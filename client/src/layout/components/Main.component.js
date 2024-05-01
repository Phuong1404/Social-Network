import classnames from 'classnames';
import React, { forwardRef } from 'react';
import styles from '../styles/Layout.module.scss';

export const Main = forwardRef(({ className, ...props }, ref) => {
	const classes = [styles.main];
	className && classes.push(className);

	return <main {...props} ref={ref} className={classnames(classes)} />;
});
