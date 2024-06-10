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

		return <App style={{ backgroundColor: token.colorBgLayout }} {...props} />;
	};

	return (
		<ConfigProvider
			locale={viVn}
			theme={{
				token: {},
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
