import { ClubDetail } from '@/types/club';
import { Calendar, MapPin, CalendarDays } from 'lucide-react';

interface ScheduleSectionProps {
  club: ClubDetail;
}

export default function ScheduleSection({ club }: ScheduleSectionProps) {
  const { schedule } = club;

  return (
    <section className="glass-card p-6 scroll-mt-24" id="schedule">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-accent" />
        活動頻度/場所
      </h2>
      
      <div className="space-y-6">
        {schedule.frequency && schedule.frequency !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              活動頻度
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {schedule.frequency}
            </p>
          </div>
        )}

        {schedule.location && schedule.location !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              活動場所
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {schedule.location}
            </p>
          </div>
        )}

        {schedule.annualPlan && schedule.annualPlan.length > 0 && schedule.annualPlan[0] !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
              年間予定
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {schedule.annualPlan.map((plan, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{plan}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!schedule.frequency && !schedule.location && (!schedule.annualPlan || schedule.annualPlan.length === 0) && (
          <div className="text-center py-8">
            <p className="text-slate-400 italic">活動頻度・場所情報は準備中です</p>
          </div>
        )}
      </div>
    </section>
  );
}
