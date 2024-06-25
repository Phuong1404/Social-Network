import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useAuth } from '@/views/auth/hooks';
import { Analytics } from '@vercel/analytics/react';
import { App, ConfigProvider, theme } from 'antd';

import '../styles/global.scss';
import 'draft-js/dist/Draft.css';

import viVn from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useTheme } from '@/layout/hooks';
import { SERVER_URL } from '@/common/config';
import SEO from '@/common/components/SEO';

dayjs.locale('vi');

export default function NextApp({ Component, pageProps }) {
	const { authUser, login } = useAuth();
	const { mode, getTheme } = useTheme();
	// const { token } = theme.useToken();

	useEffect(() => {
		getTheme();

		if (!authUser) {
			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) login();
		}
	}, []);

	useEffect(() => {
		window.socket = io(SERVER_URL, { autoConnect: false });
		if (authUser) {
			window.socket.connect();
			window.socket.on('connect', () => {
				const accessToken = localStorage.getItem('accessToken');
				window.socket.emit('login', accessToken);

				console.log('✔ Connected to socket!');
			});
		}
		return () => {
			if (authUser) {
				window.socket.off('connect');
				window.socket.disconnect();

				console.log('✖ Disconnected to socket!');
			}
		};
	}, [authUser?._id]);

	const AppContainer = (props) => {
		const { token } = theme.useToken();

		return <App style={{ backgroundColor: '#edfafd' }} {...props} />;
	};

	return (
		<ConfigProvider
			locale={viVn}
			theme={{
				token: {},
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
				},
				algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
			}}
			input={{ autoComplete: 'off' }}
			select={{ showSearch: true }}
		>
			<SEO />

			<Toaster position="bottom-right" />
			<AppContainer>
				<Component {...pageProps} />
			</AppContainer>

			<Analytics />
		</ConfigProvider>
	);
}
