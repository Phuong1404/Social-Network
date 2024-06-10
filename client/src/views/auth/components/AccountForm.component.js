import { Button, Card, Form, Input, Radio, theme, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';

export function AccountForm({ data }) {
	const { token } = theme.useToken();
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(data);
	}, [data]);

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: '#03045E', marginTop: 20, textAlign: 'center', fontWeight: '1000' }}>
					Đăng ký tài khoản
				</Typography.Title>
			}
			style={{ width: 440, margin: '30px 0px', borderBottom: 0, boxShadow: 'rgba(0, 119, 182, 0.1) 0px 10px 50px', borderRadius: 15, alignSelf: 'center' }}
			bodyStyle={{paddingBottom: 0}}
		>
			<Form layout="vertical" form={form} name="account" style={{margin: '30px 20px 0px 20px', paddingBottom: '0px'}}>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập email!',
						},
						{
							type: 'email',
							message: 'Email không hợp lệ!',
						},
					]}
					style={{fontWeight: '600', color: '#023E8A'}}
				>
					<Input  style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}} />
				</Form.Item>

				<Form.Item
					label="Họ và tên"
					name="fullname"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập họ và tên!',
						},
					]}
					style={{fontWeight: '600', color: '#023E8A'}}
				>
					<Input style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.5) 0px 2px 10px 0px'}} />
				</Form.Item>

				<Form.Item
					label="Giới tính"
					name="gender"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập giới tính!',
						},
					]}
					style={{fontWeight: '600', color: '#023E8A'}}
				>
					<Radio.Group>
						<Radio value={{ value: 'male' }}>Nam</Radio>
						<Radio value={{ value: 'female' }}>Nữ</Radio>
						<Radio value={{ value: 'other' }}>Khác</Radio>
					</Radio.Group>
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
						Tiếp tục
					</Button>
				</Form.Item>

				<Form.Item style={{ float: 'left', marginTop: 20 }}>
					Chưa có tài khoản?
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
