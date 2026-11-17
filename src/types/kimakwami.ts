export type UserRole = 'client' | 'trainer' | 'admin';

export type MembershipStatus = 'Ativa' | 'A expirar' | 'Expirada';

export type GymUnit = 'Talatona' | 'Miramar';

export type ScreenId =
  // Auth (3)
  | 'welcome'
  | 'login'
  | 'register'
  // Client (8)
  | 'client-dashboard'
  | 'client-membership'
  | 'client-workouts'
  | 'client-schedule'
  | 'client-trainer'
  | 'client-progress'
  | 'client-notifications'
  | 'client-profile'
  // Trainer (6)
  | 'trainer-dashboard'
  | 'trainer-clients'
  | 'trainer-client-detail'
  | 'trainer-workouts'
  | 'trainer-schedule'
  | 'trainer-notifications'
  // Admin (6)
  | 'admin-dashboard'
  | 'admin-clients'
  | 'admin-trainers'
  | 'admin-plans'
  | 'admin-finance'
  | 'admin-reports';

export interface MembershipPlan {
  id: string;
  name: string;
  subtitle: string;
  priceKz: number;
  durationDays: number;
  benefits: string[];
  active: boolean;
  popular?: boolean;
}

export interface BodyMetricLog {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPct: number;
  muscleMassKg: number;
  waistCm: number;
  trainerNote: string;
  recordedBy: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  loadKg: string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  trainerId: string;
  title: string;
  focus: 'Hipertrofia' | 'Força' | 'Condicionamento' | 'Mobilidade';
  daysPerWeek: number;
  createdAt: string;
  exercises: WorkoutExercise[];
  completedDates: string[];
}

export type SessionStatus = 'Confirmada' | 'Pendente' | 'Concluída' | 'Cancelada';

export interface SessionBooking {
  id: string;
  clientId: string;
  trainerId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'Treino Personalizado' | 'Avaliação Física' | 'Aula Funcional' | 'Musculação Guiada';
  unit: GymUnit;
  status: SessionStatus;
  notes?: string;
}

export type PaymentMethod = 'Multicaixa Express' | 'TPA Ginásio' | 'Transferência Bancária' | 'Numerário';
export type PaymentStatus = 'Pago' | 'Pendente';

export interface PaymentRecord {
  id: string;
  reference: string;
  clientId: string;
  planId: string;
  planName: string;
  amountKz: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string; // YYYY-MM-DD
  recordedBy: string;
}

export interface AppNotification {
  id: string;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  category: 'Treino' | 'Pagamento' | 'Agenda' | 'Inscrição' | 'Comunicado';
  createdAt: string; // ISO or YYYY-MM-DD HH:mm
  read: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string; // +244 ...
  password: string;
  avatar: string;
  unit: GymUnit;
  goal: string;
  planId: string;
  membershipStatus: MembershipStatus;
  validUntil: string; // YYYY-MM-DD
  joinedAt: string; // YYYY-MM-DD
  trainerId: string;
  birthDate: string;
  emergencyContact: string;
  monthlyCheckIns: number;
}

export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  unit: GymUnit;
  specialty: string;
  experienceYears: number;
  certification: string;
  bio: string;
  active: boolean;
  scheduleHours: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  unit: GymUnit;
  roleTitle: string;
}

export interface CurrentSession {
  role: UserRole;
  userId: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface KimakwamiDatabase {
  plans: MembershipPlan[];
  clients: ClientProfile[];
  trainers: TrainerProfile[];
  admins: AdminProfile[];
  workouts: WorkoutPlan[];
  sessions: SessionBooking[];
  metrics: BodyMetricLog[];
  payments: PaymentRecord[];
  notifications: AppNotification[];
}
