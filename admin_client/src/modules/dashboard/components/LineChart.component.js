import { Line } from '@ant-design/plots';
import { Card, DatePicker, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/common/api';

export default function LineChart() {
	const [type, setType] = useState('date');

	const lastWeek = dayjs().subtract(1, 'week').toDate();
	const today = dayjs().toDate();
	const [range, setRange] = useState([lastWeek, today]);
	const start = dayjs(range[0]).format('YYYY-MM-DD');
	const end = dayjs(range[1]).format('YYYY-MM-DD');

	const { data } = useSWR(`/admin/usersAccess?start=${start}&end=${end}&type=${type}`, swrFetcher);

	const convertData = (data) => {
		const result = [];
		if (!data) return result;

		for (const key in data) {
			result.push({
				time: key,
				name: 'Lượt truy cập',
				total: data[key].totalAccess,
			});

			result.push({
				time: key,
				name: 'Người dùng mới',
				total: data[key].totalUserCreations,
			});
		}
		return result;
	};

	const config = {
		data: convertData(data),
		padding: 'auto',
		yField: 'total',
		xField: 'time',
		xAxis: {
			label: {
				formatter: (v) => dayjs(v).format('DD/MM/YYYY'),
			},
		},
		seriesField: 'name',
		legend: {
			position: 'top',
		},
		smooth: true,
		animation: {
			appear: {
				animation: 'path-in',
				duration: 5000,
			},
		},
	};

	return (
		<Card
			title="Lượt truy cập và người dùng mới"
			extra={
				<Space>
					<Typography.Title level={5} style={{ margin: 0 }}>
						Lọc:
					</Typography.Title>

					<Select value={type} onChange={setType}>
						<Select.Option value="date">Ngày</Select.Option>
						<Select.Option value="week">Tuần</Select.Option>
						<Select.Option value="month">Tháng</Select.Option>
						<Select.Option value="quarter">Quý</Select.Option>
						<Select.Option value="year">Năm</Select.Option>
					</Select>

					<DatePicker
						picker={type}
						onChange={(date) => {
							setRange([date?.toDate() ?? lastWeek, range[1]]);
						}}
					/>

					<DatePicker
						picker={type}
						onChange={(date) => {
							setRange([range[0], date?.toDate() ?? today]);
						}}
					/>
				</Space>
			}
		>
			<Line {...config} />
		</Card>
	);
}
