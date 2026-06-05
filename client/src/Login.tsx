import { LoginForm } from './components/LoginForm';
import { toast } from 'sonner';
import { authClient } from './lib/auth-client';
import { Link, useNavigate } from 'react-router';
import { PencilLine } from 'lucide-react';

export default function SignIn() {
    const navigate = useNavigate();
    const session = authClient.useSession();
    const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const emailORusername = (
            form.querySelector('#email-or-username') as HTMLInputElement
        )?.value;
        const password = (form.querySelector('#password') as HTMLInputElement)
            ?.value;

        if (!emailORusername.trim() || !password.trim()) {
            toast.error('all fields are required');
            return;
        }
        let toastId;
        if (emailORusername.indexOf('@') >= 0) {
            await authClient.signIn.email(
                {
                    email: emailORusername,
                    password,
                    /**
                     * remember the user session after the browser is closed.
                     * @default true
                     */
                    rememberMe: false,
                },
                {
                    onRequest: _ => {
                        toastId = toast.loading('verifying your existence..');
                    },
                    onSuccess: _ => {
                        toast.dismiss(toastId!);
                        toast.success('logged in');
                        session.refetch();
                        navigate('/');
                        return;
                    },
                    onError: ctx => {
                        toast.dismiss(toastId!);
                        toast.error(ctx.error.message);
                    },
                }
            );
        } else {
            await authClient.signIn.username(
                {
                    username: emailORusername,
                    password,
                    /**
                     * remember the user session after the browser is closed.
                     * @default true
                     */
                    rememberMe: false,
                },
                {
                    onRequest: _ => {
                        toastId = toast.loading('verifying your existence...');
                    },
                    onSuccess: _ => {
                        toast.dismiss(toastId!);
                        toast.success('logged in');
                        session.refetch();
                        navigate('/');
                        return;
                    },
                    onError: ctx => {
                        toast.dismiss(toastId!);
                        toast.error(ctx.error.message);
                    },
                }
            );
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <PencilLine className="size-4" />
                    </div>
                    smriti
                </Link>
                <LoginForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
