import { Button, Card, Form, Select, theme, Typography } from 'antd';
import React from 'react';
const listHobbies = [
	'Thể thao',
	'Du lịch',
	'Âm nhạc',
	'Đọc sách',
	'Chụp ảnh',
	'Vẽ tranh',
	'Viết lách',
	'Chơi game',
	'Xem phim',
	'Nghe nhạc',
];

export function InfoForm() {
	const { token } = theme.useToken();
	const [form] = Form.useForm();

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: '#03045E', marginTop: 20, textAlign: 'center', fontWeight: '1000' }}>
					Thêm thông tin
				</Typography.Title>
			}
			style={{ width: 440, margin: '40px 0px', borderBottom: 0, boxShadow: 'rgba(0, 119, 182, 0.1) 0px 10px 50px', borderRadius: 15, alignSelf: 'center' }}
			bodyStyle={{paddingBottom: 0}}
		>
			<Form layout="vertical" form={form} name="info" style={{margin: '30px 20px 0px 20px', paddingBottom: '0px'}}>
				<Form.Item label="Sở thích" name="hobbies" 
					style={{fontWeight: '600', color: '#023E8A'}}>
					<Select mode="tags" options={listHobbies.map((item) => ({ label: item, value: item }))} 
						style={{ height: 40, borderRadius: 10, borderColor: '#00B4D8', boxShadow: 'rgba(72, 202, 228, 0.3) 0px 2px 10px 0px'}}
						/>
				</Form.Item>

				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Xác nhận
				</Button>
			</Form>
		</Card>
	);
}
