import {Button , Table } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetClouserDateQuery } from '../../slices/clouserDateApiSlice';

const AcademicYearScreen = () => {
  const { data: academicYearDates, error, isLoading } = useGetClouserDateQuery(); 

  return (
    <>
      <h1 className='mt-4 mb-4'>Academic Year Dates </h1>
      
        <Link to="/academicYear/create">
            <Button variant="info" className="mb-3">Add</Button>
          </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">Error loading Academic Year history!</Message>
      ) : academicYearDates?.length === 0 ? (
        <Message variant="info">There are no Academic Year Dates.</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Academic Year Start</th>
              <th>Academic Year End</th>
              <th>Idea Closure Date</th>
              <th>Final Closure Date</th>
            </tr>
          </thead>
          <tbody>
            {academicYearDates?.map((date, index) => (
              <tr key={date._id}>
                <td>{index + 1}</td>
                <td>{date.academicYearStart.split('T')[0]}</td>
                <td>{date.academicYearEnd.split('T')[0]}</td>
                <td>{date.ideaClosureDate.split('T')[0]}</td>
                <td>{date.finalClosureDate.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AcademicYearScreen;
