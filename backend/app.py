from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt, bcrypt
from routes import init_routes

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Extensions
CORS(app)
db.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)

# Initialize Routes
init_routes(app)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)