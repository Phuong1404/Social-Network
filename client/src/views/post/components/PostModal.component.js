import { PrivacyDropdown } from '@/common/components/Button';
import { RichTextInput } from '@/common/components/Input';
import { Collapse } from '@mui/material';
import { Button, Card, Form, Modal, Space, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiMapPin, HiPhoto, HiPlayCircle } from 'react-icons/hi2';
import { PostMedia } from './PostCard';
import { randomUtil } from '@/common/utils';
import { uploadMultiFileApi } from '@/common/api';

export const PostModal = ({ data, open, onClose, onCreate, onUpdate }) => {
	const { token } = theme.useToken();
	const isEdit = !!data?._id;

	const mediaInputRef = useRef(null);
	const [listMedia, setListMedia] = useState([]);

	const handleAddMedia = (files) => {
		if (!files) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const media = {
				_id: randomUtil.string(10),
				link: URL.createObjectURL(file),
				file,
			};
			setListMedia((prev) => [...prev, media]);
		}
	};

	const handleDeleteMedia = (id) => setListMedia((prev) => prev.filter((item) => item._id !== id));
	const handleEditMedia = (id, media) => {
		const newMedia = listMedia.map((item) => (item._id === id ? { ...item, ...media } : item));
		setListMedia(newMedia);
	};

	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!data?._id) {
			resetData();
		} else {
			setListMedia(data.media || []);

			form.setFieldsValue(data);
		}
	}, [data]);

	const resetData = () => {
		form.resetFields();
		setListMedia([]);
	};

	const onSubmit = async (data) => {
		setSubmitting(true);

		const oldMedia = [],
			newFiles = [];
		listMedia.forEach((item) => {
			if (item.file) newFiles.push(item.file);
			else oldMedia.push(item);
		});

		data.media = oldMedia;

		if (newFiles.length) {
			const toastId = toast.loading('Đang tải lên ảnh, video...');
			try {
				const { files } = await uploadMultiFileApi(newFiles);

				data.media = [
					...data.media,
					...files.map((item) => ({
						_id: item._id,
						description: listMedia.find((i) => i.file?.name === item.originalname)?.description,
					})),
				];
				toast.success('Tải lên ảnh, video thành công', { id: toastId });
			} catch (error) {
				toast.error(error.message || error.toString(), { id: toastId });
				return;
			}
		}

		if (isEdit) {
			await onUpdate?.(data._id, data);
		}

		else {
			await onCreate?.(data);
		}

		resetData();
		onClose();
		setSubmitting(false);
	};

	return (
		<Modal
			open={open}
			onCancel={onClose}
			title={isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
			footer={[
				<Button key="submit" type="primary" onClick={form.submit} loading={submitting}>
					{isEdit ? 'Lưu' : 'Đăng'}
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<Form.Item name="content" rules={[{ required: true, message: 'Nội dung không được để trống' }]}>
					<RichTextInput
						placeholder="Bạn đang nghĩ gì?"
						extra={
							<Form.Item name="privacy" noStyle>
								<PrivacyDropdown
									key="privacy"
									value={form.getFieldValue('privacy')}
									onChange={(value) => form.setFieldValue('privacy', value)}
									render={(item) => <Button icon={<item.RIcon />} />}
								/>
							</Form.Item>
						}
					/>
				</Form.Item>
			</Form>

			<input
				ref={mediaInputRef}
				type="file"
				hidden
				onChange={(e) => handleAddMedia(e.target.files)}
				multiple
				accept="image/*, video/*"
			/>

			<Card
				headStyle={{ padding: 16 }}
				bodyStyle={{ padding: 0 }}
				title="Thêm ảnh, video, vị trí,..."
				extra={
					<Space>
						<Button
							type="text"
							shape="circle"
							icon={<HiPhoto color={token.colorSuccess} />}
							onClick={() => mediaInputRef.current?.click()}
							style={{ marginLeft: 'auto' }}
						/>

						<Button
							type="text"
							shape="circle"
							icon={<HiPlayCircle color={token.colorPrimary} />}
							onClick={() => mediaInputRef.current?.click()}
						/>

						<Button
							type="text"
							shape="circle"
							icon={<HiMapPin color={token.colorWarning} />}
							onClick={() => alert('Chức năng đang phát triển')}
						/>
					</Space>
				}
			>
				<Collapse in={!!listMedia.length}>
					<PostMedia
						media={listMedia}
						onDelete={handleDeleteMedia}
						onEdit={handleEditMedia}
						showAll
						style={{ padding: 16 }}
					/>
				</Collapse>
			</Card>
		</Modal>
	);
};
