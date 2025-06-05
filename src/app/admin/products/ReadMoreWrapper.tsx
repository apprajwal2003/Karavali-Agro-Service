"use client";
import { Dispatch, SetStateAction } from "react";

export default function ReadMoreWrapper({
  text,
  expand,
  setExpand,
}: {
  text: string;
  expand: boolean;
  setExpand: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="px-2">
      <strong>Description:</strong>
      {!expand ? (
        <p className="line-clamp-2 text-gray-200">{text}</p>
      ) : (
        <div className="max-h-[180px] overflow-y-auto text-gray-200 border border-gray-600 rounded p-2 mt-1 whitespace-pre-wrap">
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
