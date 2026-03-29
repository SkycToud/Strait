import Link from 'next/link';
import NoticeSection from '@/components/notice/NoticeSection';
import {
  BookOpen,
  Utensils,
  Building,
  Calendar,
  Building2,
  Settings
} from 'lucide-react';
import calendarData from '@/data/calendar.json';
import facilityData from '@/data/facilities.json';
import { CONST_SCHEDULE_DATA, FacilityId } from '@/lib/schedules';
import { getFacilityStatus as calculateStatus } from '@/lib/schedule-utils';
import linksData from '@/data/links.json';
import { TufsNotices } from '@/components/TufsNotices';

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

  const getFacilityStatus = (facility: any) => {
    const scheduleData = CONST_SCHEDULE_DATA[facility.id as FacilityId];
    if (!scheduleData) {
      return {
        isOpen: false,
        status: 'Closed',
        time: 'No data'
      };
    }

    const currentStatus = calculateStatus(new Date(), scheduleData);
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
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-background mb-4 text-left">
          Strait
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed text-left">
          東京外国語大学の学生のための、ポータルサイト
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* '直近の予定' (Upcoming Schedule) - Large Anchor Card */}
        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              直近の予定
            </h2>
            <Link href="/calendar" className="text-sm font-semibold text-primary hover:underline">See All</Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl shadow-primary/20 group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 inline-block">Recommended Task</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">{nextEvent.title}</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center min-w-[140px]">
                <div className="text-4xl font-black mb-1">{nextEvent.day}</div>
                <div className="text-sm font-bold opacity-90">{nextEvent.month}</div>
                <div className="mt-2 pt-2 border-t border-white/20 text-xs font-medium">{nextEvent.startTime}</div>
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
            <Link href="/facilities" className="text-sm font-semibold text-primary hover:underline">See All</Link>
          </div>
          <div className="flex flex-col gap-3 h-full">
            {facilities.map((facility, index) => {
              const Icon = getFacilityIcon(facility.name);
              const status = getFacilityStatus(facility);

              return (
                <div key={facility.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between border border-outline-variant/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-tertiary-container' :
                      index === 1 ? 'bg-secondary-container' :
                        'bg-surface-container-high'
                      }`}>
                      <Icon className={`${index === 0 ? 'text-on-tertiary-container' :
                        index === 1 ? 'text-on-secondary-container' :
                          'text-on-surface-variant'
                        } w-6 h-6`} />
                    </div>
                    <div>
                      <h4 className="font-bold">{facility.name}</h4>
                      <p className="text-xs text-on-surface-variant">{facility.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mb-1 flex items-center gap-1 ${status.isOpen
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-primary' : 'bg-outline-variant'
                        }`}></span>
                      {status.status}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{status.time}</span>
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
            <Link href="/links" className="text-sm font-semibold text-primary hover:underline md:hidden">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-surface-container-low hover:bg-white p-6 rounded-3xl transition-all duration-300 flex items-start gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-primary text-2xl select-none">{link.icon}</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{link.title}</h5>
                  <p className="text-xs text-on-surface-variant leading-tight line-clamp-2">{link.description}</p>
                </div>
              </a>
            ))}

            {/* Others */}
            <Link
              href="/links"
              className="group bg-surface-container-low hover:bg-white p-6 rounded-3xl transition-all duration-300 items-start gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5 hidden lg:flex"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-2xl select-none">grid_view</span>
              </div>
              <div>
                <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Other Resources</h5>
                <p className="text-xs text-on-surface-variant leading-tight">その他便利なサービス</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

    </>
  );
}
