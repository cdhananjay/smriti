import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import Navbar from './components/Navbar';
import { axiosInstance } from './main';
import { toast } from 'sonner';

import { Card, CardContent } from './components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Separator } from './components/ui/separator';
import { Skeleton } from './components/ui/skeleton';

import {
    Pagination,
    PaginationContent,
    // PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

type userDataType = {
    name: string;
    image: string;
    createdAt: string;
};

type blogDataType = {
    title: string;
    slug: string;
    createdAt: string;
};

type blogsDataType = {
    blogs: blogDataType[];
    totalBlogs: number;
};

export default function Profile() {
    const { username } = useParams();
    const [searchParams] = useSearchParams();

    // const limit = searchParams.get("limit") || 20;
    const limit = 10;
    const page = Number(searchParams.get('page')) || 1;

    const [blogsData, setBlogsData] = useState<blogsDataType | null>(null);
    const [userData, setUserData] = useState<userDataType | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { data, status } = await axiosInstance.get(`/user/info/${username}`);

                if (status === 200) {
                    setUserData(data);
                } else if (data.message) {
                    toast.error(data.message);
                }
            } catch {
                toast.error('Something went wrong while fetching user info');
            }
        };

        const fetchUserBlogs = async () => {
            try {
                const { data, status } = await axiosInstance.get(
                    `/user/blogs/${username}?page=${page}&limit=${limit}`
                );

                if (status === 200) {
                    setBlogsData(data);
                } else if (data.message) {
                    toast.error(data.message);
                }
            } catch {
                toast.error('Something went wrong while fetching user blogs');
            }
        };

        fetchUserInfo();
        fetchUserBlogs();
    }, [username, page, limit]);

    return (
        <>
            <Navbar />

            <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
                {/* Cover */}
                <div className="h-32 rounded-2xl bg-linear-to-r from-primary/90 via-primary to-primary/70 md:h-48" />

                {/* Profile Card */}
                <div className="-mt-12 md:-mt-16">
                    {userData && username ? (
                        <ProfileInfo {...userData} username={username} />
                    ) : (
                        <ProfileSkeleton />
                    )}
                </div>

                {/* Blogs Section */}
                <section className="mt-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight md:text-2xl">Blogs</h2>

                        {blogsData && (
                            <span className="text-sm text-muted-foreground">
                                {blogsData.totalBlogs} blogs
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">
                        {blogsData ? (
                            blogsData.blogs.length > 0 ? (
                                blogsData.blogs.map(blog => <BlogCard key={blog.slug} {...blog} />)
                            ) : (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No blogs published yet.
                                    </CardContent>
                                </Card>
                            )
                        ) : (
                            <>
                                <BlogSkeleton />
                                <BlogSkeleton />
                                <BlogSkeleton />
                            </>
                        )}
                    </div>
                </section>
            </main>
            {blogsData && (
                <PageChanger
                    totalPages={Math.ceil(blogsData.totalBlogs / 10)}
                    currentPage={page}
                    baseurl={`/user/${username}`}
                />
            )}
        </>
    );
}

function PageChanger({
    currentPage,
    totalPages,
    baseurl,
}: {
    currentPage: number;
    totalPages: number;
    baseurl: string;
}) {
    return (
        <Pagination className="my-5">
            <PaginationContent>
                {currentPage - 1 > 0 && (
                    <PaginationItem>
                        <PaginationPrevious href={`${baseurl}?page=${currentPage - 1}`} />
                    </PaginationItem>
                )}
                {currentPage != 1 && (
                    <PaginationItem>
                        <PaginationLink href={`${baseurl}`}>first</PaginationLink>
                    </PaginationItem>
                )}
                {currentPage > 0 && currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationLink href={`${baseurl}?page=${currentPage}`} isActive>
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                )}
                {currentPage != totalPages && (
                    <PaginationItem>
                        <PaginationLink href={`${baseurl}?page=${totalPages}`}>last</PaginationLink>
                    </PaginationItem>
                )}
                {currentPage + 1 <= totalPages && (
                    <PaginationItem>
                        <PaginationNext href={`${baseurl}?page=${currentPage + 1}`} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}

type profileInfoProps = {
    createdAt: string;
    name: string;
    image: string;
    username: string;
};

function ProfileInfo({ name, image, createdAt, username }: profileInfoProps) {
    return (
        <Card className="border-border/50 shadow-lg backdrop-blur">
            <CardContent className="p-5 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md md:h-28 md:w-28">
                        <AvatarImage src={image} />
                        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{name}</h1>

                        <p className="mt-1 text-muted-foreground">@{username}</p>

                        <Separator className="my-4" />

                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                            <div>
                                <span className="font-medium text-foreground">Joined:</span>{' '}
                                {new Date(createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BlogCard({ title, slug, createdAt }: blogDataType) {
    return (
        <Link to={`/blog/${slug}`}>
            <Card className="my-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-5 md:p-6">
                    <div className="space-y-3">
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight md:text-xl">
                            {title}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                                {new Date(createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>

                            <span className="font-medium text-primary">Read →</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function ProfileSkeleton() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <Skeleton className="h-24 w-24 rounded-full" />

                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BlogSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-3 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-32" />
            </CardContent>
        </Card>
    );
}
