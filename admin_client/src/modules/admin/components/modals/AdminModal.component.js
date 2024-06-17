import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

function AdminFormModal({ open, onClose, onSubmit }) {
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			form.resetFields();
		}
	}, [open]);

	const [submitting, setSubmitting] = useState(false);
	const onFormFinish = async (values) => {
		setSubmitting(true);
		await onSubmit(values);
		setSubmitting(false);
	};

	return (
		<Modal
			title='Tạo mới quản trị viên'
			open={open}
			onCancel={onClose}
			onOk={form.submit}
			okButtonProps={{ loading: submitting }}
		>
			<Form form={form} onFinish={onFormFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
				<Form.Item name="fullname" label="Tên người dùng">
					<Input placeholder="Nhập tên người dùng" />
				</Form.Item>

				<Form.Item name="email" label="Email">
					<Input placeholder="Nhập email" />
				</Form.Item>
				<Form.Item name="password" label="Mật khẩu">
					<Input placeholder="Nhập mật khẩu" />
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default AdminFormModal;
