'use client';

import { useState } from 'react';
import { ClubDetail } from '@/types/club';
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Globe, MessageCircle, ArrowLeft } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19 9.45 12.504h-7.4l-5.794-7.57-6.62 7.57H.5l8.6-9.83L0 1.154h7.6l5.237 6.93 6.064-6.93zm-1.29 19.483h2.04L6.49 3.248H4.3z" />
  </svg>
);

const ExpandableText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // text may be undefined if club object lacks data, but we pass default values below.
  const isLong = text && (text.length > 80 || (text.match(/\n/g) || []).length >= 3);

  if (!isLong) {
    return <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{text}</p>;
  }

  return (
    <div className="flex flex-col items-start w-full">
      <p className={`text-on-surface-variant leading-relaxed whitespace-pre-wrap w-full ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-sm font-bold text-primary hover:text-primary-dim transition-colors"
      >
        {isExpanded ? '閉じる' : '続きを読む'}
      </button>
    </div>
  );
};

interface ClubDetailPageProps {
  club: ClubDetail;
  categorySlug: string;
}

const isValidUrl = (url: string | undefined) => {
  if (!url) return false;
  const invalidValues = ['なし', 'なし。', 'none', 'n/a', '-', ''];
  return !invalidValues.includes(url.toLowerCase().trim());
};

export default function ClubDetailPage({ club, categorySlug }: ClubDetailPageProps) {
  // Helper to parse year distribution numbers
  const getYearNum = (str: string) => {
    const parts = str.split(/[:：]/);
    if (parts.length > 1) {
      const match = parts[1].match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    const match = str.match(/(?:^|\D)(\d+)(?:人|名)/);
    return match ? parseInt(match[1]) : 0;
  };

  const years = club.membership?.yearDistribution || [];
  const y1 = getYearNum(years.find(y => y.includes('1年生')) || '0');
  const y2 = getYearNum(years.find(y => y.includes('2年生')) || '0');
  const y3 = getYearNum(years.find(y => y.includes('3年生')) || '0');
  const y4 = getYearNum(years.find(y => y.includes('4年生')) || '0');
  const y5 = getYearNum(years.find(y => y.includes('院生')) || '0');
  const total = y1 + y2 + y3 + y4 + y5 || club.membership?.memberCount || 0;

  const y1p = total ? (y1 / total) * 100 : 0;
  const y2p = total ? (y2 / total) * 100 : 0;
  const y3p = total ? (y3 / total) * 100 : 0;
  const y4p = total ? (y4 / total) * 100 : 0;
  const y5p = total ? (y5 / total) * 100 : 0;

  // Helper to parse annual plan months
  const parseAnnualPlan = (str: string) => {
    const match = str.match(/(\d+)\s*月[\s:：]+\s*(.*)/);
    if (match) {
      return { month: match[1], event: match[2] };
    }
    return { month: '--', event: str };
  };

  return (
    <main className="pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative h-[250px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl shadow-blue-900/5">
          {club.thumbnail ? (
            <Image
              alt={club.nameJa}
              src={club.thumbnail}
              fill
              className="absolute inset-0 w-full h-full object-cover"
              priority
              quality={100}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-container flex items-center justify-center text-on-surface-variant font-bold text-2xl">
              {club.nameJa}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 lg:p-12 text-white">
            {club.isSample && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 bg-amber-500/90 text-white rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-sm">science</span>
                サンプル（実在しない団体です）
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {club.categories.map((cat) => (
                <span key={cat} className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-bold border border-white/30">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 font-headline">{club.nameJa}</h1>
            <p className="hidden lg:block text-lg lg:text-xl text-white/90 max-w-2xl font-body leading-relaxed">
              {club.description || "Enjoy activities and team bonding within the community."}
            </p>
          </div>
        </div>
      </section>

      {/* Mobile TOC (only on <lg) */}
      <div className="lg:hidden max-w-7xl mx-auto px-6 mb-6">
        <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: '概要' },
            { id: 'operations', label: '活動実態' },
            { id: 'membership', label: 'メンバー構成' },
            { id: 'schedule', label: '活動概要' },
            { id: 'appeal', label: '魅力' },
            { id: 'challenges', label: '大変なところ' },
            { id: 'annual-plan', label: '年間予定' },
            { id: 'recruitment', label: '入会案内' },
            { id: 'sns', label: 'SNS' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex-shrink-0 px-3 py-1.5 bg-surface-container-low rounded-full text-sm font-medium text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Overview & Status (PC) / Mobile Sequential Layout */}
        <div className="lg:col-span-8 space-y-8">
          {/* PC Layout: Original Order */}
          <div className="hidden lg:block space-y-8">
            {/* 概要 (Overview) */}
            <section className="bg-surface-container-low p-8 rounded-xl" id="overview">
              <div className="mb-6"><h2 className="text-2xl font-bold font-headline">概要</h2></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">visibility</span>
                    <h3 className="font-bold">理念/指針</h3>
                  </div>
                  <ExpandableText text={club.overview?.philosophy || "準備中"} />
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                    <h3 className="font-bold">活動内容</h3>
                  </div>
                  <ExpandableText text={club.overview?.activities || "準備中"} />
                </div>
              </div>
            </section>

            {/* 活動実態 (Current Status) */}
            <section className="bg-surface-container-low p-8 rounded-xl" id="operations">
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-headline">活動実態</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary-container p-3 rounded-lg text-on-secondary-container">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface mb-1">執行代</h4>
                    <p className="text-on-surface-variant">
                      {club.operations?.executiveMembers?.join('・') || "3年生中心の運営です。"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary-container p-3 rounded-lg text-on-secondary-container">
                    <span className="material-symbols-outlined">engineering</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface mb-1">体制</h4>
                    <p className="text-on-surface-variant">
                      {club.operations?.organization || "学生主導の組織です。"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 年間予定 (Annual Schedule) */}
            <section className="bg-surface-container-low p-8 rounded-xl" id="annual-plan">
              <div className="mb-8"><h2 className="text-2xl font-bold font-headline">年間予定</h2></div>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-outline-variant/20">
                {club.schedule?.annualPlan?.map((plan, idx) => {
                  const { month, event } = parseAnnualPlan(plan);
                  const isLast = idx === (club.schedule?.annualPlan?.length || 0) - 1;
                  return (
                    <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${!isLast ? 'pb-8' : ''}`}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <span className="text-xs font-bold">{month}</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
                        <h4 className="font-bold text-on-surface">{event}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Mobile Layout: Specified Order */}
          <div className="lg:hidden space-y-6">
            {/* 概要 */}
            <section className="bg-surface-container-low p-6 rounded-xl scroll-mt-20" id="overview">
              <h2 className="text-xl font-bold font-headline mb-4">概要</h2>
              <div className="space-y-4">
                <div className="bg-surface-container-lowest p-4 rounded-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">visibility</span>
                    理念/指針
                  </h3>
                  <ExpandableText text={club.overview?.philosophy || "準備中"} />
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">tips_and_updates</span>
                    活動内容
                  </h3>
                  <ExpandableText text={club.overview?.activities || "準備中"} />
                </div>
              </div>
            </section>

            {/* 活動実態 */}
            <section className="bg-surface-container-low p-6 rounded-xl scroll-mt-20" id="operations">
              <h2 className="text-xl font-bold font-headline mb-4">活動実態</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary-container p-2 rounded-lg text-on-secondary-container">
                    <span className="material-symbols-outlined text-sm">groups</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface mb-1">執行代</h4>
                    <p className="text-sm text-on-surface-variant">
                      {club.operations?.executiveMembers?.join('・') || "3年生中心の運営です。"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-secondary-container p-2 rounded-lg text-on-secondary-container">
                    <span className="material-symbols-outlined text-sm">engineering</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface mb-1">体制</h4>
                    <p className="text-sm text-on-surface-variant">
                      {club.operations?.organization || "学生主導の組織です。"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* メンバー構成 */}
            <section className="bg-surface-container-low p-6 rounded-xl scroll-mt-20" id="membership">
              <h2 className="text-xl font-bold font-headline mb-4">メンバー構成</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-primary uppercase mb-1">合計人数</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-primary">{total}</span>
                    <span className="text-sm text-on-surface-variant font-medium">名</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase mb-2">学年構成</p>
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-surface-container">
                    <div className="bg-primary h-full" style={{ width: `${y1p}%` }}></div>
                    <div className="bg-primary-container h-full" style={{ width: `${y2p}%` }}></div>
                    <div className="bg-primary h-full opacity-60" style={{ width: `${y3p}%` }}></div>
                    <div className="bg-outline-variant h-full" style={{ width: `${y4p}%` }}></div>
                    {y5 > 0 && <div className="bg-secondary h-full" style={{ width: `${y5p}%` }}></div>}
                  </div>
                  <div className={`grid ${y5 > 0 ? 'grid-cols-5' : 'grid-cols-4'} gap-1 mt-2 text-xs text-center font-bold`}>
                    <div>1年生: {y1}</div>
                    <div>2年生: {y2}</div>
                    <div>3年生: {y3}</div>
                    <div>4年生: {y4}</div>
                    {y5 > 0 && <div>院生: {y5}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    {club.membership?.isIntraUniversity !== false ? "school" : "public"}
                  </span>
                  <span className="text-sm font-bold">
                    {club.membership?.isIntraUniversity !== false ? "外大生のみ" : "インカレ"}
                  </span>
                </div>
                {club.membership?.demographics && (
                  <div className="pt-3 border-t border-outline-variant/10">
                    <p className="text-xs font-bold text-primary uppercase mb-2">メンバー層・人物像</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                      {club.membership.demographics}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 活動概要 */}
            <section className="bg-surface-container-low p-6 rounded-xl scroll-mt-20" id="schedule">
              <h2 className="text-xl font-bold font-headline mb-4">活動概要</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-primary uppercase mb-1">頻度</p>
                  <p className="font-medium text-sm whitespace-pre-wrap">{club.schedule?.frequency || "週数回"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase mb-1">場所</p>
                  <p className="font-medium text-sm whitespace-pre-wrap">{club.schedule?.location || "学内施設"}</p>
                </div>
              </div>
            </section>

            {/* 魅力 */}
            <section className="scroll-mt-20" id="appeal">
              <div className="relative pt-6 pl-4 pb-3 pr-2">
                <div className="bg-[#fdf379] p-5 shadow-[3px_3px_10px_rgba(0,0,0,0.15)] transform -rotate-1 min-h-[120px] relative">
                  {/* Top left stars (縮小版) */}
                  <div className="absolute -top-5 -left-5 transform -rotate-12">
                    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 25 15 L 29 25 L 40 27 L 31 35 L 34 45 L 25 40 L 16 45 L 19 35 L 10 27 L 21 25 Z" fill="#fdf379" />
                      <path d="M 60 45 L 63 53 L 72 55 L 65 60 L 67 69 L 60 64 L 53 69 L 55 60 L 48 55 L 57 53 Z" fill="#fdf379" />
                    </svg>
                  </div>
                  {/* Top right star (縮小版) */}
                  <div className="absolute -top-3 right-14 transform rotate-6">
                    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 50 15 L 56 30 L 75 33 L 61 45 L 65 60 L 50 52 L 35 60 L 39 45 L 25 33 L 44 30 Z" fill="#fdf379" />
                    </svg>
                  </div>
                  {/* Checkmark (縮小版) */}
                  <div className="absolute -top-4 right-1 transform rotate-12 flex flex-col items-center">
                    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 25 55 L 45 75 L 80 25" />
                    </svg>
                    <span className="font-extrabold text-black text-[10px] -mt-1 tracking-widest transform -rotate-6">check</span>
                  </div>
                  {/* Content */}
                  <h4 className="font-extrabold text-black text-base mb-2 mt-1 pr-10 tracking-wide leading-tight">
                    魅力
                  </h4>
                  <div className="text-black font-bold leading-[1.7] whitespace-pre-wrap text-sm">
                    {club.recruitment?.appeal || "新入生歓迎！"}
                  </div>
                  {/* Folded corner (縮小版) */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-[48px] h-[48px] bg-[#d5c731] transform rotate-45 translate-x-2 translate-y-2 shadow-[-2px_-2px_4px_rgba(0,0,0,0.2)] opacity-90"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* 大変なところ */}
            <section className="scroll-mt-20" id="challenges">
              <div className="relative pt-6 pl-2 pb-3 pr-4">
                <div className="bg-[#bda8e6] p-5 shadow-[3px_3px_10px_rgba(0,0,0,0.15)] transform rotate-1 min-h-[120px] relative">
                  {/* Tape top-left (縮小版) */}
                  <div className="absolute -top-2 left-3 w-16 h-5 bg-white/70 backdrop-blur-md shadow-sm transform -rotate-6 overflow-hidden border-x border-y border-gray-300">
                    <div className="w-full h-full opacity-40 mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>
                  </div>
                  {/* Rain cloud top-right (縮小版) */}
                  <svg width="56" height="56" viewBox="0 0 100 100" className="absolute top-1 right-3 text-black drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 30 55 Q 25 55 25 45 Q 25 35 35 35 Q 40 20 60 20 Q 75 20 80 35 Q 90 35 90 45 Q 90 55 80 55 Z" fill="#bda8e6" />
                    <path d="M 40 65 L 37 75 M 55 68 L 52 78 M 70 65 L 67 75 M 46 82 L 43 92 M 61 80 L 58 90" strokeLinecap="round" strokeWidth="4" />
                  </svg>
                  {/* Bottom-left motion lines (縮小版) */}
                  <svg width="28" height="28" viewBox="0 0 100 100" className="absolute bottom-2 left-2 text-black drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                    <path d="M 20 60 Q 30 75 40 90" />
                    <path d="M 40 40 Q 50 60 60 80" />
                  </svg>
                  {/* Bottom-right exclamation mark (縮小版) */}
                  <svg width="22" height="34" viewBox="0 0 40 100" className="absolute bottom-3 right-4 text-black drop-shadow-sm transform -rotate-12">
                    <path d="M 12 10 L 28 5 L 24 65 L 16 65 Z" fill="#bda8e6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="85" r="7" fill="currentColor" />
                  </svg>
                  {/* Content */}
                  <h4 className="font-extrabold text-black text-base mb-2 mt-1 ml-3 pr-14 tracking-wide leading-tight">
                    大変なところ
                  </h4>
                  <div className="text-black font-bold leading-[1.7] whitespace-pre-wrap text-sm ml-3 pr-6">
                    {club.recruitment?.challenges || "特にありません"}
                  </div>
                </div>
              </div>
            </section>

            {/* 年間予定 */}
            <section className="bg-surface-container-low p-6 rounded-xl scroll-mt-20" id="annual-plan">
              <h2 className="text-xl font-bold font-headline mb-4">年間予定</h2>
              <div className="space-y-3">
                {club.schedule?.annualPlan?.length && club.schedule.annualPlan.length > 0 && club.schedule.annualPlan[0] !== "準備中" ? (
                  club.schedule.annualPlan.map((plan, idx) => {
                    const { month, event } = parseAnnualPlan(plan);
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold shrink-0">
                          {month}
                        </div>
                        <div className="bg-surface-container-lowest p-3 rounded-lg flex-1">
                          <p className="font-medium text-sm">{event}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-on-surface-variant">年間予定情報は準備中です</p>
                )}
              </div>
            </section>

            {/* 入会案内 */}
            <section className="bg-primary text-white p-6 rounded-xl scroll-mt-20" id="recruitment">
              <h2 className="text-xl font-bold font-headline mb-4">入会案内</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary-container">event_available</span>
                  <div>
                    <p className="font-bold text-sm">新歓情報</p>
                    <p className="text-sm opacity-90 whitespace-pre-wrap">{club.recruitment?.welcomeEvents || "4月から開始します。"}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary-container">payments</span>
                  <div>
                    <p className="font-bold text-sm">年会費</p>
                    <p className="text-sm opacity-90 whitespace-pre-wrap">{club.recruitment?.annualFee || "未定"}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary-container">how_to_reg</span>
                  <div>
                    <p className="font-bold text-sm">選考</p>
                    <p className="text-sm opacity-90">{club.recruitment?.hasSelection ? "選考あり" : "選考なし。どなたでも歓迎！"}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary-container">schedule</span>
                  <div>
                    <p className="font-bold text-sm">入会締切</p>
                    <p className="text-sm opacity-90">{club.recruitment?.applicationDeadline || "通年募集"}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary-container">group_add</span>
                  <div>
                    <p className="font-bold text-sm">募集対象</p>
                    <p className="text-sm opacity-90 whitespace-pre-wrap">{club.recruitment?.targetAudience || "指定なし"}</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* SNS情報 */}
            <section className="bg-surface-container-low p-6 rounded-xl scroll-mt-20" id="sns">
              <h2 className="text-xl font-bold font-headline mb-4">SNS情報</h2>
              <div className="flex flex-wrap gap-3">
                {isValidUrl(club.recruitment?.contact?.instagram || club.instagram) && (
                  <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group" href={club.recruitment?.contact?.instagram || club.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {isValidUrl(club.recruitment?.contact?.xUrl || club.xUrl) && (
                  <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group" href={club.recruitment?.contact?.xUrl || club.xUrl} target="_blank" rel="noopener noreferrer" title="X">
                    <XIcon className="w-5 h-5" />
                  </a>
                )}
                {isValidUrl(club.recruitment?.contact?.facebook) && (
                  <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group" href={club.recruitment?.contact?.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {isValidUrl(club.recruitment?.contact?.website) && (
                  <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group" href={club.recruitment?.contact?.website} target="_blank" rel="noopener noreferrer" title="HP">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {isValidUrl(club.recruitment?.contact?.line) && (
                  <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group" href={club.recruitment?.contact?.line} target="_blank" rel="noopener noreferrer" title="LINE">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
              </div>
              {!isValidUrl(club.recruitment?.contact?.instagram || club.instagram) && !isValidUrl(club.recruitment?.contact?.xUrl || club.xUrl) && 
               !isValidUrl(club.recruitment?.contact?.facebook) && 
               !isValidUrl(club.recruitment?.contact?.website) && 
               !isValidUrl(club.recruitment?.contact?.line) && (
                <p className="text-sm text-on-surface-variant">SNS情報は登録されていません。</p>
              )}
            </section>
          </div>
        </div>

        {/* Right Column: Member Profile & Admission (PC only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-8 sticky top-24 self-start">
          {/* メンバー構成 (Member Profile) */}
          <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/30 rounded-bl-full -mr-6 -mt-6"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold font-headline mb-6">メンバー構成</h2>
              <div className="mb-8">
                <p className="text-xs font-bold text-primary uppercase mb-1">合計人数</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-primary">{total}</span>
                  <span className="text-on-surface-variant font-medium">名</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-xs font-bold text-primary uppercase">学年構成</span>
                  </div>
                  <div className="flex h-3 w-full rounded-full overflow-hidden bg-surface-container">
                    <div className="bg-primary h-full" style={{ width: `${y1p}%` }} title="1st Year"></div>
                    <div className="bg-primary-container h-full" style={{ width: `${y2p}%` }} title="2nd Year"></div>
                    <div className="bg-primary h-full opacity-60" style={{ width: `${y3p}%` }} title="3rd Year"></div>
                    <div className="bg-outline-variant h-full" style={{ width: `${y4p}%` }} title="4th Year"></div>
                    {y5 > 0 && <div className="bg-secondary h-full" style={{ width: `${y5p}%` }} title="Grad"></div>}
                  </div>
                  <div className={`grid ${y5 > 0 ? 'grid-cols-5' : 'grid-cols-4'} gap-1 mt-2 text-xs text-center font-bold`}>
                    <div>1年生: {y1}</div>
                    <div>2年生: {y2}</div>
                    <div>3年生: {y3}</div>
                    <div>4年生: {y4}</div>
                    {y5 > 0 && <div>院生: {y5}</div>}
                  </div>
                </div>
                <div className="pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">
                      {club.membership?.isIntraUniversity !== false ? "school" : "public"}
                    </span>
                    <span className="text-sm font-bold">
                      {club.membership?.isIntraUniversity !== false ? "外大生のみ" : "インカレ"}
                    </span>
                  </div>
                </div>
                {club.membership?.demographics && (
                  <div className="pt-4 border-t border-outline-variant/10 mt-4">
                    <p className="text-xs font-bold text-primary uppercase mb-2">メンバー層・人物像</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                      {club.membership.demographics}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 活動詳細 (Activity Details) */}
          <section className="bg-surface-container-low p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">活動詳細</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-primary uppercase mb-1">頻度</p>
                <p className="font-medium whitespace-pre-wrap">{club.schedule?.frequency || "週数回"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase mb-1">場所</p>
                <p className="font-medium whitespace-pre-wrap">{club.schedule?.location || "学内施設"}</p>
              </div>
            </div>
          </section>

          {/* 入会案内 (Join Us) */}
          <section className="bg-primary text-white rounded-xl p-8 shadow-xl shadow-blue-900/10">
            <h2 className="text-2xl font-bold font-headline mb-6">入会案内</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-primary-container">event_available</span>
                <div>
                  <p className="font-bold">新歓情報</p>
                  <p className="text-sm opacity-90 whitespace-pre-wrap">{club.recruitment?.welcomeEvents || "4月から開始します。"}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-primary-container">payments</span>
                <div>
                  <p className="font-bold">年会費</p>
                  <p className="text-sm opacity-90 whitespace-pre-wrap">{club.recruitment?.annualFee || "未定"}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-primary-container">how_to_reg</span>
                <div>
                  <p className="font-bold">選考</p>
                  <p className="text-sm opacity-90">{club.recruitment?.hasSelection ? "選考あり" : "選考なし。どなたでも歓迎！"}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-primary-container">schedule</span>
                <div>
                  <p className="font-bold">入会締切</p>
                  <p className="text-sm opacity-90">{club.recruitment?.applicationDeadline || "通年募集"}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-primary-container">group_add</span>
                <div>
                  <p className="font-bold">募集対象</p>
                  <p className="text-sm opacity-90 whitespace-pre-wrap mt-1">{club.recruitment?.targetAudience || "指定なし"}</p>
                </div>
              </li>
            </ul>
          </section>

          {/* SNS情報 (Social Media) */}
          <section className="bg-surface-container-low p-6 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 pl-1">SNS情報</h3>
            <div className="flex justify-start items-center gap-4">
              {isValidUrl(club.recruitment?.contact?.instagram || club.instagram) && (
                <a className="p-4 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group scale-110" href={club.recruitment?.contact?.instagram || club.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {isValidUrl(club.recruitment?.contact?.xUrl || club.xUrl) && (
                <a className="p-4 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group scale-110" href={club.recruitment?.contact?.xUrl || club.xUrl} target="_blank" rel="noopener noreferrer" title="X">
                  <XIcon className="w-6 h-6" />
                </a>
              )}
              {isValidUrl(club.recruitment?.contact?.facebook) && (
                <a className="p-4 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group scale-110" href={club.recruitment?.contact?.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {isValidUrl(club.recruitment?.contact?.website) && (
                <a className="p-4 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group scale-110" href={club.recruitment?.contact?.website} target="_blank" rel="noopener noreferrer" title="HP">
                  <Globe className="w-6 h-6" />
                </a>
              )}
              {isValidUrl(club.recruitment?.contact?.line) && (
                <a className="p-4 bg-surface-container-lowest rounded-full hover:text-primary hover:shadow-md transition-all group scale-110" href={club.recruitment?.contact?.line} target="_blank" rel="noopener noreferrer" title="LINE">
                  <MessageCircle className="w-6 h-6" />
                </a>
              )}
            </div>
            {!isValidUrl(club.recruitment?.contact?.instagram || club.instagram) && !isValidUrl(club.recruitment?.contact?.xUrl || club.xUrl) && 
             !isValidUrl(club.recruitment?.contact?.facebook) && 
             !isValidUrl(club.recruitment?.contact?.website) && 
             !isValidUrl(club.recruitment?.contact?.line) && (
              <p className="text-sm text-on-surface-variant">SNS情報は登録されていません。</p>
            )}
          </section>
        </div>
      </div>

      {/* Full-width Appeal / Challenges sticky note row (PC only) */}
      {(club.recruitment?.appeal || club.recruitment?.challenges) && (
        <div className="hidden lg:grid max-w-7xl mx-auto px-6 mt-10 grid-cols-2 gap-10 items-start">
          {/* アピールポイント (魅力) - Yellow Sticky Note - LEFT */}
          <div className="relative pt-8 pl-6 pb-4 pr-2">
            <div className="bg-[#fdf379] p-6 md:p-8 shadow-[4px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.2)] transition-shadow transform -rotate-2 min-h-[160px] relative">
              {/* Top left stars */}
              <div className="absolute -top-8 -left-8 transform -rotate-12">
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 25 15 L 29 25 L 40 27 L 31 35 L 34 45 L 25 40 L 16 45 L 19 35 L 10 27 L 21 25 Z" fill="#fdf379" />
                  <path d="M 60 45 L 63 53 L 72 55 L 65 60 L 67 69 L 60 64 L 53 69 L 55 60 L 48 55 L 57 53 Z" fill="#fdf379" />
                </svg>
              </div>
              {/* Top right star */}
              <div className="absolute -top-5 right-20 transform rotate-6">
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 50 15 L 56 30 L 75 33 L 61 45 L 65 60 L 50 52 L 35 60 L 39 45 L 25 33 L 44 30 Z" fill="#fdf379" />
                </svg>
              </div>
              {/* Checkmark */}
              <div className="absolute -top-7 right-2 transform rotate-12 flex flex-col items-center">
                <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 25 55 L 45 75 L 80 25" />
                </svg>
                <span className="font-extrabold text-black text-sm -mt-2 tracking-widest transform -rotate-6">check</span>
              </div>
              {/* Content */}
              <h4 className="font-extrabold text-black text-[18px] mb-3 mt-2 pr-14 tracking-wide leading-tight">
                魅力
              </h4>
              <div className="text-black font-bold leading-[1.8] whitespace-pre-wrap text-[15px]">
                {club.recruitment?.appeal || "新入生歓迎！"}
              </div>
              {/* Folded corner */}
              <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[64px] h-[64px] bg-[#d5c731] transform rotate-45 translate-x-3 translate-y-3 shadow-[-3px_-3px_5px_rgba(0,0,0,0.2)] opacity-90"></div>
              </div>
            </div>
          </div>

          {/* 大変なところ (課題) - Purple Sticky Note - RIGHT */}
          {club.recruitment?.challenges && (
            <div className="relative pt-8 pl-2 pb-4 pr-6">
              <div className="bg-[#bda8e6] p-6 md:p-8 shadow-[4px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.2)] transition-shadow transform rotate-2 min-h-[160px] relative">
                {/* Tape top-left */}
                <div className="absolute -top-3 left-4 w-24 h-8 bg-white/70 backdrop-blur-md shadow-sm transform -rotate-6 overflow-hidden border-x border-y border-gray-300">
                  <div className="w-full h-full opacity-40 mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>
                </div>
                {/* Rain cloud top-right */}
                <svg width="80" height="80" viewBox="0 0 100 100" className="absolute top-2 right-4 text-black drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 30 55 Q 25 55 25 45 Q 25 35 35 35 Q 40 20 60 20 Q 75 20 80 35 Q 90 35 90 45 Q 90 55 80 55 Z" fill="#bda8e6" />
                  <path d="M 40 65 L 37 75 M 55 68 L 52 78 M 70 65 L 67 75 M 46 82 L 43 92 M 61 80 L 58 90" strokeLinecap="round" strokeWidth="4" />
                </svg>
                {/* Bottom-left motion lines */}
                <svg width="38" height="38" viewBox="0 0 100 100" className="absolute bottom-3 left-3 text-black drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                  <path d="M 20 60 Q 30 75 40 90" />
                  <path d="M 40 40 Q 50 60 60 80" />
                </svg>
                {/* Bottom-right exclamation mark */}
                <svg width="30" height="46" viewBox="0 0 40 100" className="absolute bottom-4 right-5 text-black drop-shadow-sm transform -rotate-12">
                  <path d="M 12 10 L 28 5 L 24 65 L 16 65 Z" fill="#bda8e6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="85" r="7" fill="currentColor" />
                </svg>
                {/* Content */}
                <h4 className="font-extrabold text-black text-[18px] mb-3 mt-2 ml-4 pr-20 tracking-wide leading-tight">
                  大変なところ
                </h4>
                <div className="text-black font-bold leading-[1.8] whitespace-pre-wrap text-[15px] ml-4 pr-8">
                  {club.recruitment.challenges}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation & Footer Meta */}
      <div className="max-w-7xl mx-auto px-6 mt-16 mb-12 py-8 border-t border-outline-variant/10 space-y-12">
        {/* Navigation - Bottom Left */}
        <div className="flex flex-wrap gap-8 items-center border-l-4 border-primary pl-6 py-2">
          <Link
            href={`/clubs/${categorySlug}`}
            className="group flex items-center gap-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-all"
          >
            <div className="p-2 rounded-full border border-outline-variant group-hover:bg-primary-container group-hover:border-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>カテゴリへ戻る</span>
          </Link>
          <Link
            href="/clubs"
            className="group flex items-center gap-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-all"
          >
            <div className="p-2 rounded-full border border-outline-variant group-hover:bg-primary-container group-hover:border-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>サークル情報ホーム</span>
          </Link>
        </div>

        {/* Status Info (Metadata) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex-1"></div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-right">
            <p className="text-sm text-on-surface-variant font-medium">最終更新日: {club.lastUpdated || "2024-03-20"}</p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeMkj-o5DL1o-pmjrAtCTabjB2v5_1BCa33hCpvHvHE21rjjQ/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full border border-outline text-on-surface-variant text-sm font-bold hover:bg-surface-container-highest hover:border-primary transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              掲載情報修正依頼
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
