import React from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { ScreenId } from './types/kimakwami';
import { AppShell } from './components/AppShell';
import { LoginScreen, RegisterScreen, WelcomeScreen } from './screens/AuthScreens';
import {
  ClientDashboardScreen,
  ClientMembershipScreen,
  ClientNotificationsScreen,
  ClientProfileScreen,
  ClientProgressScreen,
  ClientScheduleScreen,
  ClientTrainerScreen,
  ClientWorkoutsScreen,
} from './screens/ClientScreens';
import {
  TrainerClientDetailScreen,
  TrainerClientsScreen,
  TrainerDashboardScreen,
  TrainerNotificationsScreen,
  TrainerScheduleScreen,
  TrainerWorkoutsScreen,
} from './screens/TrainerScreens';
import {
  AdminClientsScreen,
  AdminDashboardScreen,
  AdminFinanceScreen,
  AdminPlansScreen,
  AdminReportsScreen,
  AdminTrainersScreen,
} from './screens/AdminScreens';

const SCREEN_META: Record<ScreenId, { title: string; backTo?: ScreenId }> = {
  welcome: { title: 'KIMAKWAMI FITNESS' },
  login: { title: 'Autenticação' },
  register: { title: 'Criar Conta' },
  // Client
  'client-dashboard': { title: 'Início' },
  'client-membership': { title: 'Plano & Pagamentos', backTo: 'client-dashboard' },
  'client-workouts': { title: 'Meus Treinos' },
  'client-schedule': { title: 'Agenda & Sessões' },
  'client-trainer': { title: 'Personal Trainer', backTo: 'client-profile' },
  'client-progress': { title: 'Evolução Física' },
  'client-notifications': { title: 'Notificações', backTo: 'client-dashboard' },
  'client-profile': { title: 'Perfil & Definições' },
  // Trainer
  'trainer-dashboard': { title: 'Painel do Treinador' },
  'trainer-clients': { title: 'Clientes Associados' },
  'trainer-client-detail': { title: 'Perfil do Cliente', backTo: 'trainer-clients' },
  'trainer-workouts': { title: 'Planos de Treino' },
  'trainer-schedule': { title: 'Agenda do Treinador' },
  'trainer-notifications': { title: 'Avisos & Histórico' },
  // Admin
  'admin-dashboard': { title: 'Painel Administrativo' },
  'admin-clients': { title: 'Clientes & Inscrições' },
  'admin-trainers': { title: 'Personal Trainers', backTo: 'admin-clients' },
  'admin-plans': { title: 'Planos & Mensalidades' },
  'admin-finance': { title: 'Finanças & Pagamentos' },
  'admin-reports': { title: 'Relatórios & Avisos' },
};

const ToastStack: React.FC = () => {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-xl px-4 py-3 shadow-lg border flex items-center gap-3 text-xs font-semibold ${
            t.type === 'error'
              ? 'bg-rose-950 text-white border-rose-800'
              : t.type === 'info'
              ? 'bg-[#062C24] text-white border-[#115345]'
              : 'bg-[#062C24] text-white border-[#84CC16]/50'
          }`}
        >
          {t.type === 'error' ? (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : t.type === 'info' ? (
            <Info className="w-4 h-4 text-[#A3E635] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />
          )}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Fechar aviso"
            className="p-1 text-white/70 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const ScreenRouter: React.FC = () => {
  const { screen, session } = useApp();

  if (!session || screen === 'welcome' || screen === 'login' || screen === 'register') {
    if (screen === 'login') return <LoginScreen />;
    if (screen === 'register') return <RegisterScreen />;
    return <WelcomeScreen />;
  }

  const meta = SCREEN_META[screen] || { title: 'KIMAKWAMI FITNESS' };

  const renderScreen = () => {
    switch (screen) {
      case 'client-dashboard':
        return <ClientDashboardScreen />;
      case 'client-membership':
        return <ClientMembershipScreen />;
      case 'client-workouts':
        return <ClientWorkoutsScreen />;
      case 'client-schedule':
        return <ClientScheduleScreen />;
      case 'client-trainer':
        return <ClientTrainerScreen />;
      case 'client-progress':
        return <ClientProgressScreen />;
      case 'client-notifications':
        return <ClientNotificationsScreen />;
      case 'client-profile':
        return <ClientProfileScreen />;

      case 'trainer-dashboard':
        return <TrainerDashboardScreen />;
      case 'trainer-clients':
        return <TrainerClientsScreen />;
      case 'trainer-client-detail':
        return <TrainerClientDetailScreen />;
      case 'trainer-workouts':
        return <TrainerWorkoutsScreen />;
      case 'trainer-schedule':
        return <TrainerScheduleScreen />;
      case 'trainer-notifications':
        return <TrainerNotificationsScreen />;

      case 'admin-dashboard':
        return <AdminDashboardScreen />;
      case 'admin-clients':
        return <AdminClientsScreen />;
      case 'admin-trainers':
        return <AdminTrainersScreen />;
      case 'admin-plans':
        return <AdminPlansScreen />;
      case 'admin-finance':
        return <AdminFinanceScreen />;
      case 'admin-reports':
        return <AdminReportsScreen />;

      default:
        return <ClientDashboardScreen />;
    }
  };

  return (
    <AppShell title={meta.title} backTo={meta.backTo}>
      {renderScreen()}
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
      <ToastStack />
    </AppProvider>
  );
}
