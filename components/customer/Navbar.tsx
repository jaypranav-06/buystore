'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart-store';
import { ShoppingCart, User, Menu, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = getTotalItems();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Velvet <span className="text-blue-600">Vogue</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-gray-700 hover:text-blue-600">
              <Search className="w-6 h-6" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline">{session.user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden group-hover:block">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-blue-600 py-2">
              Home
            </Link>
            <Link href="/products" className="block text-gray-700 hover:text-blue-600 py-2">
              Products
            </Link>
            <Link href="/categories" className="block text-gray-700 hover:text-blue-600 py-2">
              Categories
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600 py-2">
              About
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600 py-2">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
