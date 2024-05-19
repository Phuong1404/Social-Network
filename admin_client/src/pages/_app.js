import { App as AntdApp, ConfigProvider, Spin, theme } from 'antd';
import "@/styles/globals.css";
import viVn from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Layout from '@/layout/Layout';
import { useEffect, useState } from 'react';
import { useTheme } from '@/layout/hooks';
import { useAuth } from '@/modules/auth/hooks';
import { useRouter } from 'next/router';
dayjs.locale('vi');

function MyApp({ Component, pageProps }) {
	const [loading, setLoading] = useState(true);
	const { logout, getProfile } = useAuth();
	const { mode } = useTheme();
	const router = useRouter(); 

	useEffect(() => {
		getProfile()
			.catch(logout)
			.finally(() => setLoading(false));
	}, [getProfile, logout]);

	if (loading)
		return (
			<Spin
				size="large"
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			/>
		);
	if (router.pathname === '/login') {
		return (
			<ConfigProvider
				locale={viVn}
				theme={{
					token: {
						borderRadius: 12,
					},
					algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
				}}
				input={{ autoComplete: 'off' }}
				select={{ showSearch: true }}
			>
				<AntdApp>
					<Component {...pageProps} />
				</AntdApp>
			</ConfigProvider>
		);
	}
	return (
		<ConfigProvider
			locale={viVn}
			theme={{
				token: {
					borderRadius: 12,
				},
				algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
			}}
			input={{ autoComplete: 'off' }}
			select={{ showSearch: true }}
		>
			<AntdApp>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</AntdApp>
		</ConfigProvider>
	);
}

export default MyApp;
