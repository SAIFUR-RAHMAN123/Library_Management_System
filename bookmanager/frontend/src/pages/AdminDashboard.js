import { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import StatsBar from "../components/StatsBar";
import API_URL from "../config";

function AdminDashboard({ setIsAdmin }) {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, borrowed: 0, overdue: 0 });
  const [filters, setFilters] = useState({ search: "", author: "", language: "", year: "" });
  const [activeTab, setActiveTab] = useState("books");
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddBorrower, setShowAddBorrower] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [newBook, setNewBook] = useState({ title: "", author: "", year: "", country: "", language: "", link: "" });
  const [newBorrower, setNewBorrower] = useState({ library_id: "", name: "", email: "", mobile: "", address: "", govt_id: "" });

  useEffect(() => {
    fetchBooks();
    fetchBorrows();
    fetchBorrowers();
    fetchStats();
  }, []);

  const fetchBooks = () => fetch(`${API_URL}/books`).then(r => r.json()).then(setBooks);
  const fetchStats = () => fetch(`${API_URL}/stats`).then(r => r.json()).then(setStats);
  const fetchBorrows = () => fetch(`${API_URL}/borrows`).then(r => r.json()).then(setBorrows);
  const fetchBorrowers = () => fetch(`${API_URL}/borrowers`).then(r => r.json()).then(setBorrowers);

  const deleteBook = async (id) => {
    await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
    fetchBooks(); fetchStats();
  };

  const addBook = async () => {
    if (!newBook.title || !newBook.author) return;
    await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook)
    });
    setNewBook({ title: "", author: "", year: "", country: "", language: "", link: "" });
    setShowAddBook(false);
    fetchBooks(); fetchStats();
  };

  const addBorrower = async () => {
    if (!newBorrower.library_id || !newBorrower.name) return;
    const res = await fetch(`${API_URL}/borrowers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBorrower)
    });
    if (res.ok) {
      setNewBorrower({ library_id: "", name: "", email: "", mobile: "", address: "", govt_id: "" });
      setShowAddBorrower(false);
      fetchBorrowers();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const returnBook = async (borrowId) => {
    await fetch(`${API_URL}/borrow/return/${borrowId}`, { method: "PUT" });
    setBorrows(prev =>
      prev.map(b => b.id === borrowId ? { ...b, returned: true } : b)
    );
    if (selectedBorrower) {
      setSelectedBorrower(prev => ({
        ...prev,
        active_borrows: prev.active_borrows.filter(b => b.id !== borrowId),
        borrow_history: prev.borrow_history.map(b =>
          b.id === borrowId ? { ...b, returned: true } : b
        )
      }));
    }
    fetchBooks();
    fetchStats();
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    window.location.href = "/";
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.author === "" || book.author === filters.author) &&
    (filters.language === "" || book.language === filters.language) &&
    (filters.year === "" || String(book.year) === filters.year)
  );

  const resetFilters = () => setFilters({ search: "", author: "", language: "", year: "" });
  const isOverdue = (d) => new Date(d) < new Date();

  return (
    <div className="app">
      <div className="header">
        <h1>⚙️ Admin Panel</h1>
        <div className="tab-btns">
          {["books", "borrows", "borrowers"].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === "books" && (
          <button className="add-btn" onClick={() => setShowAddBook(!showAddBook)}>
            {showAddBook ? "Cancel" : "+ Add Book"}
          </button>
        )}
        {activeTab === "borrowers" && (
          <button className="add-btn" onClick={() => setShowAddBorrower(!showAddBorrower)}>
            {showAddBorrower ? "Cancel" : "+ Register Borrower"}
          </button>
        )}
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <StatsBar stats={stats} />

      {showAddBook && (
        <div className="add-form">
          <div className="form-grid">
            {["title", "author", "year", "country", "language", "link"].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  placeholder={field}
                  value={newBook[field]}
                  onChange={e => setNewBook({ ...newBook, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={addBook}>Add Book</button>
        </div>
      )}

      {showAddBorrower && (
        <div className="add-form">
          <div className="form-grid">
            {[
              { key: "library_id", label: "Library ID *" },
              { key: "name", label: "Full Name *" },
              { key: "email", label: "Email" },
              { key: "mobile", label: "Mobile No" },
              { key: "address", label: "Address" },
              { key: "govt_id", label: "Govt ID" }
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <input
                  placeholder={f.label}
                  value={newBorrower[f.key]}
                  onChange={e => setNewBorrower({ ...newBorrower, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={addBorrower}>Register Borrower</button>
        </div>
      )}

      {activeTab === "books" && (
        <div className="main">
          <FilterSidebar books={books} filters={filters} setFilters={setFilters} onReset={resetFilters} />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Author</th><th>Year</th>
                  <th>Language</th><th>Status</th><th>View</th><th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.year || "—"}</td>
                    <td><span className="lang-badge">{book.language}</span></td>
                    <td>
                      <span className={`status-badge ${book.available ? "available" : "unavailable"}`}>
                        {book.available ? "Available" : "Borrowed"}
                      </span>
                    </td>
                    <td>
                      {book.link
                        ? <a href={book.link.trim()} target="_blank" rel="noreferrer" className="view-btn">View</a>
                        : "—"}
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteBook(book.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "borrows" && (
        <div className="table-container" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>Book</th><th>Library ID</th><th>Borrower</th>
                <th>Borrow Date</th><th>Return Date</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.length > 0 ? borrows.map(b => (
                <tr key={b.id} className={!b.returned && isOverdue(b.return_date) ? "overdue-row" : ""}>
                  <td>{b.book_title}</td>
                  <td>{b.library_id}</td>
                  <td>{b.borrower_name}</td>
                  <td>{b.borrow_date}</td>
                  <td>
                    {b.return_date}
                    {!b.returned && isOverdue(b.return_date) && (
                      <span className="overdue-tag"> Overdue!</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${b.returned ? "available" : "unavailable"}`}>
                      {b.returned ? "Returned" : "Active"}
                    </span>
                  </td>
                  <td>
                    {!b.returned && (
                      <button className="return-btn" onClick={() => returnBook(b.id)}>Return</button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="no-results">Koi borrow record nahi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "borrowers" && (
        <div className="borrowers-section">
          {selectedBorrower ? (
            <div className="borrower-detail">
              <button className="back-btn" onClick={() => setSelectedBorrower(null)}>← Back</button>
              <div className="borrower-profile">
                <div className="profile-header">
                  <div className="avatar">{selectedBorrower.name.charAt(0)}</div>
                  <div>
                    <h3>{selectedBorrower.name}</h3>
                    <span className="lib-id-badge">{selectedBorrower.library_id}</span>
                  </div>
                </div>
                <div className="profile-details">
                  <div><span>Email</span><p>{selectedBorrower.email || "—"}</p></div>
                  <div><span>Mobile</span><p>{selectedBorrower.mobile || "—"}</p></div>
                  <div><span>Address</span><p>{selectedBorrower.address || "—"}</p></div>
                  <div><span>Govt ID</span><p>{selectedBorrower.govt_id || "—"}</p></div>
                  <div><span>Registered</span><p>{selectedBorrower.registered_on}</p></div>
                </div>
              </div>

              <h4 style={{ margin: "20px 0 10px", color: "#38bdf8" }}>Borrow History</h4>
              <table>
                <thead>
                  <tr>
                    <th>Book</th><th>Borrow Date</th><th>Return Date</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBorrower.borrow_history && selectedBorrower.borrow_history.length > 0
                    ? selectedBorrower.borrow_history.map(b => (
                      <tr key={b.id} className={!b.returned && isOverdue(b.return_date) ? "overdue-row" : ""}>
                        <td>{b.book_title}</td>
                        <td>{b.borrow_date}</td>
                        <td>
                          {b.return_date}
                          {!b.returned && isOverdue(b.return_date) && (
                            <span className="overdue-tag"> Overdue!</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${b.returned ? "available" : "unavailable"}`}>
                            {b.returned ? "Returned" : "Active"}
                          </span>
                        </td>
                        <td>
                          {!b.returned && (
                            <button className="return-btn" onClick={() => returnBook(b.id)}>Return</button>
                          )}
                        </td>
                      </tr>
                    ))
                    : <tr><td colSpan="5" className="no-results">Koi history nahi</td></tr>
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <div className="borrowers-grid">
              {borrowers.length > 0 ? borrowers.map(b => (
                <div key={b.id} className="borrower-card" onClick={() => setSelectedBorrower(b)}>
                  <div className="avatar">{b.name.charAt(0)}</div>
                  <div className="borrower-card-info">
                    <p className="borrower-name">{b.name}</p>
                    <p className="borrower-id">{b.library_id}</p>
                    <p className="borrower-meta">{b.email || "No email"}</p>
                  </div>
                  <div className="borrower-card-stats">
                    <span className="active-count">
                      {b.active_borrows ? b.active_borrows.length : 0} active
                    </span>
                  </div>
                </div>
              )) : (
                <p className="no-results">Koi borrower registered nahi</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;