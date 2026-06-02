import { useState } from 'react';
import { toast } from 'sonner';
import { axiosInstance } from './main';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

import { useNavigate } from 'react-router';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function App() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    function handleEditorChange({ html, text } : {html: string, text: string}) {
        setContent(text);
        console.log('handleEditorChange', html, text);
    }

    const handleSubmit = async () => {
        if (!title.trim()) return toast.error('Title is required');
        if (!content) return toast.error("content cannot be empty");
        try {
            const { data, status } = await axiosInstance.post('/blog/new', {
                title,
                content,
            });

            if (status === 201) { 
                toast.success('Created');
                navigate(`/blog/${data.slug!}`)
            }
        } catch (e) {
            toast.error('Error submitting');
        }
    };

    return (
        <div>
            <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
            <MdEditor style={{ height: 'max' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            <button onClick={handleSubmit}>submit</button>
        </div>
    );
}
