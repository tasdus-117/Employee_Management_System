from os import environ

class Config:
    SQLALCHEMY_DATABASE_URI = environ.get('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'deptrailoitaiai'