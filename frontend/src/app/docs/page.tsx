"use client";

import Header from "@/components/Header";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <h1 className="text-4xl font-bold text-center">Points to Remember</h1>
        <p className="text-lg text-gray-300 text-center">
          Before running Polish PR, please review these key points.
        </p>

        <ul className="space-y-6 text-lg">
          <li className="p-6 bg-gray-900 rounded-xl shadow-md">
            <strong className="block text-xl mb-2">🔐 Secure Authentication</strong>
            We utilize <span className="text-green-400">GitHub OAuth</span> for
            authentication, ensuring a secure login process directly tied to your
            GitHub account.
          </li>

          <li className="p-6 bg-gray-900 rounded-xl shadow-md">
            <strong className="block text-xl mb-2">⚡ Backend Availability</strong>
            Our backend is hosted on Render’s free tier. Free instances may{" "}
            <span className="text-yellow-400">spin down when inactive</span>,
            which can cause initial requests to be delayed by a few seconds.
            Simply retry if you face delays.
          </li>

          <li className="p-6 bg-gray-900 rounded-xl shadow-md">
            <strong className="block text-xl mb-2">✅ Backend Health Check</strong>
            To confirm the backend is live, visit:{" "}
            <a
              href="https://code-review-agent-j2r6.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              https://code-review-agent-j2r6.onrender.com
            </a>
            .  
            You should see the text{" "}
            <code className="bg-gray-800 px-2 py-1 rounded">The backend is live</code>.  
            This must be working for the project to run smoothly.
          </li>
          <li className="p-6 bg-gray-900 rounded-xl shadow-md">
            <strong className="block text-xl mb-2">📍 A Repo with PR</strong>
            To use Polish PR, make sure you have a repository with at least one open Pull Request in your GitHub account.This is required for the agent to analyze your code and provide AI-powered review.
          </li>
        </ul>
      </main>
    </div>
  );
}
