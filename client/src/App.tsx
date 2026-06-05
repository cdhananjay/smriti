import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import Navbar from './components/Navbar';
import { Input } from './components/ui/input';
import { axiosInstance } from './main';
import { toast } from 'sonner';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { Card, CardContent } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
    const [query, setQuery] = useState('');
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
            toast.error('Something went wrong while fetching blogs');
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

            <main className="min-h-screen bg-muted">
                {/* Hero */}
                <section className="relative overflow-hidden ">
                    <div className="absolute " />

                    <div className="relative mx-auto max-w-6xl px-6 py-24">
                        <div className="mx-auto max-w-3xl text-center">
                            <Badge
                                variant="secondary"
                                className="mb-6 px-4 py-1"
                            >
                                Create • Learn • Share
                            </Badge>

                            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                                Search Blogs
                                <span className="block text-primary">
                                    Instantly
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                                Explore blogs on any topic.
                            </p>
                        </div>

                        <div className="mx-auto mt-12 max-w-3xl">
                            <div className="rounded-3xl border bg-card p-3 shadow-lg">
                                <Input
                                    type="text"
                                    value={query}
                                    placeholder="Search for topics you are interested in"
                                    onChange={e => {
                                        setCurrentPage(1);
                                        setQuery(e.target.value);
                                    }}
                                    className="
                                        h-14
                                        border-0
                                        text-lg
                                        shadow-none
                                        focus-visible:ring-0
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results */}
                <section className="mx-auto max-w-5xl px-6">
                    {query.trim() && blogsData && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                Search Results
                            </h2>

                            <p className="text-muted-foreground">
                                {blogsData.totalBlogs} blog
                                {blogsData.totalBlogs !== 1 ? 's' : ''} found
                            </p>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Card key={index}>
                                    <CardContent className="space-y-4 p-6">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Blogs */}
                    {!loading && (
                        <div className="space-y-5">
                            {blogsData?.blogs.map(blog => (
                                <BlogCard blog={blog} />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading &&
                        query.trim() &&
                        blogsData &&
                        blogsData.blogs.length === 0 && (
                            <Card className="py-20">
                                <CardContent className="text-center">
                                    <h3 className="text-2xl font-semibold">
                                        No blogs found
                                    </h3>

                                    <p className="mt-3 text-muted-foreground">
                                        Try searching with different keywords.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                    {/* Pagination */}
                    {blogsData && blogsData.totalBlogs > 0 && (
                        <div className="mt-12">
                            <PageChanger
                                currentPage={currentPage}
                                totalPages={Math.ceil(
                                    blogsData.totalBlogs / 10
                                )}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link key={blog.slug} to={`/blog/${blog.slug}`} className="block">
            <Card className=" group transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={blog.author_image ?? undefined} />

                            <AvatarFallback>
                                {blog.author_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">
                                    {blog.author_name}
                                </span>

                                <span className="text-sm text-muted-foreground">
                                    @{blog.author_username}
                                </span>
                            </div>

                            <h2 className="mt-3 text-2xl font-semibold transition-colors group-hover:text-primary">
                                {blog.title}
                            </h2>

                            <p className="mt-4 text-sm text-muted-foreground">
                                Published on{' '}
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function PageChanger({
    currentPage,
    totalPages,
    setCurrentPage,
}: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <Pagination className="my-5">
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage(p => p - 1)}
                        />
                    </PaginationItem>
                )}

                {currentPage !== 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(1)}>
                            First
                        </PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>

                {currentPage !== totalPages && (
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            Last
                        </PaginationLink>
                    </PaginationItem>
                )}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage(p => p + 1)}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
