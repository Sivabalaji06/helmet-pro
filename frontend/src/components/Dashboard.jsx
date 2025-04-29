import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [violations, setViolations] = useState([]);
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    plate: '',
    time: '',
    date: '',
    violation: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:5000/api/violations')
      .then(res => res.json())
      .then(data => setViolations(data))
      .catch(err => console.error('Failed to fetch violations:', err));
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    setCurrentPage(1);
  };

  const handleEntriesChange = (e) => {
    setEntries(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const filteredViolations = violations.filter((v) => {
    const matchesSearch = Object.values(v)
      .join(' ')
      .toLowerCase()
      .includes(search);
    const matchesFilters = Object.entries(filters).every(
      ([key, value]) => v[key]?.toLowerCase().includes(value)
    );
    return matchesSearch && matchesFilters;
  });

  const start = (currentPage - 1) * entries;
  const paginatedViolations = filteredViolations.slice(start, start + entries);
  const totalPages = Math.ceil(filteredViolations.length / entries);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Vehicle Rule Violations
        </h2>

        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div>
            <select
              value={entries}
              onChange={handleEntriesChange}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Photo</th>
                <th className="py-2 px-4 border">Type of Vehicle</th>
                <th className="py-2 px-4 border">Number Plate</th>
                <th className="py-2 px-4 border">Time</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Rule Violation</th>
              </tr>
              <tr>
                <td></td>
                {['type', 'plate', 'time', 'date', 'violation'].map((key) => (
                  <td key={key}>
                    <input
                      type="text"
                      name={key}
                      value={filters[key]}
                      onChange={handleFilterChange}
                      placeholder="Filter"
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedViolations.length > 0 ? (
                paginatedViolations.map((v, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border">
                      <img
                        src={`http://localhost:5000/static/${v.photo}`}
                        alt="Vehicle"
                        className="w-24 h-auto mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 border">{v.type}</td>
                    <td className="py-2 px-4 border">{v.plate}</td>
                    <td className="py-2 px-4 border">{v.time}</td>
                    <td className="py-2 px-4 border">{v.date}</td>
                    <td className="py-2 px-4 border">{v.violation}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    No violations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <span>
            Showing {start + 1} to{' '}
            {Math.min(start + entries, filteredViolations.length)} of{' '}
            {filteredViolations.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="text-center mt-6 flex justify-center gap-4">
          <a
            href="/upload"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Upload Violation
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
