"use client";

interface Finding {
  severity: "Critical" | "High" | "Medium" | "Low";
  issue: string;
  fix: string;
  line: number;
}

interface SummaryCardProps {
  findings: Finding[];
  summary: string;
}


export default function SummaryCard({ findings, summary }: SummaryCardProps) {
  return (
    <div className="bg-background border border-gray-700 rounded-lg p-6 shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Summary of Findings</h2>
      <p className="mb-8">{summary}</p>
      {findings.length === 0 && (
        <p className="text-gray-500 text-sm">No issues detected.</p>
      )}
      {findings.map((f, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-lg border ${
            f.severity === "Critical"
              ? "border-red-600 bg-red-900/20"
              : f.severity === "High"
              ? "border-orange-600 bg-orange-900/20"
              : f.severity === "Medium"
              ? "border-yellow-600 bg-yellow-900/20"
              : "border-green-600 bg-green-900/20"
          }`}
        >
          <p className="font-semibold">{f.severity}: {f.issue}</p>
          <p className="text-sm text-gray-400">{f.fix}</p>
        </div>
      ))}
    </div>
  );
}
