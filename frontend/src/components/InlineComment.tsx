"use client";

export default function InlineComment({ line, message }: { line: number; message: string }) {
  return (
    <div className="pl-4 border-l-2 border-red-500 my-2">
      <p className="text-sm text-red-400">
        ⚠️ Line {line}: {message}
      </p>
    </div>
  );
}
