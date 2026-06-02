import { useState } from 'react';
import '@mdxeditor/editor/style.css';
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
} from '@mdxeditor/editor';
import { toast } from 'sonner';
import { axiosInstance } from './main';

function BlogCreator() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const handleSubmit = async () => {
        if (!title.trim()) toast.error('title is required');
        console.log(title, content);
        try {
            const { data, status } = await axiosInstance.post('/blog/new', {
                title: title,
                content: content,
            });
            if (status == 201) toast('created');
            else toast.error(data.message!);
        } catch (err) {
            toast.error('error submiting');
        }
    };
    return (
        <>
            <input placeholder="title" onChange={e => setTitle(e.target.value)}></input>
            <MDXEditor
                onChange={(markdown, _) => setContent(markdown)}
                markdown="# Hello world"
                plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
            />
            <button onClick={handleSubmit}>submit</button>
        </>
    );
}

export default BlogCreator;
