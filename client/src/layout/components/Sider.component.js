import classnames from 'classnames';
import React, { forwardRef } from 'react';
import styles from '../styles/Layout.module.scss';

export const Sider = forwardRef(
	({ align, className, children, collapse, ...props }, ref) => {
		const classes = [styles.sider];
		align && classes.push(styles[align]);
		collapse && classes.push(styles.collapse);
		className && classes.push(className);

		return (
			<div {...props} className={classnames(classes)} ref={ref}>
				<aside className={classnames(classes)}>{children}</aside>
			</div>
		);
	}
);
