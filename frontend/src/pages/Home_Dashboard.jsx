import FactofTheDay from "../components/FactofTheDay_DashboardPage";
import ResultsCharts from "../components/ResultsCharts";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <div className="mb-8">
        <FactofTheDay />
      </div>
      
      <div className="mb-8">
        <ResultsCharts />
      </div>
    </div>
  );
};

export default Home;
