import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/nextjs_logo.png';

export const Navbar = () => {
    return (
        <nav className="bg-gray-800 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <Link href="/">
                        <a className="text-white text-xl font-bold">Next.js App</a>
                        <Image src={logo} alt="Next.js logo" />
                    </Link>
                </div>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/">
                            <a className="text-white hover:text-gray-300">Home</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">
                            <a className="text-white hover:text-gray-300">About</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

