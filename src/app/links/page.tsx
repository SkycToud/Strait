import LinkCard from '@/components/links/LinkCard';
import linksData from '@/data/links.json';

export default function LinksPage() {
  return (
    <section className="max-w-7xl mx-auto">
      <div className="mb-10 text-center md:text-left animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">関連リンク集</h1>
        <div className="flex items-center justify-center md:justify-start gap-3">
          <span className="text-sm font-medium text-on-surface-variant uppercase tracking-widest bg-secondary-container px-3 py-1 rounded-full">Relevant Links</span>
          <div className="h-px flex-1 max-w-[200px] md:max-w-none bg-outline-variant opacity-20"></div>
        </div>
        <p className="mt-4 text-on-surface-variant max-w-2xl leading-relaxed mx-auto md:mx-0">
          本学の公式リソースおよび、学生生活をサポートする主要な外部システムへのアクセスポイントです。
          必要なツールを素早く見つけ、学修効率を最大化しましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {linksData.map((link, index) => (
          <LinkCard key={link.id} item={link} index={index} />
        ))}
      </div>
    </section>
  );
}
