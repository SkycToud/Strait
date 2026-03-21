import Link from 'next/link';
import { 
  MapPin, 
  BookOpen, 
  Utensils, 
  Building, 
  GraduationCap, 
  Laptop, 
  Mail, 
  Grid3x3, 
  Globe, 
  AtSign,
  Home as HomeIcon,
  Calendar,
  Building2,
  Settings
} from 'lucide-react';
import calendarData from '@/data/calendar.json';
import facilityData from '@/data/facilities.json';

export default function Home() {
  const rawEvent = calendarData.events[0];
  const nextEvent = {
    title: rawEvent.label,
    date: rawEvent.date || rawEvent.startDate || '',
    location: 'Research Lecture Building, Room 101',
    startTime: '14:30'
  };

  const facilities = facilityData.slice(0, 3);

  const getFacilityStatus = (facility: any) => {
    // Mock status logic - replace with actual data
    const isOpen = Math.random() > 0.3;
    return {
      isOpen,
      status: isOpen ? 'Open' : 'Closed',
      time: isOpen ? `Until ${21 + Math.floor(Math.random() * 3)}:00` : `Opens ${11 + Math.floor(Math.random() * 2)}:30`
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
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-background mb-4 text-center md:text-left">
          Strait
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed text-center md:text-left md:mx-0 mx-auto">
          東京外国語大学の学生のための、スマートなアカデミックポータル。<br/>
          <span className="text-sm font-medium opacity-70">A streamlined academic portal for Tokyo University of Foreign Studies students.</span>
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* '直近の予定' (Upcoming Schedule) - Large Anchor Card */}
        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              直近の予定 <span className="text-sm font-normal text-on-surface-variant ml-2">Upcoming Schedule</span>
            </h2>
            <Link href="/calendar" className="text-sm font-semibold text-primary hover:underline">See All</Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl shadow-primary/20 group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 inline-block">Recommended Task</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">{nextEvent.title}</h3>
                <p className="text-on-primary/80 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {nextEvent.location}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center min-w-[140px]">
                <div className="text-4xl font-black mb-1">15</div>
                <div className="text-sm font-bold opacity-90">OCTOBER</div>
                <div className="mt-2 pt-2 border-t border-white/20 text-xs font-medium">{nextEvent.startTime} START</div>
              </div>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          </div>
        </section>

        {/* '施設の営業状況' (Facility Status) - Compact Stack */}
        <section className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold">施設の営業状況 <span className="text-xs font-normal text-on-surface-variant block md:inline md:ml-2">Facility Status</span></h2>
            <Link href="/facilities" className="text-sm font-semibold text-primary hover:underline">See All</Link>
          </div>
          <div className="flex flex-col gap-3 h-full">
            {facilities.map((facility, index) => {
              const Icon = getFacilityIcon(facility.name);
              const status = getFacilityStatus(facility);
              
              return (
                <div key={facility.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between border border-outline-variant/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-tertiary-container' : 
                      index === 1 ? 'bg-secondary-container' : 
                      'bg-surface-container-high'
                    }`}>
                      <Icon className={`${
                        index === 0 ? 'text-on-tertiary-container' : 
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mb-1 flex items-center gap-1 ${
                      status.isOpen 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        status.isOpen ? 'bg-primary' : 'bg-outline-variant'
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

        {/* 'よく使うリンク' (Quick Links) - Grid with Icons */}
        <section className="lg:col-span-12">
          <div className="mb-4 px-2">
            <h2 className="text-xl font-bold">よく使うリンク <span className="text-sm font-normal text-on-surface-variant ml-2">Quick Links</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Academic Info */}
            <a 
              href="https://gakumu-web1.tufs.ac.jp/campusweb/campusportal.do" 
              target="_blank"
              className="group bg-surface-container-low hover:bg-white p-6 rounded-3xl transition-all duration-300 flex items-start gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Academic Info System</h5>
                <p className="text-xs text-on-surface-variant leading-tight">学務情報システムへのアクセス</p>
              </div>
            </a>

            {/* TUFS Moodle */}
            <a 
              href="https://moodle.tufs.ac.jp/" 
              target="_blank"
              className="group bg-surface-container-low hover:bg-white p-6 rounded-3xl transition-all duration-300 flex items-start gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">TUFS Moodle</h5>
                <p className="text-xs text-on-surface-variant leading-tight">授業資料・課題の提出</p>
              </div>
            </a>

            {/* University Email */}
            <a 
              href="https://mail.google.com/a/tufs.ac.jp" 
              target="_blank"
              className="group bg-surface-container-low hover:bg-white p-6 rounded-3xl transition-all duration-300 flex items-start gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">University Email</h5>
                <p className="text-xs text-on-surface-variant leading-tight">Outlook Web App</p>
              </div>
            </a>

            {/* Others */}
            <Link 
              href="/links"
              className="group bg-surface-container-low hover:bg-white p-6 rounded-3xl transition-all duration-300 flex items-start gap-4 border border-transparent hover:border-primary-container/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Grid3x3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Other Resources</h5>
                <p className="text-xs text-on-surface-variant leading-tight">その他便利なサービス</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full mt-auto border-t border-slate-200/50 bg-surface-container-low">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-12 max-w-[1440px] mx-auto">
          <div className="md:col-span-4">
            <div className="font-bold text-slate-900 text-xl mb-4">Strait</div>
            <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
              © Tokyo University of Foreign Studies - Strait Academic Platform. Providing elegant solutions for student productivity.
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-on-surface mb-4">System</h4>
            <ul className="space-y-2">
              <li><a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-on-surface mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Campus Map</a></li>
              <li><a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div className="md:col-span-4 flex flex-col items-end">
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <Globe className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <AtSign className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass-nav px-4 py-3 flex justify-around items-center border-t border-outline-variant/10 z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
          <HomeIcon className="w-6 h-6" style={{ fontVariationSettings: "'FILL' 1" }} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Events</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Building2 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Campus</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">Tools</span>
        </button>
      </div>
    </>
  );
}
