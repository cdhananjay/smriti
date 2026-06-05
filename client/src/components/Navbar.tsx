import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function AlertDialogSmall({ onConfirm }: { onConfirm: () => any }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    <LogOut />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>Log out of this device?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel> Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Logout</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Navbar() {
    const navigate = useNavigate();
    const session = authClient.useSession();
    const handleSignOut = async () => {
        let toastId;
        const { error } = await authClient.signOut({
            fetchOptions: {
                onRequest: () => {
                    toastId = toast.loading('logging out..');
                },
                onSuccess: () => {
                    toast.dismiss(toastId!);
                    toast.success('logged out!');
                    navigate('/login');
                },
                onError: ctx => {
                    toast.dismiss(toastId!);
                    toast.error(ctx.error.message);
                },
            },
        });
        if (error) {
            toast.error('something went wrong...');
        }
    };
    return (
        <nav className="border-b border-border bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo / Site Name */}
                <Link to="/" className="font-heading text-2xl font-bold tracking-tight">
                    blehh
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/blog/new"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Create Blog
                    </Link>

                    <Link
                        to={session.data ? `/user/${session.data.user.username}` : '/login'}
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        <Avatar>
                            <AvatarImage src={session.data?.user.image || '/person.svg'} />
                            <AvatarFallback>{session.data?.user.name[0]}</AvatarFallback>
                        </Avatar>
                    </Link>

                    {session.data?.user && <AlertDialogSmall onConfirm={handleSignOut} />}
                </div>
            </div>
        </nav>
    );
}
