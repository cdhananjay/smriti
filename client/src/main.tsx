import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.tsx';
import RequireAuth from './RequireAuth.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import { Toaster } from 'sonner';
import BlogViewer from './BlogViewer.tsx';
import axios from 'axios';
import BlogCreator from './BlogCreator.tsx';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 2000,
    withCredentials: true,
    validateStatus: status => status < 500,
});
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/blog/:slug" element={<BlogViewer />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<App />} />
                    <Route path="/blog/new" element={<BlogCreator />} />
                </Route>
            </Routes>
        </BrowserRouter>
        <Toaster />
    </StrictMode>
);
