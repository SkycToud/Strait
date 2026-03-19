'use client';
import { Building2, Store, Utensils, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export type Facility = {
  id: string;
  name: string;
  type: string;
  hours: { weekdays: string; saturday: string; sunday: string; holidays: string };
  note: string;
  icon: string;
};

const getIcon = (type: string) => {
  switch (type) {
    case 'food': return <Utensils className="w-5 h-5" />;
    case 'store': return <Store className="w-5 h-5" />;
    default: return <Building2 className="w-5 h-5" />;
  }
};

export default function FacilityStatusCard({ facility, index }: { facility: Facility; index: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Real-time calculation logic disabled for dummy display, showing random Open/Closed state for UI demonstration
  useEffect(() => {
    // Just a dummy logic to show dynamic UI states
    setIsOpen(Math.random() > 0.5);
  }, []);

  return (
    <div 
      className="glass-card p-5 flex flex-col justify-between animate-slide-up relative overflow-hidden group"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110", isOpen ? "bg-green-500" : "bg-red-500")} />
      
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              {getIcon(facility.type)}
            </div>
            <h3 className="font-bold text-lg leading-tight">{facility.name}</h3>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 opacity-70" />
            <span>平日: {facility.hours.weekdays}</span>
          </div>
          {facility.note && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <AlertCircle className="w-4 h-4 text-orange-400 opacity-70" />
              <span>{facility.note}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={cn("relative inline-flex rounded-full h-3 w-3", isOpen ? "bg-green-500" : "bg-red-500")}></span>
          </span>
          <span className={cn("font-bold text-sm", isOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {isOpen ? '営業中' : '営業時間外'}
          </span>
        </div>
        <button className="text-xs font-bold text-accent hover:underline opacity-0 group-hover:opacity-100 transition-opacity">詳細を見る</button>
      </div>
    </div>
  );
}
