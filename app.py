from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Book, Borrow, Borrower
from config import Config
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

with app.app_context():
    db.create_all()

from seed import seed_data
seed_data(app)

# ─── BOOKS ───────────────────────────────────────

@app.route('/books', methods=['GET'])
def get_books():
    query = Book.query
    language = request.args.get('language')
    country = request.args.get('country')
    author = request.args.get('author')
    limit = request.args.get('limit', type=int)
    if language:
        query = query.filter(Book.language.ilike(f'%{language}%'))
    if country:
        query = query.filter(Book.country.ilike(f'%{country}%'))
    if author:
        query = query.filter(Book.author.ilike(f'%{author}%'))
    if limit:
        query = query.limit(limit)
    return jsonify([b.to_dict() for b in query.all()])

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    book = Book(
        title=data['title'],
        author=data['author'],
        year=data.get('year'),
        country=data.get('country'),
        language=data.get('language'),
        pages=data.get('pages'),
        link=data.get('link'),
        available=True
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201

@app.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get_or_404(id)
    return jsonify(book.to_dict())

@app.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get_or_404(id)
    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.year = data.get('year', book.year)
    book.available = data.get('available', book.available)
    db.session.commit()
    return jsonify(book.to_dict())

@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book delete ho gayi"})

# ─── BORROWERS ───────────────────────────────────

@app.route('/borrowers', methods=['GET'])
def get_borrowers():
    borrowers = Borrower.query.all()
    result = []
    for b in borrowers:
        data = b.to_dict()
        active = [br.to_dict() for br in b.borrows if not br.returned]
        history = [br.to_dict() for br in b.borrows]
        data['active_borrows'] = active
        data['borrow_history'] = history
        result.append(data)
    return jsonify(result)

@app.route('/borrowers', methods=['POST'])
def add_borrower():
    data = request.get_json()
    if Borrower.query.filter_by(library_id=data['library_id']).first():
        return jsonify({"error": "Library ID already exists"}), 400
    b = Borrower(
        library_id=data['library_id'],
        name=data['name'],
        email=data.get('email'),
        mobile=data.get('mobile'),
        address=data.get('address'),
        govt_id=data.get('govt_id')
    )
    db.session.add(b)
    db.session.commit()
    return jsonify(b.to_dict()), 201

@app.route('/borrowers/search', methods=['GET'])
def search_borrower():
    library_id = request.args.get('library_id')
    b = Borrower.query.filter_by(library_id=library_id).first()
    if not b:
        return jsonify({"error": "Borrower nahi mila"}), 404
    return jsonify(b.to_dict())

# ─── BORROW ───────────────────────────────────────

@app.route('/borrow', methods=['POST'])
def borrow_book():
    data = request.get_json()
    book = Book.query.get_or_404(data['book_id'])
    if not book.available:
        return jsonify({"error": "Book available nahi hai"}), 400
    borrower = Borrower.query.filter_by(library_id=data['library_id']).first()
    if not borrower:
        return jsonify({"error": "Library ID registered nahi hai"}), 404
    borrow = Borrow(
        book_id=data['book_id'],
        borrower_id=borrower.id,
        return_date=datetime.strptime(data['return_date'], "%Y-%m-%d")
    )
    book.available = False
    db.session.add(borrow)
    db.session.commit()
    return jsonify(borrow.to_dict()), 201

@app.route('/borrow/return/<int:id>', methods=['PUT'])
def return_book(id):
    borrow = Borrow.query.get_or_404(id)
    borrow.returned = True
    borrow.book.available = True
    db.session.commit()
    return jsonify(borrow.to_dict())

@app.route('/borrows', methods=['GET'])
def get_borrows():
    borrows = Borrow.query.all()
    return jsonify([b.to_dict() for b in borrows])

# ─── STATS ───────────────────────────────────────

@app.route('/stats', methods=['GET'])
def get_stats():
    total = Book.query.count()
    available = Book.query.filter_by(available=True).count()
    borrowed = total - available
    overdue = 0
    active_borrows = Borrow.query.filter_by(returned=False).all()
    for b in active_borrows:
        if b.return_date < datetime.utcnow():
            overdue += 1
    return jsonify({
        "total": total,
        "available": available,
        "borrowed": borrowed,
        "overdue": overdue
    })

import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)