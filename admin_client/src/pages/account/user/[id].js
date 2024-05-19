import { useRouter } from 'next/router';
import UserDetail from '@/modules/user/pages/UserDetail';

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <UserDetail id={id} />;
};

export default UserDetailPage;
