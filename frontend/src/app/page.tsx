"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UploadForm from "../components/UploadForm";
import CodeEditor from "../components/CodeEditor";
import SummaryCard from "../components/SummaryCard";
import GitHubLogin from "@/components/GitHubLogin";

export default function Home() {
  const [code, setCode] = useState("// Don't refresh unless you want to lose all your code");
  const [findings, setFindings] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>("");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Code Analysis Tool</h1>
          <GitHubLogin />
        </div>
        
        
        <CodeEditor setFindings={setFindings} setSummary={setSummary} />
        <div className="flex items-center my-20">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <UploadForm setFindings={setFindings} setSummary={setSummary} />

        <SummaryCard findings={findings} summary={summary} />
      </main>
      <Footer />
    </div>
  );
}
