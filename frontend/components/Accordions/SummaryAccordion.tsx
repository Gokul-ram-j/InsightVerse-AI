"use client";

import { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const summaryOptions = ["Short summary", "Key takeaways"];

export default function SummaryAccordion({
  onChange,
}: {
  onChange?: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelected(prev => {
      const updated = prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option];
      return updated;
    });
  };

  useEffect(() => {
    onChange?.(selected);
  }, [selected]);

  return (
    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mt-6">
      <AccordionItem value="summary">
        <AccordionTrigger>Smart Summary</AccordionTrigger>
        <AccordionContent className="flex flex-col space-y-2 mt-2">
          {summaryOptions.map(option => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={() => toggleOption(option)}
              />
              <span className="text-sm text-zinc-300">{option}</span>
            </label>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
