"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }: { code: string; setCode: (val: string) => void }) {
  return (
    <div className="h-[500px] border border-gray-700 rounded-lg shadow-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val || "")}
      />
    </div>
  );
}
