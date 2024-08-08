'use client';
import { navbarMenu } from '@/constants/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [activePage, setActivePage] = useState('/');

  return (
    <nav className="py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image src="/MERKLE-logo.png" alt="Logo" width={224} height={81} />
        </Link>

        <ul className="flex space-x-6 text-lg font-medium">
          {navbarMenu.map((item) => (
            <li key={item.value}>
              <Link
                href={`/${item.value}`}
                onClick={() => setActivePage(item.value)}
                className={`py-2 px-4 rounded-lg hover:font-bold transition-all ${
                  activePage === item.value && 'bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
