"use client";

import { Instagram } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';
import { SiLine } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="w-full mt-auto border-t border-outline-variant/30 bg-surface-container-low pb-24 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-12 w-full">
        <div className="md:col-span-4">
          <div className="font-bold text-on-surface text-xl mb-4">Strait</div>
          <p className="text-xs font-medium text-on-surface-variant max-w-xs leading-relaxed">
            © Strait 2026- Tokyo University of Foreign Studies Information Platform.
          </p>
        </div>
        <div className="md:col-span-8 flex flex-col md:flex-row justify-end gap-12 md:gap-24">
          <div className="flex flex-col items-start md:mt-10">
            <div className="flex gap-4">
              <a href="https://www.instagram.com/tufs_ai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-on-surface-variant hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://lin.ee/ukNINCZ" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-on-surface-variant hover:text-[#06C755]">
                <SiLine className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-on-surface mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/disclaimer">免責事項</Link></li>
              <li><Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/privacy">プライバシーポリシー</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-on-surface mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="https://docs.google.com/forms/d/e/1FAIpQLSckuJrcfuzOmyxf6cbxi09oYJNQNXc-E9M4V0LoBsgKaXcLqQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer">Contact</a></li>
            </ul>
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
              aria-label={theme === 'dark' ? 'ライトテーマに切り替える' : 'ダークテーマに切り替える'}
              title={theme === 'dark' ? 'ライトテーマ' : 'ダークテーマ'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === 'dark' ? 'ライト' : 'ダーク'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
