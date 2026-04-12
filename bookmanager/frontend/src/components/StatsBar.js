function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total Books</span>
      </div>
      <div className="stat-card available">
        <span className="stat-number">{stats.available}</span>
        <span className="stat-label">Available</span>
      </div>
      <div className="stat-card borrowed">
        <span className="stat-number">{stats.borrowed}</span>
        <span className="stat-label">Borrowed</span>
      </div>
      <div className="stat-card overdue">
        <span className="stat-number">{stats.overdue}</span>
        <span className="stat-label">Overdue</span>
      </div>
    </div>
  );
}

export default StatsBar;