import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    uri = os.environ.get("DATABASE_URL")

    if uri:
        if uri.startswith("postgres://"):
            uri = uri.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = uri
    else:
       
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'books.db')