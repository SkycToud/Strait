import { ClubDetail } from '@/types/club';
import { Users, Briefcase, Building } from 'lucide-react';

interface OperationsSectionProps {
  club: ClubDetail;
}

export default function OperationsSection({ club }: OperationsSectionProps) {
  const { operations } = club;

  return (
    <section className="glass-card p-6 scroll-mt-24" id="operations">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-accent" />
        活動実態
      </h2>
      
      <div className="space-y-6">
        {operations.executiveMembers && operations.executiveMembers.length > 0 && operations.executiveMembers[0] !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              執行部
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {operations.executiveMembers.map((member, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{member}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {operations.organization && operations.organization !== "準備中" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-500" />
              体制
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {operations.organization}
            </p>
          </div>
        )}

        {!operations.executiveMembers && !operations.organization && (
          <div className="text-center py-8">
            <p className="text-slate-400 italic">活動実態情報は準備中です</p>
          </div>
        )}
      </div>
    </section>
  );
}
