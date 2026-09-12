"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
}

export default function Input({ name, label, error, ...props }: InputProps) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-2 w-full group">
      <label htmlFor={name} className="text-[10px] uppercase tracking-widest text-muted font-medium">
        {label}
      </label>
      <input
        {...register(name)}
        {...props}
        id={name}
        className={clsx(
          "px-4 py-3 rounded-mono outline-none transition-all duration-300",
          "bg-transparent border border-transparent text-foreground",
          "focus:border-white/20 focus:bg-white/[0.02] focus:scale-[1.01] focus:ring-0",
          error ? "border-accent-red-text" : "border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
      {error && <span className="text-[10px] text-accent-red-text font-medium">{error}</span>}
    </div>
  );
}
