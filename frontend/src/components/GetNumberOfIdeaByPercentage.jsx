import { useGetPercentageOfIdeasByDepartmentQuery } from "../slices/reportSlice";
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'; 
import Loader from "./Loader";
import Message from './Message';


ChartJS.register(ArcElement, Tooltip, Legend, Title); 

const GetNumberOfIdeaByPercentage = () => {
  const { data, error, isLoading } = useGetPercentageOfIdeasByDepartmentQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message>Error loading statistics report</Message>;

  // Prepare data for Pie Chart
  const pieChartData = {
    labels: data.map((item) => item.department), 
    datasets: [
      {
        data: data.map((item) => item.percentage), 
        backgroundColor: [
          '#1E3A8A', // Blue
          '#FF5733', // Red
          '#28A745', // Green
          '#FFC107', // Yellow
          '#6F42C1', // Purple
          '#DC3545', // Red
          '#007BFF', // Blue
          '#FD7E14', // Orange
        ],
        hoverBackgroundColor: [
          '#1E40AF', '#C0392B', '#218838', '#FFB600', '#8E44AD', 
          '#C0392B', '#0056B3', '#F39C12'
        ],
        borderColor: '#FFFFFF', 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        // text: 'Percentage of Ideas by Department',
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      legend: {
        position: 'top', 
        labels: {
          fontSize: 14, 
        },
      },
    },
    layout: {
      padding: 20, 
    },
  };

  return (
    <div className="container" >
    <h1>Percentage of Ideas by Department</h1>
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6" style={{height: '50%'}}>
        <Pie data={pieChartData} options={options} />
      </div>
    </div>
  </div>
  
  );
};

export default GetNumberOfIdeaByPercentage;
