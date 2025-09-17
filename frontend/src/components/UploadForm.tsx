"use client";

import { useState } from "react";

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

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
        className="file-input file-input-bordered w-full text-sm"
      />
      <button
        type="submit"
        className="bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-80 cursor-pointer transition"
      >
        Upload & Analyze
      </button>
    </form>
  );
}
