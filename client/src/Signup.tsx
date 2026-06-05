import { PencilLine } from 'lucide-react';
import { SignupForm } from './components/SignupForm';
import { toast } from 'sonner';
import { authClient } from './lib/auth-client';
import { useNavigate } from 'react-router';

export default function SignUp() {
    const navigate = useNavigate();
    const session = authClient.useSession();
    const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.querySelector('#name') as HTMLInputElement)?.value;
        const email = (form.querySelector('#email') as HTMLInputElement)?.value;
        const username = (form.querySelector('#username') as HTMLInputElement)?.value;
        const password = (form.querySelector('#password') as HTMLInputElement)?.value;
        const confirmedPassword = (form.querySelector('#confirm-password') as HTMLInputElement)
            ?.value;

        if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
            toast.error('all fields are required.');
            return;
        }

        if (password.trim() !== confirmedPassword.trim()) {
            toast.error('passwords do not match');
            return;
        }
        let toastId;
        await authClient.signUp.email(
            {
                email: email.trim(),
                username: username.trim(),
                password: password.trim(),
                name: name.trim(),
                // image: , // User image URL (optional)
            },
            {
                onRequest: _ => {
                    toastId = toast.loading('checking your info..');
                },
                onSuccess: _ => {
                    toast.dismiss(toastId!);
                    toast.success('account created');
                    session.refetch();
                    navigate('/');
                },
                onError: ctx => {
                    // display the error message
                    toast.dismiss(toastId!);
                    toast.error(ctx.error.message);
                },
            }
        );
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <PencilLine className="size-4" />
                    </div>
                    Some Blog Site.
                </a>
                <SignupForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
