"use client";

import { useState, DragEvent, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

export type DataSourceInfo = {
  type: "File Upload" | "External Link";
  name?: string;
  format?: string;
  size?: string;
  source?: string;
  url?: string;
  detected?: "website" | "youtube";
  file?: File;
};

export default function UploadBox({
  onChange,
}: {
  onChange?: (dataSource: DataSourceInfo | null) => void;
}) {
  const [mode, setMode] = useState<"file" | "link">("file");
  const [dataSource, setDataSource] = useState<DataSourceInfo | null>(null);
  const [linkInput, setLinkInput] = useState("");

  // -------------------------
  // FILE HANDLING
  // -------------------------
  const handleFile = (file: File) => {
    const ds: DataSourceInfo = {
      type: "File Upload",
      name: file.name,
      format: file.type || "Unknown",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      source: "Local Device",
      file,
    };
    setDataSource(ds);
    onChange?.(ds);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // -------------------------
  // LINK HANDLING (STRICT)
  // -------------------------
  const processLink = () => {
    const url = linkInput.trim();
    if (!url) return;

    let detected: "website" | "youtube" | null = null;

    // ✅ YouTube only
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url)) {
      detected = "youtube";
    }

    // ✅ Website only
    else if (url.startsWith("http://") || url.startsWith("https://")) {
      detected = "website";
    }

    // ❌ Everything else blocked
    if (!detected) {
      alert("❌ Only Website and YouTube links are supported");
      return;
    }

    const ds: DataSourceInfo = {
      type: "External Link",
      url,
      detected,
      source: "Public Internet",
    };

    setDataSource(ds);
    onChange?.(ds);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* MODE SELECTOR */}
      <div className="flex justify-center mb-4 gap-2">
        <button
          onClick={() => {
            setMode("file");
            setDataSource(null);
            setLinkInput("");
            onChange?.(null);
          }}
          className={`px-6 py-2 rounded-full border ${
            mode === "file"
              ? "bg-white text-black"
              : "border-slate-600 text-slate-400"
          }`}
        >
          Select File
        </button>

        <button
          onClick={() => {
            setMode("link");
            setDataSource(null);
            onChange?.(null);
          }}
          className={`px-6 py-2 rounded-full border ${
            mode === "link"
              ? "bg-white text-black"
              : "border-slate-600 text-slate-400"
          }`}
        >
          Paste Link
        </button>
      </div>

      {/* MAIN BOX */}
      <div
        className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center bg-slate-900/40"
        onDrop={mode === "file" ? onDrop : undefined}
        onDragOver={(e) => e.preventDefault()}
      >
        {mode === "file" && (
          <>
            <p className="text-xl font-semibold mb-2">
              Drag & drop your file here
            </p>
            <p className="text-slate-400 mb-6">
              PDF, DOCX, Video supported
            </p>
            <label className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold cursor-pointer">
              Select from device
              <input type="file" hidden onChange={onFileSelect} />
            </label>
          </>
        )}

        {mode === "link" && (
          <>
            <p className="text-xl font-semibold mb-4">
              Paste a website or YouTube link
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") processLink();
                }}
                placeholder="https://example.com or https://youtube.com/..."
                className="w-full px-4 py-3 pr-20 rounded-lg bg-black border border-slate-600 outline-none"
              />
              <Button
                onClick={processLink}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black rounded-full px-4 py-2"
              >
                Proceed
              </Button>
            </div>
          </>
        )}
      </div>

      {/* DATA SOURCE INFO */}
      {dataSource && (
        <div className="mt-6 bg-slate-900 rounded-xl p-6 text-left">
          <h3 className="font-bold mb-3">Data Source</h3>
          <div className="space-y-1 text-sm text-slate-300">
            <p>
              <b>Type:</b> {dataSource.type}
            </p>
            {dataSource.url && (
              <p>
                <b>URL:</b> {dataSource.url}
              </p>
            )}
            {dataSource.detected && (
              <p>
                <b>Detected:</b> {dataSource.detected}
              </p>
            )}
            <p>
              <b>Source:</b> {dataSource.source}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
