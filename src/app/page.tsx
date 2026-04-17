export const revalidate = 3600;

import Link from 'next/link';
import {
  BookOpen,
  Utensils,
  Building
} from 'lucide-react';
import calendarData from '@/data/calendar.json';
import facilityData from '@/data/facilities.json';
import { FacilityId, getFacilityDataWithMonthlyExceptions } from '@/lib/schedules';
import { getFacilityStatus as calculateStatus } from '@/lib/schedule-utils';
import linksData from '@/data/links.json';
import { TufsNotices } from '@/components/TufsNotices';

type HomeFacility = {
  id: string;
  name: string;
};

export default function Home() {
  const quickLinks = linksData.slice(0, 3);
  const getNextEvent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = calendarData.events.find(e => {
      const dateStr = e.date || e.startDate;
      if (!dateStr || /[^\x00-\x7F]/.test(dateStr)) return false;
      const eventDate = new Date(dateStr);
      return eventDate >= today;
    }) || calendarData.events[0];

    const dateStr = upcoming.date || upcoming.startDate || '';
    let day = '--';
    let month = 'TBD';

    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        day = d.getDate().toString();
        month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      }
    }

    return {
      title: upcoming.label,
      date: dateStr,
      startTime: 'All Day',
      day,
      month
    };
  };

  const nextEvent = getNextEvent();

  const facilities = facilityData.slice(0, 3);

  const getFacilityStatus = (facility: HomeFacility) => {
    const now = new Date();
    const scheduleData = getFacilityDataWithMonthlyExceptions(facility.id as FacilityId, now);
    if (!scheduleData) {
      return {
        isOpen: false,
        status: 'Closed',
        time: 'No data'
      };
    }

    const currentStatus = calculateStatus(now, scheduleData);
    return {
      isOpen: currentStatus.isOpen,
      status: currentStatus.isOpen ? 'Open' : (currentStatus.hours.length > 0 ? 'Closed' : 'Closed'),
      time: currentStatus.hours.length > 0
        ? currentStatus.hours.map(h => `${h.start}-${h.end}`).join(', ')
        : (currentStatus.note && currentStatus.note !== '営業時間外' ? currentStatus.note : '')
    };
  };

  const getFacilityIcon = (name: string) => {
    if (name.includes('図書館') || name.includes('Library')) return BookOpen;
    if (name.includes('食堂') || name.includes('Dining')) return Utensils;
    return Building;
  };

  return (
    <>
      {/* Hero Section */}
      <header className="mb-6 md:mb-12">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-on-background mb-2 md:mb-4 text-left">
          Strait
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed text-left">
          東京外国語大学の学生のための、ポータルサイト
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* '直近の予定' (Upcoming Schedule) - Large Anchor Card */}
        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              直近の予定
            </h2>
            <Link
              href="/calendar"
              className="text-sm font-semibold text-primary hover:underline"
              data-analytics-event="select_content"
              data-analytics-param-content-type="home_cta"
              data-analytics-param-item-id="home-upcoming-see-all"
              data-analytics-param-item-title="Upcoming Schedule See All"
            >
              See All
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-5 md:p-8 text-white shadow-xl shadow-primary/20 group">
            <div className="relative z-10 flex flex-row justify-between items-center gap-4 md:gap-6">
              <div className="flex-1">
                <span className="bg-white/20 backdrop-blur-md px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase mb-2 md:mb-4 inline-block">Recommended Task</span>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 md:mb-2 line-clamp-2">{nextEvent.title}</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/20 text-center min-w-[90px] md:min-w-[140px] shrink-0">
                <div className="text-2xl md:text-4xl font-black mb-1">{nextEvent.day}</div>
                <div className="text-xs md:text-sm font-bold opacity-90">{nextEvent.month}</div>
                <div className="mt-1 md:mt-2 pt-1 md:pt-2 border-t border-white/20 text-[10px] md:text-xs font-medium">{nextEvent.startTime}</div>
              </div>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          </div>
        </section>

        {/* '施設の営業状況' (Facility Status) - Compact Stack */}
        <section className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold">施設の営業状況</h2>
            <Link
              href="/facilities"
              className="text-sm font-semibold text-primary hover:underline"
              data-analytics-event="select_content"
              data-analytics-param-content-type="home_cta"
              data-analytics-param-item-id="home-facilities-see-all"
              data-analytics-param-item-title="Facilities See All"
            >
              See All
            </Link>
          </div>
          <div className="flex flex-col gap-3 h-full">
            {facilities.map((facility, index) => {
              const Icon = getFacilityIcon(facility.name);
              const status = getFacilityStatus(facility);

              return (
                <div key={facility.id} className="bg-surface-container-lowest p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between border border-outline-variant/5">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-tertiary-container' :
                      index === 1 ? 'bg-secondary-container' :
                        'bg-surface-container-high'
                      }`}>
                      <Icon className={`${index === 0 ? 'text-on-tertiary-container' :
                        index === 1 ? 'text-on-secondary-container' :
                          'text-on-surface-variant'
                        } w-5 h-5 md:w-6 md:h-6`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base">{facility.name}</h4>
                      <p className="text-[10px] md:text-xs text-on-surface-variant line-clamp-1">{facility.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold mb-1 flex items-center gap-1 ${status.isOpen
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-primary' : 'bg-outline-variant'
                        }`}></span>
                      {status.status}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-on-surface-variant">{status.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TUFS Notice セクション */}
        <TufsNotices />

        <section className="lg:col-span-12">
          <div className="mb-4 px-2 flex justify-between items-center">
            <h2 className="text-xl font-bold">よく使うリンク</h2>
            <Link
              href="/links"
              className="text-sm font-semibold text-primary hover:underline md:hidden"
              data-analytics-event="select_content"
              data-analytics-param-content-type="home_cta"
              data-analytics-param-item-id="home-links-view-all-mobile"
              data-analytics-param-item-title="Quick Links View All Mobile"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="select_content"
                data-analytics-param-content-type="link"
                data-analytics-param-item-id={link.id}
                data-analytics-param-item-title={link.title}
                data-analytics-param-item-category={link.category}
                className="group bg-surface-container-low hover:bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-300 flex flex-col md:flex-row items-start gap-3 md:gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl select-none">{link.icon}</span>
                </div>
                <div className="flex-1 w-full">
                  <h5 className="font-bold text-xs md:text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{link.title}</h5>
                  <p className="text-[10px] md:text-xs text-on-surface-variant leading-tight line-clamp-2">{link.description}</p>
                </div>
              </a>
            ))}

            {/* Others */}
            <Link
              href="/links"
              data-analytics-event="select_content"
              data-analytics-param-content-type="home_cta"
              data-analytics-param-item-id="home-links-other-resources"
              data-analytics-param-item-title="Other Resources"
              className="group bg-surface-container-low hover:bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-300 flex flex-col md:flex-row items-start gap-3 md:gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5 hidden lg:flex"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-xl md:text-2xl select-none">grid_view</span>
              </div>
              <div className="flex-1 w-full">
                <h5 className="font-bold text-xs md:text-sm mb-1 group-hover:text-primary transition-colors">Other Resources</h5>
                <p className="text-[10px] md:text-xs text-on-surface-variant leading-tight">その他便利なサービス</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

    </>
  );
}
