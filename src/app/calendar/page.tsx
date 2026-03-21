'use client';
import React, { useState } from 'react';
import { CalendarPlus, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';
import calendarData from '@/data/calendar.json';
import CalendarGrid from '@/components/calendar/CalendarGrid';

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
  const [view, setView] = useState<'list'|'calendar'>('calendar');
  const events = calendarData.events;

  return (
    <div className="max-w-[1024px] mx-auto w-full">
      <section className="flex-1">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            {view === 'calendar' ? (
              <>
                <p className="text-on-surface-variant text-sm font-medium">2026 Academic Year</p>
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">April 2026 / 4月</h1>
              </>
            ) : (
              <>
                 <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">学期予定</h1>
                 <p className="text-on-surface-variant font-medium pt-1">Academic Schedule & Timelines — Spring Semester 2024</p>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-surface-container-high rounded-full w-fit">
              <button onClick={() => setView('list')} className={`px-5 py-2 text-sm font-bold rounded-full transition-all active:scale-95 ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>List View</button>
              <button onClick={() => setView('calendar')} className={`px-5 py-2 text-sm font-bold rounded-full transition-all active:scale-95 ${view === 'calendar' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>Calendar View</button>
            </div>
            <button className="flex items-center gap-2 bg-white border border-outline-variant/30 text-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-surface-container-lowest active:scale-95 transition-all">
              <CalendarPlus className="w-4 h-4" />
              iCal Export
            </button>
          </div>
        </header>

        {view === 'list' ? (
          <>
            {/* Export & Quick Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full">All Semesters</span>
                <span className="px-4 py-2 bg-surface-container-high text-on-surface-variant text-xs font-medium rounded-full hover:bg-surface-container-highest cursor-pointer transition-colors">Undergraduate</span>
                <span className="px-4 py-2 bg-surface-container-high text-on-surface-variant text-xs font-medium rounded-full hover:bg-surface-container-highest cursor-pointer transition-colors">Graduate</span>
              </div>
            </div>

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
                        <button className="text-on-surface-variant font-medium text-xs hover:text-on-surface transition-colors flex items-center gap-1.5">
                           <CalendarPlus className="w-4 h-4"/> Add to personal calendar
                        </button>
                      </div>
                    </div>
                  </article>
                 );
              })}
            </div>
          </>
        ) : (
          <CalendarGrid events={events} />
        )}
      </section>
    </div>
  );
}
