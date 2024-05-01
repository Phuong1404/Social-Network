import classnames from 'classnames';
import React,  { forwardRef } from 'react';
import styles from '../styles/Layout.module.scss';


export const Content = forwardRef(
	({ className, fixed, ...props }, ref) => {
		const classes = [styles.content];
		className && classes.push(className);

		fixed && classes.push(styles.fixed);

		return <div {...props} ref={ref} className={classnames(classes)} />;
	}
);
