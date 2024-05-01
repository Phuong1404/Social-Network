import Layout, { withLayout } from '@/layout/components';
import { Button, Form, Steps } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SEO from '@/common/components/SEO';
import { IRegisterData } from '@/modules/auth/types';
import { toast } from 'react-hot-toast';
import { registerApi, sendOtpRegisterApi } from '@/modules/auth/api';
import { useAuth } from '@/modules/auth/hooks';
import { AccountForm, InfoForm, PasswordForm } from '@/modules/auth/components';

const ACCOUNT_STEP = 0;
const PASSWORD_STEP = 1;
const INFO_STEP = 2;

function RegisterPage() {
	const router = useRouter();
	const { from } = router.query;


	const { authUser, updateAuthUser, login } = useAuth();
	const [data, setData] = useState<Partial<IRegisterData>>({});
	const [step, setStep] = useState(ACCOUNT_STEP);

	useEffect(() => {
		if (authUser && step === ACCOUNT_STEP) {
			router.replace((from) || '/home');
		}
	}, []);
	const nextStep = async () => {
		if (step === INFO_STEP) {
			await login();
			return router.replace('/home');
		}

		setStep((step) => step + 1);
	};
	const prevStep = () => setStep((step) => step - 1);

	const canSkip = step === INFO_STEP;
	const canBack = step === PASSWORD_STEP;

	const steps = [
		{
			title: 'Tài khoản',
			content: <AccountForm data={data} />,
		},
		{
			title: 'Mật khẩu',
			content: <PasswordForm data={data} />,
		},
		{
			title: 'Thông tin cá nhân',
			content: <InfoForm />,
		},
	];

	const sendOTP = async (values) => {
		const toastId = toast.loading('Đang gửi mã xác nhận...');

		try {
			await sendOtpRegisterApi(values);
			toast.success('Gửi mã xác nhận thành công!', { id: toastId });
		} catch (error) {
			toast.error(`Gửi mã xác nhận thất bại! Lỗi: ${error.message || error.toString()}`, { id: toastId });
			throw error;
		}
	};

	return (
		<>
			<SEO title="TaNa - Đăng ký" robot />

			<Layout.Content style={{ margin: 'auto', flex: 1, height: '100%' }}>
				<Form.Provider
					onFormFinish={async (name, { forms, values }) => {
						if (name === 'account') {
							const accountForm = forms['account'];
							try {
								await sendOTP(values);
								setData(values);

								await nextStep();
							} catch (error) {
								const errorText = error.message || error.toString();
								accountForm.setFields([
									{
										name: 'email',
										errors: [errorText],
									},
								]);
							}
						} else if (name === 'password') {
							const passwordForm = forms['password'];
							try {
								const { accessToken, refreshToken } = await registerApi({
									...data,
									...values,
								});

								localStorage.setItem('accessToken', accessToken);
								localStorage.setItem('refreshToken', refreshToken);

								await nextStep();
							} catch (error) {
								const errorText = error.message || error.toString();
								passwordForm.setFields([
									{
										name: 'otp',
										errors: [errorText],
									},
								]);
							}
						} else if (name === 'info') {
							const toastId = toast.loading('Đang cập nhật thông tin...');
							try {
								await updateAuthUser(values);
								toast.success('Cập nhật thông tin thành công!', { id: toastId });

								await router.replace('/home');
							} catch (error) {
								toast.error(`Cập nhật thông tin thất bại! Lỗi: ${error}`, { id: toastId });
							}
						}
					}}
				>
					<Space direction="vertical" style={{ width: '100%', height: '100%' }}>
						<Steps current={step} size="small" items={steps} />

						<div
							style={{
								flex: 1,
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
							{steps[step].content}
						</div>

						<Space style={{ justifyContent: 'flex-end' }}>
							{canBack && <Button onClick={prevStep}>Quay lại</Button>}

							{canSkip && <Button onClick={nextStep}>Bỏ qua</Button>}
						</Space>
					</Space>
				</Form.Provider>
			</Layout.Content>
		</>
	);
}

export default withLayout(RegisterPage);
