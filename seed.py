import json
from app import app
from models import db, Book

with open('books.json', 'r') as f:
    books = json.load(f)

with app.app_context():
    db.drop_all()
    db.create_all()
    
    for book in books:
        new_book = Book(
            title=book['title'],
            author=book['author'],
            year=book.get('year'),
            country=book.get('country'),
            language=book.get('language'),
            pages=book.get('pages'),
            link=book.get('link')
        )
        db.session.add(new_book)
    
    db.session.commit()
    print(f"{len(books)} books successfully insert ho gayi!")