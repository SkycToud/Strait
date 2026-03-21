import { ClubDetail } from '@/types/club';
import { Users, GraduationCap, School } from 'lucide-react';

interface MembershipSectionProps {
  club: ClubDetail;
}

export default function MembershipSection({ club }: MembershipSectionProps) {
  const { membership } = club;

  return (
    <section className="glass-card p-6 scroll-mt-24" id="membership">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-accent" />
        メンバー構成
      </h2>
      
      <div className="space-y-6">
        {membership.memberCount && membership.memberCount > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              人数
            </h3>
            <div className="bg-accent/10 text-accent p-4 rounded-lg inline-block">
              <p className="text-2xl font-bold">{membership.memberCount}名</p>
            </div>
          </div>
        )}

        {membership.yearDistribution && membership.yearDistribution.length > 0 && membership.yearDistribution[0] !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              学年構成
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {membership.yearDistribution.map((year, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {typeof membership.isIntraUniversity === 'boolean' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <School className="w-5 h-5 text-green-500" />
              属性
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300">
                {membership.isIntraUniversity ? 'インカレ' : '学内サークル'}
              </p>
            </div>
          </div>
        )}

        {!membership.memberCount && !membership.yearDistribution && typeof membership.isIntraUniversity !== 'boolean' && (
          <div className="text-center py-8">
            <p className="text-slate-400 italic">メンバー構成情報は準備中です</p>
          </div>
        )}
      </div>
    </section>
  );
}
