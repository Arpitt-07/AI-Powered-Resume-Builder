"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90 shadow-sm",
    secondary: "bg-secondary text-white hover:opacity-90 shadow-sm",
    ghost: "bg-transparent text-foreground hover:bg-surface",
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`
        relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200
        active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : null}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
}
