import mysql.connector



# Setup
host = "/database/parking.sql"
table = "area_1"
user = "root"
password = "Salama123*"

def connect():
    conn = mysql.connector.connect(host=host,
                                        database=database,
                                        user=user,
                                        password=password,
                                        )
    cursor = conn.cursor()

    return cursor

def write_data(cursor, name):
    insert_data_query ="INSERT INTO {table} VALUES (%s)"
    data_to_insert = (name,)
    cursor.execute(insert_data_query, data_to_insert)

def read_data(cursor):
    cursor.execute("SELECT * FROM {table}")
    return cursor.fetchall()

def disconnect(cursor):
    cursor.close()

# Example usage
if __name__ == "__main__":
    # Connect to the MySQL server
    cursor = connect()

    # Read and print all data from the table
    data = read_data(cursor)
    for row in data:
        print(row)

    # Close the cursor and connection
    disconnect(cursor)
