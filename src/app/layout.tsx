import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Target, LineChart, Users, SquareStack } from 'lucide-react';
import "./globals.css";

export const metadata: Metadata = {
  title: "Automatický dotazovač",
  description: "Správa a vyhodnocení n8n kampaní",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="layout-container">
          <aside className="sidebar">
            <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SquareStack color="var(--primary)" size={24} />
              <span style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Dolphin HR</span>
            </div>
            <nav className="nav-links">
              <Link href="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LayoutDashboard size={18} /> Přehled</Link>
              <Link href="/campaigns" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Target size={18} /> Kampaně</Link>
              <Link href="/analytics" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LineChart size={18} /> Analytika</Link>
              <Link href="/colleagues" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={18} /> Zaměstnanci</Link>
            </nav>
          </aside>
          
          <div className="main-content">
            <header className="topbar">
              Správa automatického dotazovače
            </header>
            <main className="page-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
