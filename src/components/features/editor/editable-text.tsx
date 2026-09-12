"use client";

import React, { useState, useEffect, useRef } from "react";
import { useResumeStore } from "@/store/resume-store";

interface EditableTextProps {
  value: string;
  path: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export default function EditableText({ value, path, placeholder = "", className = "", multiline = false }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { resumeData, setResumeData } = useResumeStore();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    commitChange();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const commitChange = () => {
    if (localValue === value) return;

    const newData = { ...resumeData };
    const paths = path.split('.');
    let current: any = newData;

    for (let i = 0; i < paths.length - 1; i++) {
      const key = paths[i];
      current[key] = { ...current[key] };
      current = current[key];
    }

    current[paths[paths.length - 1]] = localValue;
    setResumeData(newData);
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`block w-full p-1 border border-foreground bg-surface outline-none text-foreground ${className}`}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`block w-full p-1 border border-foreground bg-surface outline-none text-foreground ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-text hover:bg-gray-100 transition-colors rounded px-0.5 ${className}`}
    >
      {value || <span className="text-gray-400 italic">{placeholder || "Click to edit"}</span>}
    </span>
  );
}
