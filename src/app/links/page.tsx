import LinkCard from '@/components/links/LinkCard';
import linksData from '@/data/links.json';
import PageHeader from '@/components/layout/PageHeader';
import PageViewTracker from '@/components/links/PageViewTracker';

export default function LinksPage() {
  return (
    <section className="max-w-7xl mx-auto">
      <PageViewTracker pageName="Links" />
      <PageHeader
        title="関連リンク集"
        subtitle="Relevant Links"
        description="本学の公式リソースおよび、学生生活をサポートする主要な外部システムへのアクセスポイントです。必要なツールを素早く見つけ、学修効率を最大化しましょう。"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {linksData.map((link, index) => (
          <LinkCard key={link.id} item={link} index={index} />
        ))}
      </div>
    </section>
  );
}
