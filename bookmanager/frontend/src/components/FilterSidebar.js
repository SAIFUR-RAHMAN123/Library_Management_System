function FilterSidebar({ books, filters, setFilters, onReset }) {
  const authors = [...new Set(books.map(b => b.author))].sort();
  const languages = [...new Set(books.map(b => b.language))].filter(Boolean).sort();
  const years = [...new Set(books.map(b => b.year))].filter(Boolean).sort((a, b) => a - b);

  return (
    <div className="sidebar">
      <div className="sidebar-title">Filters</div>

      <div className="filter-group">
        <label>Search Title</label>
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Author</label>
        <select
          value={filters.author}
          onChange={e => setFilters({ ...filters, author: e.target.value })}
        >
          <option value="">All Authors</option>
          {authors.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Language</label>
        <select
          value={filters.language}
          onChange={e => setFilters({ ...filters, language: e.target.value })}
        >
          <option value="">All Languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Year</label>
        <select
          value={filters.year}
          onChange={e => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
        </select>
      </div>

      <button className="reset-btn" onClick={onReset}>Reset Filters</button>
    </div>
  );
}

export default FilterSidebar;