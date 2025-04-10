import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ResultsCharts = () => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add new state for statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    branchCounts: {},
    batchCounts: {},
    performanceMetrics: {},
  });

  const API_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api" 
    : "/api";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all required data
        const studentsRes = await axios.get(`${API_URL}/students`);
        console.log("Students data:", studentsRes.data);
        
        const subjectsRes = await axios.get(`${API_URL}/subjects`);
        console.log("Subjects data:", subjectsRes.data);

        // Fetch marks for each student
        const allMarks = [];
        for (const student of studentsRes.data.students) {
          try {
            const studentMarksRes = await axios.get(`${API_URL}/marks/${student._id}`);
            if (studentMarksRes.data && studentMarksRes.data.marks) {
              allMarks.push(...studentMarksRes.data.marks);
            }
          } catch (err) {
            console.error(`Error fetching marks for student ${student._id}:`, err);
          }
        }
        console.log("All marks data:", allMarks);

        setStudents(studentsRes.data.students || []);
        setSubjects(subjectsRes.data.subjects || []);
        setMarks(allMarks);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Process data for charts
  const processChartData = () => {
    try {
      // 1. Branch-wise average marks
      const branchScores = {};
      students.forEach((student) => {
        const studentMarks = marks.filter(mark => mark.studentId === student._id);
        if (studentMarks.length > 0) {
          const branch = student.student_branch;
          if (!branchScores[branch]) {
            branchScores[branch] = { total: 0, count: 0 };
          }
          
          studentMarks.forEach(markDoc => {
            const examScores = markDoc.marks.map(m => m.score);
            const avgScore = examScores.reduce((a, b) => a + b, 0) / examScores.length;
            branchScores[branch].total += avgScore;
            branchScores[branch].count += 1;
          });
        }
      });

      const branchChartData = {
        labels: Object.keys(branchScores),
        datasets: [{
          label: 'Average Marks by Branch',
          data: Object.entries(branchScores).map(([, data]) => 
            data.count > 0 ? data.total / data.count : 0
          ),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      };

      // 2. Subject-wise average marks
      const subjectScores = {};
      marks.forEach(mark => {
        if (!subjectScores[mark.subjectId]) {
          subjectScores[mark.subjectId] = { total: 0, count: 0 };
        }
        mark.marks.forEach(m => {
          subjectScores[mark.subjectId].total += m.score;
          subjectScores[mark.subjectId].count += 1;
        });
      });

      const subjectChartData = {
        labels: subjects.map(s => s.subject_name),
        datasets: [{
          label: 'Average Marks by Subject',
          data: subjects.map(subject => {
            const scores = subjectScores[subject._id];
            return scores ? scores.total / scores.count : 0;
          }),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }]
      };

      // 3. Student distribution by branch
      const branchDistribution = {};
      students.forEach(student => {
        const branch = student.student_branch;
        branchDistribution[branch] = (branchDistribution[branch] || 0) + 1;
      });

      const pieChartData = {
        labels: Object.keys(branchDistribution),
        datasets: [{
          label: 'Students per Branch',
          data: Object.values(branchDistribution),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        }]
      };

      return { branchChartData, subjectChartData, pieChartData };
    } catch (err) {
      console.error("Error processing chart data:", err);
      return null;
    }
  };

  // Calculate statistics from the data
  const calculateStats = () => {
    const branchCounts = {};
    const batchCounts = {};
    const performanceMetrics = {
      byBranch: {},
    };

    students.forEach(student => {
      // Count by branch
      branchCounts[student.student_branch] = (branchCounts[student.student_branch] || 0) + 1;
      
      // Count by batch
      batchCounts[student.student_batch] = (batchCounts[student.student_batch] || 0) + 1;
      
      // Initialize performance metrics
      if (!performanceMetrics.byBranch[student.student_branch]) {
        performanceMetrics.byBranch[student.student_branch] = {
          total: 0,
          count: 0,
          highest: 0,
          lowest: 100,
        };
      }
    });

    // Calculate performance metrics
    marks.forEach(mark => {
      const student = students.find(s => s._id === mark.studentId);
      if (student) {
        const avgScore = mark.marks.reduce((sum, m) => sum + m.score, 0) / mark.marks.length;
        
        // Update branch metrics
        const branchMetrics = performanceMetrics.byBranch[student.student_branch];
        branchMetrics.total += avgScore;
        branchMetrics.count += 1;
        branchMetrics.highest = Math.max(branchMetrics.highest, avgScore);
        branchMetrics.lowest = Math.min(branchMetrics.lowest, avgScore);
      }
    });

    setStats({
      totalStudents: students.length,
      totalSubjects: subjects.length,
      branchCounts,
      batchCounts,
      performanceMetrics,
    });
  };

  useEffect(() => {
    calculateStats();
  }, [students, marks, subjects]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-white text-lg">Loading charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const chartData = processChartData();
  if (!chartData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500 text-lg">Error processing chart data</p>
      </div>
    );
  }

  const { branchChartData, subjectChartData, pieChartData } = chartData;

  // Render statistics cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-emerald-400 text-lg font-semibold">Total Students</h4>
        <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-emerald-400 text-lg font-semibold">Total Subjects</h4>
        <p className="text-3xl font-bold text-white">{stats.totalSubjects}</p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-emerald-400 text-lg font-semibold">Total Branches</h4>
        <p className="text-3xl font-bold text-white">{Object.keys(stats.branchCounts).length}</p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-emerald-400 text-lg font-semibold">Total Batches</h4>
        <p className="text-3xl font-bold text-white">{Object.keys(stats.batchCounts).length}</p>
      </div>
    </div>
  );

  // Branch-wise detailed stats
  const renderBranchStats = () => (
    <div className="bg-gray-700 p-4 rounded-lg mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Branch-wise Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats.branchCounts).map(([branch, count]) => (
          <div key={branch} className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-emerald-400 font-medium">{branch}</h4>
            <div className="mt-2">
              <p className="text-white">Students: {count}</p>
              {stats.performanceMetrics.byBranch[branch] && (
                <>
                  <p className="text-white">
                    Avg Score: {
                      (stats.performanceMetrics.byBranch[branch].total / 
                       stats.performanceMetrics.byBranch[branch].count).toFixed(2)
                    }
                  </p>
                  <p className="text-green-400">
                    Highest: {stats.performanceMetrics.byBranch[branch].highest.toFixed(2)}
                  </p>
                  <p className="text-red-400">
                    Lowest: {stats.performanceMetrics.byBranch[branch].lowest.toFixed(2)}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-8">Results Dashboard</h2>
      
      {/* Statistics Cards */}
      {renderStatsCards()}
      
      {/* Branch Statistics */}
      {renderBranchStats()}
      
      {/* Charts */}
      <div className="space-y-12">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Average Marks by Branch</h3>
          <div className="h-[300px]">
            <Bar
              data={branchChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { color: 'white' } },
                },
                scales: {
                  y: { 
                    beginAtZero: true,
                    ticks: { color: 'white' }
                  },
                  x: {
                    ticks: { color: 'white' }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Average Marks by Subject</h3>
          <div className="h-[300px]">
            <Bar
              data={subjectChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { color: 'white' } },
                },
                scales: {
                  y: { 
                    beginAtZero: true,
                    ticks: { color: 'white' }
                  },
                  x: {
                    ticks: { color: 'white' }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Student Distribution by Branch</h3>
            <div className="h-[300px]">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'right',
                      labels: { color: 'white' }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Batch Distribution</h3>
            <div className="h-[300px]">
              <Doughnut 
                data={{
                  labels: Object.keys(stats.batchCounts),
                  datasets: [{
                    data: Object.values(stats.batchCounts),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                    ],
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'right',
                      labels: { color: 'white' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCharts;