import { Avatar,message } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const PageTableBase = dynamic(() => import('@/common/components/PageTableBase').then((mod) => mod.PageTableBase), {
	ssr: false,
});
import AdminFormModal from '@/views/admin/components/modals/AdminModal.component';
import { createAdminApi } from '@/views/admin/api/createAdmin.api';
const {usePageTableBase} = require('../../../common/components/PageTableBase/PageTableBase.component')
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
	const { tableBase } = usePageTableBase({ endpoint: '/admin/searchAdmin' });
	const [modal, setModal] = useState(null);
	const closeModal = () => setModal(null);
	
	const openCreateModal = () => {
		setModal("LIST_FORM");
	};
	const handleSubmit = async (data) => {
		message.loading({
			content:'Đang tạo danh sách...',
			key: 'submit',
		});

		try {
			await createAdminApi(data) 
			await tableBase.mutate();

			message.success({
				content: 'Tạo quản trị viên thành công',
				key: 'submit',
			});
			closeModal();
		} catch (error) {
			message.error({
				content: `Tạo quản trị viên thất bại: ${error}`,
				key: 'submit',
			});
		}
	};
	return(
		<>
			<AdminFormModal
				open={modal == "LIST_FORM"}
				onClose={closeModal}
				onSubmit={handleSubmit}
			/> 
			<PageTableBase header="Quản trị viên" 
				endpoint="/admin/searchAdmin" 
				actions={[
				<Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
					Tạo mới
				</Button>,
			]}
				columns={columns} />
		</>);
}
