import { Navigate, Outlet } from 'react-router';
import { authClient } from './lib/auth-client';
import { createContext } from 'react';
import { toast } from 'sonner';

let UserContext;

function RequireAuth() {
    console.log('reached requireauth');
    const { data, error, isPending, refetch, isRefetching } = authClient.useSession();
    console.log(data, error, isPending, refetch);
    UserContext = createContext({ data, error, isPending, refetch, isRefetching });
    toast('reached /');

    if (isPending) {
        return <h1>loading...</h1>;
    }
    if (error) {
        return <h1>error fetching session...</h1>;
    }
    if (!data) {
        console.log('going /signin from requireauth');
        return <Navigate to={'/signin'} />;
    }
    return (
        <UserContext value={{ data, error, isPending, refetch, isRefetching }}>
            <Outlet />
        </UserContext>
    );
}

export default RequireAuth;
export { UserContext };
