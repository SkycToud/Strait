'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CONST_SCHEDULE_DATA } from '@/lib/schedules';
import { getFacilityStatus } from '@/lib/schedule-utils';

export type Facility = {
  id: string;
  name: string;
  type: string;
  note?: string;
  icon: string;
  accuracy: 'high' | 'medium' | 'low';
  link?: string;
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

  const Tag = facility.link ? 'a' : 'div';
  const tagProps = facility.link ? {
    href: facility.link,
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  return (
    <Tag 
      {...tagProps as any}
      className={cn(
        "group rounded-2xl p-4 md:p-6 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col",
        isOpen 
          ? "bg-surface-container-lowest hover:shadow-xl hover:shadow-primary/5 border border-surface-container-high/50" 
          : "bg-surface-container-low/50 border border-surface-container-high hover:border-surface-variant opacity-80 hover:opacity-100",
        facility.link ? "cursor-pointer" : ""
      )}
    >
      <div className="absolute top-0 right-0 p-2 md:p-3">
        <span className={cn(
          "px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold tracking-wide uppercase",
          isOpen ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container"
        )}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center",
          isOpen ? "bg-secondary-container text-primary" : "bg-surface-container-highest text-on-surface-variant"
        )}>
          <span className="material-symbols-outlined text-2xl md:text-3xl" data-icon={facility.icon}>{facility.icon}</span>
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg text-on-surface">{facility.name}</h3>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4 flex-grow">
        {(status.hours.length > 0 || isOpen) && (
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-on-surface-variant flex items-center gap-1 md:gap-2">
              <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span> {getHoursLabel(facility.type)}
            </span>
            <span className={cn("font-semibold", isOpen ? "text-on-surface" : "text-on-surface-variant")}>
              {status.hours.length > 0 
                ? status.hours.map(h => `${h.start} - ${h.end}`).join(', ')
                : ''
              }
            </span>
          </div>
        )}

        {!isOpen && (status.note && status.note !== '営業時間外' || facility.note && facility.note !== '営業時間外') && (
          <div className="bg-surface-container-high/50 p-3 rounded-xl text-xs text-on-surface-variant leading-relaxed mt-2">
            {status.note !== '営業時間外' ? status.note : (facility.note !== '営業時間外' ? facility.note : '')}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <div className="flex items-center gap-1.5 text-on-surface-variant/70">
          <span className="material-symbols-outlined text-sm" data-icon="info">info</span>
          <span className="text-xs">情報の精度: {getAccuracyLabel(facility.accuracy)}</span>
        </div>
      </div>

    </Tag>
  );
}
