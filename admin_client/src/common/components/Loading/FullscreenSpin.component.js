import { Spin } from 'antd';

export function FullscreenSpin(props) {
	return (
		<div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Spin {...props} />
		</div>
	);
}
