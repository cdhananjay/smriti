import {useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Input } from "./components/ui/input";
import { axiosInstance } from "./main";
import { toast } from "sonner";
import { Link } from "react-router";
import {
    Pagination,
    PaginationContent,
    // PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';


type Blog = {
    title: string;
    slug: string;
    createdAt: string;
    author_name: string;
    author_image: string | null;
    author_username: string;
    rank: number;
};

type BlogsResponse = {
    blogs: Blog[];
    totalBlogs: number;
};

export default function App() {
    const [query, setQuery] = useState("");
    const [blogsData, setBlogsData] = useState<BlogsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchBlogs = async (searchQuery: string) => {
        try {
            setLoading(true);

            const { data } = await axiosInstance.get(
                `/blog/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=10`
            );

            setBlogsData(data);
        } catch {
            toast.error("Something went wrong while fetching blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setBlogsData(null);
            return;
        }

        const timeout = setTimeout(() => {
            fetchBlogs(trimmedQuery);
        }, 500);

        return () => clearTimeout(timeout);
    }, [query, currentPage]);

    return (
        <>
            <Navbar />

            <div className="max-w-3xl mx-auto p-4">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a blog..."
                />

                {loading && (
                    <p className="mt-4 text-sm text-gray-500">
                        Searching...
                    </p>
                )}

                {!loading &&
                    blogsData?.blogs.map((blog) => (
                        <Link
                            to={`/blog/${blog.slug}`}
                            key={blog.slug}
                        >
                        <div
                            className="mt-4 rounded-lg border p-4"
                        >
                            <h2 className="font-semibold">{blog.title}</h2>

                            <p className="text-sm text-gray-500">
                                By {blog.author_name} (@{blog.author_username})
                            </p>

                            <p className="text-xs text-gray-400">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        </Link>
                    ))}

                {!loading &&
                    query.trim() &&
                    blogsData &&
                    blogsData.blogs.length === 0 && (
                        <p className="mt-4 text-gray-500">
                            No blogs found.
                        </p>
                    )}
            </div>
           {blogsData && blogsData.totalBlogs > 0 && <PageChanger setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={Math.ceil(blogsData.totalBlogs/10)}  /> }
        </>
    );
}

function PageChanger({
    currentPage,
    totalPages,
    setCurrentPage,
}: {
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    currentPage: number;
    totalPages: number;
}) {
    return (
        <Pagination className="my-5">
            <PaginationContent>
                {currentPage - 1 > 0 && (
                    <PaginationItem >
                        <PaginationPrevious onClick={ () => setCurrentPage(currentPage-1) }/>
                    </PaginationItem>
                )}
                {currentPage != 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={ () => setCurrentPage(1)} >first</PaginationLink>
                    </PaginationItem>
                )}
                {currentPage > 0 && currentPage <= totalPages && (
                    <PaginationItem>
                        <PaginationLink isActive>
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                )}
                {currentPage != totalPages && (
                    <PaginationItem>
                        <PaginationLink  onClick={ () => setCurrentPage(totalPages)}>last</PaginationLink>
                    </PaginationItem>
                )}
                {currentPage + 1 <= totalPages && (
                    <PaginationItem>
                        <PaginationNext onClick={ () => setCurrentPage(currentPage+1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}