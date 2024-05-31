import { useRouter } from 'next/router';
import UserDetail from '@/views/user/pages/UserDetail';

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <UserDetail id={id} />;
};

export default UserDetailPage;
