import PageHeader from '@/components/layout/PageHeader';
import { Shield, BarChart3, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl mx-auto">
      <PageHeader
        title="プライバシーポリシー"
        subtitle="Privacy Policy"
      />

      <div className="space-y-8">
        {/* 概要 */}
        <div className="p-6 bg-surface-container-low rounded-2xl">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-2">はじめに</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                本サイト「Strait」（以下「当サイト」）では、サービス改善のためにアクセス解析を行っています。
                本ポリシーでは、当サイトにおける情報の取り扱いについて説明します。
              </p>
            </div>
          </div>
        </div>

        {/* アクセス解析 */}
        <div className="p-6 bg-surface-container-low rounded-2xl">
          <div className="flex items-start gap-4">
            <BarChart3 className="w-6 h-6 text-tertiary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-4">アクセス解析について</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                当サイトでは、サービスの利用状況を把握し改善するために、アクセス解析ツールを使用しています。
              </p>
              <h3 className="text-sm font-bold text-on-surface mb-2">収集する情報</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></span>
                  <span>ページの閲覧情報（どのページが閲覧されたか）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></span>
                  <span>アクセス元の地域（国・都道府県レベル）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></span>
                  <span>使用デバイス・ブラウザの種類</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></span>
                  <span>サイト内での行動（クリック、スクロールなど）</span>
                </li>
              </ul>
              <p className="text-sm text-on-surface-variant mt-4">
                これらの情報は統計的なデータとして集計され、個人を特定するものではありません。
              </p>
            </div>
          </div>
        </div>

        {/* Cookie */}
        <div className="p-6 bg-surface-container-low rounded-2xl">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-4">Cookieについて</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                当サイトでは、アクセス解析のためにCookieを使用する場合があります。
                Cookieはブラウザの設定により無効にすることができますが、一部の機能が正常に動作しなくなる可能性があります。
              </p>
            </div>
          </div>
        </div>

        {/* 第三者への提供 */}
        <div className="p-6 bg-surface-container-low rounded-2xl">
          <h2 className="text-lg font-bold text-on-surface mb-4">第三者への情報提供</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            当サイトで収集した情報は、法令に基づく場合を除き、第三者に提供することはありません。
          </p>
        </div>

        {/* お問い合わせ */}
        <div className="p-6 bg-primary-container/30 rounded-2xl">
          <h2 className="text-lg font-bold text-on-surface mb-4">お問い合わせ</h2>
          <p className="text-sm text-on-surface-variant">
            本ポリシーに関するお問い合わせは、サイト下部のContactフォームよりお願いいたします。
          </p>
        </div>

        {/* 改定 */}
        <div className="text-xs text-on-surface-variant text-center pt-4">
          最終更新: 2026年3月
        </div>
      </div>
    </section>
  );
}
