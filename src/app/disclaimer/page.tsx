import PageHeader from '@/components/layout/PageHeader';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <section className="max-w-3xl mx-auto">
      <PageHeader
        title="免責事項"
        subtitle="Disclaimer"
      />

      <div className="space-y-8">
        {/* 非公式サイトの明示 */}
        <div className="p-6 bg-tertiary-container/30 rounded-2xl border border-tertiary/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-tertiary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-2">非公式サイトについて</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                本サイト「Strait」は、東京外国語大学の学生有志が運営する<strong>非公式</strong>の情報プラットフォームです。
                東京外国語大学が公式に運営・管理するものではありません。
              </p>
            </div>
          </div>
        </div>

        {/* 情報の正確性 */}
        <div className="p-6 bg-surface-container-low rounded-2xl">
          <h2 className="text-lg font-bold text-on-surface mb-4">情報の正確性について</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
              <span>本サイトに掲載されている情報は、正確性・最新性を保証するものではありません。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
              <span>掲載情報は予告なく変更される場合があります。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
              <span>重要な情報については、必ず大学の公式サイトや窓口でご確認ください。</span>
            </li>
          </ul>
        </div>

        {/* 免責 */}
        <div className="p-6 bg-surface-container-low rounded-2xl">
          <h2 className="text-lg font-bold text-on-surface mb-4">免責</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            本サイトの利用により生じた損害について、運営者は一切の責任を負いません。
            本サイトの情報を利用する際は、ご自身の責任において行ってください。
          </p>
        </div>

        {/* 公式サイトへの案内 */}
        <div className="p-6 bg-primary-container/30 rounded-2xl">
          <h2 className="text-lg font-bold text-on-surface mb-4">公式情報の確認</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            最新かつ正確な情報は、以下の公式サイトでご確認ください。
          </p>
          <a
            href="https://www.tufs.ac.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            東京外国語大学 公式サイト
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
