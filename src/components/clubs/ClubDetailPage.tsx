'use client';
import { useState, useEffect } from 'react';
import { ClubDetail } from '@/types/club';
import OverviewSection from './sections/OverviewSection';
import OperationsSection from './sections/OperationsSection';
import MembershipSection from './sections/MembershipSection';
import ScheduleSection from './sections/ScheduleSection';
import RecruitmentSection from './sections/RecruitmentSection';
import ContactSection from './sections/ContactSection';
import { ArrowLeft, Menu, X } from 'lucide-react';

interface ClubDetailPageProps {
  club: ClubDetail;
  categorySlug: string;
}

export default function ClubDetailPage({ club, categorySlug }: ClubDetailPageProps) {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'overview', label: '概要', icon: '📋' },
    { id: 'operations', label: '活動実態', icon: '🏢' },
    { id: 'membership', label: 'メンバー構成', icon: '👥' },
    { id: 'schedule', label: '活動頻度/場所', icon: '📅' },
    { id: 'recruitment', label: '入会情報', icon: '🎯' },
    { id: 'contact', label: '連絡先', icon: '📞' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map(nav => nav.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Header offset
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation */}
      <nav className="sticky top-16 z-40 glass-card border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {navigation.find(item => item.id === activeSection)?.label}
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
              <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-accent/10 text-accent'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Club Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8">
          {club.thumbnail && (
            <div className="mb-6 h-48 sm:h-64 overflow-hidden rounded-2xl">
              <img 
                src={club.thumbnail} 
                alt={`${club.nameJa} thumbnail`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {club.nameJa}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
                {club.nameEn}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {club.category}
                </span>
                {club.metadata && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
                    {club.metadata}
                  </span>
                )}
              </div>

              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {club.description || '詳細な説明は準備中です。'}
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 pb-16">
          <OverviewSection club={club} />
          <OperationsSection club={club} />
          <MembershipSection club={club} />
          <ScheduleSection club={club} />
          <RecruitmentSection club={club} />
          <ContactSection club={club} />
        </div>
      </div>
    </div>
  );
}
