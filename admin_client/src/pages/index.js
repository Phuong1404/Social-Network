import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { layoutData } from '@/layout/data';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(layoutData[0].path);
  }, [router]);

  return null;
};

export default HomePage;
