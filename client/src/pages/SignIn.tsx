import { useState } from 'react';
import { authClient } from './../lib/auth-client';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from './../RequireAuth';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const session: ReturnType<typeof authClient.useSession> = useContext(UserContext!);
    const handleSignIn = async () => {
        if (email.indexOf('@') >= 0) {
            const { data, error } = await authClient.signIn.email(
                {
                    email,
                    password: pass,
                    /**
                     * remember the user session after the browser is closed.
                     * @default true
                     */
                    rememberMe: false,
                },
                {
                    onRequest: _ => {
                        console.log('loading');
                    },
                    onSuccess: _ => {
                        console.log('naviagting to /... (email)');
                        session.refetch();
                        return navigate('/');
                    },
                    onError: ctx => {
                        // display the error message
                        alert(ctx.error.message);
                    },
                }
            );

            if (error) {
                console.log(error);
            } else {
                console.log(data);
            }
        } else {
            const { data, error } = await authClient.signIn.username(
                {
                    username: email,
                    password: pass,
                    /**
                     * remember the user session after the browser is closed.
                     * @default true
                     */
                    rememberMe: false,
                },
                {
                    onRequest: _ => {
                        console.log('loading');
                    },
                    onSuccess: _ => {
                        console.log('navigating to ../ (username login)');
                        session.refetch();
                        return navigate('/');
                    },
                    onError: ctx => {
                        // display the error message
                        alert(ctx.error.message);
                    },
                }
            );
            if (error) {
                console.log(error);
            } else {
                console.log(data);
            }
        }
    };
    return (
        <>
            <input placeholder="email/username" onChange={e => setEmail(e.target.value)}></input>
            <input placeholder="pass" onChange={e => setPass(e.target.value)}></input>
            <button onClick={handleSignIn}> sign in</button>
        </>
    );
}
