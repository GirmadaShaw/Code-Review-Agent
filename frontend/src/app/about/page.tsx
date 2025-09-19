"use client";

import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">
          About Polish PR
        </h1>
        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          <strong className="text-yellow-500">Polish PR</strong> is your intelligent
          code review agent built to help developers ship cleaner, more
          reliable pull requests with confidence. Whether you're working solo or
          in a team, Polish PR ensures your code meets high standards before it
          ever gets merged.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">What We Do</h2>
        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          We analyze your pull requests using AI-powered insights and
          best-practice checks. Our platform highlights potential issues,
          suggests improvements, and helps you spot mistakes early—before they
          slow down reviews or reach production.
        </p>

       <h2 className="text-2xl font-semibold mb-4 text-white">How It Works</h2>
        <ul className="list-disc pl-6 space-y-3 text-lg leading-relaxed mb-6 text-gray-300">
        <li>
            <strong className="text-green-500">Sign in with GitHub securely:</strong> Connect your account to access the repositories you have permission for.
        </li>
        <li>
            <strong className="text-orange-500">Select a Repository:</strong> We automatically fetch all accessible repos. Click the one you want to review.
        </li>
        <li>
            <strong className="text-purple-500">Pick an Open Pull Request:</strong> Browse the list of open PRs in the selected repository and choose which one you want AI to analyze.
        </li>
        <li>
            <strong className="text-blue-500">View AI Review:</strong> Instantly see analysis highlighting potential issues, suggestions, and improvements for the selected PR.
        </li>
        <li>
            <strong className="text-yellow-500">Apply Inline Comments:</strong> With a single click, post AI-generated inline comments directly to your GitHub PR. It's that easy!
        </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-white">
          Why Choose Polish PR?
        </h2>
        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          By <strong className="text-green-500">automating</strong> the most tedious parts of code review, Polish PR <strong className="text-yellow-500">speeds up collaboration</strong>, improves code quality, and frees up time for meaningful discussions. It's like having a senior engineer review your work—instantly and around the clock.
        </p>

        <div className="text-center mt-10">
          <a
            href="/"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Let' Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
