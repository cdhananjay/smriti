import { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from './../RequireAuth';
export default function SignUp() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const session: ReturnType<typeof authClient.useSession> = useContext(UserContext!);
    const handleSignUp = async () => {
        if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
            return alert('all fields are required.');
        }
        const { data, error } = await authClient.signUp.email(
            {
                email,
                username: username.trim(),
                password,
                name,
                // image: , // User image URL (optional)
            },
            {
                onRequest: _ => {
                    console.log('loading');
                },
                onSuccess: _ => {
                    session.refetch();
                    navigate('/');
                },
                onError: ctx => {
                    // display the error message
                    alert(ctx.error.message);
                },
            }
        );
        if (error) console.log(error);
        else console.log(data);
    };
    return (
        <>
            <input placeholder="name" onChange={e => setName(e.target.value)}></input>
            <input placeholder="username" onChange={e => setUsername(e.target.value)}></input>
            <input placeholder="email" onChange={e => setEmail(e.target.value)}></input>
            <input placeholder="passord" onChange={e => setPassword(e.target.value)}></input>
            <button onClick={handleSignUp}> sign up</button>
        </>
    );
}
