import pymysql

def db_connect():
    """
    Establishes a connection to the MySQL database and returns the connection and cursor objects.
    
    :return: conn, cursor
    """
    conn = pymysql.connect(
        charset="utf8mb4",
        connect_timeout=10,
        cursorclass=pymysql.cursors.DictCursor,
        db="defaultdb",
        host="parking-patrik-0978.a.aivencloud.com",
        password="AVNS_hkWeyVpMkWsO2W5KuMo",
        read_timeout=10,
        port=20274,
        user="avnadmin",
        write_timeout=10,
    )
    cursor = conn.cursor()
    print("connected")
    return conn, cursor

def db_disconnect(conn):
    """Closes the provided database connection."""
    conn.close()

def describe(cursor, table):
    """Prints the structure of the specified table using the provided cursor."""
    cursor.execute(f"DESCRIBE {table}")
    table_structure = cursor.fetchall()
    print(f"Structure of '{table}' table:")
    for column_info in table_structure:
        print(column_info['Field'], column_info['Type'])

def printer(cursor, table):
    """Prints the data in the specified table using the provided cursor."""
    cursor.execute(f"SELECT * FROM {table}")
    print(f"Data in '{table}':", cursor.fetchall())

def find_user(cursor, spz):
    """
    Finds and returns a user based on the provided SPZ (license plate) using the provided cursor.
    Returns None if no user is found.

    :return: dict(user) - [The user information as a dictionary]
    """
    user = ' '
    counter = 0

    query = "SELECT * FROM users"
    cursor.execute(query)

    users = cursor.fetchall()
    for x in users:
        for y in range(7):
            if(x['spz'][y] == spz[y]):
                counter += 1
        if(counter > 4):
            user = x['id']
            break
    if counter > 4:
        return user, True
    return user, False

def change_status(conn, cursor, user):
    query = "SELECT * FROM area_1 WHERE pid = {}".format(user)
    cursor.execute(query)

    spot = cursor.fetchone()

    query = "UPDATE area_1 SET status = 1 WHERE pid ={}".format(spot)
    cursor.execute(query)
    conn.commit()
