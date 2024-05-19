import useSWR from 'swr';
import { Card, Form, Input, Button, message, Typography, Avatar, Alert } from 'antd';
import { FullscreenSpin } from '@/common/components/Loading';
import React, { useState } from 'react';
import ProfileTab from '@/modules/user/pages/UserDetail/tabs/ProfileTab.page';
import HistoryTab from '@/modules/user/pages/UserDetail/tabs/HistoryTab.page';
import dayjs from 'dayjs';
import { lockUserApi, unlockUserApi } from '@/modules/user/api';
import { useRouter } from 'next/router';

export default function UserDetail() {
    const router = useRouter();
    const userId = router.query.id;
    const { data: user, isLoading, error, mutate } = useSWR(`users/${userId}`, swrFetcher);
    const [activeTab, setActiveTab] = useState('profile');
    const [locking, setLocking] = useState(false);
    const [lockReason, setLockReason] = useState('');

    const { modal } = App.useApp();

    const handleLock = async () => {
        message.loading({ content: 'Đang khóa tài khoản...', key: 'lock' });
        setLocking(true);

        try {
            const locked = await lockUserApi(user._id, lockReason);
            await mutate(locked, false);
            message.success({ content: 'Khóa tài khoản thành công', key: 'lock' });
        } catch (error) {
            message.error({ content: `Khóa tài khoản thất bại! Lỗi: ${error}`, key: 'lock' });
        }

        setLocking(false);
    };

    const handleUnlock = async () => {
        message.loading({ content: 'Đang mở khóa tài khoản...', key: 'unlock' });
        setLocking(true);

        try {
            const unlocked = await unlockUserApi(user._id);
            await mutate(unlocked, false);
            message.success({ content: 'Mở khóa tài khoản thành công', key: 'unlock' });
        } catch (error) {
            message.error({ content: `Mở khóa tài khoản thất bại! Lỗi: ${error}`, key: 'unlock' });
        }

        setLocking(false);
    };

    const showLockModal = () => {
        modal.confirm({
            title: 'Nhập lý do khóa tài khoản',
            content: (
                <Form name="lock-reason" onFinish={({ reason }) => setLockReason(reason)}>
                    <Form.Item
                        name="reason"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do khóa tài khoản' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            ),
            okText: 'Khóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: handleLock,
        });
    };

    const tabList = [
        {
            key: 'profile',
            tab: 'Thông tin',
            content: <ProfileTab user={user} />,
        },
        {
            key: 'history',
            tab: 'Lịch sử hoạt động',
            content: <HistoryTab user={user} />,
        },
    ];

    if (isLoading) return <FullscreenSpin />;
    if (error) return <div>{error}</div>;
    if (!user) return <Navigate to="/404" />;

    const isLocked = !!user.isPermanentlyLocked || dayjs().isBefore(user.lockTime);

    return (
        <Card
            title={
                <Card.Meta
                    avatar={<Avatar src={user.profilePicture.link} alt={user.fullname} />}
                    title={user.fullname}
                    description={<Typography.Text copyable>{user.email}</Typography.Text>}
                />
            }
            extra={
                isLocked ? (
                    <Button icon={<IoLockOpenOutline />} onClick={handleUnlock} loading={locking}>
                        Mở khóa
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        danger
                        icon={<IoLockClosedOutline />}
                        loading={locking}
                        onClick={showLockModal}
                    >
                        Khóa
                    </Button>
                )
            }
            loading={isLoading}
            tabList={tabList}
            activeTabKey={activeTab}
            onTabChange={(key) => setActiveTab(key)}
        >
            {isLocked && user.reasonLock && (
                <Alert
                    message={`Tài khoản đã bị khóa. Lý do: ${user.reasonLock}`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {tabList.map((tabItem) => (
                <div key={tabItem.key} style={{ display: activeTab === tabItem.key ? 'block' : 'none' }}>
                    {tabItem.content}
                </div>
            ))}
        </Card>
    );
}
