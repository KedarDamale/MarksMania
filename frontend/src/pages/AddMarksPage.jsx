import React, { useState, useEffect } from "react";
import axios from "axios";

// Add this helper function at the top of your component
const calculateCurrentSemester = (graduationYear) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  
  const yearsToGraduation = graduationYear - currentYear;
  const isEvenSemester = currentMonth <= 5; // January to June is even semester
  
  // Calculate semester based on graduation year
  let semester = (4 - yearsToGraduation) * 2;
  if (!isEvenSemester) {
    semester -= 1;
  }
  
  // Ensure semester is within valid range (1-8)
  return Math.min(Math.max(semester, 1), 8);
};

const AddMarksPage = () => {
  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
    batch: "",
    studentId: "",
    examType: "",
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [existingMarks, setExistingMarks] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

  // Fetch students based on filters
  const fetchStudents = async () => {
    if (!filters.branch || !filters.semester || !filters.batch) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/students`);
      
      // Filter students based on branch, batch, and calculated semester
      const filteredStudents = response.data.students.filter(student => {
        const currentSemester = calculateCurrentSemester(student.student_graduation_year);
        return (
          student.student_branch === filters.branch &&
          student.student_batch === filters.batch &&
          currentSemester.toString() === filters.semester
        );
      });

      console.log('Filtered Students:', filteredStudents.map(s => ({
        name: s.student_name,
        graduationYear: s.student_graduation_year,
        calculatedSemester: calculateCurrentSemester(s.student_graduation_year)
      })));

      setStudents(filteredStudents);
    } catch (err) {
      setError("Error fetching students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects based on branch and semester
  const fetchSubjects = async () => {
    if (!filters.branch || !filters.semester) {
      setSubjects([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/subjects`, {
        params: {
          branch: filters.branch,
          semester: parseInt(filters.semester)
        }
      });

      setSubjects(response.data.subjects || []);
    } catch (err) {
      setError("Error fetching subjects.");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing marks for the selected student
  const fetchExistingMarks = async () => {
    if (!filters.studentId) {
      setExistingMarks({});
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/marks/${filters.studentId}`);
      const marks = response.data.marks || [];
      
      // Group marks by subjectId and examType
      const marksMap = {};
      marks.forEach(mark => {
        if (!marksMap[mark.subjectId]) {
          marksMap[mark.subjectId] = {};
        }
        mark.marks.forEach(m => {
          marksMap[mark.subjectId][m.examType] = m.score;
        });
      });

      setExistingMarks(marksMap);
    } catch (err) {
      setError("Error fetching existing marks.");
      setExistingMarks({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters.branch, filters.semester, filters.batch]);

  useEffect(() => {
    fetchSubjects();
  }, [filters.branch, filters.semester]);

  useEffect(() => {
    fetchExistingMarks();
  }, [filters.studentId]);

  // Add these useEffects for debugging
  useEffect(() => {
    console.log("Current filters:", filters);
  }, [filters]);

  useEffect(() => {
    console.log("Current students:", students);
  }, [students]);

  useEffect(() => {
    console.log("Current subjects:", subjects);
  }, [subjects]);

  useEffect(() => {
    console.log("Existing marks:", existingMarks);
  }, [existingMarks]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  // Handle marks input changes
  const handleMarksChange = (subjectId, value) => {
    const score = parseInt(value, 10);
    const maxMarks = filters.examType === "Semester" ? 80 : 20;
    
    if (isNaN(score) || score < 0 || score > maxMarks) {
      setError(`Marks must be between 0 and ${maxMarks} for ${filters.examType}`);
      return;
    }
    
    setError(null);
    setMarksData(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [filters.examType]: score
      }
    }));
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filters.studentId || !filters.examType) {
      setError("Please select a student and exam type.");
      return;
    }

    // First check if any marks already exist for this student and exam type
    try {
      const existingMarksResponse = await axios.get(`${API_URL}/marks/${filters.studentId}`);
      const existingStudentMarks = existingMarksResponse.data.marks || [];

      // Check if any subject already has marks for this exam type
      const hasExistingMarks = existingStudentMarks.some(mark => 
        mark.marks.some(m => m.examType === filters.examType)
      );

      if (hasExistingMarks) {
        setError(`Marks for ${filters.examType} already exist for this student. Cannot add duplicate marks.`);
        return;
      }

      // If no existing marks, proceed with adding new marks
      const missingMarks = subjects.some(
        (subject) =>
          !marksData[subject._id] || marksData[subject._id][filters.examType] === undefined
      );

      if (missingMarks) {
        setError("Please enter marks for all subjects.");
        return;
      }

      setLoading(true);
      const promises = subjects.map((subject) => {
        const score = marksData[subject._id][filters.examType];
        return axios.post(`${API_URL}/marks`, {
          studentId: filters.studentId,
          subjectId: subject._id,
          marks: [
            {
              examType: filters.examType,
              score,
            },
          ],
        });
      });

      await Promise.all(promises);
      setSuccess("Marks added successfully!");
      setMarksData({});
      setFilters(prev => ({
        ...prev,
        studentId: "",
        examType: ""
      }));
      
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error saving marks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400">Add Marks</h1>
      {loading && <p className="text-gray-400 mb-4">Loading...</p>}

      {/* Filters */}
      <div className="space-y-4">
        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
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
        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
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
        <select
          name="batch"
          value={filters.batch}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
        >
          <option value="">Select Batch</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="B3">B3</option>
          <option value="B4">B4</option>
        </select>
        <select
          name="studentId"
          value={filters.studentId}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100"
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.student_name} ({student.student_rollno})
            </option>
          ))}
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

      {/* Marks Form */}
      {filters.studentId && filters.examType && subjects.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {subjects.map((subject) => (
            <div key={subject._id} className="border border-gray-700 p-4 rounded bg-gray-800">
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                {subject.subject_name} ({subject.subject_code})
              </label>
              <input
                type="number"
                value={marksData[subject._id]?.[filters.examType] || ""}
                onChange={(e) => handleMarksChange(subject._id, e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder={`Enter marks (0-${filters.examType === "Semester" ? "80" : "20"})`}
                min="0"
                max={filters.examType === "Semester" ? "80" : "20"}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-gray-900 px-4 py-2 rounded hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Save Marks
          </button>
          
          {/* Move error and success messages here */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-emerald-900/50 border border-emerald-500 rounded text-emerald-400">
              {success}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddMarksPage;