'use client'

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
    return (
        <div className="wmde-markdown-var">
            <MDEditor
                value={value}
                onChange={onChange}
                preview="live"
                height={400}
                visibleDragbar={true}
                textareaProps={{
                    placeholder: placeholder || 'Write your blog content in Markdown format...'
                }}
                data-color-mode="light"
            />
        </div>
    );
};
