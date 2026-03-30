'use client';
import React, { useState, useMemo } from 'react';
import { CalendarPlus, Clock, MapPin, FileText, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';
import calendarData from '@/data/calendar.json';
import PageHeader from '@/components/layout/PageHeader';

// Helper to format date strings like "2026-04-01" to "4月1日"
export const formatEventDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length >= 3) {
    const dayOrText = parts[2];
    if (isNaN(Number(dayOrText))) {
      return `${parseInt(parts[1], 10)}月${dayOrText}`;
    }
    return `${parseInt(parts[1], 10)}月${parseInt(dayOrText, 10)}日`;
  }
  return dateStr;
};

// Identify registration/course related events
export const isRegistrationEvent = (label: string) => {
  return label.includes('履修') || label.includes('登録') || label.includes('抽選');
};

// Identify examination events
export const isExaminationEvent = (label: string) => {
  return label.includes('試験期間');
};

export const getThemeClasses = (color: string) => {
  switch (color) {
    case 'tertiary':
      return {
        bg: 'bg-tertiary',
        text: 'text-tertiary',
        badgeText: 'text-white',
        border: 'border-tertiary',
        accentBg: 'bg-tertiary-container',
        accentText: 'text-on-tertiary-container'
      };
    case 'surface-dim':
      return {
        bg: 'bg-surface-dim',
        text: 'text-on-surface-variant',
        badgeText: 'text-on-surface-variant',
        border: 'border-surface-dim',
        accentBg: 'bg-surface-container-high',
        accentText: 'text-on-surface-variant'
      };
    case 'registration':
      return {
        // Red color for registration deadlines as per mockup legend
        bg: 'bg-error',
        text: 'text-error',
        badgeText: 'text-white',
        border: 'border-error',
        accentBg: 'bg-error-container',
        accentText: 'text-on-error-container'
      };
    case 'primary':
    default:
      return {
        bg: 'bg-primary',
        text: 'text-primary',
        badgeText: 'text-white',
        border: 'border-primary',
        accentBg: 'bg-primary-container',
        accentText: 'text-on-primary-container'
      };
  }
};

export default function CalendarPage() {
  const [view] = useState<'list' | 'calendar'>('list');
  const [currentMonth] = useState(new Date()); // Default to current month
  const [searchQuery, setSearchQuery] = useState('');
  const timingToDay = (timing: string): number => {
    switch (timing) {
      case '初旬': return 1;
      case '上旬': return 7;
      case '中旬': return 15;
      case '末頃': return 26;
      default: return 15;
    }
  };

  const getSortDate = (e: { date?: string; startDate?: string }): Date => {
    const raw = e.startDate || e.date || '';
    // 「2026-06-上旬」のような形式
    const match = raw.match(/^(\d{4})-(\d{2})-(.+)$/);
    if (match && isNaN(Number(match[3]))) {
      return new Date(parseInt(match[1]), parseInt(match[2]) - 1, timingToDay(match[3]));
    }
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date(8640000000000000) : d;
  };

  const allEvents = [...calendarData.events].sort(
    (a, b) => getSortDate(a).getTime() - getSortDate(b).getTime()
  );

  // Filter events based on search query
  const events = useMemo(() => {
    if (!searchQuery.trim()) return allEvents;
    
    const query = searchQuery.toLowerCase();
    return allEvents.filter(event => 
      event.label.toLowerCase().includes(query)
    );
  }, [allEvents, searchQuery]);


  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  return (
    <div className="max-w-[1024px] mx-auto w-full">
      <section className="flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            <PageHeader
              title='予定表'
              subtitle='Academic Schedule & Timelines 2026'
            />

            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
              <input
                type="text"
                placeholder="イベント名やキーワードを検索..."
                className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)] outline-none transition-all text-sm md:text-lg placeholder:text-on-surface-variant/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </div>

        </div>

        {/* Timeline List View */}
            {/* Search Results Summary */}
            {searchQuery.trim() && (
              <div className="mb-6 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                <p className="text-sm text-on-surface-variant">
                  "{searchQuery}" の検索結果: <span className="font-bold text-primary">{events.length}件</span>
                </p>
              </div>
            )}

            {/* Sophisticated Timeline */}
            <div className="relative space-y-12 pb-12">
              <div className="absolute left-10 md:left-14 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-outline-variant to-transparent opacity-20"></div>

              {events.length > 0 ? events.map((event, index) => {
                const displayDate = formatEventDate(event.date || event.startDate);
                const isPeriod = !!event.endDate;
                const dateText = isPeriod ? `${displayDate} 〜 ${formatEventDate(event.endDate)}` : displayDate;

                const isRegistration = isRegistrationEvent(event.label);
                const isExamination = isExaminationEvent(event.label);
                const colors = ['primary', 'tertiary'];
                let themeText: string;
                if (isRegistration) {
                  themeText = 'registration';
                } else if (isExamination) {
                  themeText = 'surface-dim';
                } else {
                  themeText = colors[index % 2];
                }
                const theme = getThemeClasses(themeText);

                return (
                  <article key={index} className="relative flex items-start gap-4 md:gap-10 group">
                    <div className="z-10 flex-shrink-0 w-16 md:w-28 flex flex-col items-center pt-2">
                      <div className={`px-2 md:px-3 py-1 ${theme.bg} ${theme.badgeText} text-[10px] md:text-xs font-bold rounded-full mb-2 tracking-tighter shadow-sm whitespace-nowrap`}>
                        {displayDate}
                      </div>
                      <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-[3px] md:border-4 border-surface ${theme.bg} group-hover:scale-125 transition-transform duration-300`}></div>
                    </div>
                    <div className={`flex-1 bg-surface-container-lowest p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 ${theme.border} relative overflow-hidden`}>

                      {(isRegistration || event.isSemesterSchedule) && (
                        <div className={`absolute top-0 right-0 ${isRegistration ? theme.accentBg : 'bg-secondary-container'} ${isRegistration ? theme.accentText : 'text-on-secondary-container'} px-4 md:px-6 py-1 md:py-1.5 rounded-bl-2xl md:rounded-bl-3xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1`}>
                          {isRegistration ? <AlertCircle className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {isRegistration ? 'Registration' : 'Semester'}
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-2 md:mb-3">
                        <span className={`${theme.text} font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2 md:mt-0`}>
                          {isRegistration ? 'Important Actions' : (isPeriod ? 'Period' : 'Event')}
                        </span>
                        <span className="text-on-surface-variant text-[10px] md:text-xs flex items-center gap-1.5 break-keep">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" /> {dateText}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-on-surface leading-tight mb-2 md:mb-2">{event.label}</h2>
                      <div className="mt-4 md:mt-6 flex items-center gap-4">
                        {(() => {
                          const ev = event as { date?: string; startDate?: string; endDate?: string; label: string; isSemesterSchedule?: boolean };
                          const gcUrl = buildGoogleCalendarUrl({ date: ev.date, startDate: ev.startDate, endDate: ev.endDate, label: ev.label, isSemesterSchedule: ev.isSemesterSchedule });
                          return gcUrl ? (
                            <a
                              href={gcUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-on-surface-variant font-medium text-xs hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                              <CalendarPlus className="w-4 h-4" /> Googleカレンダーに追加
                            </a>
                          ) : (
                            <span className="text-on-surface-variant/40 font-medium text-xs flex items-center gap-1.5 cursor-default">
                              <CalendarPlus className="w-4 h-4" /> 日時未確定
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </article>
                );
              }) : searchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
                  <h3 className="text-xl font-bold text-on-surface mb-2">イベントが見つかりません</h3>
                  <p className="text-on-surface-variant">検索条件を変えてみてください。</p>
                </div>
              ) : null}
            </div>

            {/* 出典・最終更新日 */}
            <div className="mt-12 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>出典: </span>
                  <a
                    href="https://www.tufs.ac.jp/documents/student/calendar/2026_academic_calendar_gakubu.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    東京外国語大学 学年暦（PDF）
                  </a>
                </div>
                <div className="text-xs">
                  最終更新: 2026年3月
                </div>
              </div>
            </div>
      </section>
    </div>
  );
}
