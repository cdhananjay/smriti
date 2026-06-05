import { useState } from 'react';
import { toast } from 'sonner';
import { axiosInstance } from './main';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import { useNavigate } from 'react-router';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const mdParser = new MarkdownIt();

export default function App() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    function handleEditorChange({ text }: { html: string; text: string }) {
        setContent(text);
    }

    const handleSubmit = async () => {
        if (!title.trim()) return toast.error('Title is required');
        if (!content) return toast.error('Content cannot be empty');
        const toastId = toast.loading('creating...');
        try {
            const { data, status } = await axiosInstance.post('/blog/new', {
                title,
                content,
            });

            if (status === 201) {
                toast.success('Created');
                navigate(`/blog/${data.slug}`);
            }
        } catch (err) {
            console.log(err);
            toast.error('Error submitting');
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="min-h-screen bg-muted text-foreground">
            <div className="mx-auto max-w-4xl px-6 py-10">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Create new blog</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Write something worth reading
                    </p>
                </div>

                {/* TITLE INPUT */}
                <Input
                    className="p-5 bg-background"
                    placeholder="Blog Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                {/* EDITOR WRAPPER */}
                <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                    <MdEditor
                        className="h-150"
                        renderHTML={text => mdParser.render(text)}
                        onChange={handleEditorChange}
                    />
                </div>

                {/* SUBMIT */}
                <div className="mt-6 flex justify-end">
                    <Button variant={'default'} onClick={handleSubmit} size={'lg'}>
                        Publish
                    </Button>
                </div>
            </div>
        </div>
    );
}
