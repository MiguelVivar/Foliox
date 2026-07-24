"use client";

import { useState } from "react";
import {
  README_TEMPLATES,
  applyTemplate,
  type ReadmeTemplate,
} from "@/lib/readmeTemplates";
import { useEditorStore } from "@/store/useEditorStore";

interface TemplateSelectorProps {
  onClose?: () => void;
}

export function TemplateLibrary({ onClose }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReadmeTemplate | null>(null);
  const addBlock = useEditorStore((state) => state.addBlock);

  const handleApplyTemplate = (template: ReadmeTemplate) => {
    const blocks = applyTemplate(template.id);
    blocks.forEach((block) => {
      addBlock(block);
    });

    // Close the dialog/modal if provided
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">README Templates</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose a template to quickly set up your README with pre-configured
          blocks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {README_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <h3 className="mb-2 text-lg font-semibold">{template.name}</h3>
            <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
              {template.description}
            </p>

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {template.blocks.length} blocks
              </p>
              <div className="mt-2 space-y-1">
                {template.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    <span className="inline-block rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
                      {block.kind}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleApplyTemplate(template)}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Apply Template
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <strong>Tip:</strong> Templates provide pre-filled blocks that you can
          customize further. Edit any block properties after applying a
          template.
        </p>
      </div>
    </div>
  );
}
