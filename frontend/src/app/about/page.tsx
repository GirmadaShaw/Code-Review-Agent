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
          <strong className="text-white">Polish PR</strong> is your intelligent
          code review assistant built to help developers ship cleaner, more
          reliable pull requests with confidence. Whether you’re working solo or
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
            <strong className="text-white">Connect with GitHub:</strong> Sign in
            securely with GitHub and link your repositories.
          </li>
          <li>
            <strong className="text-white">Upload or Submit PRs:</strong> Share
            your code changes or pull requests for instant analysis.
          </li>
          <li>
            <strong className="text-white">AI-Powered Review:</strong> Our
            engine scans for bugs, vulnerabilities, style inconsistencies, and
            optimization opportunities.
          </li>
          <li>
            <strong className="text-white">Write Inline Comments:</strong> Get
            clear, easy-to-follow suggestions you can apply automatically.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-white">
          Why Choose Polish PR?
        </h2>
        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          By automating the most tedious parts of code review, Polish PR speeds
          up collaboration, improves code quality, and frees up time for
          meaningful discussions. It's like having a senior engineer review your
          work—instantly and around the clock.
        </p>

        <div className="text-center mt-10">
          <a
            href="/"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
