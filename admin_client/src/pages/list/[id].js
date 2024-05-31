import { useRouter } from 'next/router';
import ListDetail from '@/views/list/pages/ListDetail.page';

const ListDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ListDetail id={id} />;
};

export default ListDetailPage;
