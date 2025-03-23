import { useGetContributorsByDepartmentQuery } from "../slices/reportSlice";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Loader from "./Loader";
import Message from './Message';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GetNumberOfContributorsByDepartment = () => {
  const { data, error, isLoading } = useGetContributorsByDepartmentQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message> Error loading contributors data</Message>;

  // Ensure data is not null or empty
  if (!data || data.length === 0) {
    return <Message>No contributor data available</Message>;
  }

  const barChartData = {
    labels: data.map((item) => item.departmentName), // Fix key name
    datasets: [
      {
        label: 'Number of Contributors',
        data: data.map((item) => item.totalContributors),
        backgroundColor: '#FF6F61',
        borderColor: '#D32F2F',
        borderWidth: 1,
      },
    ],
  };

  return (
   

      <div style={{ marginBottom: '40px' }} className="col-lg-8 ">
        <h2>Number of Contributors by Department</h2>
        <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
    
  );
};

export default GetNumberOfContributorsByDepartment;
