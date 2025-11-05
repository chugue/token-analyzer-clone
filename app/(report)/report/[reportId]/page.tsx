import { useParams } from "next/navigation";

const ReportDetailPage = () => {
  const params = useParams();
  const reportId = params?.reportId as string | undefined;

  return <div>ReportDetailPage</div>;
};

export default ReportDetailPage;
