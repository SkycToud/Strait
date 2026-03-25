import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-slate-200/50 bg-surface-container-low">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-12 w-full">
        <div className="md:col-span-4">
          <div className="font-bold text-slate-900 text-xl mb-4">Strait</div>
          <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
            © Strait 2026- Tokyo University of Foreign Studies Information Platform.
          </p>
        </div>
        <div className="md:col-span-8 flex flex-col md:flex-row justify-end gap-12 md:gap-24">
          <div className="flex flex-col items-start md:mt-10">
            <div className="flex gap-4">
              <a href="https://www.instagram.com/tufs_ai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-on-surface-variant hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-on-surface mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Help</a></li>
              <li><a className="text-xs text-slate-500 hover:text-primary transition-colors" href="https://docs.google.com/forms/d/e/1FAIpQLSckuJrcfuzOmyxf6cbxi09oYJNQNXc-E9M4V0LoBsgKaXcLqQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
