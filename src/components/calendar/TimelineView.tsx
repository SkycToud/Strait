import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';

export type CalendarEvent = {
  id: number;
  date: string;
  endDate?: string;
  title: string;
  type: string;
  description: string;
  isSemesterSchedule?: boolean;
};

export default function TimelineView({ events }: { events: CalendarEvent[] }) {
  const timingToDay = (timing: string): number => {
    switch (timing) {
      case '初旬': return 1;
      case '上旬': return 7;
      case '中旬': return 15;
      case '末頃': return 22;
      default: return 15; // デフォルトは中旬
    }
  };

  const getSortDate = (event: CalendarEvent): Date => {
    if (event.isSemesterSchedule) {
      const match = event.date.match(/(\d{4})-(\d{2})-(.+)/);
      if (match) {
        const [, year, month, timing] = match;
        return new Date(parseInt(year), parseInt(month) - 1, timingToDay(timing));
      }
    }
    
    // 通常の日付イベント
    return new Date(event.date);
  };

  const isCourseRegistrationEvent = (event: CalendarEvent): boolean => {
    return event.title.includes('履修') || 
           event.title.includes('抽選') ||
           event.title.includes('登録') ||
           event.title.includes('修正');
  };

  // イベントを並び替え
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = getSortDate(a);
    const dateB = getSortDate(b);
    return dateA.getTime() - dateB.getTime();
  });

  const formatSemesterDate = (dateStr: string) => {
    // Handle special semester schedule dates like "2026-06-上旬"
    const match = dateStr.match(/(\d{4})-(\d{2})-(.+)/);
    if (match) {
      const [, year, month, timing] = match;
      return `${parseInt(month)}月${timing}`;
    }
    // Fallback to regular date formatting
    try {
      return format(parseISO(dateStr), 'M月d日(E)', { locale: ja });
    } catch {
      return dateStr;
    }
  };

  const formatSemesterEndDate = (dateStr: string) => {
    const match = dateStr.match(/(\d{4})-(\d{2})-(.+)/);
    if (match) {
      const [, year, month, timing] = match;
      return `${parseInt(month)}月${timing}`;
    }
    try {
      return format(parseISO(dateStr), 'M月d日(E)', { locale: ja });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative space-y-6 mt-6">
      {/* Vertical line connecting events */}
      <div className="absolute left-[23px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-purple-500/20" />
      
      {sortedEvents.map((event, index) => (
        <div 
          key={event.id} 
          className="relative pl-14 animate-slide-up" 
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          {/* Timeline Dot */}
          <div className={`absolute left-[17px] w-3.5 h-3.5 rounded-full ring-4 ring-background mt-1.5 shadow-sm ${
            event.isSemesterSchedule 
              ? 'bg-purple-500' 
              : isCourseRegistrationEvent(event)
                ? 'bg-yellow-500'
                : 'bg-accent'
          }`} />
          
          <div className={`glass-card p-5 group ${
            event.isSemesterSchedule 
              ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20' 
              : isCourseRegistrationEvent(event)
                ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20'
                : ''
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-bold mb-1.5 inline-block px-2.5 py-0.5 rounded-full ${
                  event.isSemesterSchedule
                    ? 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-800/50'
                    : isCourseRegistrationEvent(event)
                      ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-800/50'
                      : 'text-accent bg-accent/10'
                }`}>
                  {event.isSemesterSchedule ? (
                    <>
                      {formatSemesterDate(event.date)}
                      {event.endDate && event.endDate !== event.date && ` - ${formatSemesterEndDate(event.endDate)}`}
                    </>
                  ) : (
                    <>
                      {format(parseISO(event.date), 'M月d日(E)', { locale: ja })}
                      {event.endDate && event.endDate !== event.date && ` - ${format(parseISO(event.endDate), 'M月d日(E)', { locale: ja })}`}
                    </>
                  )}
                </span>
                <h3 className={`text-lg font-bold mb-2 group-hover:text-accent transition-colors ${
                  event.isSemesterSchedule ? 'text-purple-800 dark:text-purple-200' : isCourseRegistrationEvent(event) ? 'text-yellow-800 dark:text-yellow-200' : ''
                }`}>
                  {event.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
              </div>
              {(() => {
                const gcUrl = buildGoogleCalendarUrl(event);
                return gcUrl ? (
                  <a
                    href={gcUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title="Googleカレンダーに追加"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
                    </svg>
                    <span className="hidden sm:inline">追加</span>
                  </a>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
