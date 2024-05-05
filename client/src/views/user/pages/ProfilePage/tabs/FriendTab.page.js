import { ListFriend } from '@/views/friend/components';
import React from 'react';
import { useUserContext } from '@/views/user/hooks';

export function FriendTab() {
	const { user, isCurrentUser } = useUserContext();

	return (
		<ListFriend
			api={`/users/${user._id}/friends`}
			title={isCurrentUser ? 'Bạn bè' : 'Bạn bè của ' + user.fullname}
		/>
	);
}
