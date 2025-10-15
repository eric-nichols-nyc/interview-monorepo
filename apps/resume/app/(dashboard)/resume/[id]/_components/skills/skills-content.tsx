"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";

export function SkillsContent() {
  const [category, setCategory] = useState("Frontend Development");
  const [skills, setSkills] = useState(
    "HTML, CSS, Tailwind, Javascript, TypeScript, React, React hooks, Redux, Zustand, Next.js"
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSkillSets, setSelectedSkillSets] = useState<string[]>([]);

  const skillSets = [
    { id: "frontend", label: "Frontend Skills" },
    { id: "backend", label: "Backend Skills" },
    { id: "database", label: "Database Skills" },
    { id: "devops", label: "DevOps Skills" },
  ];

  const toggleSkillSet = (skillSetId: string) => {
    setSelectedSkillSets((prev) =>
      prev.includes(skillSetId)
        ? prev.filter((id) => id !== skillSetId)
        : [...prev, skillSetId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Top Actions */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <Button className="bg-rose-600 hover:bg-rose-700">
            Add New Skill
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                variant="outline"
              >
                Import from Profile
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">
                  Select skill sets to import
                </h3>
                <div className="space-y-3">
                  {skillSets.map((skillSet) => (
                    <div
                      className="flex items-center space-x-2"
                      key={skillSet.id}
                    >
                      <Checkbox
                        checked={selectedSkillSets.includes(skillSet.id)}
                        id={skillSet.id}
                        onCheckedChange={() => toggleSkillSet(skillSet.id)}
                      />
                      <label
                        className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor={skillSet.id}
                      >
                        {skillSet.label}
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  disabled={selectedSkillSets.length === 0}
                >
                  Import
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <h1 className="font-semibold text-rose-900 text-xl">
              Frontend Development
            </h1>
            <div className="flex items-center gap-2">
              <Button
                className="h-8 w-8 text-rose-700 hover:bg-rose-100 hover:text-rose-900"
                onClick={() => setIsExpanded(!isExpanded)}
                size="icon"
                variant="ghost"
              >
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${isExpanded ? "" : "rotate-180"}`}
                />
              </Button>
              <Button
                className="h-8 w-8 text-rose-700 hover:bg-rose-100 hover:text-rose-900"
                size="icon"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form Content */}
          {isExpanded && (
            <div className="space-y-6">
              {/* Category Field */}
              <div className="space-y-2">
                <Label
                  className="font-medium text-rose-700 text-xs uppercase tracking-wide"
                  htmlFor="category"
                >
                  Category
                </Label>
                <Input
                  className="border-rose-200 bg-white text-base hover:bg-rose-50"
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category name"
                  value={category}
                />
              </div>

              {/* Skills Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="font-medium text-rose-900 text-sm"
                    htmlFor="skills"
                  >
                    Skills
                  </Label>
                  <span className="text-rose-600 text-xs">
                    Separate with commas
                  </span>
                </div>
                <Input
                  className="border-rose-200 bg-white text-base hover:bg-rose-50 focus-visible:ring-rose-300"
                  id="skills"
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter skills separated by commas"
                  value={skills}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
