from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer)
    country = db.Column(db.String(100))
    language = db.Column(db.String(50))
    pages = db.Column(db.Integer)
    link = db.Column(db.String(500))
    available = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "year": self.year if self.year and self.year > 0 else None,
            "country": self.country,
            "language": self.language,
            "pages": self.pages,
            "link": self.link,
            "available": self.available
        }

class Borrower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    library_id = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    mobile = db.Column(db.String(15))
    address = db.Column(db.String(200))
    govt_id = db.Column(db.String(50))
    registered_on = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "library_id": self.library_id,
            "name": self.name,
            "email": self.email,
            "mobile": self.mobile,
            "address": self.address,
            "govt_id": self.govt_id,
            "registered_on": self.registered_on.strftime("%Y-%m-%d")
        }

class Borrow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('borrower.id'), nullable=False)
    borrow_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, nullable=False)
    returned = db.Column(db.Boolean, default=False)

    book = db.relationship('Book', backref='borrows')
    borrower = db.relationship('Borrower', backref='borrows')

    def to_dict(self):
        return {
            "id": self.id,
            "book_id": self.book_id,
            "book_title": self.book.title,
            "borrower_id": self.borrower_id,
            "library_id": self.borrower.library_id,
            "borrower_name": self.borrower.name,
            "borrow_date": self.borrow_date.strftime("%Y-%m-%d"),
            "return_date": self.return_date.strftime("%Y-%m-%d"),
            "returned": self.returned
        }