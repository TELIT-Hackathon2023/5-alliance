import db
from datetime import datetime

def writer():
    new_values = [datetime(2023, 1, 1), datetime(2023, 1, 2), datetime(2023, 1, 3)]
    formatted_values = [value.strftime('%Y-%m-%d %H:%M:%S') for value in new_values]

    # Join the formatted values into a comma-separated string
    comma_separated_string = ','.join(formatted_values)

    # Update the 'occupied_from' column in the 'area_1' table with the comma-separated string
    update_query = f"UPDATE area_1 SET occupied_from = '{comma_separated_string}' WHERE id = 1"
    cursor.execute(update_query)

    # Commit the changes
    conn.commit()

conn, cursor = db.db_connect()



conn.commit()

db.describe(cursor, 'area_1')

db.db_disconnect(conn)