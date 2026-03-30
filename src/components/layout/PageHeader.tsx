import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  description?: string;
  actionButton?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, description, actionButton }: Props) {
  return (
    <div className="mb-6 md:mb-10 text-left">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-1 md:mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs md:text-sm font-semibold text-primary uppercase tracking-widest mb-2 md:mb-3">
          {subtitle}
        </p>
      )}
      {description && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>
          {actionButton && (
            <div className="flex-shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
