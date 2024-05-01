import { Button, Card, Space } from 'antd';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { useState } from 'react';
import { GrOrderedList, GrUnorderedList } from 'react-icons/gr';

const blockStyles = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: <GrUnorderedList />, style: 'unordered-list-item' },
	{ label: <GrOrderedList />, style: 'ordered-list-item' },
];

const inlineStyles= [
	{ label: <b>B</b>, style: 'BOLD' },
	{ label: <i>I</i>, style: 'ITALIC' },
	{ label: <u>U</u>, style: 'UNDERLINE' },
];


const styles = [
	...inlineStyles.map((style) => ({ ...style, type: 'inline' })),
	...blockStyles.map((style) => ({ ...style, type: 'block' })),
];


export const RichTextInput = ({ value = '', onChange, placeholder, ...props }) => {
	const [editorState, setEditorState] = useState(EditorState.createWithContent(stateFromHTML(value)));

	const handleEditorChange = (newEditorState) => {
		const contentState = newEditorState.getCurrentContent();
		const contentStateString = stateToHTML(contentState);
		setEditorState(newEditorState);
		onChange?.(contentStateString);
	};

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			handleEditorChange(newState);
			return 'handled';
		}
		return 'not-handled';
	};

	const toggleBlockType = (blockType) =>
		handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
	const isBlockActive = (blockType) => {
		const selection = editorState.getSelection();
		const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
		return block.getType() === blockType;
	};

	const toggleInlineStyle = (inlineStyle) =>
		handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	const isInlineStyleActive = (inlineStyle) => editorState.getCurrentInlineStyle().has(inlineStyle);

	const toggleStyle = (s) => (s.type === 'block' ? toggleBlockType(s.style) : toggleInlineStyle(s.style));
	const isStyleActive = (s) => (s.type === 'block' ? isBlockActive(s.style) : isInlineStyleActive(s.style));

	return (
		<Card
			headStyle={{ padding: 16 }}
			bodyStyle={{ padding: 16 }}
			title={
				<Space>
					{styles.map((s) => (
						<Button
							key={s.style}
							onClick={() => toggleStyle(s)}
							type={isStyleActive(s) ? 'primary' : 'default'}
							style={{ width: 32, height: 32, padding: 0 }}
						>
							{s.label}
						</Button>
					))}
				</Space>
			}
			{...props}
		>
			<Editor
				placeholder={placeholder}
				editorState={editorState}
				onChange={handleEditorChange}
				handleKeyCommand={handleKeyCommand}
			/>
		</Card>
	);
};


export const RichTextViewer = function Viewer({ content }) {
	const contentState = stateFromHTML(content);
	const editorState = EditorState.createWithContent(contentState);

	return (
		<Editor
			editorState={editorState}
			readOnly={true}
			onChange={() => {

			}}
		/>
	);
};
