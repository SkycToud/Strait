'use client';
import React, { useState } from 'react';
import { CalendarPlus, Clock, MapPin, FileText, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';
import calendarData from '@/data/calendar.json';
import CalendarGrid from '@/components/calendar/CalendarGrid';
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
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Default to current month
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

  const events = [...calendarData.events].sort(
    (a, b) => getSortDate(a).getTime() - getSortDate(b).getTime()
  );

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  return (
    <div className="max-w-[1024px] mx-auto w-full">
      <section className="flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex flex-col gap-4">
            <PageHeader
              title={view === 'calendar' ? `${year} / ${month}月` : '学期予定'}
              subtitle={view === 'calendar' ? 'Academic Calendar' : 'Academic Schedule & Timelines 2026'}
            />

            {view === 'calendar' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-full hover:bg-surface-container-high transition-colors border border-outline-variant/30 text-on-surface"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-full hover:bg-surface-container-high transition-colors border border-outline-variant/30 text-on-surface"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2">
            <div className="flex items-center gap-1 p-1 bg-surface-container-high rounded-full w-fit">
              <button onClick={() => setView('list')} className={`px-5 py-2 text-sm font-bold rounded-full transition-all active:scale-95 ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>List View</button>
              <button onClick={() => setView('calendar')} className={`px-5 py-2 text-sm font-bold rounded-full transition-all active:scale-95 ${view === 'calendar' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>Calendar View</button>
            </div>
          </div>
        </div>

        {view === 'list' ? (
          <>


            {/* Sophisticated Timeline */}
            <div className="relative space-y-12 pb-12">
              <div className="absolute left-10 md:left-14 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-outline-variant to-transparent opacity-20"></div>

              {events.map((event, index) => {
                const displayDate = formatEventDate(event.date || event.startDate);
                const isPeriod = !!event.endDate;
                const dateText = isPeriod ? `${displayDate} 〜 ${formatEventDate(event.endDate)}` : displayDate;

                const isRegistration = isRegistrationEvent(event.label);
                const colors = ['primary', 'tertiary', 'surface-dim'];
                const themeText = isRegistration ? 'registration' : colors[index % 3];
                const theme = getThemeClasses(themeText);

                return (
                  <article key={index} className="relative flex items-start gap-6 md:gap-10 group">
                    <div className="z-10 flex-shrink-0 w-20 md:w-28 flex flex-col items-center pt-2">
                      <div className={`px-3 py-1 ${theme.bg} ${theme.badgeText} text-[10px] md:text-xs font-bold rounded-full mb-2 tracking-tighter shadow-sm whitespace-nowrap`}>
                        {displayDate}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-4 border-surface ${theme.bg} group-hover:scale-125 transition-transform duration-300`}></div>
                    </div>
                    <div className={`flex-1 bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 ${theme.border} relative overflow-hidden`}>

                      {(isRegistration || event.isSemesterSchedule) && (
                        <div className={`absolute top-0 right-0 ${isRegistration ? theme.accentBg : 'bg-secondary-container'} ${isRegistration ? theme.accentText : 'text-on-secondary-container'} px-6 py-1.5 rounded-bl-3xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1`}>
                          {isRegistration ? <AlertCircle className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {isRegistration ? 'Registration' : 'Semester'}
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <span className={`${theme.text} font-bold text-xs uppercase tracking-widest`}>
                          {isRegistration ? 'Important Actions' : (isPeriod ? 'Period' : 'Event')}
                        </span>
                        <span className="text-on-surface-variant text-xs flex items-center gap-1.5 break-keep">
                          <Clock className="w-4 h-4" /> {dateText}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-on-surface leading-tight mb-2">{event.label}</h2>
                      <div className="mt-6 flex items-center gap-4">
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
              })}
            </div>
          </>
        ) : (
          <CalendarGrid events={events} currentMonth={currentMonth} />
        )}
      </section>
    </div>
  );
}
