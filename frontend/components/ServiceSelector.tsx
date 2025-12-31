"use client";

import { useState } from "react";
import SummaryAccordion from "./Accordions/SummaryAccordion";
import QuizAccordion from "./Accordions/QuizAccordion";
import { SelectedServices } from "../types/services";

import {
  SUMMARY_MAP,
  QUIZ_TYPE_MAP,
} from "../utils/serviceMappings";
import InsightChat from "./InsightChat";

export default function ServiceSelector({
  onServiceChange,
}: {
  onServiceChange?: (services: SelectedServices) => void;
}) {
  const [rawServices, setRawServices] = useState({
    summary: [] as string[],
    concept: [] as string[],
    quiz: { difficulty: "Medium", types: [] as string[] },
    flashcards: false,
  });

  const normalizeServices = (services: typeof rawServices): SelectedServices => {
    return {
      summary: services.summary.map((s) => SUMMARY_MAP[s]),

      quiz: {
        difficulty: services.quiz.difficulty.toLowerCase(), // easy | medium | hard
        types: services.quiz.types.map((t) => QUIZ_TYPE_MAP[t]),
      },

    };
  };

  const updateService = (key: keyof typeof rawServices, value: any) => {
    const updatedRaw = { ...rawServices, [key]: value };
    setRawServices(updatedRaw);

    const normalized = normalizeServices(updatedRaw);
    onServiceChange?.(normalized);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-xl md:text-2xl font-semibold text-center text-white mb-4">
        Choose your AI services
      </h2>

      <div className="space-y-4">
        <SummaryAccordion onChange={(v) => updateService("summary", v)} />
        <QuizAccordion onChange={(v) => updateService("quiz", v)} />
      </div>
    </div>
  );
}
