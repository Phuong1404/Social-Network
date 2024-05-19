import { useRouter } from 'next/router';
import ReportDetail from '@/modules/report/pages/ReportDetail.page';

const ReportDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ReportDetail id={id} />;
};

export default ReportDetailPage;
