from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS # 1. Import

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
    
    def json(self):
        return {"id": self.id, "name": self.name, "email": self.email, "password": self.password}
    
db.create_all()

#create a test route
@app.route('/test', methods=['GET'])
def test(): 
    return make_response(jsonify({'message':'test_route'}), 200)

@app.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(name=data['name'], email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({"message": "User created successfully"}), 201)
    except Exception as e:
        return make_response(jsonify({"message": "Error creating user", "error": str(e)}), 500)
# get all user
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return make_response(jsonify({"users": [user.json() for user in users]}), 200)
    except Exception as e:
        return make_response(jsonify({"message": "Error fetching users", "error": str(e)}), 500)

# get user by id
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(jsonify({"user": user.json()}), 200)
        return make_response(jsonify({"message": "User not found"}), 404)
    except Exception as e:
        return make_response(jsonify({"message": "Error fetching user", "error": str(e)}), 500)

@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify({"message": "User not found"}), 404
            
        data = request.get_json()
        
        # Cập nhật các trường dữ liệu
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        
        # QUAN TRỌNG: Kiểm tra xem có mật khẩu mới gửi lên không
        if 'password' in data:
            user.password = data.get('password')
        
        db.session.commit() # Lưu thay đổi vào Postgres
        return jsonify({"message": "Updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#delete user by id
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({"message": "User deleted successfully"}), 200)
        return make_response(jsonify({"message": "User not found"}), 404)
    except Exception as e:
        return make_response(jsonify({"message": "Error deleting user", "error": str(e)}), 500)

# Register
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        new_user = User(name=data['name'], email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({"message": "User registered successfully"}), 201)
    except Exception as e:
        return make_response(jsonify({"message": "Error registering user", "error": str(e)}), 500)
    
# Login 
@app.route('/login', methods=['POST'])
def login():
    try:
        email, password_provided = request.get_json().get('email'), request.get_json().get('password')
        user = User.query.filter_by(email=email).first()
        if user:
            if user.password == password_provided:
                return make_response(jsonify({"message": "Login successful"}), 200)
            else:
                return make_response(jsonify({"message": "Incorrect password"}), 401)
        return make_response(jsonify({"message": "User not found"}), 404)
    except Exception as e:  
        return make_response(jsonify({"message": "Error during login", "error": str(e)}), 500)
    





