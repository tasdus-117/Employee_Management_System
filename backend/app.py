from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS # 1. Import
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
bcrypt = Bcrypt(app)
app.config['JWT_SECRET'] = 'deptrailoitaiai'
jwt = JWTManager(app)

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
@jwt_required() # Bảo vệ route này bằng JWT
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

@jwt_required()
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
from flask_jwt_extended import create_access_token # Đảm bảo đã import dòng này

@app.route('/login', methods=['POST'])
def login():
    try:
        # Lấy dữ liệu từ request
        data = request.get_json()
        email = data.get('email')
        password_provided = data.get('password')

        # Truy vấn user trong DB
        user = User.query.filter_by(email=email).first()

        if user:
            # Kiểm tra mật khẩu (Sau này nên dùng bcrypt để check pass đã hash nhé Tú)
            if user.password == password_provided:
                
                # --- PHẦN NÂNG CẤP JWT Ở ĐÂY ---
                # Tạo thẻ thông hành dựa trên ID hoặc Email của user
                access_token = create_access_token(identity=str(user.id))
                
                return make_response(jsonify({
                    "message": "Login successful",
                    "access_token": access_token, # Gửi token về cho React
                    "user": {"email": user.email, "id": user.id} # Gửi thêm ít thông tin user nếu cần
                }), 200)
                # ------------------------------
                
            else:
                return make_response(jsonify({"message": "Incorrect password"}), 401)
        
        return make_response(jsonify({"message": "User not found"}), 404)

    except Exception as e:  
        return make_response(jsonify({"message": "Error during login", "error": str(e)}), 500)


    





