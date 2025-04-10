import React, { useState, useEffect } from "react";
import axios from "axios";

const SubjectsDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    subject_name: "",
    branch: "",
    semester: "",
    subject_code: "",
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/subjects"
      : "/api/subjects";

  // Fetch subjects from the backend
  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setSubjects(response.data.subjects || []);
    } catch (error) {
      setError(
        "Error fetching subjects: " +
          (error.response ? error.response.data.message : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle form submission to add or edit a subject
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !newSubject.subject_name ||
      !newSubject.branch ||
      !newSubject.semester ||
      !newSubject.subject_code
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      if (editingSubjectId) {
        // Update existing subject
        await axios.put(`${API_URL}/${editingSubjectId}`, newSubject, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSuccess("Subject updated successfully!");
      } else {
        // Add new subject
        await axios.post(API_URL, newSubject, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSuccess("Subject added successfully!");
      }

      setNewSubject({
        subject_name: "",
        branch: "",
        semester: "",
        subject_code: "",
      });
      setEditingSubjectId(null);
      fetchSubjects();
    } catch (error) {
      setError(
        "Error saving subject: " +
          (error.response ? error.response.data.message : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete subject
  const handleDelete = async (subjectId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${subjectId}`);
      fetchSubjects();
    } catch (error) {
      setError("Error deleting subject.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit subject
  const handleEdit = (subject) => {
    setNewSubject(subject);
    setEditingSubjectId(subject._id);
  };

  const exportToCSV = () => {
    const headers = [
      'Subject Name',
      'Branch',
      'Semester',
      'Subject Code'
    ];

    const csvData = [
      headers.join(','),
      ...filteredSubjects.map(s => [
        s.subject_name,
        s.branch,
        s.semester,
        s.subject_code
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const currentDate = new Date().toISOString().slice(0, 10);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `subjects_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and sort subjects
  const filteredSubjects = subjects.filter((s) => {
    return (
      (filters.branch === "" || s.branch === filters.branch) &&
      (filters.semester === "" || s.semester === parseInt(filters.semester))
    );
  });

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400">
        {editingSubjectId ? "Edit Subject" : "Add Subject"}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-emerald-400 mb-4">{success}</p>}
      {loading && <p className="text-gray-400 mb-4">Loading...</p>}

      {/* Form to add or edit a subject */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Subject Name
          </label>
          <input
            type="text"
            name="subject_name"
            value={newSubject.subject_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Branch</label>
          <select
            name="branch"
            value={newSubject.branch}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select Branch</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Science and Engineering">
              Computer Science and Engineering
            </option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="Electronics and Telecommunication">
              Electronics and Telecommunication
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Semester</label>
          <select
            name="semester"
            value={newSubject.semester}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Subject Code
          </label>
          <input
            type="text"
            name="subject_code"
            value={newSubject.subject_code}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-500 text-gray-900 px-4 py-2 rounded hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {editingSubjectId ? "Update Subject" : "Add Subject"}
        </button>
      </form>

      {/* Filters */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Filter Subjects</h2>
        <div className="space-y-2">
          <select
            name="branch"
            value={filters.branch}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
          >
            <option value="">All Branches</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Science and Engineering">
              Computer Science and Engineering
            </option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="Electronics and Telecommunication">
              Electronics and Telecommunication
            </option>
          </select>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
          >
            <option value="">All Semesters</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>

      {/* Subjects List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-emerald-400">Subjects List</h2>
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-gray-100 px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export to CSV
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-700 p-2">Name</th>
              <th className="border-b border-gray-700 p-2">Branch</th>
              <th className="border-b border-gray-700 p-2">Semester</th>
              <th className="border-b border-gray-700 p-2">Code</th>
              <th className="border-b border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject._id}>
                <td className="border-b border-gray-700 p-2">{subject.subject_name}</td>
                <td className="border-b border-gray-700 p-2">{subject.branch}</td>
                <td className="border-b border-gray-700 p-2">{subject.semester}</td>
                <td className="border-b border-gray-700 p-2">{subject.subject_code}</td>
                <td className="border-b border-gray-700 p-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="bg-blue-500 text-gray-100 px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="bg-red-500 text-gray-100 px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsDashboard;