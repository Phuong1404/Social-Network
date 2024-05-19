import { Avatar } from 'antd';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import UserStatusTag from '@/modules/user/components/UserStatusTag.component';

const PageTableBase = dynamic(() => import('@/common/components/PageTableBase').then((mod) => mod.PageTableBase), {
	ssr: false,
});

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
		key: 'status',
		title: 'Trạng thái',
		dataIndex: 'status',
		render: (_, user) => <UserStatusTag user={user} />,
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

export default function UserPage() {
	const router = useRouter();

	const handleRowClick = (record) => {
		router.push(`/account/user/${record._id}`);
	};

	return (
		<PageTableBase
			header="Người dùng"
			endpoint="/admin/searchUser"
			columns={columns}
			onRow={(record) => ({
				style: { cursor: 'pointer' },
				onClick: () => handleRowClick(record),
			})}
		/>
	);
}
