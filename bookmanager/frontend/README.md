# 📚 Library Management System

## 🚀 Live Demo
🌐 **Frontend:** https://library-management-system-six-lemon-91.vercel.app/  
⚙️ **Backend API:** https://librarymanagementsystem-production-0b93.up.railway.app/

---

## 📌 Overview
A full-stack Library Management System with separate **User** and **Admin** panels.
Users can browse and borrow books, while admins manage the entire library including borrowers, borrow records, and book inventory.

---

## ✨ Features
- 📖 Browse 100+ books with filters (Author, Language, Year)
- ➕ Add / Delete books (Admin only)
- 👤 Register borrowers with Library ID, Email, Mobile, Govt ID
- 🔄 Borrow and return books with due date tracking
- 🔴 Overdue alerts for late returns
- 📊 Live stats — Total, Available, Borrowed, Overdue
- 🔐 Admin panel with username & password protection
- 🌍 Wikipedia link for every book

---

## 🔐 Admin Login
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

> Admin Panel: https://library-management-system-six-lemon-91.vercel.app/admin/login

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router |
| Backend | Python, Flask, REST API |
| Database | SQLite + SQLAlchemy ORM |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books |
| POST | `/books` | Add new book |
| DELETE | `/books/<id>` | Delete book |
| GET | `/stats` | Library statistics |
| GET | `/borrowers` | All borrowers |
| POST | `/borrowers` | Register borrower |
| POST | `/borrow` | Borrow a book |
| PUT | `/borrow/return/<id>` | Return a book |

---

## ⚙️ Local Setup

### Backend
```bash
cd bookmanager
pip install -r requirements.txt
python seed.py
python app.py
```

### Frontend
```bash
cd bookmanager/frontend
npm install
npm start
```

---

## 👨‍💻 Author
**Saifur Rahman**  
B.Sc. Computer Science & Data Analytics  

---

## ⭐ Support
If you like this project, give it a star on GitHub ⭐