import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { dateUtil } from '@/common/utils';


export function CountdownButton({
	milliseconds,
	step = 1000,
	renderCountdown,
	afterChildren,
	state: initState = 'stop',
	...props
}) {
	const [state, setState] = useState(initState);
	const [countdown, setCountdown] = useState(milliseconds);
	const duration = dateUtil.getDuration(countdown);

	const countdownRef = useRef();
	useEffect(() => {
		const isStart = state === 'start';
		if (isStart) {
			countdownRef.current = setInterval(() => {
				setCountdown((prev) => {
					const next = prev - step;
					if (next <= 0) {
						clearInterval(countdownRef.current);
						setState('stop');
						return milliseconds;
					} else return next;
				});
			}, step);
		} else if (countdownRef.current) clearInterval(countdownRef.current);

		return () => {
			if (countdownRef.current) clearInterval(countdownRef.current);
		};
	}, [state]);

	const startCountdown = () => setState('start');

	const isCounting = state === 'start';


	renderCountdown ??= (duration) => {
		const { minutes, seconds } = {
			minutes: duration.minutes(),
			seconds: duration.seconds(),
		};
		const arr = [minutes, seconds].map((n) => n.toString().padStart(2, '0'));
		return arr.join(':');
	};


	afterChildren ??= props.children;

	return (
		<Button
			{...props}
			loading={isCounting || props.loading}
			onClick={async (e) => {
				await props?.onClick?.(e);
				if (!props.disabled) startCountdown();
			}}
		>
			{isCounting ? renderCountdown(duration) : countdownRef.current ? afterChildren : props.children}
		</Button>
	);
}
