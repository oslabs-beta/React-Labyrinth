// Test Case 12a - Parse for Next.js using Pages Router

import Head from 'next/head';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
    return (
        <div className="container mx-auto">
            <Head>
                <title>Home Page</title>
                <meta name="description" content="This is the home page of your Next.js app." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <main className="mt-10">
                <h1 className="text-3xl font-bold">Welcome to Next.js!</h1>
                <p className="text-lg mt-4">This is a sample index page created with Next.js.</p>
            </main>
            <footer className="mt-10">
                <p className="text-sm text-gray-500">Footer content here</p>
            </footer>
        </div>
    );
}