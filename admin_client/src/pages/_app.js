import { App as AntdApp, ConfigProvider, Spin, theme } from 'antd';
import "@/styles/globals.css";
import viVn from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Layout from '@/layout/Layout';
import { useEffect, useState } from 'react';
import { useTheme } from '@/layout/hooks';
import { useAuth } from '@/views/auth/hooks';
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
	if (router.pathname == '/login') {
		return (
			<ConfigProvider
				locale={viVn}
				theme={{
					token: {
						borderRadius: 12,
					},
					algorithm: mode == 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
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
				components: {
					Menu:{
						fontSize: 16,
						itemColor: '#00b4d8',
						itemSelectedColor: '#023e8a',
						itemActiveBg: '#00b4d8',
						itemHoverColor: '#023e8a',	
						itemHeight: 36,					
					},
					Input: {
						colorTextPlaceholder: '#0077B6',
						colorBorder: '#0077B6',
						borderRadius: 10,
					},
					Tooltip: {
						colorBgSpotlight: '#03045E',
					},
					Divider: {
						colorSplit: 'rgb(3, 4, 94, 0.5)'
					},
					Typography: {
						colorText: '#023E8A'
					},
					Modal: {
						titleColor: '#023E8A'
					},
					Button: {
						colorPrimary: '#023E8A',
						colorPrimaryHover: '#0077B6',
						defaultColor: '#0077B6',
						colorBorder: '#0077B6',
					},
					Card: {
						actionsLiMargin: '7px 0',
						colorTextHeading: '#0077B6',
						headerFontSize: 14,
						headerHeight: 45,
					},
					Popover: {
						boxShadow: 'rgba(0, 119, 182, 0.25) 0px 0px 5px',
					},
					Form: {
						labelColor: '#023E8A',
						itemMarginBottom: 14,
					},
					Select: {
						colorBorder: '#0077B6',
						colorText: '#023E8A',
						boxShadow: 'rgba(0, 119, 182, 0.25) 0px 0px 5px !important',
						borderRadius: '8px !important'
					},
					Steps: {
						colorSplit: '#90E0EF',
					},
					List:{
						titleMarginBottom: 0,
					}
				}
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
