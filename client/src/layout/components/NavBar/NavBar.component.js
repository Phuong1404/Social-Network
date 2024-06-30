import Layout from '@/layout/components';
import { useAuth } from '@/views/auth/hooks';
import { App, Button, theme, Tooltip, Typography, Badge } from 'antd';
import { useRouter } from 'next/router';
import { FiHome, FiMessageSquare, FiUser, FiUsers } from 'react-icons/fi';
import styles from '../../styles/Layout.module.scss';
import { HeaderCenter, HeaderRight } from '../Header.component';
import { NavBarLeft } from './NavBarLeft.component';
import { NavBarRight } from './NavBarRight.component';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FcSms } from 'react-icons/fc';
import { MessageItem } from '@/views/messages/components';


const items = [
	{
		label: 'Trang chủ',
		RIcon: FiHome,
		path: '/home',
	},
	{
		label: 'Bạn bè',
		RIcon: FiUsers,
		path: '/friends',
	},
	{
		label: 'Tin nhắn',
		RIcon: FiMessageSquare,
		path: '/messages',
	},
	{
		label: 'Trang cá nhân',
		RIcon: FiUser,
		path: '/profile',
	},
];

export default function NavBar() {
	const { authUser } = useAuth();
	const router = useRouter();
	const { token } = theme.useToken();
	const { notification } = App.useApp();
	const [notiUnread, setNotiUnread] = useState(false)
	useEffect(() => {
		if (authUser) {
			window.socket.on('sendMessage', (data) =>{
				if (!router.pathname.startsWith('/messages')) {
					setNotiUnread(true);
				} 
				notification.open({
					icon: <FcSms />,
					message: 'Tin nhắn mới!',
					description: <MessageItem message={data} />,
					placement: 'bottomRight',
					style: { cursor: 'pointer' },
					onClick: () =>
						router.push({
							pathname: '/messages',
							query: { id: data.conversation },
						}),
				})}
			);
		}
		return () => {
			if (authUser) {
				window.socket.off('sendMessage');
			}
		};
	}, [authUser?._id]);

	return (
		<Layout.Header>
			<NavBarLeft />
			<HeaderCenter>
				{authUser ? (
					items.map((page) => {
						const isCurrentPage = router.pathname.startsWith(page.path);
						const classes = [styles.nav_button];
						if (isCurrentPage) classes.push(styles.nav_button_active);
						return (
							<Tooltip key={page.path} title={page.label} mouseEnterDelay={1} >
								<Button
									size="large"
									onClick={() => router.push(page.path)}
									icon={page.path === '/messages' && notiUnread ? <Badge dot={true}><page.RIcon /></Badge>: <page.RIcon /> }
									className={classes.join(' ')}
									type="text"
									style={{
										color: isCurrentPage ? '#03045E' : '#90E0EF',
									}}
								/>
							</Tooltip>
						);
					})
				) : (
					<Typography.Title level={2} style={{ margin: 0, color: '#03045E' }}>
						Social - Kết nối và sáng tạo
					</Typography.Title>
				)}
			</HeaderCenter>

			{authUser ? (
				<NavBarRight />
			) : (
				<HeaderRight> 
					<Link href="/auth/login" draggable>
						<Button 
							type="primary"
							style={{
								height: 34, 
								borderRadius: 10, 
								backgroundColor: '#0077B6',
								boxShadow: 'rgba(3, 4, 94, 0.25) 0px 4px 4px'
							}}
						>
							Đăng nhập
						</Button>
					</Link>

					<Link href="/auth/register" draggable>
						<Button 
							type="text"
							style={{
								height: 34, 
								borderRadius: 10, 
								borderColor: '#0077B6',
								borderWidth: 1,
								boxShadow: 'rgba(3, 4, 94, 0.25) 0px 4px 4px',
								color: '#0077B6'
							}}
						>
							Đăng ký
						</Button>
					</Link>
				</HeaderRight>
			)}
		</Layout.Header>
	);
}
