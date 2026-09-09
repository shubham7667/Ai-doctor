from app.database.connection import get_connection

def get_user_by_google_id(google_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            query ='''SELECT * FROM USER_DATA WHERE GOOGLE_ID=%s'''
            
            cursor.execute(query,(google_id),)
            user = cursor.fetchone()
            return user
    finally:
        connection.close()

def get_user_by_user_id(user_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            query ='''SELECT * FROM USER_DATA WHERE ID=%s'''
            
            cursor.execute(query,(user_id),)
            user= cursor.fetchone()
            return user
    finally:
        connection.close()

def create_user(google_id,email,name,profile_pic):
    connection = get_connection()
    try:
         with connection.cursor() as cursor:
                query= '''
                INSERT INTO USER_DATA 
                (GOOGLE_ID,EMAIL,NAME,PROFILE_PIC)
                VALUES(%s,%s,%s,%s)
                '''
                cursor.execute(query,(google_id,email,name,profile_pic))
                connection.commit()
                return cursor.lastrowid
    finally:
        connection.close()

