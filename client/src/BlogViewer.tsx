import { useParams } from 'react-router';
import { axiosInstance } from './main';
import Markdown from 'react-markdown';
import { useEffect, useState } from 'react';
function BlogViewer() {
    let { slug } = useParams();
    console.log(slug);
    const [title, setTitle] = useState('loading...');
    const [content, setContent] = useState('loading...');
    useEffect(() => {
        const fn = async () => {
            try {
                const res = await axiosInstance.get(`/blog/view/${slug}`);
                const { data, status } = res;
                console.log(data, status);
                if (status == 200) {
                    setTitle(data.title!);
                    setContent(data.content!);
                } else {
                    setTitle('ERROR');
                    setContent(data.message!);
                }
            } catch (err) {
                console.log(err);
                setTitle('');
                setContent('error fetching data');
            }
        };
        fn();
    }, []);
    return (
        <>
            <h1>{title}</h1>
            <Markdown>{content}</Markdown>
        </>
    );
}

export default BlogViewer;
