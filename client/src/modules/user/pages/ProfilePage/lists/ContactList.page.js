import { contactOptions, privacyOptions } from '@/assets/data';
import { PrivacyDropdown } from '@/common/components/Button';
import { useAuth } from '@/modules/auth/hooks';
import { Button, Form, Input, List, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';
import { useUserContext } from '@/modules/user/hooks';
import { SelectApi } from '@/common/components/Input';
import { useFetcher } from '@/common/hooks';

export const ContactList = () => {
	const { user, isCurrentUser } = useUserContext();
	const { updateAuthUser } = useAuth();
	const [contacts, setContacts] = useState(user.contact);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);

	const openModal = (data) => {
		setModalOpen(true);
		setModalData(data || null);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalData(null);
	};

	const optimisticUpdate = async (newContacts, updateNotify) => {
		if (!isCurrentUser) return;

		const prev = [...contacts];

		setContacts(newContacts);

		try {
			await updateAuthUser({ contact: newContacts });
			toast.success(`${updateNotify} thành công!`);
		} catch (error) {
			setContacts(prev);
			toast.error(`${updateNotify} thất bại! ${error.message || error}`);
		}
	};

	const handleCreate = (data) => optimisticUpdate([...contacts, data], 'Thêm liên hệ');

	const handleUpdate = async (data, index) => {
		const newContact = [...contacts];
		newContact[index] = data;
		await optimisticUpdate(newContact, 'Cập nhật liên hệ');
	};

	const handleModalSubmit = async (data) => {
		if (modalData?.index !== undefined) {
			await handleUpdate(data, modalData.index);
		} else {
			await handleCreate(data);
		}

		closeModal();
	};

	const handleDelete = async (index) => {
		const newContact = [...contacts];
		newContact.splice(index, 1);
		await optimisticUpdate(newContact, 'Xóa liên hệ');
	};

	const handlePrivacyChange = async (value, index) => {
		const newContact = [...contacts];
		newContact[index].privacy = value;
		await optimisticUpdate(newContact, 'Thay đổi quyền riêng tư');
	};

	return (
		<>
			<ContactModal open={modalOpen} onClose={closeModal} data={modalData?.data} onSubmit={handleModalSubmit} />

			<List
				header={
					isCurrentUser && (
						<Button icon={<HiPlus />} onClick={() => openModal()}>
							Thêm mới
						</Button>
					)
				}
				bordered
				dataSource={contacts}
				renderItem={(contact, index) => {
					const actions = [];
					if (isCurrentUser) {
						actions.push(
							<PrivacyDropdown
								key="privacy"
								value={contact.privacy}
								onChange={(value) => handlePrivacyChange(value, index)}
							/>,
							<Button
								key="edit"
								type="text"
								icon={<HiPencil />}
								onClick={() => openModal({ data: contact, index })}
							/>,
							<Button key="delete" type="text" icon={<HiTrash />} onClick={() => handleDelete(index)} />
						);
					}

					const title = contactOptions.find((option) => option.value === contact.type)?.label;

					return (
						<List.Item actions={actions}>
							<List.Item.Meta title={title} description={contact.value} style={{ width: '100%' }} />
						</List.Item>
					);
				}}
			/>
		</>
	);
};

const defaultValues = {
	type: 'phone',
	value: '',
	privacy: {
		value: 'public',
	},
};

function ContactModal({ open, onClose, data, onSubmit }) {
	const [form] = Form.useForm();

	React.useEffect(() => {
		if (open) {
			if (!data) form.setFieldsValue(defaultValues);
			else form.setFieldsValue(data);
		}
	}, [open, data]);

	const friendFetcher = useFetcher({ api: `/users/searchUser/friends` });
	const privacyValue = Form.useWatch(['privacy', 'value'], form);

	return (
		<Modal
			open={open}
			onCancel={onClose}
			title={data ? 'Chỉnh sửa thông tin liên hệ' : 'Thêm thông tin liên hệ'}
			okText={data ? 'Lưu' : 'Thêm'}
			onOk={form.submit}
			cancelText="Hủy"
		>
			<Form form={form} onFinish={onSubmit} layout="vertical">
				<Form.Item
					name="type"
					label="Loại liên hệ"
					rules={[
						{
							required: true,
							message: 'Vui lòng chọn loại liên hệ!',
						},
					]}
				>
					<Select options={contactOptions} />
				</Form.Item>

				<Form.Item
					name="value"
					label="Giá trị"
					dependencies={['type']}
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập giá trị!',
						},
						({ getFieldValue }) => {
							const type = getFieldValue('type');

							if (type === 'phone') {
								return {
									pattern: /^0[0-9]{9}$/,
									message: 'Số điện thoại không hợp lệ!',
								};
							}

							if (type === 'email') {
								return {
									type: 'email',
									message: 'Email không hợp lệ!',
								};
							}

							return {
								type: 'url',
								message: 'URL không hợp lệ!',
							};
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name={['privacy', 'value']}
					label="Quyền riêng tư"
					rules={[
						{
							required: true,
							message: 'Vui lòng chọn quyền riêng tư!',
						},
					]}
				>
					<Select options={privacyOptions} />
				</Form.Item>

				{privacyValue === 'includes' && (
					<Form.Item
						name={['privacy', 'includes']}
						label="Bao gồm"
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (getFieldValue('value') === 'includes' && value?.length === 0) {
										return Promise.reject(new Error('Vui lòng chọn người dùng'));
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<SelectApi
							mode="multiple"
							fetcher={friendFetcher}
							toOption={(u) => ({ label: u.fullname, value: u._id })}
						/>
					</Form.Item>
				)}

				{privacyValue === 'excludes' && (
					<Form.Item
						name={['privacy', 'excludes']}
						label="Trừ ra"
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (getFieldValue('value') === 'excludes' && value?.length === 0) {
										return Promise.reject(new Error('Vui lòng chọn người dùng'));
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<SelectApi
							mode="multiple"
							fetcher={friendFetcher}
							toOption={(u) => ({ label: u.fullname, value: u._id })}
						/>
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
}
