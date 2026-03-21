import { ClubDetail } from '@/types/club';
import { Lightbulb, Target, Activity } from 'lucide-react';

interface OverviewSectionProps {
  club: ClubDetail;
}

export default function OverviewSection({ club }: OverviewSectionProps) {
  const { overview } = club;

  return (
    <section className="glass-card p-6 scroll-mt-24" id="overview">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-accent" />
        概要
      </h2>
      
      <div className="space-y-6">
        {overview.philosophy && overview.philosophy !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              理念/指針
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {overview.philosophy}
            </p>
          </div>
        )}

        {overview.guidelines && overview.guidelines !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              活動内容
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {overview.guidelines}
            </p>
          </div>
        )}

        {overview.activities && overview.activities !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              詳細な活動内容
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {overview.activities}
            </p>
          </div>
        )}

        {!overview.philosophy && !overview.guidelines && !overview.activities && (
          <div className="text-center py-8">
            <p className="text-slate-400 italic">概要情報は準備中です</p>
          </div>
        )}
      </div>
    </section>
  );
}
