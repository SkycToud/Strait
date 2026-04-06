import LinkCard from '@/components/links/LinkCard';
import linksData from '@/data/links.json';
import PageHeader from '@/components/layout/PageHeader';

export default function LinksPage() {
  return (
    <section className="max-w-7xl mx-auto">
      <PageHeader
        title="関連リンク集"
        subtitle="Relevant Links"
        description="東京外国語大学の公式リソースおよび、主要な外部システムへのアクセスポイントです。"
      />

      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
        {linksData.map((link, index) => (
          <LinkCard key={link.id} item={link} index={index} />
        ))}
      </div>
    </section>
  );
}
