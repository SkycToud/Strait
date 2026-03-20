'use client';
import { Building2, Store, Utensils, Clock, AlertCircle, Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';
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

const getIcon = (type: string) => {
  switch (type) {
    case 'food': return <Utensils className="w-5 h-5" />;
    case 'store': return <Store className="w-5 h-5" />;
    default: return <Building2 className="w-5 h-5" />;
  }
};

const getAccuracyIcon = (accuracy: string) => {
  switch (accuracy) {
    case 'high': return <SignalHigh className="w-4 h-4 text-green-500" />;
    case 'medium': return <SignalMedium className="w-4 h-4 text-yellow-500" />;
    case 'low': return <SignalLow className="w-4 h-4 text-red-500" />;
    default: return null;
  }
};

const getAccuracyLabel = (accuracy: string) => {
  switch (accuracy) {
    case 'high': return '高精度';
    case 'medium': return '中精度';
    case 'low': return '低精度';
    default: return '';
  }
};

export default function FacilityStatusCard({ facility, index }: { facility: Facility; index: number }) {
  const [status, setStatus] = useState<{isOpen: boolean; hours: {start: string; end: string}[]; note?: string}>({
    isOpen: false,
    hours: [],
    note: '営業時間外'
  });
  
  useEffect(() => {
    // Get real-time status from schedule system
    const scheduleData = CONST_SCHEDULE_DATA[facility.id as keyof typeof CONST_SCHEDULE_DATA];
    if (scheduleData) {
      const currentStatus = getFacilityStatus(new Date(), scheduleData);
      setStatus(currentStatus);
    }
  }, [facility.id]);

  return (
    <div 
      className="glass-card p-5 flex flex-col justify-between animate-slide-up relative overflow-hidden group"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110", status.isOpen ? "bg-green-500" : "bg-red-500")} />
      
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              {getIcon(facility.type)}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg leading-tight">{facility.name}</h3>
              <div className="relative group">
                {getAccuracyIcon(facility.accuracy)}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {getAccuracyLabel(facility.accuracy)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 opacity-70" />
            <span>
              {status.hours.length > 0 
                ? status.hours.map(h => `${h.start} - ${h.end}`).join(', ')
                : '営業時間外'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {status.isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={cn("relative inline-flex rounded-full h-3 w-3", status.isOpen ? "bg-green-500" : "bg-red-500")}></span>
          </span>
          <span className={cn("font-bold text-sm", status.isOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {status.isOpen ? '営業中' : '営業時間外'}
          </span>
        </div>
        <button className="text-xs font-bold text-accent hover:underline opacity-0 group-hover:opacity-100 transition-opacity">詳細を見る</button>
      </div>
    </div>
  );
}
