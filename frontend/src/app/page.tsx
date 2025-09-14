"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UploadForm from "../components/UploadForm";
import CodeEditor from "../components/CodeEditor";
import SummaryCard from "../components/SummaryCard";

export default function Home() {
  const [code, setCode] = useState("// Don't refresh unless you want to lose all your code");
  const [findings, setFindings] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>("");

  const handleRedirect = () => {
    window.location.href = "/redirect";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold">Code Analysis Tool</h1>
        
        <CodeEditor code={code} setCode={setCode} />
        <UploadForm setFindings={setFindings} setSummary={setSummary} />

        <button
          onClick={handleRedirect}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          Analyze via /redirect
        </button>

        <SummaryCard findings={findings} summary={summary} />
      </main>
      <Footer />
    </div>
  );
}
