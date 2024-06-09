import { GithubIcon, GoogleIcon } from '@/assets/icons';
import { SERVER_URL } from '@/common/config';
import { Avatar, Button, Card, Divider, Form, Input, theme, Typography } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';
import { useRouter } from 'next/router';

export function LoginForm() {
	const router = useRouter();
	const { query } = router;
	const { token } = theme.useToken();
	const { login } = useAuth();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values) => {
		setLoading(true);

		const toastId = toast.loading('Đang đăng nhập...');
		try {
			await login(values);

			await router.replace((query?.redirect) || '/home');

			toast.success('Đăng nhập thành công!', { id: toastId });
		} catch (error) {
			toast.error(`Đăng nhập thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};

	return (
		<Card
			title={
				<Typography.Title level={1} style={{ color: '#03045E', marginTop: 15, textAlign: 'center', fontWeight: '1000' }}>
					Đăng nhập
				</Typography.Title>
			}
			bodyStyle={{paddingBottom: 0}}
			style={{ width: 430, margin: 'auto', borderBottom: 0, boxShadow: 'rgba(0, 119, 182, 0.1) 0px 10px 50px', borderRadius: 15 }}
		>
			<Form layout="vertical" form={form} onFinish={onFinish} style={{margin: '30px 20px 0px 20px', paddingBottom: '0px'}}>
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
					<Input style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}} />
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
					<Input.Password style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.5) 0px 2px 10px 0px'}} />
				</Form.Item>

				<Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Link href="/auth/forgot-password" style={{ padding: 0 }}>
						<Button type='link' style={{ padding: 0 }} >
							Quên mật khẩu?
						</Button>
					</Link>
				</Form.Item>
				<Form.Item style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
					<Button 
						type="primary" 
						htmlType="submit" 
						loading={loading} 
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
						Đăng nhập
					</Button>
				</Form.Item>

				<Divider style={{width: 300}}>Hoặc</Divider>

				<Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
					<Link href={`${SERVER_URL}/auth/google`} target="_self" >
						<Button icon={<Avatar src={GoogleIcon.src} />} block style={{
							height: 40, 
							width: 300, 
							borderRadius: 30, 
							fontWeight: '600',
							fontSize: '16px',
							boxShadow: 'rgba(3, 4, 94, 0.25) 0px 4px 4px'
						}}>
							Đăng nhập bằng Google
						</Button>
					</Link>
				</Form.Item>

				{/* <Form.Item>
					<Link href={`${SERVER_URL}/auth/github`} target="_self">
						<Button icon={<Avatar src={GithubIcon.src} />} block>
							Đăng nhập bằng Github
						</Button>
					</Link>
				</Form.Item> */}

				<Form.Item style={{ float: 'left', marginTop: 20 }}>
					Chưa có tài khoản?
				</Form.Item>
				<Form.Item style={{ float: 'right', marginTop: 20 }}>
					<Link href="/auth/register">
						<Button type="link">Đăng ký ngay!</Button>
					</Link>
				</Form.Item>
			</Form>
		</Card>
	);
}
