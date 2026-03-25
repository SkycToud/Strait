'use client';

import { useState } from 'react';
import { ClubDetail } from '@/types/club';
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

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
    const match = str.match(/(\d+)\s*月[:：]\s*(.*)/);
    if (match) {
      return { month: match[1].padStart(2, '0'), event: match[2] };
    }
    return { month: '--', event: str };
  };

  return (
    <main className="pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl shadow-blue-900/5">
          {club.thumbnail ? (
            <Image
              alt={club.nameJa}
              src={club.thumbnail}
              fill
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-container flex items-center justify-center text-on-surface-variant font-bold text-2xl">
              {club.nameJa}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 lg:p-12 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-sm font-medium border border-primary/30">公認サークル</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 font-headline">{club.nameJa}</h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl font-body leading-relaxed">
              {club.description || "Enjoy activities and team bonding within the community."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Overview & Status */}
        <div className="lg:col-span-8 space-y-8">
          {/* 概要 (Overview) */}
          <section className="bg-surface-container-low p-8 rounded-xl">
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
          <section className="bg-surface-container-low p-8 rounded-xl">
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
          <section className="bg-surface-container-low p-8 rounded-xl">
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

        {/* Right Column: Member Profile & Admission */}
        <div className="lg:col-span-4 space-y-8 sticky top-24 self-start">
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
                  <div className={`grid ${y5 > 0 ? 'grid-cols-5' : 'grid-cols-4'} gap-1 mt-2 text-[10px] text-center font-bold`}>
                    <div>1st: {y1}</div>
                    <div>2nd: {y2}</div>
                    <div>3rd: {y3}</div>
                    <div>4th: {y4}</div>
                    {y5 > 0 && <div>Grad: {y5}</div>}
                  </div>
                </div>
                <div className="pt-4 border-t border-outline-variant/10">
                  <p className="text-xs font-bold text-primary uppercase mb-1">学内/学外</p>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                    <span className="text-sm font-bold">
                      {club.membership?.isIntraUniversity !== false ? "学内サークル (外大生のみ)" : "インカレサークル"}
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
            <div>
              <p className="text-xs font-bold text-primary uppercase mb-1">頻度・場所</p>
              <p className="font-medium">{club.schedule?.frequency || "週数回"}</p>
              <p className="text-sm text-on-surface-variant">{club.schedule?.location || "学内施設"}</p>
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
                  <p className="text-sm opacity-90">{club.recruitment?.welcomeEvents || "4月から開始します。"}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-primary-container">payments</span>
                <div>
                  <p className="font-bold">年会費</p>
                  <p className="text-sm opacity-90">{club.recruitment?.annualFee || "未定"}</p>
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
                  <div className="text-sm opacity-90 space-y-1 mt-1">
                    <p>
                      <span className="font-semibold text-primary">対象学年:</span>{' '}
                      {club.recruitment?.targetGrades?.length > 0
                        ? club.recruitment.targetGrades.join('、')
                        : "指定なし"}
                    </p>
                    {club.recruitment?.targetAudience && (
                      <p className="whitespace-pre-wrap">{club.recruitment.targetAudience}</p>
                    )}
                  </div>
                </div>
              </li>
            </ul>
            {club.instagram && (
              <a
                href={club.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-opacity-90 transition-all active:scale-95 shadow-lg"
              >
                Instagramで問い合わせる
              </a>
            )}
          </section>

          {/* SNS情報 (Social Media) */}
          <section className="bg-surface-container-low p-6 rounded-xl text-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">SNS情報</h3>
            <div className="flex justify-around items-center">
              {club.instagram && (
                <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary transition-colors shadow-sm group" href={club.instagram} target="_blank" title="Instagram">
                  <span className="material-symbols-outlined">camera_style</span>
                </a>
              )}
              {club.xUrl && (
                <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary transition-colors shadow-sm group" href={club.xUrl} target="_blank" title="X">
                  <span className="material-symbols-outlined">alternate_email</span>
                </a>
              )}
              {club.recruitment?.contact?.website && (
                <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary transition-colors shadow-sm group" href={club.recruitment.contact.website} target="_blank" title="HP">
                  <span className="material-symbols-outlined">language</span>
                </a>
              )}
              {club.recruitment?.contact?.line && (
                <a className="p-3 bg-surface-container-lowest rounded-full hover:text-primary transition-colors shadow-sm group" href={club.recruitment.contact.line} target="_blank" title="LINE">
                  <span className="material-symbols-outlined">chat</span>
                </a>
              )}
            </div>
            {!club.instagram && !club.xUrl && !club.recruitment?.contact?.website && (
              <p className="text-sm text-on-surface-variant">SNS情報は登録されていません。</p>
            )}
          </section>
        </div>
      </div>

      {/* Full-width Appeal / Challenges sticky note row */}
      {(club.recruitment?.appeal || club.recruitment?.challenges) && (
        <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* アピールポイント (魅力) - Yellow Sticky Note */}
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

          {/* 大変なところ (課題) - Purple Sticky Note */}
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

      {/* Footer Meta */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-12 flex flex-col md:flex-row justify-between items-center py-8 border-t border-outline-variant/10 gap-6">
        <p className="text-sm text-on-surface-variant">最終更新日: {club.lastUpdated || "2024-03-20"}</p>
        <button className="px-6 py-2.5 rounded-full border border-outline text-on-surface-variant text-sm font-bold hover:bg-surface-container-highest hover:border-primary transition-all">
          掲載情報修正依頼
        </button>
      </div>
    </main>
  );
}
