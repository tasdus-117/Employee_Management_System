from flask import request, jsonify, make_response
from extensions import db
from models import User
from flask_jwt_extended import jwt_required, create_access_token

def init_routes(app):
    @app.route('/test', methods=['GET'])
    def test(): 
        return make_response(jsonify({'message':'test_route'}), 200)

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

    @app.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            user = User.query.filter_by(email=data.get('email')).first()
            if user and user.password == data.get('password'):
                access_token = create_access_token(identity=str(user.id))
                return make_response(jsonify({
                    "message": "Login successful",
                    "access_token": access_token,
                    "user": {"email": user.email, "id": user.id}
                }), 200)
            return make_response(jsonify({"message": "Invalid credentials"}), 401)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

    @app.route('/users', methods=['GET'])
    @jwt_required()
    def get_users():
        users = User.query.all()
        return jsonify({"users": [user.json() for user in users]})
  
    @app.route('/users', methods=['POST'])
    @jwt_required()
    def create_user():
        data = request.get_json()
        new_user = User(name=data['name'], email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created", "user": new_user.json()}), 201
      
    @app.route('/users/<int:id>', methods=['GET'])
    def get_user(id):
        user = User.query.get(id)
        if user: return jsonify({"user": user.json()})
        return jsonify({"message": "User not found"}), 404

    @app.route('/users/<int:id>', methods=['PUT'])
    @jwt_required()
    def update_user(id):
        user = User.query.get(id)
        if not user: return jsonify({"message": "User not found"}), 404
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        if 'password' in data: user.password = data['password']
        db.session.commit()
        return jsonify({"message": "Updated successfully"})

    @app.route('/users/<int:id>', methods=['DELETE'])
    def delete_user(id):
        user = User.query.get(id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"message": "Deleted"})
        return jsonify({"message": "Not found"}), 404