import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  CreditCard,
  Dumbbell,
  LogOut,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  GymUnit,
  PaymentMethod,
  PaymentRecord,
  SessionBooking,
  WorkoutPlan,
} from '../types/kimakwami';
import {
  daysUntil,
  formatDatePt,
  formatKz,
  formatShortDatePt,
  isValidAngolaPhone,
} from '../utils/formatters';
import { AvatarImage, BrandMarkIcon, StatusLabel } from '../components/BrandLogo';
import { EvolutionLineChart, ProgressRing } from '../components/Charts';
import { ModalSheet } from '../components/ModalSheet';

function useCurrentClient() {
  const { db, session } = useApp();
  const client =
    db.clients.find((c) => c.id === session?.userId) || db.clients[0];
  const plan = db.plans.find((p) => p.id === client.planId) || db.plans[0];
  const trainer =
    db.trainers.find((t) => t.id === client.trainerId) || db.trainers[0];
  return { client, plan, trainer };
}

export const ClientDashboardScreen: React.FC = () => {
  const { db, navigate } = useApp();
  const { client, plan, trainer } = useCurrentClient();

  const daysLeft = daysUntil(client.validUntil);
  const myWorkouts = db.workouts.filter((w) => w.clientId === client.id);
  const mySessions = db.sessions
    .filter((s) => s.clientId === client.id && s.status !== 'Cancelada')
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextSession = mySessions.find((s) => s.status !== 'Concluída') || mySessions[0];
  const myMetrics = db.metrics
    .filter((m) => m.clientId === client.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const latestMetric = myMetrics[myMetrics.length - 1];

  const monthlyGoalPct = Math.min(100, Math.round((client.monthlyCheckIns / 20) * 100));

  return (
    <div className="space-y-5">
      {/* Digital Member Pass Card */}
      <section className="rounded-2xl bg-gradient-to-br from-[#08382D] via-[#062C24] to-[#041E18] border border-[#145849] text-white p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BrandMarkIcon size={24} variant="light" />
            <span className="font-display text-[11px] font-bold tracking-[0.16em] text-emerald-100/90">
              KIMAKWAMI PASS
            </span>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-[#A3E635]">
            KM-{client.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <AvatarImage
              src={client.avatar}
              alt={client.name}
              sizeClass="w-14 h-14 border-2 border-[#84CC16]"
            />
            <div className="min-w-0">
              <p className="text-xs text-emerald-100/80">Olá, {client.name.split(' ')[0]}</p>
              <h2 className="text-lg sm:text-xl font-bold truncate">{client.name}</h2>
              <p className="text-xs text-[#A3E635] mt-0.5">
                Unidade {client.unit} · {plan.name}
              </p>
            </div>
          </div>

          <ProgressRing
            percent={monthlyGoalPct}
            size={56}
            strokeWidth={5}
            label={`${client.monthlyCheckIns}/20`}
          />
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
          <div>
            <p className="text-[11px] text-emerald-100/70">Estado da Inscrição</p>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-xs font-bold text-[#062C24]">
              <StatusLabel status={client.membershipStatus} />
            </div>
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70">Validade do Plano</p>
            <p className="text-sm font-bold font-mono tabular-nums mt-1">
              {formatDatePt(client.validUntil)}
            </p>
            <p className="text-[11px] text-[#A3E635]">
              {daysLeft >= 0 ? `${daysLeft} dias restantes` : 'Expirado'}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 flex sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('client-membership')}
              className="w-full sm:w-auto min-h-[44px] px-4 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] text-xs font-bold transition-colors whitespace-nowrap"
            >
              Plano & Pagamentos
            </button>
          </div>
        </div>
      </section>

      {/* Quick KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('client-workouts')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <Dumbbell className="w-5 h-5" />
            <ChevronRight className="w-4 h-4 text-[#6D857E]" />
          </div>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-[#062C24]">
            {myWorkouts.length}
          </p>
          <p className="text-xs font-medium text-[#4A635D] mt-0.5">Planos de treino</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('client-progress')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <Activity className="w-5 h-5" />
            <ChevronRight className="w-4 h-4 text-[#6D857E]" />
          </div>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-[#062C24]">
            {latestMetric ? `${latestMetric.weightKg.toFixed(1)} kg` : '—'}
          </p>
          <p className="text-xs font-medium text-[#4A635D] mt-0.5">
            {latestMetric ? `Gordura ${latestMetric.bodyFatPct}%` : 'Sem avaliação'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate('client-schedule')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <CalendarDays className="w-5 h-5" />
            <ChevronRight className="w-4 h-4 text-[#6D857E]" />
          </div>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-[#062C24]">
            {mySessions.filter((s) => s.status !== 'Concluída').length}
          </p>
          <p className="text-xs font-medium text-[#4A635D] mt-0.5">Sessões marcadas</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('client-trainer')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <UserCheck className="w-5 h-5" />
            <ChevronRight className="w-4 h-4 text-[#6D857E]" />
          </div>
          <p className="text-sm font-bold text-[#062C24] truncate">{trainer.name}</p>
          <p className="text-xs font-medium text-[#4A635D] mt-1 truncate">Meu Personal Trainer</p>
        </button>
      </section>

      {/* 2-Column Responsive Split: Next Session & Active Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Next Session */}
        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#062C24]">Próxima Sessão</h3>
            <button
              type="button"
              onClick={() => navigate('client-schedule')}
              className="text-xs font-semibold text-[#059669] hover:underline min-h-[36px]"
            >
              Ver agenda
            </button>
          </div>

          {nextSession ? (
            <div className="p-4 rounded-xl bg-[#F6F9F8] border border-[#E2EAE7] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#062C24]">{nextSession.type}</span>
                <StatusLabel status={nextSession.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A635D] font-mono tabular-nums">
                <span>{formatDatePt(nextSession.date)}</span>
                <span aria-hidden="true">·</span>
                <span>{nextSession.time}</span>
                <span aria-hidden="true">·</span>
                <span>{nextSession.unit}</span>
              </div>
              {nextSession.notes && (
                <p className="text-xs text-[#4A635D]">{nextSession.notes}</p>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F6F9F8] text-center space-y-2">
              <p className="text-xs text-[#4A635D]">Sem sessões agendadas para os próximos dias.</p>
              <button
                type="button"
                onClick={() => navigate('client-schedule')}
                className="min-h-[40px] px-4 rounded-xl bg-[#062C24] text-white text-xs font-semibold"
              >
                Marcar Sessão
              </button>
            </div>
          )}
        </section>

        {/* Active Workout Preview */}
        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#062C24]">Treino em Destaque</h3>
            <button
              type="button"
              onClick={() => navigate('client-workouts')}
              className="text-xs font-semibold text-[#059669] hover:underline min-h-[36px]"
            >
              Abrir treinos
            </button>
          </div>

          {myWorkouts[0] ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-[#062C24]">{myWorkouts[0].title}</p>
                <p className="text-xs text-[#4A635D] mt-0.5">
                  {myWorkouts[0].focus} · {myWorkouts[0].exercises.length} exercícios ·{' '}
                  {myWorkouts[0].daysPerWeek}x/semana
                </p>
              </div>
              <div className="divide-y divide-[#EEF3F1]">
                {myWorkouts[0].exercises.slice(0, 3).map((ex) => (
                  <div key={ex.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#062C24] truncate">{ex.name}</span>
                    <span className="font-mono tabular-nums text-[#4A635D] shrink-0">
                      {ex.sets}×{ex.reps} · {ex.loadKg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#4A635D]">
              O teu treinador ainda não atribuiu um plano de treino.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export const ClientMembershipScreen: React.FC = () => {
  const { db, requestPlanRenewal } = useApp();
  const { client, plan } = useCurrentClient();
  const [renewModal, setRenewModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(plan.id);
  const [method, setMethod] = useState<PaymentMethod>('Multicaixa Express');
  const [receipt, setReceipt] = useState<PaymentRecord | null>(null);

  const myPayments = db.payments
    .filter((p) => p.clientId === client.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const selectedPlan = db.plans.find((p) => p.id === selectedPlanId) || plan;

  const handleConfirmRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    requestPlanRenewal(client.id, selectedPlanId, method);
    setRenewModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Current Plan Summary */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#4A635D]">Plano de Adesão Atual</p>
            <h2 className="text-xl font-extrabold text-[#062C24] mt-0.5">{plan.name}</h2>
            <p className="text-xs text-[#4A635D] mt-1">{plan.subtitle}</p>
          </div>
          <div className="text-right">
            <StatusLabel status={client.membershipStatus} />
            <p className="text-lg font-extrabold font-mono tabular-nums text-[#062C24] mt-1">
              {formatKz(plan.priceKz)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EEF3F1] text-xs">
          <div>
            <span className="text-[#4A635D]">Unidade</span>
            <p className="font-bold text-[#062C24] mt-0.5">{client.unit}</p>
          </div>
          <div>
            <span className="text-[#4A635D]">Válido até</span>
            <p className="font-bold font-mono tabular-nums text-[#062C24] mt-0.5">
              {formatDatePt(client.validUntil)}
            </p>
          </div>
          <div>
            <span className="text-[#4A635D]">Membro desde</span>
            <p className="font-bold font-mono tabular-nums text-[#062C24] mt-0.5">
              {formatDatePt(client.joinedAt)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          {plan.benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#062C24]">
              <Check className="w-4 h-4 text-[#059669] shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedPlanId(plan.id);
            setRenewModal(true);
          }}
          className="w-full sm:w-auto min-h-[46px] px-5 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] font-bold text-sm transition-colors"
        >
          Renovar ou Mudar de Plano
        </button>
      </section>

      {/* Payment History */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF3F1] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#062C24]">Histórico de Pagamentos</h3>
          <span className="text-xs font-mono tabular-nums text-[#4A635D]">
            {myPayments.length} registos
          </span>
        </div>

        {myPayments.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#4A635D]">
            Ainda não tens pagamentos registados.
          </div>
        ) : (
          <div className="divide-y divide-[#EEF3F1]">
            {myPayments.map((pay) => (
              <button
                key={pay.id}
                type="button"
                onClick={() => setReceipt(pay)}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#F8FBFA] transition-colors min-h-[60px]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#062C24] truncate">{pay.planName}</p>
                  <p className="text-xs text-[#4A635D] mt-0.5">
                    {formatDatePt(pay.date)} · {pay.method} · {pay.reference}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-sm font-bold font-mono tabular-nums text-[#062C24]">
                    {formatKz(pay.amountKz)}
                  </p>
                  <StatusLabel status={pay.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Renewal Sheet */}
      <ModalSheet
        open={renewModal}
        onClose={() => setRenewModal(false)}
        title="Renovar Adesão (Demonstrativo)"
        subtitle="Simulação de pagamento em Kwanza sem cobrança real."
      >
        <form onSubmit={handleConfirmRenewal} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#062C24]">
              Selecionar Plano
            </label>
            {db.plans
              .filter((p) => p.active)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${
                    selectedPlanId === p.id
                      ? 'border-[#059669] bg-[#F2FBF7]'
                      : 'border-[#E2EAE7] hover:border-[#B6CBC4]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#062C24]">{p.name}</p>
                    <p className="text-xs text-[#4A635D]">{p.durationDays} dias de acesso</p>
                  </div>
                  <span className="text-sm font-extrabold font-mono tabular-nums text-[#062C24]">
                    {formatKz(p.priceKz)}
                  </span>
                </button>
              ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1.5">
              Método de Pagamento
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              <option value="Multicaixa Express">Multicaixa Express</option>
              <option value="TPA Ginásio">TPA na Receção</option>
              <option value="Transferência Bancária">Transferência Bancária (BAI / BFA)</option>
              <option value="Numerário">Numerário</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6F9F8] flex items-center justify-between">
            <span className="text-xs font-medium text-[#4A635D]">Total a simular</span>
            <span className="text-base font-extrabold font-mono tabular-nums text-[#062C24]">
              {formatKz(selectedPlan.priceKz)}
            </span>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] hover:bg-[#0B3F34] text-white font-bold text-sm transition-colors"
          >
            Confirmar Renovação Demonstrativa
          </button>
        </form>
      </ModalSheet>

      {/* Payment Receipt Modal */}
      <ModalSheet
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        title="Comprovativo de Pagamento"
        subtitle={receipt?.reference}
      >
        {receipt && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F6F9F8] border border-[#E2EAE7] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4A635D]">Plano</span>
                <span className="font-bold text-[#062C24]">{receipt.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A635D]">Montante</span>
                <span className="font-bold font-mono tabular-nums text-[#062C24]">
                  {formatKz(receipt.amountKz)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A635D]">Método</span>
                <span className="font-semibold text-[#062C24]">{receipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A635D]">Data</span>
                <span className="font-mono tabular-nums text-[#062C24]">
                  {formatDatePt(receipt.date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4A635D]">Estado</span>
                <StatusLabel status={receipt.status} />
              </div>
            </div>
            <p className="text-[11px] text-[#4A635D] flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-[#059669] shrink-0" />
              Documento demonstrativo emitido pela KIMAKWAMI FITNESS Angola.
            </p>
          </div>
        )}
      </ModalSheet>
    </div>
  );
};

export const ClientWorkoutsScreen: React.FC = () => {
  const { db, toggleWorkoutCompletedToday } = useApp();
  const { client } = useCurrentClient();
  const [focusFilter, setFocusFilter] = useState<string>('Todos');
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null);
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});

  const myWorkouts = db.workouts.filter((w) => w.clientId === client.id);
  const filtered =
    focusFilter === 'Todos'
      ? myWorkouts
      : myWorkouts.filter((w) => w.focus === focusFilter);

  const today = '2026-11-17';

  const toggleExerciseCheck = (exId: string) => {
    setCheckedExercises((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['Todos', 'Hipertrofia', 'Força', 'Condicionamento'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFocusFilter(f)}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              focusFilter === f
                ? 'bg-[#062C24] text-white'
                : 'bg-white border border-[#E2EAE7] text-[#4A635D] hover:text-[#062C24]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2EAE7] p-8 text-center text-sm text-[#4A635D]">
          Nenhum plano de treino encontrado nesta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((plan) => {
            const trainer = db.trainers.find((t) => t.id === plan.trainerId);
            const doneToday = plan.completedDates.includes(today);
            return (
              <article
                key={plan.id}
                className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#059669]">
                      {plan.focus} · {plan.daysPerWeek}x por semana
                    </p>
                    <h2 className="text-base font-bold text-[#062C24] mt-0.5">{plan.title}</h2>
                    <p className="text-xs text-[#4A635D] mt-1">
                      Prescrito por {trainer?.name || 'Personal Trainer'} ·{' '}
                      {plan.exercises.length} exercícios
                    </p>
                  </div>
                  {doneToday && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] shrink-0">
                      <CheckCheck className="w-4 h-4" />
                      Feito hoje
                    </span>
                  )}
                </div>

                <div className="divide-y divide-[#EEF3F1]">
                  {plan.exercises.map((ex) => (
                    <div key={ex.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#062C24] truncate">{ex.name}</p>
                        <p className="text-xs text-[#4A635D]">
                          {ex.muscleGroup} · Descanso {ex.restSeconds}s
                        </p>
                      </div>
                      <div className="text-right font-mono tabular-nums shrink-0">
                        <p className="text-xs font-bold text-[#062C24]">
                          {ex.sets} × {ex.reps}
                        </p>
                        <p className="text-[11px] text-[#059669] font-semibold">{ex.loadKg}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveWorkout(plan)}
                    className="flex-1 min-h-[44px] rounded-xl bg-[#062C24] hover:bg-[#0B3F34] text-white text-xs font-bold transition-colors"
                  >
                    Iniciar Modo Treino
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWorkoutCompletedToday(plan.id)}
                    className={`min-h-[44px] px-4 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap ${
                      doneToday
                        ? 'border-[#059669] bg-[#F2FBF7] text-[#059669]'
                        : 'border-[#D4E0DC] text-[#062C24] hover:bg-[#F6F9F8]'
                    }`}
                  >
                    {doneToday ? 'Concluído' : 'Marcar Feito'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Workout Execution Sheet */}
      <ModalSheet
        open={Boolean(activeWorkout)}
        onClose={() => setActiveWorkout(null)}
        title={activeWorkout?.title || ''}
        subtitle="Toca em cada exercício conforme completares as séries."
      >
        {activeWorkout && (
          <div className="space-y-3">
            {activeWorkout.exercises.map((ex) => {
              const checked = Boolean(checkedExercises[ex.id]);
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => toggleExerciseCheck(ex.id)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                    checked
                      ? 'bg-[#F2FBF7] border-[#059669]'
                      : 'bg-white border-[#E2EAE7]'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      checked
                        ? 'bg-[#059669] border-[#059669] text-white'
                        : 'border-[#B6CBC4]'
                    }`}
                  >
                    {checked && <Check className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold ${
                        checked ? 'line-through text-[#4A635D]' : 'text-[#062C24]'
                      }`}
                    >
                      {ex.name}
                    </p>
                    <p className="text-xs font-mono tabular-nums text-[#4A635D] mt-0.5">
                      {ex.sets} séries × {ex.reps} · Carga: {ex.loadKg} · {ex.restSeconds}s descanso
                    </p>
                    {ex.notes && (
                      <p className="text-xs text-[#059669] mt-1">{ex.notes}</p>
                    )}
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                if (!activeWorkout.completedDates.includes(today)) {
                  toggleWorkoutCompletedToday(activeWorkout.id);
                }
                setActiveWorkout(null);
              }}
              className="w-full min-h-[48px] rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] font-bold text-sm transition-colors"
            >
              Finalizar e Registar Treino de Hoje
            </button>
          </div>
        )}
      </ModalSheet>
    </div>
  );
};

export const ClientScheduleScreen: React.FC = () => {
  const { db, bookSession, updateSessionStatus } = useApp();
  const { client, trainer } = useCurrentClient();
  const [selectedDay, setSelectedDay] = useState<string>('Todos');
  const [bookingOpen, setBookingOpen] = useState(false);

  const [date, setDate] = useState('2026-11-19');
  const [time, setTime] = useState('08:30');
  const [type, setType] = useState<SessionBooking['type']>('Treino Personalizado');
  const [unit, setUnit] = useState<GymUnit>(client.unit);
  const [trainerId, setTrainerId] = useState(trainer.id);
  const [notes, setNotes] = useState('');

  const days = [
    { key: 'Todos', label: 'Todas' },
    { key: '2026-11-17', label: 'Hoje 17' },
    { key: '2026-11-18', label: 'Qua 18' },
    { key: '2026-11-19', label: 'Qui 19' },
    { key: '2026-11-20', label: 'Sex 20' },
    { key: '2026-11-21', label: 'Sáb 21' },
  ];

  const mySessions = db.sessions
    .filter((s) => s.clientId === client.id)
    .filter((s) => selectedDay === 'Todos' || s.date === selectedDay)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    bookSession({ clientId: client.id, trainerId, date, time, type, unit, notes });
    setNotes('');
    setBookingOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Agenda de Sessões</h2>
          <p className="text-xs text-[#4A635D]">Marca treinos personalizados ou avaliações físicas.</p>
        </div>
        <button
          type="button"
          onClick={() => setBookingOpen(true)}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Marcar</span>
        </button>
      </div>

      {/* Horizontal Day Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setSelectedDay(d.key)}
            className={`min-h-[40px] px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDay === d.key
                ? 'bg-[#062C24] text-white'
                : 'bg-white border border-[#E2EAE7] text-[#4A635D]'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {mySessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE7] p-8 text-center space-y-3">
            <p className="text-sm text-[#4A635D]">Nenhuma sessão encontrada para este filtro.</p>
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="min-h-[44px] px-5 rounded-xl bg-[#062C24] text-white text-xs font-bold"
            >
              Agendar Nova Sessão
            </button>
          </div>
        ) : (
          mySessions.map((ses) => {
            const tr = db.trainers.find((t) => t.id === ses.trainerId);
            return (
              <div
                key={ses.id}
                className="bg-white rounded-2xl border border-[#E2EAE7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#062C24]">{ses.type}</span>
                    <StatusLabel status={ses.status} />
                  </div>
                  <p className="text-xs text-[#4A635D] font-mono tabular-nums">
                    {formatDatePt(ses.date)} · {ses.time} · Unidade {ses.unit}
                  </p>
                  <p className="text-xs text-[#4A635D]">
                    Treinador: <span className="font-semibold text-[#062C24]">{tr?.name}</span>
                  </p>
                  {ses.notes && <p className="text-xs text-[#059669]">{ses.notes}</p>}
                </div>

                {(ses.status === 'Pendente' || ses.status === 'Confirmada') && (
                  <button
                    type="button"
                    onClick={() => updateSessionStatus(ses.id, 'Cancelada')}
                    className="min-h-[40px] px-3.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 self-start sm:self-center whitespace-nowrap"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Book Session Modal */}
      <ModalSheet
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Marcar Sessão"
        subtitle="O pedido fica sujeito a confirmação pelo Personal Trainer."
      >
        <form onSubmit={handleBook} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Tipo de Sessão</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SessionBooking['type'])}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              <option value="Treino Personalizado">Treino Personalizado</option>
              <option value="Avaliação Física">Avaliação Física (Bioimpedância)</option>
              <option value="Musculação Guiada">Musculação Guiada</option>
              <option value="Aula Funcional">Aula Funcional em Grupo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Data</label>
              <input
                type="date"
                value={date}
                min="2026-11-17"
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Hora</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm font-mono"
              >
                {['06:30', '07:30', '08:30', '10:00', '12:00', '16:30', '18:00', '19:30'].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Unidade</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as GymUnit)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="Talatona">Talatona</option>
                <option value="Miramar">Miramar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Treinador</label>
              <select
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                {db.trainers.filter((t) => t.active).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Notas para o treinador (opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Foco em treino de membros inferiores"
              className="w-full p-3 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] hover:bg-[#0B3F34] text-white font-bold text-sm"
          >
            Confirmar Pedido de Sessão
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const ClientTrainerScreen: React.FC = () => {
  const { sendMessageToTrainer, navigate } = useApp();
  const { client, trainer } = useCurrentClient();
  const [msgModal, setMsgModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessageToTrainer(client.name, trainer.id, messageText);
    setMessageText('');
    setMsgModal(false);
  };

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-4">
          <AvatarImage src={trainer.avatar} alt={trainer.name} sizeClass="w-20 h-20" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#059669]">Personal Trainer Associado</p>
            <h2 className="text-xl font-extrabold text-[#062C24] truncate">{trainer.name}</h2>
            <p className="text-xs text-[#4A635D] mt-0.5">{trainer.specialty}</p>
          </div>
        </div>

        <p className="text-sm text-[#062C24] leading-relaxed">{trainer.bio}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#EEF3F1] text-xs">
          <div className="flex items-center gap-2.5 text-[#062C24]">
            <Award className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{trainer.certification}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#062C24]">
            <MapPin className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Unidade {trainer.unit}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#062C24]">
            <Clock className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{trainer.scheduleHours}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#062C24] font-mono tabular-nums">
            <Phone className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{trainer.phone}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => setMsgModal(true)}
            className="min-h-[46px] px-5 rounded-xl bg-[#062C24] hover:bg-[#0B3F34] text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enviar Nota ao Treinador</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('client-schedule')}
            className="min-h-[46px] px-5 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] text-xs font-bold flex items-center justify-center gap-2"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Marcar Sessão com {trainer.name.split(' ')[0]}</span>
          </button>
        </div>
      </section>

      <ModalSheet
        open={msgModal}
        onClose={() => setMsgModal(false)}
        title={`Mensagem para ${trainer.name}`}
        subtitle="A mensagem aparece nas notificações do treinador."
      >
        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            rows={4}
            required
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Escreve a tua dúvida sobre o treino ou disponibilidade..."
            className="w-full p-3.5 rounded-xl border border-[#D4E0DC] text-sm focus:outline-none focus:border-[#059669]"
          />
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Enviar Mensagem
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const ClientProgressScreen: React.FC = () => {
  const { db } = useApp();
  const { client } = useCurrentClient();
  const [metricTab, setMetricTab] = useState<'weight' | 'fat' | 'muscle' | 'waist'>('weight');

  const logs = useMemo(
    () =>
      db.metrics
        .filter((m) => m.clientId === client.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [db.metrics, client.id]
  );

  const latest = logs[logs.length - 1];
  const first = logs[0];

  const chartConfig = {
    weight: {
      title: 'Peso Corporal',
      unit: 'kg',
      color: '#062C24',
      points: logs.map((l) => ({ label: formatShortDatePt(l.date), value: l.weightKg })),
    },
    fat: {
      title: 'Gordura Corporal',
      unit: '%',
      color: '#059669',
      points: logs.map((l) => ({ label: formatShortDatePt(l.date), value: l.bodyFatPct })),
    },
    muscle: {
      title: 'Massa Muscular',
      unit: 'kg',
      color: '#65A30D',
      points: logs.map((l) => ({ label: formatShortDatePt(l.date), value: l.muscleMassKg })),
    },
    waist: {
      title: 'Perímetro Abdominal',
      unit: 'cm',
      color: '#0B3F34',
      points: logs.map((l) => ({ label: formatShortDatePt(l.date), value: l.waistCm })),
    },
  }[metricTab];

  return (
    <div className="space-y-5">
      {latest && first && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-[#E2EAE7] p-4">
            <p className="text-xs text-[#4A635D]">Peso Atual</p>
            <p className="text-xl font-extrabold font-mono tabular-nums text-[#062C24] mt-1">
              {latest.weightKg.toFixed(1)} kg
            </p>
            <p className="text-[11px] font-mono text-[#059669] mt-0.5">
              {(latest.weightKg - first.weightKg).toFixed(1)} kg vs início
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2EAE7] p-4">
            <p className="text-xs text-[#4A635D]">% Gordura</p>
            <p className="text-xl font-extrabold font-mono tabular-nums text-[#062C24] mt-1">
              {latest.bodyFatPct.toFixed(1)}%
            </p>
            <p className="text-[11px] font-mono text-[#059669] mt-0.5">
              {(latest.bodyFatPct - first.bodyFatPct).toFixed(1)}% vs início
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2EAE7] p-4">
            <p className="text-xs text-[#4A635D]">Massa Magra</p>
            <p className="text-xl font-extrabold font-mono tabular-nums text-[#062C24] mt-1">
              {latest.muscleMassKg.toFixed(1)} kg
            </p>
            <p className="text-[11px] font-mono text-[#059669] mt-0.5">
              +{(latest.muscleMassKg - first.muscleMassKg).toFixed(1)} kg vs início
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2EAE7] p-4">
            <p className="text-xs text-[#4A635D]">Cintura</p>
            <p className="text-xl font-extrabold font-mono tabular-nums text-[#062C24] mt-1">
              {latest.waistCm} cm
            </p>
            <p className="text-[11px] font-mono text-[#059669] mt-0.5">
              {latest.waistCm - first.waistCm} cm vs início
            </p>
          </div>
        </section>
      )}

      {/* Interactive Chart Card */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[#062C24]">{chartConfig.title}</h3>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF4F2]">
            {(
              [
                { id: 'weight', label: 'Peso' },
                { id: 'fat', label: '% Gordura' },
                { id: 'muscle', label: 'Músculo' },
                { id: 'waist', label: 'Cintura' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMetricTab(t.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  metricTab === t.id ? 'bg-[#062C24] text-white' : 'text-[#4A635D]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <EvolutionLineChart
          points={chartConfig.points}
          color={chartConfig.color}
          unit={chartConfig.unit}
        />
      </section>

      {/* Evaluation History */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF3F1]">
          <h3 className="text-base font-bold text-[#062C24]">Histórico de Avaliações</h3>
        </div>
        {logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#4A635D]">
            Ainda não tens avaliações físicas registadas. Marca uma avaliação na Agenda.
          </div>
        ) : (
          <div className="divide-y divide-[#EEF3F1]">
            {[...logs].reverse().map((log) => (
              <div key={log.id} className="p-4 sm:px-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono tabular-nums text-[#062C24]">
                    {formatDatePt(log.date)}
                  </span>
                  <span className="text-[#4A635D]">Por {log.recordedBy}</span>
                </div>
                <p className="text-xs font-mono tabular-nums text-[#059669] font-semibold">
                  Peso {log.weightKg} kg · Gordura {log.bodyFatPct}% · Músculo {log.muscleMassKg} kg · Cintura {log.waistCm} cm
                </p>
                {log.trainerNote && (
                  <p className="text-xs text-[#4A635D]">{log.trainerNote}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export const ClientNotificationsScreen: React.FC = () => {
  const { db, markNotificationRead, markAllNotificationsRead } = useApp();
  const { client } = useCurrentClient();

  const items = db.notifications.filter(
    (n) =>
      n.targetRole === 'all' ||
      (n.targetRole === 'client' && (!n.targetUserId || n.targetUserId === client.id))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Notificações</h2>
          <p className="text-xs text-[#4A635D]">Avisos de treino, agenda e mensalidade.</p>
        </div>
        <button
          type="button"
          onClick={() => markAllNotificationsRead('client', client.id)}
          className="min-h-[40px] px-3.5 rounded-xl bg-white border border-[#E2EAE7] text-xs font-semibold text-[#062C24] hover:bg-[#F6F9F8]"
        >
          Marcar todas como lidas
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2EAE7] divide-y divide-[#EEF3F1]">
        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#4A635D]">
            Sem notificações de momento.
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markNotificationRead(n.id)}
              className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                n.read ? 'bg-white' : 'bg-[#F2FBF7]'
              }`}
            >
              <Bell
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  n.read ? 'text-[#6D857E]' : 'text-[#059669]'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#062C24] truncate">{n.title}</p>
                  <span className="text-[11px] font-mono text-[#6D857E] shrink-0">
                    {n.createdAt}
                  </span>
                </div>
                <p className="text-xs text-[#4A635D] mt-1">{n.message}</p>
                <p className="text-[11px] font-semibold text-[#059669] mt-1">
                  {n.category} · {n.read ? 'Lida' : 'Nova'}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export const ClientProfileScreen: React.FC = () => {
  const { updateClientOwnProfile, navigate, logout, resetDemoData, showToast } = useApp();
  const { client, plan } = useCurrentClient();

  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  const [unit, setUnit] = useState<GymUnit>(client.unit);
  const [goal, setGoal] = useState(client.goal);
  const [emergencyContact, setEmergencyContact] = useState(client.emergencyContact);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAngolaPhone(phone)) {
      showToast('Insere um número angolano válido (+244 9XX XXX XXX).', 'error');
      return;
    }
    updateClientOwnProfile(client.id, { name, phone, unit, goal, emergencyContact });
  };

  return (
    <div className="space-y-5">
      {/* Summary Header */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 flex items-center gap-4">
        <AvatarImage src={client.avatar} alt={client.name} sizeClass="w-16 h-16" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-[#062C24] truncate">{client.name}</h2>
          <p className="text-xs text-[#4A635D] truncate">{client.email}</p>
          <p className="text-xs font-semibold text-[#059669] mt-1">
            {plan.name} · Unidade {client.unit}
          </p>
        </div>
      </section>

      {/* Quick Shortcuts */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] divide-y divide-[#EEF3F1]">
        <button
          type="button"
          onClick={() => navigate('client-membership')}
          className="w-full px-5 py-3.5 min-h-[56px] flex items-center justify-between text-left hover:bg-[#F8FBFA]"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#059669]" />
            <div>
              <p className="text-sm font-bold text-[#062C24]">Plano & Pagamentos</p>
              <p className="text-xs text-[#4A635D]">Validade, renovação e comprovativos em Kz</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6D857E]" />
        </button>

        <button
          type="button"
          onClick={() => navigate('client-trainer')}
          className="w-full px-5 py-3.5 min-h-[56px] flex items-center justify-between text-left hover:bg-[#F8FBFA]"
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-[#059669]" />
            <div>
              <p className="text-sm font-bold text-[#062C24]">Personal Trainer Associado</p>
              <p className="text-xs text-[#4A635D]">Contactos, horários e mensagens</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6D857E]" />
        </button>

        <button
          type="button"
          onClick={() => navigate('client-notifications')}
          className="w-full px-5 py-3.5 min-h-[56px] flex items-center justify-between text-left hover:bg-[#F8FBFA]"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#059669]" />
            <div>
              <p className="text-sm font-bold text-[#062C24]">Notificações</p>
              <p className="text-xs text-[#4A635D]">Central de avisos e comunicados</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6D857E]" />
        </button>
      </section>

      {/* Personal Settings Form */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <h3 className="text-base font-bold text-[#062C24]">Dados Pessoais & Definições</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Telemóvel (+244)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Unidade Preferida
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as GymUnit)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="Talatona">Talatona</option>
                <option value="Miramar">Miramar</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Objetivo</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Contacto de Emergência
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-5 rounded-xl bg-[#062C24] text-white text-xs font-bold"
          >
            Guardar Alterações
          </button>
        </form>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={logout}
          className="flex-1 min-h-[46px] rounded-xl border border-[#D4E0DC] bg-white text-[#062C24] text-xs font-bold flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminar Sessão / Mudar Perfil</span>
        </button>
        <button
          type="button"
          onClick={resetDemoData}
          className="min-h-[46px] px-4 rounded-xl border border-[#E2EAE7] bg-[#EFF4F2] text-[#4A635D] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Repor Dados Demo</span>
        </button>
      </div>
    </div>
  );
};
