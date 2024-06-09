import { Button, Card, Form, Input, theme, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CountdownButton } from '@/common/components/Button';
import { toast } from 'react-hot-toast';
import { sendOtpRegisterApi } from '@/views/auth/api';

export function PasswordForm({ data }) {
	const { token } = theme.useToken();
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(data);
	}, [data]);

	const [sending, setSending] = useState(false);
	const sendOTP = async () => {
		setSending(true);
		const toastId = toast.loading('Đang gửi mã xác nhận...');

		try {
			await sendOtpRegisterApi(data );
			toast.success('Gửi mã xác nhận thành công!', { id: toastId });
			setSending(false);
		} catch (error) {
			const errorText = error.message || error.toString();
			toast.error(`Gửi mã xác nhận thất bại! Lỗi: ${errorText}`, { id: toastId });
			form.setFields([{ name: 'otp', errors: [errorText] }]);
			setSending(false);
			throw error;
		}
	};

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: '#03045E', marginTop: 20, textAlign: 'center', fontWeight: '1000' }}>
					Đăng ký tài khoản
				</Typography.Title>
			}
			bodyStyle={{paddingBottom: 0}}
			style={{ width: 440, margin: '30px 0px', borderBottom: 0, boxShadow: 'rgba(0, 119, 182, 0.1) 0px 10px 50px', borderRadius: 15, alignSelf: 'center' }}
		>
			<Form layout="vertical" form={form} name="password" style={{margin: '30px 20px 0px 20px', paddingBottom: '0px'}}>
				<Form.Item
					label="Mã xác nhận"
					name="otp"
					rules={[
						{ required: true, message: 'Vui lòng nhập mã xác nhận!' },
						{
							len: 6,
							message: 'Mã xác nhận phải có 6 số!',
						},
					]}
					style={{fontWeight: '600', color: '#023E8A'}}
				>
					<Input
						suffix={
							<CountdownButton
								type="primary"
								size="small"
								milliseconds={5 * 60 * 1000} 
								afterChildren="Gửi lại"
								onClick={sendOTP}
								loading={sending}
								state="start"
							>
								Gửi mã
							</CountdownButton>
						}
						style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}}
					/>
				</Form.Item>

				<Form.Item
					label="Mật khẩu"
					name="password"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập mật khẩu!',
						},
						{
							min: 6,
							message: 'Mật khẩu phải có ít nhất 6 ký tự!',
						},
					]}
					style={{fontWeight: '600', color: '#023E8A'}}
				>
					<Input.Password style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}}/>
				</Form.Item>

				<Form.Item
					label="Nhập lại mật khẩu"
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập lại mật khẩu!',
						},
						{
							validator: (_, value) => {
								if (value === form.getFieldValue('password')) {
									return Promise.resolve();
								}

								return Promise.reject(new Error('Mật khẩu không khớp!'));
							},
						},
					]}
					style={{fontWeight: '600', color: '#023E8A'}}
				>
					<Input.Password style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}}/>
				</Form.Item>

				<Form.Item style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
					<Button 
						type="primary" 
						htmlType="submit"
						style={{
							display: 'flex', 
							height: 40, 
							width: 300, 
							borderRadius: 30, 
							backgroundImage: 'linear-gradient(to right, #023E8A, #48CAE4)',
							fontWeight: '600',
							fontSize: '16px',
							boxShadow: 'rgba(3, 4, 94, 0.25) 0px 4px 4px'
						}}>
						Đăng ký
					</Button>
				</Form.Item>

				<Form.Item style={{ float: 'left', marginTop: 20 }}>
					Đã có tài khoản?
				</Form.Item>
				<Form.Item style={{ float: 'right', marginTop: 20 }}>
					<Link href="/auth/login">
						<Button type="link">Đăng nhập ngay!</Button>
					</Link>
				</Form.Item>
			</Form>
		</Card>
	);
}
