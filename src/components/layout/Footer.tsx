import { Globe, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-slate-200/50 bg-surface-container-low">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-12 max-w-[1440px] mx-auto">
        <div className="md:col-span-4">
          <div className="font-bold text-slate-900 text-xl mb-4">Strait</div>
          <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
            © Strait 2026- Tokyo University of Foreign Studies Information Platform.
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
  );
}
