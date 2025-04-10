import { useState } from "react";
import Sidebar from "../components/Sidebar_DashboardPage";
import Navbar from "../components/Navbar_DashboardPage";

// Import components for different pages
import SubjectsDashboard from "./SubjectsDashboard"; // Import the SubjectsDashboard
import AddStudentPage from "./AddStudentPage"; // Import AddStudentPage
import AddMarksPage from "./AddMarksPage"; // Import AddMarksPage
import Home from "./Home_Dashboard";
import ViewMarks from "./ViewMarks"; // Add this import

const DashboardPage = () => {
  const [activePage, setActivePage] = useState("Home"); // Default page is Home
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setSidebarOpen(false); // Automatically close the sidebar after selecting a page
  };

  // Render the component for the active page
  const renderActivePage = () => {
    switch (activePage) {
      case "Home":
        return <Home />;
      case "SubjectsDashboard":
        return <SubjectsDashboard />;
      case "AddStudentPage": // Add the AddStudentPage case
        return <AddStudentPage />;
      case "AddMarksPage": // Add the AddMarksPage case
        return <AddMarksPage />;
      case "ViewMarks": // Add this case
        return <ViewMarks />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setActivePage={handlePageChange} // Pass the new handlePageChange function
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Content Section */}
        <div className="flex-1 p-6 overflow-y-auto mt-16"> {/* Add 'mt-16' to push content below navbar */}
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
