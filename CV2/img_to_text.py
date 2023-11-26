import cv2
import threading
import pathlib
import easyocr
import keyboard
import string
import db


alphabet = string.digits + string.ascii_uppercase
numbers = string.digits

class app:
    def __init__(self):
        self.cascade_file = pathlib.Path(cv2.__file__).parent.absolute() / "data/haarcascade_russian_plate_number.xml"
        self.clf = cv2.CascadeClassifier(str(self.cascade_file))
        self.reader = easyocr.Reader(['en'], gpu=False)
        self.car_founded = False
        self.car_passed = False
        self.car_plates = []

        self.wait_for_car()

    def wait_for_car(self):
        video_stream = cv2.VideoCapture(0)
        while True:
            self.car_plates = []
            frame = video_stream.read()[1]

            if not self.car_founded:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                plate = self.clf.detectMultiScale(gray, scaleFactor=2, minNeighbors=5, minSize=(20, 20))

                for (x, y, w, h) in plate:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                    image_path = "car_plate.png"
                    cv2.imwrite(image_path, frame[y:y+h, x:x+w])
                    threading.Thread(target=self.check_plate_text, args=(image_path, )).start()

            cv2.imshow("car plate detection", frame)

            if cv2.waitKey(1) == ord('q'):
                video_stream.release()
                cv2.destroyAllWindows()
                break

    def check_plate_text(self, image_path):
        try:
            img = cv2.imread(image_path)
            output = []
            result = self.reader.readtext(img, detail=0, contrast_ths = 0.3)

            for i in result:
                for j in i:
                    if j in alphabet:
                        output.append(j)

            self.car_plates.append(output)
            self.print_result(self.car_plates)
        
        except:
            self.check_plate_text(image_path)
    
    def print_result(self, plate_array):
        output = []
        for i in plate_array:
            if len(i) == 7 and i[len(i)-1] not in numbers and i[len(i)-2] not in numbers:
                output.append(i)
        if output != []:
            counter = 0
            plate = output[0]
     
            for i in output:
                curr_frequency = output.count(i)
            if(curr_frequency > counter):
                counter = curr_frequency
                plate = i

            conn, cursor = db.db_connect()
            print(plate)
            user, is_user = db.find_user(cursor, plate)

            self.car_founded = True
            print(user)
            if is_user:
                print(user)
                self.car_pass(conn, cursor, user)
            else:
                self.car_not_recognized(conn)

    def car_not_recognized(self, conn):
        print("Car not recognized.")
        while True:
            if keyboard.read_key() == 'c':
                break
        self.car_founded = False
        db.db_disconnect(conn)
    
    def car_pass(self, conn, cursor, user):
        print("Waiting for gate.")
        db.change_status(conn, cursor, user)
        print("Status changed.")
        while True:
            if keyboard.read_key() == 'g':
                break
        db.db_disconnect(conn)
        self.car_founded = False


if __name__ == "__main__":
    app()