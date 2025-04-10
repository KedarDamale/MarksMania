import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStudentPage = () => {
  const [student, setStudent] = useState({
    student_reg: "",
    student_name: "",
    student_branch: "",
    student_graduation_year: "",
    student_batch: "",
    student_rollno: "",
  });

  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    branch: "",
    batch: "",
    graduationYear: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null); // Track the student being edited

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/students"
      : "/api/students";

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data.students);
    } catch (error) {
      setError("Error fetching students.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !student.student_reg ||
      !student.student_name ||
      !student.student_branch ||
      !student.student_graduation_year ||
      !student.student_batch ||
      !student.student_rollno
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingStudentId) {
        // Update existing student
        await axios.put(`${API_URL}/${editingStudentId}`, student, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSuccess("Student updated successfully!");
      } else {
        // Add new student
        await axios.post(API_URL, student, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSuccess("Student added successfully!");
      }

      setStudent({
        student_reg: "",
        student_name: "",
        student_branch: "",
        student_graduation_year: "",
        student_batch: "",
        student_rollno: "",
      });
      setEditingStudentId(null); // Reset editing state
      fetchStudents(); // Refresh the student list
    } catch (error) {
      setError(
        "Error saving student: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  // Handle delete student
  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/${studentId}`);
      fetchStudents(); // Refresh the student list
    } catch (error) {
      setError("Error deleting student.");
    }
  };

  // Handle edit student
  const handleEdit = (student) => {
    setStudent(student);
    setEditingStudentId(student._id); // Set the student ID being edited
  };

  // Add new exportToCSV function
  const exportToCSV = () => {
    const headers = [
      'Registration Number',
      'Name',
      'Branch',
      'Graduation Year',
      'Batch',
      'Roll Number'
    ];

    const csvData = [
      headers.join(','),
      ...filteredStudents.map(s => [
        s.student_reg,
        s.student_name,
        s.student_branch,
        s.student_graduation_year,
        s.student_batch,
        s.student_rollno
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const currentDate = new Date().toISOString().slice(0, 10);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `students_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and sort students
  const filteredStudents = students.filter((s) => {
    return (
      (filters.branch === "" || s.student_branch === filters.branch) &&
      (filters.batch === "" || s.student_batch === filters.batch) &&
      (filters.graduationYear === "" ||
        s.student_graduation_year === parseInt(filters.graduationYear))
    );
  });

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400">
        {editingStudentId ? "Edit Student" : "Add Student"}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-emerald-400 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Registration Number
          </label>
          <input
            type="text"
            name="student_reg"
            value={student.student_reg}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            name="student_name"
            value={student.student_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Branch</label>
          <select
            name="student_branch"
            value={student.student_branch}
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
          <label className="block text-sm font-medium text-gray-300">
            Graduation Year
          </label>
          <input
            type="number"
            name="student_graduation_year"
            value={student.student_graduation_year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Batch</label>
          <select
            name="student_batch"
            value={student.student_batch}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select Batch</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="B3">B3</option>
            <option value="B4">B4</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Roll Number
          </label>
          <input
            type="text"
            name="student_rollno"
            value={student.student_rollno}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-500 text-gray-900 px-4 py-2 rounded hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {editingStudentId ? "Update Student" : "Add Student"}
        </button>
      </form>

      {/* Filters */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Filter Students</h2>
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
            name="batch"
            value={filters.batch}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
          >
            <option value="">All Batches</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="B3">B3</option>
            <option value="B4">B4</option>
          </select>
          <input
            type="number"
            name="graduationYear"
            value={filters.graduationYear}
            onChange={handleFilterChange}
            placeholder="Graduation Year"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
          />
        </div>
      </div>

      {/* Student List with Export Button */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-emerald-400">Student List</h2>
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
              <th className="border-b border-gray-700 p-2">Reg Number</th>
              <th className="border-b border-gray-700 p-2">Roll Number</th>
              <th className="border-b border-gray-700 p-2">Name</th>
              <th className="border-b border-gray-700 p-2">Branch</th>
              <th className="border-b border-gray-700 p-2">Batch</th>
              <th className="border-b border-gray-700 p-2">Graduation Year</th>
              <th className="border-b border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id}>
                <td className="border-b border-gray-700 p-2">{s.student_reg}</td>
                <td className="border-b border-gray-700 p-2">{s.student_rollno}</td>
                <td className="border-b border-gray-700 p-2">{s.student_name}</td>
                <td className="border-b border-gray-700 p-2">{s.student_branch}</td>
                <td className="border-b border-gray-700 p-2">{s.student_batch}</td>
                <td className="border-b border-gray-700 p-2">{s.student_graduation_year}</td>
                <td className="border-b border-gray-700 p-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-blue-500 text-gray-100 px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
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

export default AddStudentPage;