from flask import Flask, jsonify, request
import pyodbc
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # This is for handling cross-origin requests from the React frontend

# Setup the database connection
def get_db_connection():
    conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                          'SERVER=IONUT\\SQLEXPRESS;'  # Double backslash to escape
                          'DATABASE=IonutPI;'
                          'Trusted_Connection=yes')  # Uses Windows Authentication
    return conn



@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = get_db_connection()  # Ensure this function connects to your database
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, technologies, image, link FROM Projects")
        rows = cursor.fetchall()

        projects = []
        for row in rows:
            projects.append({
                'id': row[0],  # ID
                'name': row[1],  # Name
                'technologies': row[2],  # Technologies
                'image': base64.b64encode(row[3]).decode('utf-8') if row[3] else None,  # Base64 image
                'link': row[4]  # Link
            })

        return jsonify(projects), 200
    except Exception as e:
        print(f"Error in get_projects: {e}")  # Log the error
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()  # Close the database connection




@app.route('/api/projects', methods=['POST'])
def add_project():
    conn = get_db_connection()
    data = request.json
    name = data.get('name')
    technologies = data.get('technologies')
    link = data.get('link')
    image_base64 = data.get('image')

    # Convert Base64 to binary
    image_binary = base64.b64decode(image_base64)

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Projects (name, technologies, image, link)
            VALUES (?, ?, ?, ?)
        """, (name, technologies, image_binary, link))
        conn.commit()

        return jsonify({'message': 'Project added successfully', 'id': cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM Projects WHERE id = ?', (project_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Project deleted successfully'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')  # Retrieve username from the request
    password = data.get('password')  # Retrieve password from the request

    conn = get_db_connection()
    cursor = conn.cursor()

    # Query to check if the user exists and password matches
    cursor.execute('''
        SELECT UserID, IsAdmin 
        FROM Users 
        WHERE username = ? AND Password = ? 
    ''', (username, password))
    
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({'success': True, 'user_id': user[0], 'is_admin': user[1]})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(debug=True)
