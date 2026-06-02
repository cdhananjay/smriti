import { useParams } from 'react-router';
import { axiosInstance } from './main';
import Markdown from 'react-markdown';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm'
import "./blog.css";
import { toast } from 'sonner';
import { Spinner } from './components/ui/spinner';

type blogType = {
    createdAt: Date;
    title: string;
    content: string;
    author: {
        username: string | null;
        name: string;
        image: string | null;
    };
} | null

function BlogViewer() {
    let { slug } = useParams();
    const [blog, setBlog] = useState<blogType>(null);
    useEffect(() => {
        const fn = async () => {
            try {
                const {data, status} = await axiosInstance.get(`/blog/view/${slug}`);
                if (status == 200) {
                    const blog = data as blogType;
                    setBlog(blog);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error("something went wrong")
            }
        };
        fn();
    }, []);

    if (blog === null) {
        return ( 
        <div className='flex justify-center items-center h-screen'>
            <Spinner/>
        </div>
        )
    }

     return (
    <div className="min-h-screen bg-muted text-foreground">
      <article className="mx-auto max-w-3xl px-6 py-10">
        {/* TITLE */}
        <header className="mb-3">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            {blog ? blog.title : "loading.."}
          </h1>

          {/* AUTHOR CARD */}
          <div className="mt-6 flex items-center gap-4">
            <img
              src={blog ? blog.author.image || "/person.svg" : "/person.svg"}
              alt={blog ? blog.author.name : "rick ashley"}
              className="h-12 w-12 rounded-full object-cover border border-border"
            />

            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {blog ? blog.author.name : "john doe"}
              </span>

              <span className="text-sm text-muted-foreground">
                @{blog ? blog.author.username : "johndoe67"}
              </span>
            </div>
          </div>
        </header>

        {/* DIVIDER */}
        <div className="mb-8 h-px w-full bg-border" />

        {/* CONTENT */}
        <div
        id='blog'
          className="prose prose-neutral dark:prose-invert max-w-none
                     prose-headings:font-semibold
                     prose-p:leading-relaxed
                     prose-p:mb-4
                     prose-li:my-1
                     prose-blockquote:border-l-primary
                     prose-blockquote:bg-muted
                     prose-blockquote:px-4
                     prose-blockquote:py-2
                     prose-code:bg-muted
                     prose-code:px-1.5
                     prose-code:py-0.5
                     prose-code:rounded
                     prose-pre:bg-muted
                     prose-pre:text-foreground"
        >
          <Markdown remarkPlugins={[remarkGfm]}>
            {blog ? blog.content : "error" }
          </Markdown>
        </div>

      </article>
    </div>
  )
}

export default BlogViewer;
