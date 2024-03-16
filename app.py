import sqlite3
from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__, static_url_path='/static')

# Configuration
DATABASE = 'urls.db'

# Connect to SQLite database
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# Create table to store URLs if not exists
def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS urls (url TEXT PRIMARY KEY)''')
        db.commit()

# Close database connection at the end of each request
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create', methods=['POST'])
def create():
    try:
        data = request.json
        url = data['url']
        print("Received URL:", url)  # Debug print

        # Check if URL already exists in the database
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM urls WHERE url=?", (url,))
        existing_url = cursor.fetchone()
        if existing_url:
            return jsonify({'url': url}), 200

        # If URL doesn't exist, insert into the database
        cursor.execute("INSERT INTO urls (url) VALUES (?)", (url,))
        db.commit()
        return jsonify({'url': url}), 200
    except Exception as e:
        print("Error:", e)  # Debug print
        return jsonify({'error': str(e)}), 500

@app.route('/view/<url>', methods=['GET', 'POST'])
def view(url):
    if request.method == 'GET':
        return render_template('view.html', url=url, text="", title=url)
    elif request.method == 'POST':
        text = request.form['text']
        # Update text content for the URL (not necessary for URL persistence)
        return "Text saved successfully."

if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(debug=True)






