"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UploadBox, { DataSourceInfo } from "@/components/UploadBox";
import ServiceSelector from "@/components/ServiceSelector";
import { Button } from "@/components/ui/button";
import { SelectedServices } from "@/types/services";

type JobStatus = "IDLE" | "UPLOADING" | "PROCESSING" | "ERROR";

export default function Page() {
  const router = useRouter();

  const [dataSource, setDataSource] = useState<DataSourceInfo | null>(null);

  const [services, setServices] = useState<SelectedServices>({
    summary: [],
    quiz: { difficulty: "Medium", types: [] },
  });

  const [jobStatus, setJobStatus] = useState<JobStatus>("IDLE");
  const [statusMessage, setStatusMessage] = useState("");

  const isSubmittingRef = useRef(false);

  const hasSelectedService =
    services.summary.length > 0 || services.quiz.types.length > 0;

  // -------------------------
  // POLL JOB STATUS
  // -------------------------
  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/status/${jobId}`
        );
        const data = await res.json();

        if (data.status === "COMPLETED") {
          clearInterval(interval);
          isSubmittingRef.current = false;
          router.push(`/results/${jobId}`);
        }

        if (data.status === "ERROR") {
          clearInterval(interval);
          setJobStatus("ERROR");
          isSubmittingRef.current = false;
        }
      } catch {
        clearInterval(interval);
        setJobStatus("ERROR");
        isSubmittingRef.current = false;
      }
    }, 2000);
  };

  // -------------------------
  // GENERATE
  // -------------------------
  const handleGenerate = async () => {
    if (isSubmittingRef.current) return;
    if (!dataSource || !hasSelectedService) return;

    try {
      isSubmittingRef.current = true;

      /* ================================
         FILE UPLOAD
      ================================= */
      if (dataSource.type === "File Upload" && dataSource.file) {
        setJobStatus("UPLOADING");
        setStatusMessage("Preparing upload...");

        const presignRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload/presign`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: dataSource.file.name,
              contentType: dataSource.file.type,
            }),
          }
        );

        const { success, uploadUrl, fileUrl } = await presignRes.json();
        if (!success) throw new Error("Presign failed");

        setStatusMessage("Uploading file...");
        await fetch(uploadUrl, {
          method: "PUT",
          body: dataSource.file,
          headers: { "Content-Type": dataSource.file.type },
        });

        setJobStatus("PROCESSING");
        setStatusMessage("Processing document...");

        const payload = {
          sourceType: "FILE",
          fileType: dataSource.file.type,
          fileUrl,
          services,
          query: "Generate content from this document",
        };

        const notifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload/data`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const { jobId } = await notifyRes.json();
        pollJobStatus(jobId);
        return;
      }

      /* ================================
         🔗 EXTERNAL LINK (WEBSITE / YOUTUBE ONLY)
      ================================= */
      if (dataSource.type === "External Link" && dataSource.url) {
        if (
          dataSource.detected !== "website" &&
          dataSource.detected !== "youtube"
        ) {
          alert("Only Website and YouTube links are supported");
          isSubmittingRef.current = false;
          return;
        }

        setJobStatus("PROCESSING");
        setStatusMessage("Processing link...");

        const payload = {
          sourceType: "LINK",
          linkType: dataSource.detected, // website | youtube
          url: dataSource.url,
          services,
          query: "Generate content from this link",
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload/data`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const { jobId } = await res.json();
        pollJobStatus(jobId);
      }
    } catch (err) {
      console.error("❌ Generate error:", err);
      setJobStatus("ERROR");
      isSubmittingRef.current = false;
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <main className="min-h-screen bg-black text-white py-20 space-y-8">
      <UploadBox onChange={setDataSource} />
      <ServiceSelector onServiceChange={setServices} />

      <div className="max-w-3xl mx-auto flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={
            !dataSource ||
            !hasSelectedService ||
            jobStatus === "UPLOADING" ||
            jobStatus === "PROCESSING"
          }
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold px-10 py-4 text-lg disabled:opacity-50"
        >
          {jobStatus === "UPLOADING"
            ? "Uploading..."
            : jobStatus === "PROCESSING"
            ? "Processing..."
            : "Generate"}
        </Button>
      </div>

      {jobStatus === "PROCESSING" && (
        <p className="text-center text-yellow-400">{statusMessage}</p>
      )}

      {jobStatus === "ERROR" && (
        <p className="text-center text-red-500">
          ❌ Something went wrong. Please try again.
        </p>
      )}
    </main>
  );
}
