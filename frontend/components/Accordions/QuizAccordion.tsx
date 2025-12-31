"use client";

import { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const quizTypes = ["MCQs", "True / False", "Short answers", "Long-form questions"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function QuizAccordion({
  onChange,
}: {
  onChange?: (quiz: { difficulty: string; types: string[] }) => void;
}) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("Medium");

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  useEffect(() => {
    onChange?.({ difficulty, types: selectedTypes });
  }, [selectedTypes, difficulty]);

  return (
    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mt-6">
      <AccordionItem value="quiz">
        <AccordionTrigger>Quiz Generation</AccordionTrigger>
        <AccordionContent className="flex flex-col space-y-3 mt-2">
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-zinc-300">Select difficulty:</span>
            <select
              className="bg-black text-white border border-zinc-700 rounded px-2 py-1"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              {difficulties.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {quizTypes.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              />
              <span className="text-sm text-zinc-300">{type}</span>
            </label>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
