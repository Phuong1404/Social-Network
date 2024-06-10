import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ListFormModal from '@/views/list/components/modals/ListFormModal.component';
import { createListApi } from '@/views/list/api/createList.api';
import { updateListApi } from '@/views/list/api/updateList.api';
import { BsPen, BsTrash } from 'react-icons/bs';
import { deleteListApi } from '@/views/list/api/deleteList.api';
const PageTableBase = dynamic(() => import('@/common/components/PageTableBase').then((mod) => mod.PageTableBase), {
	ssr: false,
});
// import {usePageTableBase} from '@/common/components/PageTableBase'
// import { usePageTableBase } from '../../../common/components';
const {usePageTableBase} = require('../../../common/components/PageTableBase/PageTableBase.component')


export default function ListPage() {
	const router = useRouter();
	const { tableBase } = usePageTableBase({ endpoint: '/list' });

	const [modal, setModal] = useState(null);
	const closeModal = () => setModal(null);
	
	const [list, setList] = useState();
	const openCreateModal = () => {
		setList(undefined);
		setModal("LIST_FORM");
	};
	const openEditModal = (list) => {
		setList(list);
		setModal("LIST_FORM");
	};

	const handleSubmit = async (data) => {
		const isCreate = !list?._id;
		message.loading({
			content: isCreate ? 'Đang tạo danh sách...' : 'Đang cập nhật danh sách...',
			key: 'submit',
		});

		try {
			await (isCreate ? createListApi(data) : updateListApi(list?._id, data));
			await tableBase.mutate();

			message.success({
				content: isCreate ? 'Tạo danh sách thành công' : 'Cập nhật danh sách thành công',
				key: 'submit',
			});
			closeModal();
		} catch (error) {
			message.error({
				content: isCreate ? `Tạo danh sách thất bại: ${error}` : `Cập nhật danh sách thất bại: ${error}`,
				key: 'submit',
			});
		}
	};

	const handleDelete = async (list) => {
		message.loading({
			content: 'Đang xóa danh sách...',
			key: 'submit',
		});

		try {
			await deleteListApi(list._id);
			await tableBase.mutate();

			message.success({
				content: 'Xóa danh sách thành công',
				key: 'submit',
			});
		} catch (error) {
			message.error({
				content: `Xóa danh sách thất bại: ${error}`,
				key: 'submit',
			});
		}
	};

	const columns = [
		{
			key: 'key',
			title: 'Key',
			dataIndex: 'key',
			width: 200,
		},
		{
			key: 'name',
			title: 'Tên danh sách',
			dataIndex: 'name',
		},
		{
			key: 'length',
			title: 'Số lượng',
			dataIndex: 'items',
			render: (items) => items.length,
			width: 100,
			align: 'right',
		},
		{
			key: 'isPrivate',
			title: 'Bảo mật',
			dataIndex: 'isPrivate',
			render: (isPrivate) => (
				<Tag color={isPrivate ? 'red' : 'green'}>{isPrivate ? 'Riêng tư' : 'Công khai'}</Tag>
			),
			width: 100,
		},
		{
			key: 'actions',
			title: 'Hành động',
			render: (_, list) => (
				<Space onClick={(e) => e.stopPropagation()}>
					<Button
						shape="circle"
						type="text"
						icon={<Icon component={BsPen} />}
						onClick={() => openEditModal(list)}
					/>

					<Popconfirm title="Bạn có chắc chắn muốn xóa danh sách này?" onConfirm={() => handleDelete(list)}>
						<Button shape="circle" type="text" icon={<Icon component={BsTrash} />} danger />
					</Popconfirm>
				</Space>
			),
			width: 100,
		},
	];

	return (
		<>
			<ListFormModal
				open={modal == "LIST_FORM"}
				onClose={closeModal}
				list={list}
				onSubmit={handleSubmit}
			/>

			<PageTableBase
				endpoint="/list"
				header="Quản lý danh sách"
				actions={[
					<Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
						Tạo mới
					</Button>,
				]}
				columns={columns}
				onRow={(record) => ({
					style: { cursor: 'pointer' },
					onClick: () => {
						router.push(`/list/${record._id}`);
					},
				})}
			/>
		</>
	);
}
