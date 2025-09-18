"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface Finding {
  line: number;
  issue: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  fix: string;
}

interface CodeEditorProps {
  setFindings: React.Dispatch<React.SetStateAction<Finding[]>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
}

export default function CodeEditor({ setFindings, setSummary }: CodeEditorProps) {
  const [code, setCode] = useState("//Don't refresh unless you want to lose all your code");

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setFindings(data.analysis.findings || []);
      setSummary(data.analysis.summary || "");
    } catch (err) {
      console.error("❌ Error analyzing code:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[500px] border border-gray-700 rounded-lg shadow-md overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || "")}
        />
      </div>
      <button
        onClick={handleAnalyze}
        className="bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-80 cursor-pointer transition self-start"
      >
        Analyze Code
      </button>
    </div>
  );
}


// "use client";

// import Editor from "@monaco-editor/react";

// export default function CodeEditor({ code, setCode }: { code: string; setCode: (val: string) => void }) {
//   console.log("Rendering CodeEditor with code:", code);
//   return (
//     <div className="h-[500px] border border-gray-700 rounded-lg shadow-md overflow-hidden">
//       <Editor
//         height="100%"
//         defaultLanguage="javascript"
//         theme="vs-dark"
//         value={code}
//         onChange={(val) => setCode(val || "")}
//       />
//     </div>
//   );
// }
