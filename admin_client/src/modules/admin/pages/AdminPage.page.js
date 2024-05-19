import { Avatar } from 'antd';
import dynamic from 'next/dynamic';
const PageTableBase = dynamic(() => import('@/common/components/PageTableBase').then((mod) => mod.PageTableBase), {
	ssr: false,
});
const columns = [
	{
		key: 'avatar',
		title: 'Avatar',
		dataIndex: 'profilePicture',
		render: (profilePicture, user) =>{
			return (
				
				<Avatar src={profilePicture && profilePicture.link} alt="avatar">
					{user.fullname}
				</Avatar>
			)
		} 
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

export default function AdminPage() {
	return <PageTableBase header="Quản trị viên" endpoint="/admin/searchAdmin" columns={columns} />;
}
