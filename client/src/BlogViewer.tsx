import { useParams } from 'react-router';
import { axiosInstance } from './main';
import Markdown from 'react-markdown';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import './blog.css';
import { toast } from 'sonner';
import { Spinner } from './components/ui/spinner';
import { Link } from 'react-router';
import Navbar from './components/Navbar';
type blogType = {
    createdAt: Date;
    title: string;
    content: string;
    author: {
        username: string | null;
        name: string;
        image: string | null;
    };
} | null;

function BlogViewer() {
    const { slug } = useParams();
    const [blog, setBlog] = useState<blogType>(null);
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data, status } = await axiosInstance.get(`/blog/view/${slug}`);
                if (status == 200) {
                    const blog = data as blogType;
                    setBlog(blog);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error('something went wrong');
                console.log(err);
            }
        };
        fetchBlog();
    }, []);

    if (blog === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-muted text-foreground">
            <article className="mx-auto max-w-3xl px-6 py-10">
                {/* TITLE */}
                <header className="mb-3">
                    <h1 className="text-4xl font-bold tracking-tight leading-tight">
                        {blog.title}
                    </h1>
                    {/* date */}
                    <p className="mt-2 text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>

                    {/* AUTHOR CARD */}
                    <div className="mt-6 flex items-center gap-4">
                        <Link to={`/user/${blog.author.username}`}>
                            <img
                                src={blog.author.image || '/person.svg'}
                                alt={`profile-pic-for-@${blog.author.username}`}
                                className="h-12 w-12 rounded-full object-cover border border-border"
                            />
                        </Link>
                        <div className="flex flex-col">
                            <Link to={`/user/${blog.author.username}`}>
                                <span className="font-medium text-sm">{blog.author.name}</span>
                            </Link>
                            <Link to={`/user/${blog.author.username}`}>
                                <span className="text-sm text-muted-foreground">
                                    @{blog.author.username}
                                </span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* DIVIDER */}
                <div className="mb-6 h-px w-full bg-border" />

                {/* CONTENT */}
                <div id="blog" className="max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>{blog.content}</Markdown>
                </div>
            </article>
        </div>
        </>
    );
}

export default BlogViewer;
