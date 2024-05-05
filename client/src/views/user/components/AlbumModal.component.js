import { Badge, Button, Card, Form, Image, Input, List, Modal, Select, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { randomUtil } from '@/common/utils';
import { HiPlus, HiTrash } from 'react-icons/hi2';
import { privacyOptions } from '@/assets/data';
import { SelectApi } from '@/common/components/Input';
import { useFetcher } from '@/common/hooks';
import { UserAvatar } from '@/views/user/components';

export function AlbumModal({ open, onClose, album, onSubmit }) {
	const [form] = Form.useForm();
	const privacyValue = Form.useWatch(['privacy', 'value'], form);

	useEffect(() => {
		if (album) form.setFieldsValue({ ...album, media: [] });
		else form.resetFields();
	}, [album]);

	const [submitting, setSubmitting] = useState(false);
	const handleSubmit = async (data) => {
		setSubmitting(true);
		await onSubmit(data);
		setSubmitting(false);
		form.resetFields();
	};

	const friendFetcher = useFetcher({ api: `/users/searchUser/friends` });

	return (
		<Modal
			title={album ? 'Chỉnh sửa album' : 'Tạo mới album'}
			open={open}
			onCancel={onClose}
			width={600}
			onOk={form.submit}
			confirmLoading={submitting}
		>
			<Form form={form} layout="vertical" onFinish={handleSubmit}>
				<Form.Item
					name="name"
					label="Tên album"
					rules={[{ required: true, message: 'Vui lòng nhập tên album' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item name={['privacy', 'value']} label="Quyền riêng tư" initialValue={privacyOptions[0].value}>
					<Select showSearch={false}>
						{privacyOptions.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								<Space>
									<item.RIcon />

									{item.label}
								</Space>
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{privacyValue === 'includes' && (
					<Form.Item
						name={['privacy', 'includes']}
						label="Danh sách những người được xem"
						rules={[{ required: true, message: 'Vui lòng chọn người được xem' }]}
					>
						<SelectApi
							fetcher={friendFetcher}
							mode="multiple"
							toOption={(item) => ({ value: item._id, label: item.fullname })}
							renderOption={(item) => (
								<Space>
									<UserAvatar user={item} avtSize={20} />

									<Typography.Text>{item.fullname}</Typography.Text>
								</Space>
							)}
						/>
					</Form.Item>
				)}

				{privacyValue === 'excludes' && (
					<Form.Item
						name={['privacy', 'excludes']}
						label="Danh sách những người không được xem"
						rules={[{ required: true, message: 'Vui lòng chọn người không được xem' }]}
					>
						<SelectApi
							fetcher={friendFetcher}
							mode="multiple"
							toOption={(item) => ({ value: item._id, label: item.fullname })}
							renderOption={(item) => (
								<Space>
									<UserAvatar user={item} avtSize={20} />

									<Typography.Text>{item.fullname}</Typography.Text>
								</Space>
							)}
						/>
					</Form.Item>
				)}

				{!album && (
					<Form.Item name="media" noStyle>
						<ListMedia />
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
}

const ListMedia = ({ value = [], onChange }) => {
	const mediaInputRef = useRef(null);

	const handleAddMedia = (files) => {
		if (!files) return;

		const medias = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const media = {
				_id: randomUtil.string(10),
				link: URL.createObjectURL(file),
				file,
			};
			medias.push(media);
		}
		onChange?.([...value, ...medias].slice(0, 10)); 
	};
	const handleDeleteMedia = (id) => onChange?.(value.filter((item) => item._id !== id));

	return (
		<Image.PreviewGroup>
			<Form.Item hidden>
				<input
					ref={mediaInputRef}
					type="file"
					hidden
					onChange={(e) => handleAddMedia(e.target.files)}
					multiple
					accept="image/*, video/*"
				/>
			</Form.Item>

			<List
				header={
					<Space style={{ width: '100%', justifyContent: 'space-between' }}>
						<span>Danh sách ảnh</span>

						<Button size="small" onClick={() => mediaInputRef.current?.click()} icon={<HiPlus />}>
							Thêm (tối đa 10 ảnh)
						</Button>
					</Space>
				}
				dataSource={value}
				grid={{ gutter: 16, column: 3 }}
				renderItem={(item, index) => (
					<List.Item>
						<Card
							cover={
								<Badge
									count={
										<Button
											size="small"
											shape="circle"
											danger
											icon={<HiTrash />}
											onClick={() => handleDeleteMedia(item._id)}
										/>
									}
									offset={[0, 0]}
								>
									<Image
										src={item.link}
										alt={item.description}
										style={{ aspectRatio: '1', objectFit: 'cover' }}
									/>
								</Badge>
							}
							bodyStyle={{ padding: 0 }}
						>
							<Input.TextArea
								placeholder="Nhập mô tả"
								autoSize={{ minRows: 2, maxRows: 4 }}
								value={item.description}
								onChange={(e) => {
									const { value: desc } = e.target;
									const newList = [...value];
									newList[index].description = desc;
									onChange?.(newList);
								}}
								bordered={false}
							/>
						</Card>
					</List.Item>
				)}
			/>
		</Image.PreviewGroup>
	);
};
