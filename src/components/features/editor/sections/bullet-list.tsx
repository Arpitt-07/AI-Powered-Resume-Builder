"use client";

import React, { useEffect, useRef } from "react";
import { useFieldArray, Control, Controller, FieldValues, Path, ArrayPath } from "react-hook-form";
import Button from "@/components/ui/button";
import clsx from "clsx";

interface BulletListProps<TFieldValues extends FieldValues> {
  name: ArrayPath<TFieldValues>;
  control: Control<TFieldValues>;
  onImprove: (value: string, index: number) => void;
}

export default function BulletList<TFieldValues extends FieldValues>({ name, control, onImprove }: BulletListProps<TFieldValues>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (fields.length > 0) {
      const lastInput = inputRefs.current[fields.length - 1];
      lastInput?.focus();
    }
  }, [fields.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      append({ text: "" } as any);
    } else if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      e.preventDefault();
      remove(index);
    }
  };

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2 group">
          <span className="mt-2 text-muted text-xs">•</span>
          <Controller
            control={control}
            name={`${name}.${index}.text` as Path<TFieldValues>}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <div className="flex-1 flex gap-2">
                <input
                  value={value || ""}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={(el) => {
                    ref(el);
                    inputRefs.current[index] = el;
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={clsx(
                    "flex-1 px-2 py-1 rounded-mono outline-none transition-all duration-300",
                    "bg-transparent border border-transparent text-foreground",
                    "focus:border-white/20 focus:bg-white/[0.02] focus:scale-[1.01] focus:ring-0"
                  )}
                  placeholder="Enter a key achievement..."
                  aria-label={`Bullet item ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onImprove(value || "", index)}
                >
                  ✨
                </Button>
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
}
