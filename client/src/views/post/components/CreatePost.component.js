import { useAuth } from '@/views/auth/hooks';
import { Button, Card, Input, theme } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiMapPin, HiPhoto, HiPlayCircle } from 'react-icons/hi2';
import { createPostApi } from '@/views/post/api';
import dynamic from 'next/dynamic';

const PostModal = dynamic(() => import('./PostModal.component').then((mod) => mod.PostModal));
const UserAvatar = dynamic(() => import('@/views/user/components').then((mod) => mod.UserAvatar));


export function CreatePost({ fetcher, ...cardProps }) {
	const { authUser } = useAuth();
	const { token } = theme.useToken();

	const handleAddPost = async (data) => {
		const toastId = toast.loading('Đang thêm bài viết...');
		try {
			const created = await createPostApi(data);
			fetcher.addData(created);
			toast.success('Thêm bài viết thành công', { id: toastId });
		} catch (error) {
			toast.error(error.toString(), { id: toastId });
		}
	};

	const [openModal, setOpenModal] = useState(false);

	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	return (
		<>
			<PostModal open={openModal} onClose={handleCloseModal} onCreate={handleAddPost} />

			<Card
				{...cardProps}
				bodyStyle={{
					padding: 16,
					...cardProps?.headStyle,
				}}
				actions={[
					<Button key="photo" type="text" icon={<HiPhoto color={token.colorSuccess} />}>
						Ảnh
					</Button>,

					<Button key="video" type="text" icon={<HiPlayCircle color={token.colorPrimary} />}>
						Video
					</Button>,

					<Button key="location" type="text" icon={<HiMapPin color={token.colorWarning} />}>
						Vị trí
					</Button>,

					...(cardProps?.actions ?? []),
				]}
				onClick={handleOpenModal}
			>
				<Card.Meta
					avatar={<UserAvatar user={authUser} />}
					title={
						<Input.TextArea placeholder="Bạn đang nghĩ gì?" bordered={false} rows={2} readOnly autoSize />
					}
				/>
			</Card>
		</>
	);
}
