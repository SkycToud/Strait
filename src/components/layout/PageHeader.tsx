type Props = {
  title: string;
  subtitle?: string;
  description?: string;
};

export default function PageHeader({ title, subtitle, description }: Props) {
  return (
    <div className="mb-10 text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="text-on-surface-variant max-w-2xl leading-relaxed mx-auto md:mx-0">
          {description}
        </p>
      )}
    </div>
  );
}
