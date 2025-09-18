"use client";

import { useState, useEffect } from "react";

interface Finding {
  line: number;
  issue: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  fix: string;
}
interface UploadFormProps {
  setFindings: React.Dispatch<React.SetStateAction<Finding[]>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
}

export default function UploadForm({setFindings, setSummary} : UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dots, setDots] = useState(".");

  // Animated dots effect
  useEffect(() => {
      if (!isAnalyzing) return;
      const interval = setInterval(() => {
        setDots((prev) => (prev.length === 3 ? "." : prev + "."));
      }, 500);
      return () => clearInterval(interval);
  }, [isAnalyzing]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsAnalyzing(true);
    const text = await file.text();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: text }),
        });

        const data = await res.json();
        setFindings(data.analysis.findings || [] );
        setSummary(data.analysis.summary);
    } catch (err) {
        console.error("❌ Error sending code:", err);
    } finally {
      setIsAnalyzing(false);
      setDots(".");
    }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-gray-700 rounded-lg p-6 shadow-md flex flex-col gap-4"
    >
      <label className="text-sm text-gray-400">Click below to choose your file</label>
      <input
        type="file"
        accept=".js,.ts,.py,.java,.go,.cpp,.c,.html,.css"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500 cursor-pointer transition"
      />
      <button
        type="submit"
        disabled={isAnalyzing}
        className={`w-full px-4 py-2 rounded-lg transition self-start ${
          isAnalyzing
            ? "bg-gray-600 text-white cursor-not-allowed"
            : "bg-foreground text-background hover:opacity-80 cursor-pointer"
        }`}
      >
        {isAnalyzing ? `Analyzing${dots}` : "Analyze"}
      </button>
    </form>
  );
}
