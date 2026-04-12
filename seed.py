import json
from app import app
from models import db, Book

with app.app_context():
    db.create_all()

    # check if already data exists
    if Book.query.count() > 0:
        print("⚠️ Data already exists, skipping seeding...")
    else:
        with open('books.json', 'r', encoding='utf-8') as f:
            books = json.load(f)

        for book in books:
            new_book = Book(
                title=book.get('title'),
                author=book.get('author'),
                year=book.get('year'),
                country=book.get('country'),
                language=book.get('language'),
                pages=book.get('pages'),
                link=book.get('link'),
                available=True
            )
            db.session.add(new_book)

        db.session.commit()
        print(f"✅ {len(books)} books inserted successfully!")