import Layout, { withLayout } from '@/layout/components';
import { withAuth } from '@/views/auth/components';
import { Card, Menu } from 'antd';
import { useRouter } from 'next/router';
import { ListFriend } from '../components';
import { friendTypeList } from '../data';
import SEO from '@/common/components/SEO';

function FriendPage() {
	const router = useRouter();
	const type = (router.query.type ) || 'friends';
	const title = friendTypeList.find((item) => item.type == type)?.title;

	const changeType = (type) => router.push({ pathname: router.pathname, query: { type } });

	return (
		<>
			<SEO title={title} />

			<Layout.Sider align="left">
				<Card title="Danh sách" 
					headStyle={{ padding: '0 16px', fontSize: 16, color: '#023E8A', fontWeight: '700' }} 
					bodyStyle={{ padding: 8 }} 
					style={{boxShadow: 'rgba(0, 119, 182, 0.25) 0px 0px 5px'}}
				>
					<Menu
						mode="vertical"
						style={{ width: '100%', border: 'none' }}
						items={friendTypeList.map((item) => ({
							key: item.type,
							icon: <item.Icon />,
							label: item.title,
						}))}
						selectedKeys={[type]}
						onClick={({ key }) => changeType(key)}
					/>
				</Card>
			</Layout.Sider>

			<Layout.Content>
				<ListFriend title={title} api={`users/searchUser/${type}`} />
			</Layout.Content>
		</>
	);
}

export default withAuth(withLayout(FriendPage));
