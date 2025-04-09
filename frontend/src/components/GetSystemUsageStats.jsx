import { Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
import { useGetUserActivityStatsQuery, useGetMostActiveUserQuery } from "../slices/reportSlice";

const GetSystemUsageStats = () => {
  const {
    data: activityStats,
    isLoading: loadingActivity,
    error: activityError,
  } = useGetUserActivityStatsQuery();

  const {
    data: mostActiveUser,
    isLoading: loadingUser,
    error: userError,
  } = useGetMostActiveUserQuery();

  if (loadingActivity || loadingUser) return <Spinner animation="border" />;
  if (activityError || userError)
    return <Alert variant="danger">Error loading system usage stats</Alert>;

  const activeUser = mostActiveUser && mostActiveUser.length > 0 ? mostActiveUser[0] : null;

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-3">
        <Card.Title className="mb-3 fs-5 fw-semibold text-primary">System Usage Statistics</Card.Title>
        <Table hover borderless className="mb-0">
          <tbody>
            <tr className="border-bottom">
              <td className="text-muted py-2"><strong>Most Active User</strong></td>
              <td className="py-2">
                {activeUser?.fullName ? (
                  <Badge bg="primary" className="fw-normal">
                    {activeUser.fullName}
                  </Badge>
                ) : "N/A"}
              </td>
            </tr>
            <tr className="border-bottom">
              <td className="text-muted py-2"><strong>Most Used Browser</strong></td>
              <td className="py-2">{activityStats?.mostUsedBrowser || "N/A"}</td>
            </tr>
            <tr className="border-bottom">
              <td className="text-muted py-2"><strong>Most Used Device</strong></td>
              <td className="py-2">{activityStats?.mostUsedDevice || "N/A"}</td>
            </tr>
            <tr>
              <td className="text-muted py-2"><strong>Most Visited Page</strong></td>
              <td className="py-2">
                {activityStats?.mostVisitedPage ? (
                  <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}} title={activityStats.mostVisitedPage}>
                    {activityStats.mostVisitedPage}
                  </span>
                ) : "N/A"}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default GetSystemUsageStats;