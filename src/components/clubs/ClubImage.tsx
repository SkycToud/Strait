'use client';

import { useState } from 'react';

interface ClubImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function ClubImage({ src, alt, className }: ClubImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-on-surface-variant ${className}`}>
        <span className="material-symbols-outlined text-4xl">image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
