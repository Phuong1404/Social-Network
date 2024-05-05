import Layout from '@/layout/components';
import { Avatar, Card, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';
import SEO from '@/common/components/SEO';


const ProviderAuthPage = ({ provider }) => {
	const router = useRouter();
	const { login } = useAuth();

	useEffect(() => {
		const loginWithProvider = async () => {
			const toastId = toast.loading('Đang xử lý...');

			const { accessToken, refreshToken } = router.query;

			if (!accessToken || !refreshToken) {
				toast.error(`Đăng nhập với ${provider?.name} thất bại!`, { id: toastId });
				return router.replace('/auth/login');
			}

			try {

				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);


				await login();


				toast.success(`Đăng nhập với ${provider?.name} thành công!`, { id: toastId });
				await router.replace('/');
			} catch (error) {

				toast.error(`Đăng nhập với ${provider?.name} thất bại! Lỗi: ${error.toString()}`, { id: toastId });
				await router.replace('/auth/login');
			}
		};


		if (router.isReady) loginWithProvider().then();
	}, [router.isReady]);

	return (
		<Layout.Container>
			<SEO title={`Đăng nhập với ${provider?.name}`} robot />

			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Card>
					<Card.Meta
						description={<Spin />}
						title={`Đang đăng nhập với ${provider?.name}`}
						avatar={<Avatar src={provider?.icon} />}
					/>
				</Card>
			</div>
		</Layout.Container>
	);
};

export default ProviderAuthPage;
