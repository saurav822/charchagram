import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleImageInsert = () => {
        if (imageUrl.trim()) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.position = 'relative';
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.style.position = 'absolute';
            deleteBtn.style.top = '5px';
            deleteBtn.style.right = '5px';
            deleteBtn.style.background = 'rgba(0,0,0,0.7)';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '50%';
            deleteBtn.style.width = '24px';
            deleteBtn.style.height = '24px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '16px';
            deleteBtn.style.fontWeight = 'bold';
            deleteBtn.style.display = 'flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.justifyContent = 'center';
            deleteBtn.style.zIndex = '10';
            
            // Create wrapper div
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.maxWidth = '100%';
            wrapper.appendChild(img);
            wrapper.appendChild(deleteBtn);
            
            // Add delete functionality
            deleteBtn.onclick = () => {
                wrapper.remove();
                if (editorRef.current) {
                    onChange(editorRef.current.innerHTML);
                }
            };
            
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(wrapper);
                range.collapse(false);
            }
            
            setImageUrl('');
            setShowImageInput(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // Handle image pasting
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const result = event.target?.result as string;
                        if (result) {
                            const img = document.createElement('img');
                            img.src = result;
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.style.position = 'relative';
                            
                            // Create delete button
                            const deleteBtn = document.createElement('button');
                            deleteBtn.innerHTML = '×';
                            deleteBtn.style.position = 'absolute';
                            deleteBtn.style.top = '5px';
                            deleteBtn.style.right = '5px';
                            deleteBtn.style.background = 'rgba(0,0,0,0.7)';
                            deleteBtn.style.color = 'white';
                            deleteBtn.style.border = 'none';
                            deleteBtn.style.borderRadius = '50%';
                            deleteBtn.style.width = '24px';
                            deleteBtn.style.height = '24px';
                            deleteBtn.style.cursor = 'pointer';
                            deleteBtn.style.fontSize = '16px';
                            deleteBtn.style.fontWeight = 'bold';
                            deleteBtn.style.display = 'flex';
                            deleteBtn.style.alignItems = 'center';
                            deleteBtn.style.justifyContent = 'center';
                            deleteBtn.style.zIndex = '10';
                            
                            // Create wrapper div
                            const wrapper = document.createElement('div');
                            wrapper.style.position = 'relative';
                            wrapper.style.display = 'inline-block';
                            wrapper.style.maxWidth = '100%';
                            wrapper.appendChild(img);
                            wrapper.appendChild(deleteBtn);
                            
                            // Add delete functionality
                            deleteBtn.onclick = () => {
                                wrapper.remove();
                                if (editorRef.current) {
                                    onChange(editorRef.current.innerHTML);
                                }
                            };
                            
                            const selection = window.getSelection();
                            if (selection && selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                range.insertNode(wrapper);
                                range.collapse(false);
                            }
                            
                            // Update parent component
                            if (editorRef.current) {
                                onChange(editorRef.current.innerHTML);
                            }
                        }
                    };
                    reader.readAsDataURL(blob);
                }
                return;
            }
            
            // Handle text pasting
            if (item.type.indexOf('text') !== -1) {
                item.getAsString((text) => {
                    document.execCommand('insertText', false, text);
                    if (editorRef.current) {
                        onChange(editorRef.current.innerHTML);
                    }
                });
            }
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Add delete buttons to existing images when component mounts or value changes
    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const images = editor.querySelectorAll('img');
        images.forEach((img) => {
            // Check if image already has a delete button
            if (img.parentElement?.querySelector('.image-delete-btn')) return;

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.className = 'image-delete-btn';
            deleteBtn.style.position = 'absolute';
            deleteBtn.style.top = '5px';
            deleteBtn.style.right = '5px';
            deleteBtn.style.background = 'rgba(0,0,0,0.7)';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '50%';
            deleteBtn.style.width = '24px';
            deleteBtn.style.height = '24px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '16px';
            deleteBtn.style.fontWeight = 'bold';
            deleteBtn.style.display = 'flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.justifyContent = 'center';
            deleteBtn.style.zIndex = '10';

            // Create wrapper if image doesn't have one
            let wrapper = img.parentElement;
            if (!wrapper || wrapper.tagName !== 'DIV') {
                wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';
                wrapper.style.maxWidth = '100%';
                img.parentNode?.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }

            wrapper.appendChild(deleteBtn);

            // Add delete functionality
            deleteBtn.onclick = () => {
                wrapper.remove();
                if (editorRef.current) {
                    onChange(editorRef.current.innerHTML);
                }
            };
        });
    }, [value]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        // Add paste event listener
        editor.addEventListener('paste', handlePaste as any);

        return () => {
            editor.removeEventListener('paste', handlePaste as any);
        };
    }, []);

    return (
        <div className="space-y-2">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
                <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 font-bold"
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 italic"
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 underline"
                    title="Underline"
                >
                    U
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h3>')}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                    title="Sub-Heading 1"
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h4>')}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                    title="Sub-Heading 2"
                >
                    H4
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                    title="Insert Image"
                >
                    📷 Image
                </button>
            </div>

            {/* Image URL Input */}
            {showImageInput && (
                <div className="p-2 border border-gray-300 bg-gray-50 rounded-md">
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Enter image URL or paste image"
                            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleImageInsert}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                            Insert
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowImageInput(false);
                                setImageUrl('');
                            }}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                dangerouslySetInnerHTML={{ __html: value }}
                onInput={handleInput}
                className="w-full min-h-[300px] px-4 py-3 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 prose max-w-none"
                style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}
                onPaste={handlePaste}
            />
        </div>
    );
};