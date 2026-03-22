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
              className="object-cover"
              preload
              sizes="(max-width: 1280px) 100vw, 1280px"
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
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-primary uppercase mb-1">頻度・場所</p>
                <p className="font-medium">{club.schedule?.frequency || "週数回"}</p>
                <p className="text-sm text-on-surface-variant">{club.schedule?.location || "学内施設"}</p>
              </div>
              <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                <p className="text-xs font-bold text-primary uppercase mb-1">アピールポイント (魅力)</p>
                <p className="text-sm italic leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                  {club.recruitment?.appeal || "新入生歓迎！"}
                </p>
              </div>
              {club.recruitment?.challenges && (
                <div className="p-4 bg-error/5 border-l-4 border-error rounded-r-lg">
                  <p className="text-xs font-bold text-error uppercase mb-1">大変なところ (課題)</p>
                  <p className="text-sm italic leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                    {club.recruitment.challenges}
                  </p>
                </div>
              )}
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
