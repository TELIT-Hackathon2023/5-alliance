import schedule
import time
import db

columns = ["occupied_from","occupied_until"]

def remove_booking():
    conn, cursor = db.db_connect()

    for column in columns:
        cursor.execute(f"SELECT {column} FROM area_1")
        rows = cursor.fetchall()

        for i, row in enumerate(rows):
            # Remove first datetime
            row = row[column]
            if row != None:
                row = row.split(',')
                print(row[0])
                if column == "occupied_from":
                    if (row[0] + 3600) < time.time():
                        row = row[1:]
                        row = ','.join(row)
                        cursor.execute(f"UPDATE area_1 SET {column} = '{row}' WHERE id = {i + 1}")

                if column == "occupied_from":
                    if row[0] < time.time():
                        row = row[1:]
                        row = ','.join(row)
                        cursor.execute(f"UPDATE area_1 SET {column} = '{row}' WHERE id = {i + 1}")
                
    conn.commit()
    db.db_disconnect(conn)

# Schedule the task to run every hour
schedule.every().hour.do(remove_booking)

remove_booking()

# Infinite loop to keep the script running
while True:
    schedule.run_pending()
    time.sleep(1)
