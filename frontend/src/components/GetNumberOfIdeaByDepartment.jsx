import { useGetNumberofIdeasByDepartmentQuery } from "../slices/reportSlice";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Loader from "./Loader"
import Message from './Message'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GetNumberOfIdeaByDepartment = () => {
  
  const { data, error, isLoading } = useGetNumberofIdeasByDepartmentQuery();

  if (isLoading) return <Loader/>;
  if (error) return <Message> Error loading statistics report</Message>;

  const barChartData = {
    labels: data.map((item) => item.department),
    datasets: [
      {
        label: 'Number of Ideas',
        data: data.map((item) => item.totalIdeas), 
        backgroundColor: '#4BC0C0', 
        borderColor: '#36A2EB', 
        borderWidth: 1,
      },
    ],
  };

  return (
   
      
      <div style={{ marginBottom: '40px'}} className="col-lg-8 ">
        <h2>Number of Ideas by Department</h2>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>
    
  );
};

export default GetNumberOfIdeaByDepartment;
