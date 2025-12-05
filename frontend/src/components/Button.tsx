import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseStyles = "font-bold transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95";
  
  const variants = {
    primary: "bg-accent-primary text-black hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] rounded-full",
    secondary: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-full",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], sizes[size], className)} 
      {...props} 
    />
  );
}
