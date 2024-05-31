import dynamic from 'next/dynamic';
const Pie = dynamic(
	() => import("@ant-design/plots").then((item) => item.Pie),
	{
	  ssr: false,
	}
  )
import { Card } from 'antd';
import useSWR from 'swr';
import { useState } from 'react';
import { swrFetcher } from '@/common/api';

export default function PieChart() {
	const [by] = useState('gender');
	const { data } = useSWR(`/admin/statictisUser?by=${by}`, swrFetcher);
	const config = {
		appendPadding: 10,
		data: data || [],
		angleField: 'total',
		colorField: '_id',
		radius: 0.9,
		label: {
			// type: 'inner',
			offset: '-30%',
			content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
			style: {
				fontSize: 14,
				textAlign: 'center',
			},
			formatter: (datum) => `${datum && datum._id ? datum._id : 'Unknown'}: ${datum && datum.total != undefined ? datum.total : 'Unknown'}`,
		},
		interactions: [
			{
				type: 'element-active',
			},
		],
		legend: {
			layout: 'horizontal',
			position: 'bottom',
			flipPage: false,
		},
	};
	return (
		<Card title="Thống kê người dùng">
			<Pie {...config} />
		</Card>
	);
}
