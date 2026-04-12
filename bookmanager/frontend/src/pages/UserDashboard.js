import { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import StatsBar from "../components/StatsBar";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, borrowed: 0, overdue: 0 });
  const [filters, setFilters] = useState({ search: "", author: "", language: "", year: "" });
  const [borrowing, setBorrowing] = useState(null);
  const [libraryId, setLibraryId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [borrowerInfo, setBorrowerInfo] = useState(null);
  const [idError, setIdError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  const fetchBooks = () => {
    fetch("/books").then(r => r.json()).then(setBooks);
  };

  const fetchStats = () => {
    fetch("/stats").then(r => r.json()).then(setStats);
  };

  const checkLibraryId = async () => {
    if (!libraryId) return;
    const res = await fetch(`/borrowers/search?library_id=${libraryId}`);
    if (res.ok) {
      const data = await res.json();
      setBorrowerInfo(data);
      setIdError("");
    } else {
      setBorrowerInfo(null);
      setIdError("Library ID registered nahi hai — Admin se contact karo");
    }
  };

  const handleBorrow = async () => {
    if (!borrowerInfo || !returnDate) return;
    const res = await fetch("/borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: borrowing.id,
        library_id: libraryId,
        return_date: returnDate
      })
    });
    if (res.ok) {
      setMessage(`"${borrowing.title}" successfully borrow hua!`);
      setBorrowing(null);
      setLibraryId("");
      setReturnDate("");
      setBorrowerInfo(null);
      fetchBooks();
      fetchStats();
    }
  };

  const filteredBooks = books.filter(book => {
    return (
      book.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.author === "" || book.author === filters.author) &&
      (filters.language === "" || book.language === filters.language) &&
      (filters.year === "" || String(book.year) === filters.year)
    );
  });

  const resetFilters = () => setFilters({ search: "", author: "", language: "", year: "" });

  return (
    <div className="app">
      <div className="header">
        <h1>📚 BookManager</h1>
        <span className="book-count">{filteredBooks.length} / {books.length} books</span>
        <a href="/admin/login" className="admin-link">Admin Panel</a>
      </div>

      {message && (
        <div className="success-msg">
          {message}
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      <StatsBar stats={stats} />

      {borrowing && (
        <div className="modal-overlay">
          <div className="borrow-box">
            <h3>Borrow — {borrowing.title}</h3>
            <p className="modal-author">by {borrowing.author}</p>

            <div className="form-group">
              <label>Library ID</label>
              <div className="id-row">
                <input
                  placeholder="Apni Library ID daalo"
                  value={libraryId}
                  onChange={e => { setLibraryId(e.target.value); setBorrowerInfo(null); setIdError(""); }}
                />
                <button className="check-btn" onClick={checkLibraryId}>Check</button>
              </div>
              {idError && <span className="error">{idError}</span>}
            </div>

            {borrowerInfo && (
              <div className="borrower-info">
                <span className="verified">✓ Verified</span>
                <p>{borrowerInfo.name}</p>
                <p>{borrowerInfo.email}</p>
                <p>{borrowerInfo.mobile}</p>
              </div>
            )}

            <div className="form-group">
              <label>Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="modal-btns">
              <button
                className="submit-btn"
                onClick={handleBorrow}
                disabled={!borrowerInfo || !returnDate}
              >
                Confirm Borrow
              </button>
              <button className="cancel-btn" onClick={() => {
                setBorrowing(null);
                setLibraryId("");
                setReturnDate("");
                setBorrowerInfo(null);
                setIdError("");
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main">
        <FilterSidebar
          books={books}
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Country</th>
                <th>Language</th>
                <th>Status</th>
                <th>View</th>
                <th>Borrow</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? filteredBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year || "—"}</td>
                  <td>{book.country}</td>
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
                    {book.available
                      ? <button className="borrow-btn" onClick={() => setBorrowing(book)}>Borrow</button>
                      : <span className="na">—</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="no-results">Koi book nahi mili</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;