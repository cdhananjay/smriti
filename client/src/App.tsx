import { useNavigate } from 'react-router';
import { Button } from './components/ui/button';
import { authClient } from './lib/auth-client';
import { toast } from 'sonner';

function App() {
    const navigate = useNavigate();
    const session = authClient.useSession();
    console.log('reached home');

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
        <>
            <h1>hai {session.data?.user.name}</h1>
            <Button onClick={handleSignOut}>sign out</Button>
        </>
    );
}

export default App;
