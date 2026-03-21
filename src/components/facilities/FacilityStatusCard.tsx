'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CONST_SCHEDULE_DATA } from '@/lib/schedules';
import { getFacilityStatus } from '@/lib/schedule-utils';

export type Facility = {
  id: string;
  name: string;
  type: string;
  note: string;
  icon: string;
  accuracy: 'high' | 'medium' | 'low';
};

const getAccuracyLabel = (accuracy: string) => {
  switch (accuracy) {
    case 'high': return '高';
    case 'medium': return '中';
    case 'low': return '低';
    default: return '';
  }
};

export default function FacilityStatusCard({ facility, index }: { facility: Facility; index: number }) {
  const [status, setStatus] = useState<{isOpen: boolean; hours: {start: string; end: string}[]; note?: string}>({
    isOpen: true,
    hours: [],
    note: ''
  });
  
  useEffect(() => {
    // Get real-time status from schedule system
    const scheduleData = CONST_SCHEDULE_DATA[facility.id as keyof typeof CONST_SCHEDULE_DATA];
    if (scheduleData) {
      const currentStatus = getFacilityStatus(new Date(), scheduleData);
      setStatus(currentStatus);
    }
  }, [facility.id]);

  const isOpen = status.isOpen;

  // Type label mapping based on original mock
  const getTypeLabel = (type: string) => {
    if (type === 'study') return 'Study Facility';
    if (type === 'food') return 'Cafeteria';
    if (type === 'store') return 'Store';
    if (type === 'administration') return 'Administration';
    if (type === 'service') return 'Service';
    if (type === 'extracurricular') return 'Extracurricular';
    return 'Facility';
  };

  const getHoursLabel = (type: string) => {
    if (type === 'food' || type === 'store') return '営業時間';
    if (type === 'administration' || type === 'service') return '受付時間';
    if (type === 'extracurricular') return '利用時間';
    return '開館時間';
  };

  return (
    <div 
      className={cn(
        "group rounded-2xl p-6 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col",
        isOpen 
          ? "bg-surface-container-lowest hover:shadow-xl hover:shadow-primary/5 border border-surface-container-high/50" 
          : "bg-surface-container-low/50 border border-surface-container-high hover:border-surface-variant opacity-80 hover:opacity-100"
      )}
    >
      <div className="absolute top-0 right-0 p-3">
        <span className={cn(
          "px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase",
          isOpen ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container"
        )}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          isOpen ? "bg-secondary-container text-primary" : "bg-surface-container-highest text-on-surface-variant"
        )}>
          <span className="material-symbols-outlined text-3xl" data-icon={facility.icon}>{facility.icon}</span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-on-surface">{facility.name}</h3>
          <p className="text-xs text-on-surface-variant">{getTypeLabel(facility.type)}</p>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span> {getHoursLabel(facility.type)}
          </span>
          <span className={cn("font-semibold", isOpen ? "text-on-surface" : "text-on-surface-variant")}>
            {status.hours.length > 0 
              ? status.hours.map(h => `${h.start} - ${h.end}`).join(', ')
              : '営業時間外'
            }
          </span>
        </div>

        {isOpen ? (
          <div className="pt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-on-surface-variant">情報の精度</span>
              <span className="text-xs font-bold text-primary">{getAccuracyLabel(facility.accuracy)}</span>
            </div>
            <div className="flex gap-1">
              <div className={cn("h-1.5 flex-1 rounded-full", facility.accuracy === 'high' || facility.accuracy === 'medium' || facility.accuracy === 'low' ? "bg-[#61a0e8]" : "bg-surface-container-high")}></div>
              <div className={cn("h-1.5 flex-1 rounded-full", facility.accuracy === 'high' || facility.accuracy === 'medium' ? "bg-[#61a0e8]" : "bg-surface-container-high")}></div>
              <div className={cn("h-1.5 flex-1 rounded-full", facility.accuracy === 'high' ? "bg-[#61a0e8]" : "bg-surface-container-high")}></div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-high/50 p-3 rounded-xl text-xs text-on-surface-variant leading-relaxed">
            {status.note || facility.note || '本日は利用できません。'}
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-surface-container-high flex justify-between items-center">
        <span className={cn("text-xs", (status.note && status.note.includes('混雑')) ? "text-error font-medium" : "text-on-surface-variant")}>
          {status.note || facility.note || '詳細を見る'}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
      </div>
    </div>
  );
}
