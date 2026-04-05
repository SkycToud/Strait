import { ClubDetail } from '@/types/club';
import { Heart, AlertTriangle, UserPlus, Calendar, DollarSign, Filter, Target, MessageCircle } from 'lucide-react';

interface RecruitmentSectionProps {
  club: ClubDetail;
}

export default function RecruitmentSection({ club }: RecruitmentSectionProps) {
  const { recruitment } = club;

  return (
    <section className="glass-card p-6 scroll-mt-24" id="recruitment">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-accent" />
        入会までの流れ・必要事項
      </h2>
      
      <div className="space-y-8">
        {/* 魅力 */}
        {recruitment.appeal && recruitment.appeal !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              魅力
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
              {recruitment.appeal}
            </p>
          </div>
        )}

        {/* 大変なところ */}
        {recruitment.challenges && recruitment.challenges !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              大変なところ
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              {recruitment.challenges}
            </p>
          </div>
        )}

        {/* 新歓情報 */}
        {recruitment.welcomeEvents && recruitment.welcomeEvents !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              新歓情報
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {recruitment.welcomeEvents}
            </p>
          </div>
        )}

        {/* 年会費 */}
        {recruitment.annualFee && recruitment.annualFee !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              年会費
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg font-medium">
              {recruitment.annualFee}
            </p>
          </div>
        )}

        {/* 選考あり/選考なし */}
        {typeof recruitment.hasSelection === 'boolean' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-500" />
              選考
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300">
                {recruitment.hasSelection ? '選考あり' : '選考なし'}
              </p>
            </div>
          </div>
        )}

        {/* 募集対象 */}
        {recruitment.targetAudience && recruitment.targetAudience !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              募集対象
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {recruitment.targetAudience}
            </p>
          </div>
        )}

        {/* SNS情報 */}
        {(recruitment.contact.facebook || recruitment.contact.website || recruitment.contact.line) && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-500" />
              その他SNS情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recruitment.contact.facebook && (
                <a 
                  href={recruitment.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Facebook</p>
                </a>
              )}
              {recruitment.contact.website && (
                <a 
                  href={recruitment.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Website</p>
                </a>
              )}
              {recruitment.contact.line && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">LINE</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!recruitment.appeal && !recruitment.challenges && 
         !recruitment.welcomeEvents && !recruitment.annualFee && typeof recruitment.hasSelection !== 'boolean' &&
         !recruitment.targetAudience && !recruitment.contact.facebook && !recruitment.contact.website && !recruitment.contact.line && (
          <div className="text-center py-8">
            <p className="text-slate-400 italic">入会情報は準備中です</p>
          </div>
        )}
      </div>
    </section>
  );
}
