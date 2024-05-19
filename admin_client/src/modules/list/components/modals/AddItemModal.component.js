import { Form, Input, Modal, Space, Tag } from 'antd';
import { useRef, useState } from 'react';

function AddItemModal({ open, onClose, onAdd }) {
	const [items, setItems] = useState([]);
	const itemSet = new Set(items);

	const handleAdd = (item) => {
		itemSet.add(item.trim().toLowerCase());
		setItems([...itemSet]);
	};

	const handleRemove = (item) => {
		itemSet.delete(item);
		setItems([...itemSet]);
	};

	const inputRef = useRef(null);
	const [form] = Form.useForm();
	const onFormFinish = (values) => {
		handleAdd(values.value);
		form.resetFields();

		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const [submitting, setSubmitting] = useState(false);
	const handleOk = async () => {
		setSubmitting(true);
		await onAdd(items);
		setSubmitting(false);

		setItems([]);
		onClose();
	};

	return (
		<Modal
			title="Thêm giá trị"
			open={open}
			onCancel={onClose}
			onOk={handleOk}
			okButtonProps={{ loading: submitting, disabled: items.length === 0 }}
		>
			<Form form={form} onFinish={onFormFinish}>
				<Form.Item
					name="value"
					rules={[
						{
							validator: (_rule, _value) => {
								const value = _value.trim().toLowerCase();
								if (itemSet.has(value)) return Promise.reject('Giá trị đã tồn tại');

								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder="Nhập giá trị" ref={inputRef} />
				</Form.Item>
			</Form>

			<Space size={8} wrap>
				{items.map((item) => (
					<Tag key={item} closable onClose={() => handleRemove(item)}>
						{item}
					</Tag>
				))}
			</Space>
		</Modal>
	);
}

export default AddItemModal;
