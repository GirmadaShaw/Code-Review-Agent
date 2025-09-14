"use client";

export default function GitHubLogin() {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <a
        href="/api/auth/login"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Sign in with GitHub
      </a>
    </div>
  );
}
