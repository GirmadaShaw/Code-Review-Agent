"use client";

export default function GitHubLogin() {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <a
        href="/api/auth/login"
        className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
      >
        Sign in with GitHub
      </a>
    </div>
  );
}
