import React from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

export function UploadImage({ cropProps, onPickImage, ...props }) {
	return (
		<ImgCrop {...cropProps}>
			<Upload
				fileList={[]}
				beforeUpload={(file) => {
					onPickImage(file);
					return false;
				}}
				{...props}
			/>
		</ImgCrop>
	);
}
