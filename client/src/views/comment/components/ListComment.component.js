import { useFetcher } from '@/common/hooks';
import { Button, Form, Input, List, Space } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createCommentApi, deleteCommentApi, reactToCommentApi, replyToCommentApi } from '../api';
import { CommentItem } from './CommentItem.component';
import { useAuth } from '@/views/auth/hooks';

export function ListComment({ post, comment }) {
	const isReply = !!comment;

	const api = isReply ? `posts/${post._id}/comments/${comment?._id}/replies` : `posts/${post._id}/comments`;
	const fetcher = useFetcher({ api });

	const handleDelete = async (commentId) => {
		try {
			await deleteCommentApi(post._id, commentId);
			fetcher.removeData(commentId);
		} catch (error) {
			toast.error(error.toString());
		}
	};

	const { authUser } = useAuth();

	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	const inputRef = React.useRef(null);
	const onSubmit = async (data) => {
		setSubmitting(true);
		try {
			const created = isReply
				? await replyToCommentApi(post._id, comment._id, data)
				: await createCommentApi(post._id, data);
			form.resetFields();
			fetcher.addData(created);

			toast.success('Bình luận thành công!');

			setTimeout(() => {
				const el = document.getElementById(created._id);
				el?.scrollIntoView({ behavior: 'smooth' });

				inputRef.current?.focus();
			}, 0); 
		} catch (error) {
			toast.error(error.toString());
		}
		setSubmitting(false);
	};

	const handleReact = async (commentId, react) => {
		const reacted = await reactToCommentApi(post._id, commentId, react);
		fetcher.updateData(commentId, reacted);
	};

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<List
				bordered={isReply}
				style={{
					padding: isReply ? '0 16px' : undefined,
					borderTopLeftRadius: isReply ? 0 : undefined,
					borderTopRightRadius: isReply ? 0 : undefined,
					borderTop: isReply ? 'none' : undefined,
				}}
				itemLayout="vertical"
				loading={fetcher.fetching}
				dataSource={fetcher.data}
				renderItem={(comment) => (
					<CommentItem
						key={comment._id}
						comment={comment}
						post={post}
						onReact={handleReact}
						onDelete={handleDelete}
						isReply={isReply}
					/>
				)}
				loadMore={
					!fetcher.fetching &&
					fetcher.data.length > 0 && (
						<div style={{ textAlign: 'center', marginTop: 5 }}>
							<Button
								onClick={fetcher.loadMore}
								loading={fetcher.loadingMore}
								disabled={!fetcher.hasMore}
							>
								{fetcher.hasMore ? 'Xem thêm' : 'Hết rồi'}
							</Button>
						</div>
					)
				}
			/>

			<Form form={form} onFinish={onSubmit} layout="inline">
				<Form.Item
					style={{ flex: 1 }}
					name="content"
					rules={[{ required: true, message: 'Nội dung không được để trống' }]}
				>
					<Input.TextArea
						placeholder="Viết bình luận"
						autoSize={{ minRows: 1	, maxRows: 4 }}
						onPressEnter={(e) => {
							e.preventDefault();
							form.submit();
						}}
						disabled={!authUser || submitting}
						ref={inputRef}
					/>
				</Form.Item>

				<Button type="primary" htmlType="submit" loading={submitting} disabled={!authUser}>
					{isReply ? 'Trả lời' : 'Bình luận'}
				</Button>
			</Form>
		</Space>
	);
}
