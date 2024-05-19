import { TableBase } from '@/common/components/Table';
import { Avatar, Button, Card } from 'antd';
import { useRouter } from 'next/router';

const columns = [
	{
		key: 'avatar',
		title: 'Avatar',
		dataIndex: 'profilePicture',
		render: (profilePicture, user) => (
			<Avatar src={profilePicture.link} alt="avatar">
				{user.fullname}
			</Avatar>
		),
	},
	{
		key: 'fullname',
		title: 'Tên',
		dataIndex: 'fullname',
	},
	{
		key: 'email',
		title: 'Email',
		dataIndex: 'email',
	},
];

export default function UserTable() {
	const router = useRouter();

	const viewAll = () => {
		router.push('/account/user');
	};

	return (
		<Card title="Người dùng mới" extra={<Button onClick={viewAll}>Xem tất cả</Button>} bodyStyle={{ padding: 12 }}>
			<TableBase
				endpoint="/admin/searchUser"
				columns={columns}
				pagination={{ position: [] }}
			/>
		</Card>
	);
}
