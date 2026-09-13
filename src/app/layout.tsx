import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/common/Header';
import { MobileNav } from '../components/common/MobileNav';
import { CommandPalette } from '../components/common/CommandPalette';
import { AIChatPanel } from '../components/ai/AIChatPanel';
import { FloorPlanModal } from '../components/map/FloorPlanModal';
import { MaintenanceWizard } from '../components/reports/MaintenanceWizard';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: 'CAMPUS TWIN | Amity University Spatial Digital Twin',
  description: 'Amity University Spatial Digital Twin. Explore buildings, navigate rooms, check cafeteria crowd levels, log maintenance reports, & consult AI Campus Assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-[#f8fafc] text-slate-900 font-sans antialiased min-h-screen flex flex-col pb-16 lg:pb-0 selection:bg-cyan-100 selection:text-cyan-900">
        <Header />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />

        {/* Global Modals & Overlays */}
        <CommandPalette />
        <AIChatPanel />
        <FloorPlanModal />
        <MaintenanceWizard />

        <footer className="border-t border-slate-200/80 bg-white py-6 mt-8 hidden lg:block text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
              CAMPUS TWIN • Amity University Digital Twin System
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Spatial Telemetry v2.4</span>
              <span>•</span>
              <span>Enterprise Spatial Intelligence</span>
              <span>•</span>
              <a href="/admin" className="hover:text-cyan-600 font-medium">Admin Operations</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
