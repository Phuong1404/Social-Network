import { useRouter } from 'next/router';
import useSWR from 'swr';
import { swrFetcher } from '@/common/api';
import { FullscreenSpin } from '@/common/components/Loading';
import { Button, Card, message, Popconfirm, Space, Tag, Typography } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { BsPen, BsTrash } from 'react-icons/bs';
import { useState } from 'react';
import { removeListItemsApi } from '@/views/list/api/removeListItems.api';
import AddItemModal from '@/views/list/components/modals/AddItemModal.component';
import { addListItemsApi } from '@/views/list/api/addListItems.api';
import ListFormModal from '@/views/list/components/modals/ListFormModal.component';
import { updateListApi } from '@/views/list/api/updateList.api';
import dynamic from 'next/dynamic';
const Table = dynamic(
	() => import('antd').then((item) => item.Table),
	{
	  ssr: false,
	}
  )

const ListDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: list, isLoading, error, mutate } = useSWR(id ? `/list/${id}` : null, swrFetcher);

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const hasSelected = selectedRowKeys.length > 0;
	const onSelectChange = (rowKeys) => setSelectedRowKeys(rowKeys);

	const [modal, setModal] = useState(null);
	const closeModal = () => setModal(null);
	const openEditListModal = () => setModal("EDIT_LIST");
	const openAddItemModal = () => setModal("ADD_ITEM");

	if (isLoading) return <FullscreenSpin />;
	if (error) return <div>{error || error.toString()}</div>;
	if (!id || !list) {
		router.push('/404');
		return null;
	}

	const handleDelete = async (items) => {
		message.loading({ content: `Đang xóa ${items.length} giá trị...`, key: 'delete' });

		try {
			const removed = await removeListItemsApi(list._id, items);

			setSelectedRowKeys((prev) => prev.filter((key) => !items.includes(key)));
			await mutate(removed, false);

			message.success({ content: `Xóa ${items.length} giá trị thành công!`, key: 'delete' });
		} catch (error) {
			message.error({ content: `Xóa ${items.length} giá trị thất bại! ${error}`, key: 'delete' });
		}
	};

	const handleAddItems = async (items) => {
		message.loading({ content: `Đang thêm ${items.length} giá trị...`, key: 'add' });

		try {
			const added = await addListItemsApi(list._id, items);
			await mutate(added, false);

			message.success({ content: `Thêm ${items.length} giá trị thành công!`, key: 'add' });
			closeModal();
		} catch (error) {
			message.error({ content: `Thêm ${items.length} giá trị thất bại! ${error}`, key: 'add' });
		}
	};

	const handleEditList = async (list) => {
		message.loading({ content: `Đang cập nhật danh sách...`, key: 'edit' });

		try {
			const updated = await updateListApi(id, list);
			await mutate(updated, false);

			message.success({ content: `Cập nhật danh sách thành công!`, key: 'edit' });
			closeModal();
		} catch (error) {
			message.error({ content: `Cập nhật danh sách thất bại! ${error}`, key: 'edit' });
		}
	};

	return (
		<Card
			title={
				<Space direction="vertical">
					<Typography.Title level={4} style={{ margin: 0 }}>
						{list.name}
					</Typography.Title>

					<Space split>
						<Typography.Text type="secondary">ID: {list._id}</Typography.Text>

						<Typography.Text type="secondary">Key: {list.key}</Typography.Text>

						<Typography.Text type="secondary">Số lượng: {list.items.length}</Typography.Text>

						<Tag color={list.isPrivate ? 'red' : 'green'}>{list.isPrivate ? 'Riêng tư' : 'Công khai'}</Tag>
					</Space>
				</Space>
			}
			extra={
				<Space>
					{hasSelected && (
						<Popconfirm
							title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} giá trị đã chọn?`}
							onConfirm={() => handleDelete(selectedRowKeys)}
						>
							<Button danger icon={<Icon component={BsTrash} />}>
								Xóa ({selectedRowKeys.length} giá trị)
							</Button>
						</Popconfirm>
					)}

					<Button icon={<Icon component={BsPen} />} onClick={openEditListModal}>
						Chỉnh sửa
					</Button>

					<Button type="primary" icon={<PlusOutlined />} onClick={openAddItemModal}>
						Thêm mới
					</Button>
				</Space>
			}
		>
			<AddItemModal open={modal == "ADD_ITEM"} onClose={closeModal} onAdd={handleAddItems} />
			<ListFormModal
				open={modal == "EDIT_LIST"}
				onClose={closeModal}
				onSubmit={handleEditList}
				list={list}
			/>

			<Table
				dataSource={list.items.map((item, index) => ({ index: index + 1, key: item, value: item }))}
				rowKey="key"
				rowSelection={{
					preserveSelectedRowKeys: true,
					selectedRowKeys,
					onChange: onSelectChange,
				}}
				columns={[
					{
						title: 'STT',
						dataIndex: 'index',
						width: 60,
						align: 'right',
					},
					{
						title: 'Giá trị',
						dataIndex: 'value',
					},
					{
						title: '',
						dataIndex: 'action',
						render: (_, item) => (
							<Space>
								<Popconfirm
									title="Bạn có chắc muốn xóa giá trị này?"
									onConfirm={() => handleDelete([item.key])}
									okText="Có"
									cancelText="Không"
									placement="left"
								>
									<Button shape="circle" type="text" danger icon={<Icon component={BsTrash} />} />
								</Popconfirm>
							</Space>
						),
						width: 60,
						align: 'center',
					},
				]}
			/>
		</Card>
	);
};

export default ListDetail;
