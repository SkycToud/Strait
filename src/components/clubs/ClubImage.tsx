'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className ?? ''}`}
      onError={() => setHasError(true)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}
