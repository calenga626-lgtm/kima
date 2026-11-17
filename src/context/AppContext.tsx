import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_DB, ASSETS } from '../data/seedData';
import {
  AppNotification,
  BodyMetricLog,
  ClientProfile,
  CurrentSession,
  GymUnit,
  KimakwamiDatabase,
  MembershipPlan,
  MembershipStatus,
  PaymentMethod,
  PaymentRecord,
  ScreenId,
  SessionBooking,
  SessionStatus,
  ToastMessage,
  TrainerProfile,
  UserRole,
  WorkoutPlan,
} from '../types/kimakwami';
import { generateId } from '../utils/formatters';

const STORAGE_KEY_DB = 'kimakwami_fitness_db_v1';
const STORAGE_KEY_SESSION = 'kimakwami_fitness_session_v1';

interface AppContextValue {
  db: KimakwamiDatabase;
  session: CurrentSession | null;
  screen: ScreenId;
  selectedClientId: string | null;
  toasts: ToastMessage[];
  navigate: (screen: ScreenId, options?: { clientId?: string }) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Auth
  loginDemo: (role: UserRole) => void;
  loginWithCredentials: (role: UserRole, identifier: string, password: string) => boolean;
  registerClient: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    unit: GymUnit;
    planId: string;
    goal: string;
  }) => void;
  logout: () => void;

  // Client Actions
  toggleWorkoutCompletedToday: (workoutId: string) => void;
  bookSession: (input: {
    clientId: string;
    trainerId: string;
    date: string;
    time: string;
    type: SessionBooking['type'];
    unit: GymUnit;
    notes?: string;
  }) => void;
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  requestPlanRenewal: (clientId: string, planId: string, method: PaymentMethod) => void;
  sendMessageToTrainer: (clientName: string, trainerId: string, text: string) => void;
  updateClientOwnProfile: (clientId: string, patch: Partial<ClientProfile>) => void;

  // Trainer Actions
  saveWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'completedDates'> & { id?: string }) => void;
  addBodyMetricLog: (log: Omit<BodyMetricLog, 'id'>) => void;
  updateTrainerOwnProfile: (trainerId: string, patch: Partial<TrainerProfile>) => void;

  // Admin Actions
  upsertClient: (client: Omit<ClientProfile, 'id' | 'joinedAt' | 'monthlyCheckIns'> & { id?: string }) => void;
  upsertTrainer: (trainer: Omit<TrainerProfile, 'id'> & { id?: string }) => void;
  upsertPlan: (plan: Omit<MembershipPlan, 'id'> & { id?: string }) => void;
  recordPayment: (input: {
    clientId: string;
    planId: string;
    amountKz: number;
    method: PaymentMethod;
    status: 'Pago' | 'Pendente';
  }) => void;
  updatePaymentStatus: (paymentId: string, status: 'Pago' | 'Pendente') => void;
  sendBroadcastNotification: (input: {
    targetRole: UserRole | 'all';
    title: string;
    message: string;
    category: AppNotification['category'];
  }) => void;

  // Notifications & System
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: UserRole, userId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadDb(): KimakwamiDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DB);
    if (!raw) return INITIAL_DB;
    const parsed = JSON.parse(raw) as KimakwamiDatabase;
    if (!parsed.clients || !parsed.plans || !parsed.trainers) return INITIAL_DB;
    return parsed;
  } catch {
    return INITIAL_DB;
  }
}

function loadSession(): CurrentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as CurrentSession;
  } catch {
    return null;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<KimakwamiDatabase>(loadDb);
  const [session, setSession] = useState<CurrentSession | null>(loadSession);
  const [screen, setScreen] = useState<ScreenId>(() => {
    const s = loadSession();
    if (!s) return 'welcome';
    if (s.role === 'client') return 'client-dashboard';
    if (s.role === 'trainer') return 'trainer-dashboard';
    return 'admin-dashboard';
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(db));
    } catch {
      // Ignore storage quota issues in restricted environments
    }
  }, [db]);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch {
      // Ignore
    }
  }, [session]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (nextScreen: ScreenId, options?: { clientId?: string }) => {
    if (options?.clientId !== undefined) {
      setSelectedClientId(options.clientId);
    }
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginDemo = (role: UserRole) => {
    if (role === 'client') {
      const client = db.clients[0];
      setSession({ role: 'client', userId: client.id });
      navigate('client-dashboard');
      showToast(`Bem-vindo, ${client.name.split(' ')[0]}!`);
    } else if (role === 'trainer') {
      const trainer = db.trainers[0];
      setSession({ role: 'trainer', userId: trainer.id });
      navigate('trainer-dashboard');
      showToast(`Sessão iniciada como PT ${trainer.name}`);
    } else {
      const admin = db.admins[0];
      setSession({ role: 'admin', userId: admin.id });
      navigate('admin-dashboard');
      showToast(`Painel Administrativo · ${admin.name}`);
    }
  };

  const loginWithCredentials = (role: UserRole, identifier: string, password: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\s+/g, '');

    if (role === 'client') {
      const match = db.clients.find(
        (c) =>
          (c.email.toLowerCase() === cleanId || c.phone.replace(/\s+/g, '') === cleanPhone) &&
          c.password === password
      );
      if (!match) return false;
      setSession({ role: 'client', userId: match.id });
      navigate('client-dashboard');
      showToast(`Bem-vindo de volta, ${match.name.split(' ')[0]}!`);
      return true;
    }

    if (role === 'trainer') {
      const match = db.trainers.find(
        (t) =>
          (t.email.toLowerCase() === cleanId || t.phone.replace(/\s+/g, '') === cleanPhone) &&
          t.password === password
      );
      if (!match) return false;
      setSession({ role: 'trainer', userId: match.id });
      navigate('trainer-dashboard');
      showToast(`Sessão iniciada · PT ${match.name}`);
      return true;
    }

    const match = db.admins.find(
      (a) =>
        (a.email.toLowerCase() === cleanId || a.phone.replace(/\s+/g, '') === cleanPhone) &&
        a.password === password
    );
    if (!match) return false;
    setSession({ role: 'admin', userId: match.id });
    navigate('admin-dashboard');
    showToast(`Bem-vinda, ${match.name}`);
    return true;
  };

  const registerClient = (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    unit: GymUnit;
    planId: string;
    goal: string;
  }) => {
    const plan = db.plans.find((p) => p.id === input.planId) || db.plans[0];
    const validDate = new Date('2026-11-17T00:00:00');
    validDate.setDate(validDate.getDate() + plan.durationDays);
    const validUntil = validDate.toISOString().split('T')[0];

    const newClient: ClientProfile = {
      id: generateId('cl'),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      password: input.password,
      avatar: ASSETS.avatarClientMale,
      unit: input.unit,
      goal: input.goal.trim() || 'Condicionamento físico geral',
      planId: plan.id,
      membershipStatus: 'Ativa',
      validUntil,
      joinedAt: '2026-11-17',
      trainerId: db.trainers.find((t) => t.unit === input.unit)?.id || db.trainers[0].id,
      birthDate: '1996-05-10',
      emergencyContact: '+244 923 000 100',
      monthlyCheckIns: 1,
    };

    const payment: PaymentRecord = {
      id: generateId('pay'),
      reference: `KM-2026-${Math.floor(1200 + Math.random() * 800)}`,
      clientId: newClient.id,
      planId: plan.id,
      planName: plan.name,
      amountKz: plan.priceKz,
      method: 'Multicaixa Express',
      status: 'Pago',
      date: '2026-11-17',
      recordedBy: 'Registo Online (Demo)',
    };

    const welcomeNotif: AppNotification = {
      id: generateId('not'),
      targetRole: 'client',
      targetUserId: newClient.id,
      title: 'Bem-vindo à KIMAKWAMI FITNESS',
      message: `A sua adesão ao plano ${plan.name} está ativa na unidade ${input.unit}.`,
      category: 'Inscrição',
      createdAt: '2026-11-17 15:15',
      read: false,
    };

    setDb((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients],
      payments: [payment, ...prev.payments],
      notifications: [welcomeNotif, ...prev.notifications],
    }));

    setSession({ role: 'client', userId: newClient.id });
    navigate('client-dashboard');
    showToast('Conta demonstrativa criada e ativada!');
  };

  const logout = () => {
    setSession(null);
    setSelectedClientId(null);
    navigate('login');
    showToast('Sessão terminada com segurança.', 'info');
  };

  const toggleWorkoutCompletedToday = (workoutId: string) => {
    const today = '2026-11-17';
    setDb((prev) => {
      const workouts = prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        const already = w.completedDates.includes(today);
        const completedDates = already
          ? w.completedDates.filter((d) => d !== today)
          : [...w.completedDates, today];
        return { ...w, completedDates };
      });
      return { ...prev, workouts };
    });
    showToast('Progresso do treino atualizado!');
  };

  const bookSession = (input: {
    clientId: string;
    trainerId: string;
    date: string;
    time: string;
    type: SessionBooking['type'];
    unit: GymUnit;
    notes?: string;
  }) => {
    const client = db.clients.find((c) => c.id === input.clientId);
    const newBooking: SessionBooking = {
      id: generateId('ses'),
      clientId: input.clientId,
      trainerId: input.trainerId,
      date: input.date,
      time: input.time,
      type: input.type,
      unit: input.unit,
      status: 'Pendente',
      notes: input.notes,
    };

    const notif: AppNotification = {
      id: generateId('not'),
      targetRole: 'trainer',
      targetUserId: input.trainerId,
      title: 'Nova marcação solicitada',
      message: `${client?.name || 'Cliente'} pediu ${input.type} para ${input.date} às ${input.time}.`,
      category: 'Agenda',
      createdAt: '2026-11-17 15:18',
      read: false,
    };

    setDb((prev) => ({
      ...prev,
      sessions: [newBooking, ...prev.sessions],
      notifications: [notif, ...prev.notifications],
    }));
    showToast('Sessão marcada! Aguardar confirmação do treinador.');
  };

  const updateSessionStatus = (sessionId: string, status: SessionStatus) => {
    const targetSession = db.sessions.find((s) => s.id === sessionId);
    setDb((prev) => {
      const sessions = prev.sessions.map((s) => (s.id === sessionId ? { ...s, status } : s));
      const notifications = targetSession
        ? [
            {
              id: generateId('not'),
              targetRole: 'client' as const,
              targetUserId: targetSession.clientId,
              title: `Sessão ${status.toLowerCase()}`,
              message: `A sua sessão de ${targetSession.type} (${targetSession.date} às ${targetSession.time}) foi marcada como ${status}.`,
              category: 'Agenda' as const,
              createdAt: '2026-11-17 15:20',
              read: false,
            },
            ...prev.notifications,
          ]
        : prev.notifications;
      return { ...prev, sessions, notifications };
    });
    showToast(`Estado da sessão atualizado para ${status}.`);
  };

  const requestPlanRenewal = (clientId: string, planId: string, method: PaymentMethod) => {
    const plan = db.plans.find((p) => p.id === planId);
    const client = db.clients.find((c) => c.id === clientId);
    if (!plan || !client) return;

    const baseDate = new Date('2026-11-17T00:00:00');
    baseDate.setDate(baseDate.getDate() + plan.durationDays);
    const newValidUntil = baseDate.toISOString().split('T')[0];

    const newPayment: PaymentRecord = {
      id: generateId('pay'),
      reference: `KM-2026-${Math.floor(1200 + Math.random() * 899)}`,
      clientId,
      planId: plan.id,
      planName: plan.name,
      amountKz: plan.priceKz,
      method,
      status: 'Pago',
      date: '2026-11-17',
      recordedBy: 'Portal do Cliente (Demo)',
    };

    const notif: AppNotification = {
      id: generateId('not'),
      targetRole: 'admin',
      title: 'Renovação de plano efetuada',
      message: `${client.name} renovou o plano ${plan.name} via ${method}.`,
      category: 'Pagamento',
      createdAt: '2026-11-17 15:20',
      read: false,
    };

    setDb((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === clientId
          ? { ...c, planId: plan.id, membershipStatus: 'Ativa', validUntil: newValidUntil }
          : c
      ),
      payments: [newPayment, ...prev.payments],
      notifications: [notif, ...prev.notifications],
    }));
    showToast(`Plano ${plan.name} renovado (modo demonstrativo)!`);
  };

  const sendMessageToTrainer = (clientName: string, trainerId: string, text: string) => {
    const notif: AppNotification = {
      id: generateId('not'),
      targetRole: 'trainer',
      targetUserId: trainerId,
      title: `Mensagem de ${clientName}`,
      message: text.trim(),
      category: 'Treino',
      createdAt: '2026-11-17 15:22',
      read: false,
    };
    setDb((prev) => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));
    showToast('Mensagem enviada ao seu Personal Trainer!');
  };

  const updateClientOwnProfile = (clientId: string, patch: Partial<ClientProfile>) => {
    setDb((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === clientId ? { ...c, ...patch } : c)),
    }));
    showToast('Perfil atualizado com sucesso!');
  };

  const saveWorkoutPlan = (
    plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'completedDates'> & { id?: string }
  ) => {
    const client = db.clients.find((c) => c.id === plan.clientId);
    setDb((prev) => {
      if (plan.id) {
        return {
          ...prev,
          workouts: prev.workouts.map((w) => (w.id === plan.id ? { ...w, ...plan } : w)),
        };
      }
      const created: WorkoutPlan = {
        ...plan,
        id: generateId('wk'),
        createdAt: '2026-11-17',
        completedDates: [],
      };
      const notif: AppNotification = {
        id: generateId('not'),
        targetRole: 'client',
        targetUserId: plan.clientId,
        title: 'Novo plano de treino atribuído',
        message: `O seu treinador criou "${plan.title}" (${plan.exercises.length} exercícios).`,
        category: 'Treino',
        createdAt: '2026-11-17 15:25',
        read: false,
      };
      return {
        ...prev,
        workouts: [created, ...prev.workouts],
        notifications: [notif, ...prev.notifications],
      };
    });
    showToast(
      plan.id
        ? 'Plano de treino atualizado!'
        : `Plano atribuído a ${client?.name.split(' ')[0] || 'cliente'}!`
    );
  };

  const addBodyMetricLog = (log: Omit<BodyMetricLog, 'id'>) => {
    const created: BodyMetricLog = { ...log, id: generateId('met') };
    const notif: AppNotification = {
      id: generateId('not'),
      targetRole: 'client',
      targetUserId: log.clientId,
      title: 'Nova avaliação física disponível',
      message: `Peso: ${log.weightKg} kg · Gordura: ${log.bodyFatPct}% · Massa muscular: ${log.muscleMassKg} kg.`,
      category: 'Treino',
      createdAt: '2026-11-17 15:25',
      read: false,
    };
    setDb((prev) => ({
      ...prev,
      metrics: [...prev.metrics, created],
      notifications: [notif, ...prev.notifications],
    }));
    showToast('Avaliação física registada no histórico!');
  };

  const updateTrainerOwnProfile = (trainerId: string, patch: Partial<TrainerProfile>) => {
    setDb((prev) => ({
      ...prev,
      trainers: prev.trainers.map((t) => (t.id === trainerId ? { ...t, ...patch } : t)),
    }));
    showToast('Dados do treinador atualizados!');
  };

  const upsertClient = (
    clientInput: Omit<ClientProfile, 'id' | 'joinedAt' | 'monthlyCheckIns'> & { id?: string }
  ) => {
    setDb((prev) => {
      if (clientInput.id) {
        return {
          ...prev,
          clients: prev.clients.map((c) => (c.id === clientInput.id ? { ...c, ...clientInput } : c)),
        };
      }
      const newClient: ClientProfile = {
        ...clientInput,
        id: generateId('cl'),
        joinedAt: '2026-11-17',
        monthlyCheckIns: 0,
      };
      return {
        ...prev,
        clients: [newClient, ...prev.clients],
      };
    });
    showToast(clientInput.id ? 'Dados do cliente atualizados!' : 'Novo cliente registado!');
  };

  const upsertTrainer = (trainerInput: Omit<TrainerProfile, 'id'> & { id?: string }) => {
    setDb((prev) => {
      if (trainerInput.id) {
        return {
          ...prev,
          trainers: prev.trainers.map((t) =>
            t.id === trainerInput.id ? { ...t, ...trainerInput } : t
          ),
        };
      }
      const newTrainer: TrainerProfile = {
        ...trainerInput,
        id: generateId('tr'),
      };
      return {
        ...prev,
        trainers: [newTrainer, ...prev.trainers],
      };
    });
    showToast(trainerInput.id ? 'Personal Trainer atualizado!' : 'Novo Personal Trainer adicionado!');
  };

  const upsertPlan = (planInput: Omit<MembershipPlan, 'id'> & { id?: string }) => {
    setDb((prev) => {
      if (planInput.id) {
        return {
          ...prev,
          plans: prev.plans.map((p) => (p.id === planInput.id ? { ...p, ...planInput } : p)),
        };
      }
      const newPlan: MembershipPlan = {
        ...planInput,
        id: generateId('plan'),
      };
      return {
        ...prev,
        plans: [...prev.plans, newPlan],
      };
    });
    showToast(planInput.id ? 'Plano atualizado!' : 'Novo plano criado!');
  };

  const recordPayment = (input: {
    clientId: string;
    planId: string;
    amountKz: number;
    method: PaymentMethod;
    status: 'Pago' | 'Pendente';
  }) => {
    const plan = db.plans.find((p) => p.id === input.planId);
    const client = db.clients.find((c) => c.id === input.clientId);
    if (!plan || !client) return;

    const newPayment: PaymentRecord = {
      id: generateId('pay'),
      reference: `KM-2026-${Math.floor(1200 + Math.random() * 899)}`,
      clientId: input.clientId,
      planId: input.planId,
      planName: plan.name,
      amountKz: input.amountKz,
      method: input.method,
      status: input.status,
      date: '2026-11-17',
      recordedBy: db.admins[0]?.name || 'Administração',
    };

    const nextDate = new Date('2026-11-17T00:00:00');
    nextDate.setDate(nextDate.getDate() + plan.durationDays);
    const validUntil = nextDate.toISOString().split('T')[0];

    setDb((prev) => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
      clients:
        input.status === 'Pago'
          ? prev.clients.map((c) =>
              c.id === input.clientId
                ? {
                    ...c,
                    planId: plan.id,
                    membershipStatus: 'Ativa' as MembershipStatus,
                    validUntil,
                  }
                : c
            )
          : prev.clients,
      notifications: [
        {
          id: generateId('not'),
          targetRole: 'client',
          targetUserId: input.clientId,
          title: input.status === 'Pago' ? 'Pagamento confirmado' : 'Pagamento registado como pendente',
          message: `Recibo ${newPayment.reference} · ${plan.name} via ${input.method}.`,
          category: 'Pagamento',
          createdAt: '2026-11-17 15:25',
          read: false,
        },
        ...prev.notifications,
      ],
    }));

    showToast('Pagamento registado no histórico financeiro!');
  };

  const updatePaymentStatus = (paymentId: string, status: 'Pago' | 'Pendente') => {
    const pay = db.payments.find((p) => p.id === paymentId);
    if (!pay) return;
    const plan = db.plans.find((p) => p.id === pay.planId);
    const nextDate = new Date('2026-11-17T00:00:00');
    nextDate.setDate(nextDate.getDate() + (plan?.durationDays || 30));

    setDb((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === paymentId ? { ...p, status } : p)),
      clients:
        status === 'Pago'
          ? prev.clients.map((c) =>
              c.id === pay.clientId
                ? { ...c, membershipStatus: 'Ativa', validUntil: nextDate.toISOString().split('T')[0] }
                : c
            )
          : prev.clients,
    }));
    showToast(`Pagamento ${pay.reference} marcado como ${status}.`);
  };

  const sendBroadcastNotification = (input: {
    targetRole: UserRole | 'all';
    title: string;
    message: string;
    category: AppNotification['category'];
  }) => {
    const created: AppNotification = {
      id: generateId('not'),
      targetRole: input.targetRole,
      title: input.title.trim(),
      message: input.message.trim(),
      category: input.category,
      createdAt: '2026-11-17 15:28',
      read: false,
    };
    setDb((prev) => ({
      ...prev,
      notifications: [created, ...prev.notifications],
    }));
    showToast('Comunicado enviado com sucesso!');
  };

  const markNotificationRead = (id: string) => {
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = (role: UserRole, userId: string) => {
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => {
        const matches =
          n.targetRole === 'all' ||
          (n.targetRole === role && (!n.targetUserId || n.targetUserId === userId));
        return matches ? { ...n, read: true } : n;
      }),
    }));
    showToast('Todas as notificações foram lidas.', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_DB);
    setDb(INITIAL_DB);
    showToast('Dados de demonstração repostos com sucesso!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        db,
        session,
        screen,
        selectedClientId,
        toasts,
        navigate,
        showToast,
        dismissToast,
        loginDemo,
        loginWithCredentials,
        registerClient,
        logout,
        toggleWorkoutCompletedToday,
        bookSession,
        updateSessionStatus,
        requestPlanRenewal,
        sendMessageToTrainer,
        updateClientOwnProfile,
        saveWorkoutPlan,
        addBodyMetricLog,
        updateTrainerOwnProfile,
        upsertClient,
        upsertTrainer,
        upsertPlan,
        recordPayment,
        updatePaymentStatus,
        sendBroadcastNotification,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
