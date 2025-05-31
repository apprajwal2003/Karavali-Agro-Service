"use client";
import { useState } from "react";

export default function ReadMoreWrapper({ text }: { text: string }) {
  const [expand, setExpand] = useState(false);

  return (
    <div className="px-2">
      <strong>Description:</strong>
      {!expand ? (
        <p className="line-clamp-2 text-gray-200">{text}</p>
      ) : (
        <div className="max-h-32 overflow-y-auto text-gray-200 border border-gray-600 rounded p-2 mt-1 whitespace-pre-wrap">
          {text}
        </div>
      )}
      <button
        onClick={() => setExpand(!expand)}
        className="mt-1 text-green-400 font-semibold hover:underline"
      >
        {expand ? "read less" : "read more..."}
      </button>
    </div>
  );
}
