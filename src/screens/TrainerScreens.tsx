import React, { useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Dumbbell,
  LogOut,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  SessionBooking,
  WorkoutExercise,
  WorkoutPlan,
} from '../types/kimakwami';
import {
  formatDatePt,
  formatShortDatePt,
  generateId,
} from '../utils/formatters';
import { AvatarImage, StatusLabel } from '../components/BrandLogo';
import { EvolutionLineChart } from '../components/Charts';
import { ModalSheet } from '../components/ModalSheet';

function useCurrentTrainer() {
  const { db, session } = useApp();
  const trainer =
    db.trainers.find((t) => t.id === session?.userId) || db.trainers[0];
  return trainer;
}

export const TrainerDashboardScreen: React.FC = () => {
  const { db, navigate, updateSessionStatus } = useApp();
  const trainer = useCurrentTrainer();

  const myClients = db.clients.filter((c) => c.trainerId === trainer.id);
  const mySessions = db.sessions.filter((s) => s.trainerId === trainer.id);
  const pendingSessions = mySessions.filter((s) => s.status === 'Pendente');
  const upcomingSessions = mySessions
    .filter((s) => s.status === 'Confirmada' || s.status === 'Pendente')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const myWorkouts = db.workouts.filter((w) => w.trainerId === trainer.id);

  return (
    <div className="space-y-5">
      {/* Trainer Header Card */}
      <section className="rounded-2xl bg-[#062C24] text-white p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <AvatarImage
            src={trainer.avatar}
            alt={trainer.name}
            sizeClass="w-14 h-14 border-2 border-[#84CC16]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[#A3E635] font-semibold">
              Personal Trainer · {trainer.unit}
            </p>
            <h2 className="text-xl font-extrabold truncate">{trainer.name}</h2>
            <p className="text-xs text-emerald-100/80 mt-0.5 truncate">{trainer.specialty}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10">
          <div>
            <p className="text-[11px] text-emerald-100/70">Meus Clientes</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums mt-0.5">
              {myClients.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70">Planos Ativos</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums mt-0.5">
              {myWorkouts.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70">Pendentes</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-[#A3E635] mt-0.5">
              {pendingSessions.length}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('trainer-clients')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <Users className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Ver Clientes</p>
          <p className="text-xs text-[#4A635D] mt-0.5">Perfis e evolução</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('trainer-workouts')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <Dumbbell className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Criar Treino</p>
          <p className="text-xs text-[#4A635D] mt-0.5">Séries e repetições</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('trainer-schedule')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <CalendarDays className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Agenda</p>
          <p className="text-xs text-[#4A635D] mt-0.5">Horários e sessões</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('trainer-notifications')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <Activity className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Acompanhamento</p>
          <p className="text-xs text-[#4A635D] mt-0.5">Histórico & avisos</p>
        </button>
      </section>

      {/* 2-Column Split: Upcoming Agenda & Client List Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#062C24]">Próximas Sessões</h3>
            <button
              type="button"
              onClick={() => navigate('trainer-schedule')}
              className="text-xs font-semibold text-[#059669] hover:underline min-h-[36px]"
            >
              Gerir agenda
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <p className="text-xs text-[#4A635D] py-4">Sem sessões agendadas de momento.</p>
          ) : (
            <div className="divide-y divide-[#EEF3F1]">
              {upcomingSessions.slice(0, 4).map((ses) => {
                const cl = db.clients.find((c) => c.id === ses.clientId);
                return (
                  <div key={ses.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#062C24] truncate">
                        {cl?.name || 'Cliente'}
                      </p>
                      <p className="text-xs text-[#4A635D] font-mono tabular-nums">
                        {formatShortDatePt(ses.date)} · {ses.time} · {ses.type}
                      </p>
                    </div>
                    {ses.status === 'Pendente' ? (
                      <button
                        type="button"
                        onClick={() => updateSessionStatus(ses.id, 'Confirmada')}
                        className="min-h-[36px] px-3 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold shrink-0"
                      >
                        Confirmar
                      </button>
                    ) : (
                      <StatusLabel status={ses.status} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#062C24]">Clientes Associados</h3>
            <button
              type="button"
              onClick={() => navigate('trainer-clients')}
              className="text-xs font-semibold text-[#059669] hover:underline min-h-[36px]"
            >
              Ver todos
            </button>
          </div>

          <div className="divide-y divide-[#EEF3F1]">
            {myClients.slice(0, 4).map((cl) => (
              <button
                key={cl.id}
                type="button"
                onClick={() => navigate('trainer-client-detail', { clientId: cl.id })}
                className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-[#F8FBFA] rounded-xl px-1 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AvatarImage src={cl.avatar} alt={cl.name} sizeClass="w-10 h-10" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#062C24] truncate">{cl.name}</p>
                    <p className="text-xs text-[#4A635D] truncate">{cl.goal}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6D857E] shrink-0" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const TrainerClientsScreen: React.FC = () => {
  const { db, navigate } = useApp();
  const trainer = useCurrentTrainer();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'meus' | 'todos'>('meus');

  const clients = useMemo(() => {
    const base =
      scope === 'meus'
        ? db.clients.filter((c) => c.trainerId === trainer.id)
        : db.clients;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.goal.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q)
    );
  }, [db.clients, trainer.id, scope, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6D857E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar cliente por nome ou objetivo..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-[#D4E0DC] bg-white text-sm focus:outline-none focus:border-[#059669]"
          />
        </div>
        <div className="flex p-1 rounded-xl bg-[#EFF4F2] shrink-0">
          <button
            type="button"
            onClick={() => setScope('meus')}
            className={`min-h-[38px] px-3.5 rounded-lg text-xs font-semibold ${
              scope === 'meus' ? 'bg-[#062C24] text-white' : 'text-[#4A635D]'
            }`}
          >
            Meus Clientes
          </button>
          <button
            type="button"
            onClick={() => setScope('todos')}
            className={`min-h-[38px] px-3.5 rounded-lg text-xs font-semibold ${
              scope === 'todos' ? 'bg-[#062C24] text-white' : 'text-[#4A635D]'
            }`}
          >
            Todos do Ginásio
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2EAE7] divide-y divide-[#EEF3F1]">
        {clients.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#4A635D]">
            Nenhum cliente encontrado para a tua pesquisa.
          </div>
        ) : (
          clients.map((cl) => {
            const workoutsCount = db.workouts.filter((w) => w.clientId === cl.id).length;
            return (
              <button
                key={cl.id}
                type="button"
                onClick={() => navigate('trainer-client-detail', { clientId: cl.id })}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-[#F8FBFA] transition-colors min-h-[72px]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <AvatarImage src={cl.avatar} alt={cl.name} sizeClass="w-12 h-12" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#062C24] truncate">{cl.name}</p>
                    </div>
                    <p className="text-xs text-[#4A635D] truncate">{cl.goal}</p>
                    <p className="text-[11px] text-[#6D857E] mt-0.5 font-mono tabular-nums">
                      {cl.unit} · {workoutsCount} planos · {cl.monthlyCheckIns} treinos/mês
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusLabel status={cl.membershipStatus} />
                  <ChevronRight className="w-4 h-4 text-[#6D857E]" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export const TrainerClientDetailScreen: React.FC = () => {
  const { db, selectedClientId, addBodyMetricLog, navigate } = useApp();
  const trainer = useCurrentTrainer();

  const client =
    db.clients.find((c) => c.id === selectedClientId) ||
    db.clients.find((c) => c.trainerId === trainer.id) ||
    db.clients[0];

  const plan = db.plans.find((p) => p.id === client.planId);
  const clientWorkouts = db.workouts.filter((w) => w.clientId === client.id);
  const clientMetrics = useMemo(
    () =>
      db.metrics
        .filter((m) => m.clientId === client.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [db.metrics, client.id]
  );

  const [evalModal, setEvalModal] = useState(false);
  const [weightKg, setWeightKg] = useState('77.5');
  const [bodyFatPct, setBodyFatPct] = useState('14.4');
  const [muscleMassKg, setMuscleMassKg] = useState('37.9');
  const [waistCm, setWaistCm] = useState('80');
  const [trainerNote, setTrainerNote] = useState('');

  const handleAddEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    addBodyMetricLog({
      clientId: client.id,
      date: '2026-11-17',
      weightKg: parseFloat(weightKg) || 75,
      bodyFatPct: parseFloat(bodyFatPct) || 15,
      muscleMassKg: parseFloat(muscleMassKg) || 35,
      waistCm: parseFloat(waistCm) || 82,
      trainerNote: trainerNote.trim() || 'Avaliação periódica registada.',
      recordedBy: trainer.name,
    });
    setTrainerNote('');
    setEvalModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Client Header Card */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <AvatarImage src={client.avatar} alt={client.name} sizeClass="w-16 h-16" />
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-[#062C24] truncate">{client.name}</h2>
              <p className="text-xs text-[#4A635D] mt-0.5">{client.goal}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A635D] mt-1 font-mono tabular-nums">
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#059669]" />
                  {client.phone}
                </span>
                <span>·</span>
                <span>{client.unit}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <StatusLabel status={client.membershipStatus} />
            <p className="text-xs text-[#4A635D]">{plan?.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#EEF3F1]">
          <button
            type="button"
            onClick={() => setEvalModal(true)}
            className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Registar Avaliação Física</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('trainer-workouts')}
            className="min-h-[44px] px-4 rounded-xl bg-[#062C24] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Atribuir Plano de Treino</span>
          </button>
        </div>
      </section>

      {/* Client Evolution Chart */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
        <h3 className="text-base font-bold text-[#062C24]">Evolução de Peso (kg)</h3>
        <EvolutionLineChart
          points={clientMetrics.map((m) => ({
            label: formatShortDatePt(m.date),
            value: m.weightKg,
          }))}
          unit="kg"
          color="#059669"
        />
      </section>

      {/* Assigned Workouts & Evaluation History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <h3 className="text-base font-bold text-[#062C24]">
            Planos Atribuídos ({clientWorkouts.length})
          </h3>
          {clientWorkouts.length === 0 ? (
            <p className="text-xs text-[#4A635D]">Este cliente ainda não possui planos.</p>
          ) : (
            <div className="divide-y divide-[#EEF3F1]">
              {clientWorkouts.map((wk) => (
                <div key={wk.id} className="py-3">
                  <p className="text-sm font-bold text-[#062C24]">{wk.title}</p>
                  <p className="text-xs text-[#4A635D] mt-0.5">
                    {wk.focus} · {wk.exercises.length} exercícios · {wk.completedDates.length} sessões concluídas
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <h3 className="text-base font-bold text-[#062C24]">Histórico de Acompanhamento</h3>
          {clientMetrics.length === 0 ? (
            <p className="text-xs text-[#4A635D]">Sem avaliações registadas.</p>
          ) : (
            <div className="divide-y divide-[#EEF3F1]">
              {[...clientMetrics].reverse().map((m) => (
                <div key={m.id} className="py-3 space-y-1">
                  <div className="flex justify-between text-xs font-mono tabular-nums">
                    <span className="font-bold text-[#062C24]">{formatDatePt(m.date)}</span>
                    <span className="text-[#059669] font-semibold">
                      {m.weightKg} kg · {m.bodyFatPct}% · {m.muscleMassKg} kg musc.
                    </span>
                  </div>
                  <p className="text-xs text-[#4A635D]">{m.trainerNote}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Add Physical Evaluation Modal */}
      <ModalSheet
        open={evalModal}
        onClose={() => setEvalModal(false)}
        title="Registar Avaliação Física"
        subtitle={`Cliente: ${client.name}`}
      >
        <form onSubmit={handleAddEvaluation} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">% Gordura</label>
              <input
                type="number"
                step="0.1"
                required
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Massa Magra (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={muscleMassKg}
                onChange={(e) => setMuscleMassKg(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Cintura (cm)</label>
              <input
                type="number"
                step="1"
                required
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Observações técnicas do treinador
            </label>
            <textarea
              rows={3}
              value={trainerNote}
              onChange={(e) => setTrainerNote(e.target.value)}
              placeholder="Ex: Boa evolução de massa magra. Aumentar carga nos exercícios compostos."
              className="w-full p-3 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Guardar Avaliação
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const TrainerWorkoutsScreen: React.FC = () => {
  const { db, saveWorkoutPlan, showToast } = useApp();
  const trainer = useCurrentTrainer();

  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState(
    db.clients.find((c) => c.trainerId === trainer.id)?.id || db.clients[0].id
  );
  const [title, setTitle] = useState('');
  const [focus, setFocus] = useState<WorkoutPlan['focus']>('Hipertrofia');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    {
      id: generateId('ex'),
      name: 'Agachamento Goblet com Haltere',
      muscleGroup: 'Quadríceps',
      sets: 4,
      reps: '12',
      loadKg: '22 kg',
      restSeconds: 60,
    },
  ]);

  const myWorkouts = db.workouts.filter((w) => w.trainerId === trainer.id);

  const openNewBuilder = () => {
    setEditingId(undefined);
    setTitle('');
    setFocus('Hipertrofia');
    setDaysPerWeek(4);
    setExercises([
      {
        id: generateId('ex'),
        name: 'Supino Reto com Barra',
        muscleGroup: 'Peitoral',
        sets: 4,
        reps: '10',
        loadKg: '50 kg',
        restSeconds: 90,
      },
    ]);
    setBuilderOpen(true);
  };

  const openEditBuilder = (wk: WorkoutPlan) => {
    setEditingId(wk.id);
    setClientId(wk.clientId);
    setTitle(wk.title);
    setFocus(wk.focus);
    setDaysPerWeek(wk.daysPerWeek);
    setExercises(wk.exercises);
    setBuilderOpen(true);
  };

  const addExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: generateId('ex'),
        name: '',
        muscleGroup: 'Geral',
        sets: 3,
        reps: '12',
        loadKg: '15 kg',
        restSeconds: 60,
      },
    ]);
  };

  const updateExerciseField = (
    idx: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex))
    );
  };

  const removeExerciseRow = (idx: number) => {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Indica um título para o plano de treino.', 'error');
      return;
    }
    const validExercises = exercises.filter((ex) => ex.name.trim().length > 0);
    if (validExercises.length === 0) {
      showToast('Adiciona pelo menos um exercício válido.', 'error');
      return;
    }
    saveWorkoutPlan({
      id: editingId,
      clientId,
      trainerId: trainer.id,
      title: title.trim(),
      focus,
      daysPerWeek,
      exercises: validExercises,
    });
    setBuilderOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Planos de Treino Criados</h2>
          <p className="text-xs text-[#4A635D]">
            Cria e atribui planos com séries, repetições e cargas.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewBuilder}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Plano</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myWorkouts.map((wk) => {
          const cl = db.clients.find((c) => c.id === wk.clientId);
          return (
            <div
              key={wk.id}
              className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#059669]">
                    Para {cl?.name || 'Cliente'} · {wk.focus}
                  </p>
                  <h3 className="text-base font-bold text-[#062C24] mt-0.5">{wk.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => openEditBuilder(wk)}
                  className="min-h-[36px] px-3 rounded-lg border border-[#D4E0DC] text-xs font-semibold text-[#062C24] hover:bg-[#F6F9F8]"
                >
                  Editar
                </button>
              </div>

              <div className="divide-y divide-[#EEF3F1]">
                {wk.exercises.map((ex) => (
                  <div key={ex.id} className="py-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#062C24] truncate pr-2">{ex.name}</span>
                    <span className="font-mono tabular-nums text-[#4A635D] shrink-0">
                      {ex.sets}×{ex.reps} · {ex.loadKg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Workout Plan Modal */}
      <ModalSheet
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        title={editingId ? 'Editar Plano de Treino' : 'Criar Plano de Treino'}
        subtitle="O cliente recebe o plano imediatamente na sua área."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Cliente</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              {db.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Título do Plano
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treino C · Glúteos & Posteriores"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Foco</label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value as WorkoutPlan['focus'])}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Força">Força</option>
                <option value="Condicionamento">Condicionamento</option>
                <option value="Mobilidade">Mobilidade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Frequência (dias/sem)
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value, 10) || 3)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
          </div>

          {/* Exercises Builder */}
          <div className="space-y-3 pt-2 border-t border-[#EEF3F1]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#062C24]">
                Exercícios ({exercises.length})
              </span>
              <button
                type="button"
                onClick={addExerciseRow}
                className="text-xs font-bold text-[#059669] flex items-center gap-1 min-h-[36px]"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Exercício</span>
              </button>
            </div>

            {exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="p-3 rounded-xl bg-[#F6F9F8] border border-[#E2EAE7] space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nome do exercício"
                    value={ex.name}
                    onChange={(e) => updateExerciseField(idx, 'name', e.target.value)}
                    className="flex-1 min-h-[40px] px-3 rounded-lg border border-[#D4E0DC] bg-white text-xs font-semibold"
                  />
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExerciseRow(idx)}
                      aria-label="Remover exercício"
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#4A635D]">Séries</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={ex.sets}
                      onChange={(e) =>
                        updateExerciseField(idx, 'sets', parseInt(e.target.value, 10) || 3)
                      }
                      className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#D4E0DC] bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#4A635D]">Repetições</label>
                    <input
                      type="text"
                      value={ex.reps}
                      onChange={(e) => updateExerciseField(idx, 'reps', e.target.value)}
                      className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#D4E0DC] bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#4A635D]">Carga</label>
                    <input
                      type="text"
                      value={ex.loadKg}
                      onChange={(e) => updateExerciseField(idx, 'loadKg', e.target.value)}
                      className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#D4E0DC] bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Guardar e Atribuir Plano
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const TrainerScheduleScreen: React.FC = () => {
  const { db, updateSessionStatus, bookSession } = useApp();
  const trainer = useCurrentTrainer();
  const [filter, setFilter] = useState<string>('Todas');
  const [newModal, setNewModal] = useState(false);
  const [clientId, setClientId] = useState(db.clients[0].id);
  const [date, setDate] = useState('2026-11-19');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<SessionBooking['type']>('Treino Personalizado');

  const sessions = db.sessions
    .filter((s) => s.trainerId === trainer.id)
    .filter((s) => filter === 'Todas' || s.status === filter)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    bookSession({
      clientId,
      trainerId: trainer.id,
      date,
      time,
      type,
      unit: trainer.unit,
      notes: 'Agendado diretamente pelo Personal Trainer',
    });
    setNewModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Gestão de Horários</h2>
          <p className="text-xs text-[#4A635D]">Turno habitual: {trainer.scheduleHours}</p>
        </div>
        <button
          type="button"
          onClick={() => setNewModal(true)}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['Todas', 'Pendente', 'Confirmada', 'Concluída', 'Cancelada'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
              filter === st
                ? 'bg-[#062C24] text-white'
                : 'bg-white border border-[#E2EAE7] text-[#4A635D]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE7] p-8 text-center text-xs text-[#4A635D]">
            Nenhuma sessão neste estado.
          </div>
        ) : (
          sessions.map((ses) => {
            const cl = db.clients.find((c) => c.id === ses.clientId);
            return (
              <div
                key={ses.id}
                className="bg-white rounded-2xl border border-[#E2EAE7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#062C24]">{cl?.name || 'Cliente'}</p>
                    <StatusLabel status={ses.status} />
                  </div>
                  <p className="text-xs text-[#4A635D] font-mono tabular-nums">
                    {formatDatePt(ses.date)} · {ses.time} · {ses.type} ({ses.unit})
                  </p>
                  {ses.notes && <p className="text-xs text-[#059669]">{ses.notes}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ses.status === 'Pendente' && (
                    <button
                      type="button"
                      onClick={() => updateSessionStatus(ses.id, 'Confirmada')}
                      className="min-h-[40px] px-3.5 rounded-xl bg-[#059669] text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirmar</span>
                    </button>
                  )}
                  {ses.status === 'Confirmada' && (
                    <button
                      type="button"
                      onClick={() => updateSessionStatus(ses.id, 'Concluída')}
                      className="min-h-[40px] px-3.5 rounded-xl bg-[#062C24] text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Concluir</span>
                    </button>
                  )}
                  {(ses.status === 'Pendente' || ses.status === 'Confirmada') && (
                    <button
                      type="button"
                      onClick={() => updateSessionStatus(ses.id, 'Cancelada')}
                      className="min-h-[40px] px-3 rounded-xl border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <ModalSheet
        open={newModal}
        onClose={() => setNewModal(false)}
        title="Agendar Sessão com Cliente"
      >
        <form onSubmit={handleAddSlot} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Cliente</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              {db.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SessionBooking['type'])}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              <option value="Treino Personalizado">Treino Personalizado</option>
              <option value="Avaliação Física">Avaliação Física</option>
              <option value="Musculação Guiada">Musculação Guiada</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Criar Marcação
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const TrainerNotificationsScreen: React.FC = () => {
  const { db, markNotificationRead, markAllNotificationsRead, logout } = useApp();
  const trainer = useCurrentTrainer();

  const items = db.notifications.filter(
    (n) =>
      n.targetRole === 'all' ||
      (n.targetRole === 'trainer' && (!n.targetUserId || n.targetUserId === trainer.id))
  );

  const recentLogs = [...db.metrics]
    .filter((m) => m.recordedBy === trainer.name)
    .reverse()
    .slice(0, 6);

  return (
    <div className="space-y-5">
      {/* Notifications */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#062C24]">Notificações</h2>
          <button
            type="button"
            onClick={() => markAllNotificationsRead('trainer', trainer.id)}
            className="min-h-[38px] px-3 rounded-xl bg-white border border-[#E2EAE7] text-xs font-semibold text-[#062C24]"
          >
            Marcar lidas
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE7] divide-y divide-[#EEF3F1]">
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markNotificationRead(n.id)}
              className={`w-full p-4 text-left flex items-start gap-3 ${
                n.read ? 'bg-white' : 'bg-[#F2FBF7]'
              }`}
            >
              <Bell
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  n.read ? 'text-[#6D857E]' : 'text-[#059669]'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-bold text-[#062C24] truncate">{n.title}</p>
                  <span className="text-[11px] font-mono text-[#6D857E] shrink-0">
                    {n.createdAt}
                  </span>
                </div>
                <p className="text-xs text-[#4A635D] mt-1">{n.message}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Coaching Log */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#059669]" />
          <h3 className="text-base font-bold text-[#062C24]">Histórico de Acompanhamento</h3>
        </div>
        <div className="divide-y divide-[#EEF3F1]">
          {recentLogs.map((log) => {
            const cl = db.clients.find((c) => c.id === log.clientId);
            return (
              <div key={log.id} className="py-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#062C24]">{cl?.name}</span>
                  <span className="font-mono text-[#6D857E]">{formatDatePt(log.date)}</span>
                </div>
                <p className="text-xs font-mono text-[#059669]">
                  {log.weightKg} kg · {log.bodyFatPct}% gordura · {log.muscleMassKg} kg músculo
                </p>
                <p className="text-xs text-[#4A635D]">{log.trainerNote}</p>
              </div>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={logout}
        className="w-full min-h-[46px] rounded-xl border border-[#D4E0DC] bg-white text-[#062C24] text-xs font-bold flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Terminar Sessão / Trocar de Perfil</span>
      </button>
    </div>
  );
};
