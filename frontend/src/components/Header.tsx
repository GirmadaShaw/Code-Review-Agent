"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-background border-b border-gray-800 text-foreground shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/"><h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">⚡Grace's Secret</h1></Link> 
        <nav className="space-x-6">
          <Link href="/" className="hover:text-gray-400 transition">Home      </Link>
          <Link href="/about" className="hover:text-gray-400 transition">About</Link>
          <Link href="/docs" className="hover:text-gray-400 transition">Guide </Link>
        </nav>
      </div>
    </header>
  );
}

