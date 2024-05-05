import { UserAvatar } from '@/views/user/components';
import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { SelectApi } from '@/common/components/Input';
import { useFetcher } from '@/common/hooks';

export function CreateConversationModal({ open, onClose, onCreate }) {
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		form.resetFields();
	}, [open]);

	const onFinish = async (values) => {
		setSubmitting(true);

		const apiData = {
			name: values.name,
			members: values.members.map((mem) => ({ user: mem })),
		};

		await onCreate?.(apiData);

		setSubmitting(false);
		onClose();
	};

	const friendFetcher = useFetcher({ api: `/users/searchUser/friends` });

	return (
		<Modal
			title="Tạo cuộc trò chuyện"
			open={open}
			onCancel={onClose}
			footer={[
				<Button key="submit" type="primary" onClick={form.submit} loading={submitting}>
					Tạo
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="name" label="Tên cuộc trò chuyện">
					<Input />
				</Form.Item>

				<Form.Item
					name="members"
					label="Thành viên"
					rules={[
						{
							required: true,
							message: 'Vui lòng chọn thành viên',
						},
					]}
				>
					<SelectApi
						fetcher={friendFetcher}
						mode="multiple"
						toOption={(item) => ({ value: item._id, label: item.fullname })}
						renderOption={(item) => (
							<Space align="center">
								<UserAvatar user={item} avtSize={20} />

								<Typography.Text>{item.fullname}</Typography.Text>
							</Space>
						)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
