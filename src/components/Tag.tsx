import React from 'react';

interface TagProps {
  variant?: 'vaccinated' | 'unvaccinated' | 'default';
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ variant = 'default', children, className = '' }: TagProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200';
  
  const variantStyles = {
    vaccinated: 'bg-forest text-white',
    unvaccinated: 'bg-gray-400 text-white',
    default: 'bg-cream-dark text-forest',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
