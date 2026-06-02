import { Navigate, Outlet } from 'react-router';
import { authClient } from './lib/auth-client';
import { toast } from 'sonner';
import { Spinner } from './components/ui/spinner';

function RequireAuth() {
    const { data, error, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }
    if (error) {
        toast.error('error fetching session');
        return <p>try again later</p>;
    }
    if (!data) {
        toast.info('login first to access the page');
        return <Navigate to={'/login'} />;
    }
    return <Outlet />;
}

export default RequireAuth;
