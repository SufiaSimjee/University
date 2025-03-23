import { useGetIdeasWithAndWithoutCommentsQuery } from "../slices/reportSlice";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Loader from "./Loader";
import Message from "./Message";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GetIdeasWithAndWithoutComments = () => {
  const { data, error, isLoading } = useGetIdeasWithAndWithoutCommentsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message>Error loading ideas data</Message>;

  const barChartData = {
    labels: ["With Comments", "Without Comments"],
    datasets: [
      {
        label: "Number of Ideas",
        data: [data.ideasWithCommentsCount, data.ideasWithoutCommentsCount],
        backgroundColor: ["#4CAF50", "#FF5733"], 
        borderColor: ["#388E3C", "#C70039"],
        borderWidth: 1,
      },
    ],
  };

  return (
    

      <div style={{ marginBottom: "40px" }} className="col-lg-8 ">
        <h2>Ideas With & Without Comments</h2>
        <Bar data={barChartData} options={{ responsive: true }} />
    
    </div>
  );
};

export default GetIdeasWithAndWithoutComments;
