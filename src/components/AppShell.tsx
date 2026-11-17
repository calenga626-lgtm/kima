import React from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  Dumbbell,
  Home,
  LogOut,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenId, UserRole } from '../types/kimakwami';
import { AvatarImage, BrandLogo } from './BrandLogo';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CLIENT_NAV: NavItem[] = [
  { id: 'client-dashboard', label: 'Início', icon: Home },
  { id: 'client-workouts', label: 'Treinos', icon: Dumbbell },
  { id: 'client-schedule', label: 'Agenda', icon: CalendarDays },
  { id: 'client-progress', label: 'Evolução', icon: Activity },
  { id: 'client-profile', label: 'Perfil', icon: Users },
];

const TRAINER_NAV: NavItem[] = [
  { id: 'trainer-dashboard', label: 'Início', icon: Home },
  { id: 'trainer-clients', label: 'Clientes', icon: Users },
  { id: 'trainer-workouts', label: 'Planos', icon: Dumbbell },
  { id: 'trainer-schedule', label: 'Agenda', icon: CalendarDays },
  { id: 'trainer-notifications', label: 'Avisos', icon: Bell },
];

const ADMIN_NAV: NavItem[] = [
  { id: 'admin-dashboard', label: 'Painel', icon: Home },
  { id: 'admin-clients', label: 'Clientes', icon: Users },
  { id: 'admin-plans', label: 'Planos', icon: CreditCard },
  { id: 'admin-finance', label: 'Finanças', icon: Wallet },
  { id: 'admin-reports', label: 'Relatórios', icon: BarChart3 },
];

interface AppShellProps {
  title: string;
  backTo?: ScreenId;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ title, backTo, children }) => {
  const { db, session, screen, navigate, logout } = useApp();

  if (!session) return <>{children}</>;

  const role: UserRole = session.role;
  const navItems =
    role === 'client' ? CLIENT_NAV : role === 'trainer' ? TRAINER_NAV : ADMIN_NAV;

  const currentUser =
    role === 'client'
      ? db.clients.find((c) => c.id === session.userId)
      : role === 'trainer'
      ? db.trainers.find((t) => t.id === session.userId)
      : db.admins.find((a) => a.id === session.userId);

  const unreadCount = db.notifications.filter((n) => {
    if (n.read) return false;
    return (
      n.targetRole === 'all' ||
      (n.targetRole === role && (!n.targetUserId || n.targetUserId === session.userId))
    );
  }).length;

  const notifTarget: ScreenId =
    role === 'client'
      ? 'client-notifications'
      : role === 'trainer'
      ? 'trainer-notifications'
      : 'admin-reports';

  const roleLabel =
    role === 'client' ? 'Área do Cliente' : role === 'trainer' ? 'Personal Trainer' : 'Administração';

  const isNavActive = (itemId: ScreenId) => {
    if (screen === itemId) return true;
    if (itemId === 'trainer-clients' && screen === 'trainer-client-detail') return true;
    if (itemId === 'client-profile' && (screen === 'client-membership' || screen === 'client-trainer'))
      return true;
    if (itemId === 'admin-clients' && screen === 'admin-trainers') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F6F9F8] text-[#062C24] flex flex-col lg:flex-row">
      {/* Desktop Left Navigation Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#062C24] text-white border-r border-[#0F473B] z-30">
        <div className="px-5 py-5 border-b border-white/10">
          <BrandLogo variant="light" size="sm" showSlogan />
        </div>

        <div className="px-5 py-3 text-[11px] font-semibold tracking-wider text-[#A3E635] uppercase">
          {roleLabel}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Navegação principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#84CC16] text-[#062C24] font-semibold'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {role === 'client' && (
            <>
              <button
                type="button"
                onClick={() => navigate('client-membership')}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  screen === 'client-membership'
                    ? 'bg-[#84CC16] text-[#062C24] font-semibold'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Plano & Pagamentos</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('client-trainer')}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  screen === 'client-trainer'
                    ? 'bg-[#84CC16] text-[#062C24] font-semibold'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Meu Treinador</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <button
              type="button"
              onClick={() => navigate('admin-trainers')}
              className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                screen === 'admin-trainers'
                  ? 'bg-[#84CC16] text-[#062C24] font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Personal Trainers</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <AvatarImage
              src={currentUser?.avatar}
              alt={currentUser?.name || 'Utilizador'}
              sizeClass="w-10 h-10"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-xs text-emerald-100/70 truncate">{currentUser?.unit}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Trocar de Perfil</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Compact Sticky Mobile/Desktop Header (52px high) */}
        <header className="sticky top-0 z-30 h-[52px] bg-white/95 backdrop-blur-md border-b border-[#E2EAE7] px-4 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {backTo ? (
              <button
                type="button"
                onClick={() => navigate(backTo)}
                aria-label="Voltar"
                className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-xl text-[#062C24] hover:bg-[#F1F6F4] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(navItems[0].id)}
                className="lg:hidden flex items-center"
                aria-label="Início KIMAKWAMI FITNESS"
              >
                <BrandLogo size="sm" />
              </button>
            )}
            <h1 className="text-base lg:text-lg font-bold text-[#062C24] truncate">
              {backTo || role ? title : ''}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate(notifTarget)}
              aria-label="Ver notificações"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#062C24] hover:bg-[#F1F6F4] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#84CC16] text-[#062C24] text-[10px] font-bold font-mono flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={logout}
              aria-label="Trocar de perfil ou sair"
              title="Trocar de Perfil"
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#4A635D] hover:bg-[#F1F6F4] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Scrollable Viewport */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 lg:px-8 pt-4 pb-24 lg:pb-10">
          {children}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar (60px high, thumb-ergonomic) */}
        <nav
          aria-label="Navegação móvel"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EAE7] pb-safe"
        >
          <div className="grid grid-cols-5 h-[60px] items-center max-w-xl mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`min-h-[44px] h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                    active ? 'text-[#062C24]' : 'text-[#6D857E] hover:text-[#062C24]'
                  }`}
                >
                  <div
                    className={`px-3 py-1 rounded-full transition-colors ${
                      active ? 'bg-[#84CC16]/30 text-[#062C24]' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] tracking-tight whitespace-nowrap ${
                      active ? 'font-bold text-[#062C24]' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
