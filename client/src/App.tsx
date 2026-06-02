import { useNavigate } from 'react-router';
import './App.css';
import { authClient } from './lib/auth-client';
import { useContext } from 'react';
import { UserContext } from './RequireAuth';

function App() {
    const session: ReturnType<typeof authClient.useSession> = useContext(UserContext!);
    const navigate = useNavigate();

    console.log('reached home');
    // const { data } = authClient.useSession();
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    console.log('signed out.. going /signin');
                    navigate('/signin'); // redirect to login page
                },
            },
        });
    };

    return (
        <>
            <h1>{session.data?.user.name}</h1>
            <button onClick={handleSignOut}>sign out</button>
        </>
    );
}

export default App;
