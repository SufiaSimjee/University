import { useGetAnonymousIdeasAndCommentsQuery } from "../slices/reportSlice";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Loader from "./Loader";
import Message from './Message';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GetAnonymousIdeasAndComments = () => {
  
  const { data, error, isLoading } = useGetAnonymousIdeasAndCommentsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message> Error loading anonymous ideas and comments statistics</Message>;

  const barChartData = {
    labels: ['Anonymous Ideas', 'Anonymous Comments'], 
    datasets: [
      {
        label: 'Anonymous Ideas',
        data: [data.anonymousIdeasCount, 0], 
        backgroundColor: '#8934eb', 
        borderColor: '#6a1f9c',
        borderWidth: 1,
      },
      {
        label: 'Anonymous Comments',
        data: [0, data.anonymousCommentsCount], 
        backgroundColor: '#34eb89', 
        borderColor: '#1c9c6a',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Statistics Report</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Anonymous Ideas and Comments</h2>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default GetAnonymousIdeasAndComments;
