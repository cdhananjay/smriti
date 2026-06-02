import { authClient } from './lib/auth-client';

function App() {
    const session = authClient.useSession();
    console.log('reached home');

    return (
        <>
            <h1>hai {session.data?.user.name}</h1>
        </>
    );
}

export default App;
