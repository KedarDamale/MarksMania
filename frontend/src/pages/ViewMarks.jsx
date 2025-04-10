import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Helper function to calculate the current semester
const calculateCurrentSemester = (graduationYear) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  const yearsToGraduation = graduationYear - currentYear;
  const isEvenSemester = currentMonth <= 5; // January to June is even semester

  let semester = (4 - yearsToGraduation) * 2;
  if (!isEvenSemester) {
    semester -= 1;
  }
  return Math.min(Math.max(semester, 1), 8);
};

const ViewMarks = () => {
  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
    batch: "",
    examType: "",
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Fetch subjects based on branch and semester
  const fetchSubjects = async () => {
    if (!filters.branch || !filters.semester) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/subjects`, {
        params: {
          branch: filters.branch,
          semester: parseInt(filters.semester),
        },
      });
      setSubjects(response.data.subjects || []);
    } catch (err) {
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndMarks = async () => {
    if (!filters.branch || !filters.semester || !filters.examType) {
      setError("Please select Branch, Semester, and Exam Type.");
      return;
    }
    setLoading(true);
    try {
      // Fetch all students
      const studentsResponse = await axios.get(`${API_URL}/students`);
      const filteredStudents = studentsResponse.data.students.filter((student) => {
        const currentSemester = calculateCurrentSemester(student.student_graduation_year);
        return (
          student.student_branch === filters.branch &&
          currentSemester.toString() === filters.semester &&
          (!filters.batch || student.student_batch === filters.batch)
        );
      });
      setStudents(filteredStudents);

      if (filteredStudents.length > 0) {
        const newMarksData = {};
        for (const student of filteredStudents) {
          try {
            // Using endpoint: /marks/:studentId
            const marksResponse = await axios.get(`${API_URL}/marks/${student._id}`);
            console.log(`Marks for student ${student.student_name}:`, marksResponse.data);
            if (marksResponse.data && marksResponse.data.marks) {
              newMarksData[student._id] = {};
              marksResponse.data.marks.forEach((mark) => {
                if (mark.subjectId && mark.subjectId._id) {
                  const examMark = mark.marks.find(m => m.examType === filters.examType);
                  if (examMark) {
                    newMarksData[student._id][mark.subjectId._id] = examMark.score;
                  }
                } else {
                  console.warn("Missing populated subjectId for mark document", mark);
                }
              });
            }
          } catch (error) {
            console.error(`Error fetching marks for student ${student.student_name}:`, error);
          }
        }
        console.log("Final processed marks data:", newMarksData);
        setMarksData(newMarksData);
      }
    } catch (err) {
      console.error("Error fetching students and marks:", err);
      setError("Error fetching data");
      setStudents([]);
      setMarksData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.branch && filters.semester) {
      fetchSubjects();
    }
  }, [filters.branch, filters.semester]);

  useEffect(() => {
    if (filters.branch && filters.semester && filters.examType) {
      fetchStudentsAndMarks();
    }
  }, [filters.branch, filters.semester, filters.batch, filters.examType]);

  // Export to CSV function remains unchanged.
  const exportToCSV = () => {
    if (!students.length || !subjects.length) return;
    const headers = [
      "Student Name",
      "Roll No",
      "Batch",
      ...subjects.map((s) => s.subject_name),
    ];
    const csvData = [
      headers.join(","),
      ...students.map((student) => [
        student.student_name,
        student.student_rollno,
        student.student_batch,
        ...subjects.map((subject) => marksData[student._id]?.[subject._id] || "N/A"),
      ].join(",")),
    ].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const currentDate = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `marks_${filters.examType}_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400">View Marks</h1>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
        >
          <option value="">Select Branch</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Computer Science and Engineering">Computer Science and Engineering</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Electrical">Electrical</option>
          <option value="Electronics and Telecommunication">Electronics and Telecommunication</option>
        </select>
        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
        >
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
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
        <select
          name="examType"
          value={filters.examType}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
        >
          <option value="">Select Exam Type</option>
          <option value="IA1">IA1</option>
          <option value="IA2">IA2</option>
          <option value="Semester">Semester</option>
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Results Table */}
      {students.length > 0 && subjects.length > 0 && filters.examType && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-emerald-400">Results</h2>
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-gray-100 px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Export to CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-700 p-2">Student Name</th>
                  <th className="border-b border-gray-700 p-2">Roll No</th>
                  <th className="border-b border-gray-700 p-2">Batch</th>
                  {subjects.map((subject) => (
                    <th key={subject._id} className="border-b border-gray-700 p-2">
                      {subject.subject_name}
                      <br />
                      <span className="text-xs text-gray-400">({subject.subject_code})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="border-b border-gray-700 p-2">{student.student_name}</td>
                    <td className="border-b border-gray-700 p-2">{student.student_rollno}</td>
                    <td className="border-b border-gray-700 p-2">{student.student_batch}</td>
                    {subjects.map((subject) => (
                      <td key={subject._id} className="border-b border-gray-700 p-2">
                        {marksData[student._id]?.[subject._id] !== undefined
                          ? marksData[student._id][subject._id]
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMarks;