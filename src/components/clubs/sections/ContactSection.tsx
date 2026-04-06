import { ClubDetail } from '@/types/club';
import { Instagram, ExternalLink, Facebook, Globe, MessageCircle, Clock } from 'lucide-react';

interface ContactSectionProps {
  club: ClubDetail;
}

export default function ContactSection({ club }: ContactSectionProps) {
  const { recruitment, lastUpdated } = club;
  
  // recruitment.contact を優先し、なければトップレベルの値を使用
  const instagram = recruitment.contact.instagram || club.instagram;
  const xUrl = recruitment.contact.xUrl || club.xUrl;

  return (
    <section className="glass-card p-6 scroll-mt-24" id="contact">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-accent" />
        SNS情報・最終更新日
      </h2>
      
      <div className="space-y-6">
        {/* メインSNS */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
            公式SNS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instagram && (
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#E1306C]/10 hover:bg-[#E1306C]/20 transition-colors group"
              >
                <Instagram className="w-6 h-6 text-[#E1306C]" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white group-hover:text-[#E1306C] transition-colors">
                    Instagram
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    最新情報や活動様子を発信中
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            )}
            
            {xUrl && (
              <a 
                href={xUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
              >
                <span className="font-extrabold text-xl leading-none text-slate-800 dark:text-slate-200">𝕏</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    X (Twitter)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    お知らせやイベント情報を更新
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* その他連絡先 */}
        {(recruitment.contact.facebook || recruitment.contact.website || recruitment.contact.line) && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
              その他連絡先
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recruitment.contact.facebook && (
                <a 
                  href={recruitment.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                >
                  <Facebook className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      Facebook
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
              {recruitment.contact.website && (
                <a 
                  href={recruitment.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                >
                  <Globe className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-green-600 transition-colors">
                      Website
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
              {recruitment.contact.line && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      LINE
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 最終更新日 */}
        {lastUpdated && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>最終更新日: {new Date(lastUpdated).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        )}

        {!instagram && !xUrl && !recruitment.contact.facebook && !recruitment.contact.website && !recruitment.contact.line && (
          <div className="text-center py-8">
            <p className="text-slate-400 italic">SNS情報は準備中です</p>
          </div>
        )}
      </div>
    </section>
  );
}
