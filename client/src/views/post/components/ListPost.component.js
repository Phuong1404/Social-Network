import { ListComment } from '@/views/comment/components';
import { Collapse } from '@mui/material';
import { Card, List } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostCard } from './PostCard';

export function ListPost({ containerId, fetcher }) {
	const loader = Array.from({ length: 10 }, (_, i) => <PostCard key={i} />);

	const handleUpdate = async (postId, data) => fetcher.updateData(postId, data);
	const handleDelete = async (postId) => fetcher.removeData(postId);

	return (
		<InfiniteScroll
			style={{
				overflow: 'visible',
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
			}}
			scrollableTarget={containerId}
			dataLength={fetcher.data.length}
			next={fetcher.loadMore}
			hasMore={fetcher.hasMore}
			loader={loader}
			endMessage={
				!fetcher.fetching && (
					<div className="empty-text">
						{fetcher.data.length ? 'Đã tải hết bài viết' : 'Chưa có bài viết nào'}
					</div>
				)
			}
		>
			<List
				loading={fetcher.fetching}
				dataSource={fetcher.data}
				split={false}
				renderItem={(post) => (
					<PostItem post={post} onDelete={handleDelete} onUpdate={handleUpdate} openNewTab />
				)}
			/>
		</InfiniteScroll>
	);
}

const PostItem = (props) => {
	const [showComment, setShowComment] = useState(false);
	const toggleComment = () => setShowComment(!showComment);

	return (
		<List.Item style={{padding: '0 0 12px 0'}}>
			<Card bodyStyle={{ padding: 0 }} style={{ width: '100%' }}>
				<PostCard {...props} onCommentClick={toggleComment} />

				<Collapse in={showComment} mountOnEnter>
					<div style={{ padding: '0 16px 16px' }}>
						<ListComment post={props.post} />
					</div>
				</Collapse>
			</Card>
		</List.Item>
	);
};
