"use client";

export default function Header() {
  return (
    <header className="w-full bg-background border-b border-gray-800 text-foreground shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-3xl font-bold">⚡Polish PR</h1>
        <nav className="space-x-6">
          <a href="/" className="hover:text-gray-400 transition">Home</a>
          <a href="/about" className="hover:text-gray-400 transition">About</a>
          <a href="/docs" className="hover:text-gray-400 transition">Docs</a>
        </nav>
      </div>
    </header>
  );
}

