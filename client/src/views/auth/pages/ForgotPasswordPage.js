import { withLayout } from '@/layout/components';
import { Button, Card, Col, Divider, Form, Input, Row, theme, Typography } from 'antd';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { forgotPasswordApi } from '../api';
import SEO from '@/common/components/SEO';
import { forgotPwdJson } from '@/assets/data/json';

import { useLottie } from "lottie-react";

const ForgotPasswordPage = () => {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const options = {
		animationData: forgotPwdJson,
		loop: true,
		autoplay:true,
		style:{width: '100%', height: '100%'}
	  };
	
	  const { View } = useLottie(options);

	const onFinish = async (values) => {
		setLoading(true);

		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			await forgotPasswordApi(values.email);

			toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: toastId });
		} catch (error) {
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};
	return (
		<>
			<SEO title="Quên mật khẩu" robot />
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
							Quên mật khẩu
						</Typography.Title>
					}
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
							style={{fontWeight: '600', color: '#023E8A', marginBottom: 30}}
						>
							<Input  style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}}/>
						</Form.Item>

						<Form.Item style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
							<Button type="primary" block loading={loading} htmlType="submit" 
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
								Gửi yêu cầu
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

export default withLayout(ForgotPasswordPage);
