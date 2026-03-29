type Props = {
  title: string;
  subtitle?: string;
  description?: string;
};

export default function PageHeader({ title, subtitle, description }: Props) {
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
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
