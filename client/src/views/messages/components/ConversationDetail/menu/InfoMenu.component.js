import { useConversationContext } from '@/views/messages/hooks';
import { App, Button, Input, Space } from 'antd';
import { useRef } from 'react';
import { HiMagnifyingGlass, HiPencil } from 'react-icons/hi2';

export function InfoMenu() {
	const { conversation, updateConversationForm } = useConversationContext();
	const { modal } = App.useApp();

	const inputNameRef = useRef(null);
	const handleChangeName = async () =>
		modal.info({
			title: 'Đổi tên cuộc trò chuyện',
			content: <Input placeholder="Tên cuộc trò chuyện" defaultValue={conversation.name} ref={inputNameRef} />,
			okText: 'Lưu',
			cancelText: 'Hủy',
			onOk: () => updateConversationForm({ name: inputNameRef.current.input?.value }),
			okCancel: true,
			closable: true,
			maskClosable: true,
		});

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<Button block icon={<HiPencil />} onClick={handleChangeName}>
				Đổi tên
			</Button>

			<Button block icon={<HiMagnifyingGlass />}>
				Tìm kiếm
			</Button>
		</Space>
	);
}
