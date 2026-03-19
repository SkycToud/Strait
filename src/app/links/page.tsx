import LinkCard from '@/components/links/LinkCard';
import linksData from '@/data/links.json';

export default function LinksPage() {
  return (
    <div className="space-y-8">
      <header className="animate-fade-in p-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">関連リンク集</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl">大学の公式システムや、外部の有用なリソースへのリンクです。</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {linksData.map((link, index) => (
          <LinkCard key={link.id} item={link} index={index} />
        ))}
      </div>
    </div>
  );
}
