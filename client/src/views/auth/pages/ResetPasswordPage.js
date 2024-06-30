import { withLayout } from '@/layout/components';
import { Button, Card, Col, Divider, Form, Input, Row, theme, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { resetPasswordApi } from '../api';
import SEO from '@/common/components/SEO';
import { resetPwdJson } from '@/assets/data/json';
import { useLottie } from "lottie-react";

const ResetPasswordPage = () => {
	const router = useRouter();
	const { id, token: rsToken } = router.query;

	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const options = {
		animationData: resetPwdJson,
		loop: true,
		autoplay:true,
		style:{width: '100%', height: '100%'}
	  };
	
	const { View } = useLottie(options);


	const onFinish = async (values) => {
		setLoading(true);

		const toastId = toast.loading('Đang đặt lại mật khẩu...');
		try {
			await resetPasswordApi({ id, token: rsToken, password: values.password });

			toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.', { id: toastId });

			await router.push('/auth/login');
		} catch (error) {
			toast.error(`Đặt lại mật khẩu thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};
	return (
		<>
			<SEO title="Đặt lại mật khẩu" robot />

			<Row style={{ maxWidth: 1200, margin: 'auto', flex: 1, height: '100%' }} align="middle" justify="center">
				<Col span={12} style={{ height: 'fit-content' }}>
					{ View }
				</Col>

				<Card
					title={
						<Typography.Title
							level={2}
							style={{ color: '#03045E', marginTop: 20, textAlign: 'center', fontWeight: '1000' }}
						>
							Đặt lại mật khẩu
						</Typography.Title>
					}
					style={{ width: 430, margin: 'auto', borderBottom: 0, boxShadow: 'rgba(0, 119, 182, 0.1) 0px 10px 50px', borderRadius: 15 }}
				>
					<Form layout="vertical" form={form} onFinish={onFinish} style={{margin: '30px 20px 0px 20px', paddingBottom: '0px'}}>
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
							style={{fontWeight: '600', color: '#023E8A', marginBottom: 30}}
						>
							<Input.Password style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}}/>
						</Form.Item>

						<Form.Item style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
							<Button 
								type="primary" 
								block 
								loading={loading}
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
								Đặt lại mật khẩu
							</Button>
						</Form.Item>

						<Divider>Hoặc</Divider>

						<Link href={`/auth/login`} style={{ float: 'right' }}>
							<Button type="primary">Đăng nhập</Button>
						</Link>

						<Link href={`/auth/register`} style={{ float: 'left' }}>
							<Button>Đăng ký</Button>
						</Link>
					</Form>
				</Card>
			</Row>
		</>
	);
};

export default withLayout(ResetPasswordPage);
