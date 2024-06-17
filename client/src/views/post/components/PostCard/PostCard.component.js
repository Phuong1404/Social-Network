import { PrivacyDropdown } from '@/common/components/Button';
import { UserAvatar } from '@/views/user/components';
import { ReactPopover,SharePopover } from '@/common/components/Popover';
import { useAuth } from '@/views/auth/hooks';
import { App, Avatar, Button, Card, Dropdown, MenuProps, Skeleton, Space, Typography } from 'antd';
import Link from 'next/link';
import { HiArchive, HiBell, HiDotsHorizontal, HiEyeOff, HiLink } from 'react-icons/hi';
import { HiExclamationTriangle,HiOutlineArrowTopRightOnSquare,HiOutlineChatBubbleLeft,HiOutlineHandThumbUp,HiOutlineShare,HiPencil,HiTrash } from 'react-icons/hi2';
import styles from './PostCard.module.scss';
import { PostContent } from './PostContent.component';
import { PostMedia } from './PostMedia.component';
import { deletePostApi, reactToPostApi, updatePostApi } from '@/views/post/api';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { dateUtil, randomUtil, urlUtil } from '@/common/utils';
import { useReport } from '@/views/report/hooks';
import { PostModal } from '../PostModal.component';
const { Meta } = Card;


export function PostCard({ post: initPost, onUpdate, onDelete, onCommentClick, openNewTab }) {
	const { modal } = App.useApp();
	const [post, setPost] = useState(initPost);

	const [openModal, setOpenModal] = useState(false);

	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const link = urlUtil.getFullUrl(`/post/${post?._id}`);

	useEffect(() => {
		setPost(initPost);
	}, [initPost]);

	const loading = !post;
	const { authUser } = useAuth();

	const { openReport } = useReport({ type: 'post', id: post?._id });
	const menuProps = {
		items: [
			{
				key: 'archive',
				icon: <HiArchive />,
				label: 'Lưu bài viết',
				disabled: true,
			},
			{
				key: 'subscribe',
				icon: <HiBell />,
				label: 'Theo dõi bài viết',
				disabled: true,
			},
			{
				key: 'hide',
				icon: <HiEyeOff />,
				label: 'Ẩn bài viết',
				disabled: true,
			},
			{
				key: 'copy',
				icon: <HiLink />,
				label: 'Sao chép liên kết',
				onClick: async () => {
					await navigator.clipboard.writeText(link);
					toast.success('Đã sao chép liên kết');
				},
			},
			{
				key: 'report',
				icon: <HiExclamationTriangle />,
				label: 'Báo cáo bài viết',
				onClick: openReport,
			},
		],
	};

	if (loading)
		return (
			<Card>
				<Skeleton active avatar paragraph={{ rows: randomUtil.number(1, 4) }} />
			</Card>
		);

		const isAuthor = authUser?._id === post.author._id;
	const author = isAuthor ? authUser : post.author;

	// React to the post
	const handleReact = async (react) => {
		try {
			const reacted = await reactToPostApi(post._id, react);

			onUpdate?.(post._id, reacted);

			setPost(reacted);
		} catch (error) {
			toast.error(error.toString());
		}
	};

	// Change privacy of the post
	const handlePrivacyChange = async (privacy) => {
		try {
			const updated = await updatePostApi(post._id, { privacy });

			onUpdate?.(post._id, updated);

			setPost(updated);

			toast.success('Đã thay đổi quyền riêng tư của bài viết');
		} catch (error) {
			toast.error(error.toString());
		}
	};

	// Delete the post
	const handleDelete = async () => {
		try {
			await deletePostApi(post._id);

			onDelete?.(post._id);

			toast.success('Đã xóa bài viết');
		} catch (error) {
			toast.error(error.toString());
		}
	};

	const handleUpdate = async (id, data) => {
		try {
			await updatePostApi(post._id, data);
			handleCloseModal()
			toast.success('Đã cập nhật bài viết');
		} catch (error) {
			toast.error(error.toString());
		}
	};

	if (isAuthor)
		menuProps.items.push(
			{
				key: 'edit',
				icon: <HiPencil />,
				label: 'Chỉnh sửa bài viết',
				onClick: handleOpenModal
			},
			{
				key: 'delete',
				icon: <HiTrash />,
				label: 'Xóa bài viết',
				onClick: () =>
					modal.confirm({
						title: 'Xóa bài viết',
						content: 'Bạn có chắc muốn xóa bài viết này?',
						onOk: handleDelete,
					}),
			}
		);

	const statistics = [];

	if (post.numberReact > 0)
		statistics.push(
			<Typography.Text>
				<strong>{post.numberReact}</strong> lượt thích
			</Typography.Text>
		);
	if (post.numberComment > 0)
		statistics.push(
			<Typography.Text>
				<strong>{post.numberComment}</strong> bình luận
			</Typography.Text>
		);
	if (post.numberShare > 0)
		statistics.push(
			<Typography.Text>
				<strong>{post.numberShare}</strong> lượt chia sẻ
			</Typography.Text>
		);

	return (
		<Card
			style={{ width: '100%', boxShadow: 'rgba(0, 119, 182, 0.25) 0px 0px 5px' }}
			headStyle={{ padding: '0 16px' }}
			bodyStyle={{ padding: '8px 16px' }}
			bordered={false}
			extra={
				<Space>
					{openNewTab && (
						<Link href={`/post/${post._id}`} target="_blank" rel="noopener noreferrer" passHref>
							<Button type="text" icon={<HiOutlineArrowTopRightOnSquare size={20} color={'#023E8A'}/>} />
						</Link>
					)}

					{authUser && (
						<PrivacyDropdown value={post.privacy} disabled={!isAuthor} onChange={handlePrivacyChange} />
					)}

					<Dropdown menu={menuProps} arrow trigger={['click']}>
						<Button type="text" icon={<HiDotsHorizontal size={20} color={'#023E8A'}/>} />
					</Dropdown>
				</Space>
			}
			actions={[
				<ReactPopover
					key="reaction"
					reaction={post.reactOfUser}
					onReact={handleReact}
					trigger={authUser ? 'click' : []}
					renderChildren={({ reaction, loading }) => (
						<Button
							icon={reaction ? <Avatar src={reaction?.img}/> : <HiOutlineHandThumbUp size={20}/>}
							type="text"
							disabled={!authUser}
							loading={loading}
						>
							{reaction?.label || 'Thích'}
						</Button>
					)}
				/>,
				<Button
					key="comment"
					icon={<HiOutlineChatBubbleLeft size={20} />}
					type="text"
					onClick={onCommentClick}
					disabled={!authUser} 
				>
					Bình luận
				</Button>,
				<SharePopover link={link} key="share">
					<Button icon={<HiOutlineShare size={20}/>} type="text">
						Chia sẻ
					</Button>
				</SharePopover>,
			]}
			title={
				<Meta
					avatar={<UserAvatar user={author} avtSize={48} />}
					title={author.fullname}
					description={<span className="time-ago">{dateUtil.getTimeAgo(post.createdAt)}</span>}
					className={styles.meta}
				/>
			}
		>
			<PostContent post={post} />

			<PostMedia media={post.media} />

			{statistics.length > 0 && (
				<Space style={{ marginTop: 8 }}>{statistics.map((statistic) => statistic)}</Space>
			)}
			
			<PostModal open={openModal} onClose={handleCloseModal} onUpdate={handleUpdate} data={post}/>
		</Card>
	);
}
