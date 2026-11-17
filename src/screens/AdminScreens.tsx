import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  LogOut,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { ASSETS } from '../data/seedData';
import { useApp } from '../context/AppContext';
import {
  AppNotification,
  ClientProfile,
  GymUnit,
  MembershipPlan,
  MembershipStatus,
  PaymentMethod,
  TrainerProfile,
  UserRole,
} from '../types/kimakwami';
import {
  formatDatePt,
  formatKz,
  isValidAngolaPhone,
  isValidEmail,
} from '../utils/formatters';
import { AvatarImage, StatusLabel } from '../components/BrandLogo';
import { EvolutionLineChart, SimpleBarChart } from '../components/Charts';
import { ModalSheet } from '../components/ModalSheet';

export const AdminDashboardScreen: React.FC = () => {
  const { db, navigate } = useApp();
  const admin = db.admins[0];

  const totalClients = db.clients.length;
  const activeClients = db.clients.filter((c) => c.membershipStatus === 'Ativa').length;
  const expiringOrExpired = db.clients.filter(
    (c) => c.membershipStatus === 'A expirar' || c.membershipStatus === 'Expirada'
  );
  const totalRevenueKz = db.payments
    .filter((p) => p.status === 'Pago')
    .reduce((sum, p) => sum + p.amountKz, 0);

  const revenueSeries = [
    { label: 'Jul', value: 410000 },
    { label: 'Ago', value: 525000 },
    { label: 'Set', value: 590000 },
    { label: 'Out', value: 645000 },
    { label: 'Nov', value: totalRevenueKz, highlight: true },
  ];

  return (
    <div className="space-y-5">
      {/* Admin Hero Card */}
      <section className="rounded-2xl bg-[#062C24] text-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <AvatarImage
              src={admin?.avatar}
              alt={admin?.name || 'Admin'}
              sizeClass="w-13 h-13 border-2 border-[#84CC16]"
            />
            <div className="min-w-0">
              <p className="text-xs text-[#A3E635] font-semibold">Administração Geral</p>
              <h2 className="text-lg sm:text-xl font-extrabold truncate">{admin?.name}</h2>
              <p className="text-xs text-emerald-100/75 truncate">
                {admin?.roleTitle} · Luanda (Talatona & Miramar)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('admin-finance')}
            className="hidden sm:inline-flex min-h-[42px] px-4 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Registar Pagamento</span>
          </button>
        </div>

        {/* 4 Key KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div>
            <p className="text-[11px] text-emerald-100/70">Total de Clientes</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums mt-0.5">
              {totalClients}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70">Inscrições Ativas</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-[#A3E635] mt-0.5">
              {activeClients}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70">Expiradas / A Expirar</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-amber-300 mt-0.5">
              {expiringOrExpired.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70">Receita Confirmada</p>
            <p className="text-lg sm:text-xl font-extrabold font-mono tabular-nums mt-1">
              {formatKz(totalRevenueKz)}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Management Shortcuts */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('admin-clients')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <Users className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Clientes & Inscrições</p>
          <p className="text-xs text-[#4A635D] mt-0.5">{totalClients} registados</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('admin-trainers')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <UserCheck className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Personal Trainers</p>
          <p className="text-xs text-[#4A635D] mt-0.5">{db.trainers.length} treinadores</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('admin-plans')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <CreditCard className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Planos & Mensalidades</p>
          <p className="text-xs text-[#4A635D] mt-0.5">{db.plans.length} planos em Kz</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('admin-finance')}
          className="bg-white rounded-2xl border border-[#E2EAE7] p-4 text-left hover:border-[#059669] transition-colors"
        >
          <Wallet className="w-5 h-5 text-[#059669] mb-2" />
          <p className="text-sm font-bold text-[#062C24]">Pagamentos & Caixa</p>
          <p className="text-xs text-[#4A635D] mt-0.5">{db.payments.length} transações</p>
        </button>
      </section>

      {/* Revenue Chart + Expiring Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#062C24]">Faturação Mensal (Kz)</h3>
            <button
              type="button"
              onClick={() => navigate('admin-reports')}
              className="text-xs font-semibold text-[#059669] hover:underline min-h-[36px]"
            >
              Ver relatórios
            </button>
          </div>
          <SimpleBarChart data={revenueSeries} formatValue={(v) => formatKz(v)} />
        </section>

        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-[#062C24]">
                Inscrições Expiradas / A Expirar
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('admin-clients')}
              className="text-xs font-semibold text-[#059669] hover:underline min-h-[36px]"
            >
              Gerir
            </button>
          </div>

          {expiringOrExpired.length === 0 ? (
            <p className="text-xs text-[#4A635D] py-4">
              Todas as inscrições encontram-se ativas e em dia.
            </p>
          ) : (
            <div className="divide-y divide-[#EEF3F1]">
              {expiringOrExpired.map((cl) => (
                <div key={cl.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#062C24] truncate">{cl.name}</p>
                    <p className="text-xs text-[#4A635D] font-mono tabular-nums">
                      {cl.phone} · Validade {formatDatePt(cl.validUntil)}
                    </p>
                  </div>
                  <StatusLabel status={cl.membershipStatus} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export const AdminClientsScreen: React.FC = () => {
  const { db, upsertClient, navigate, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [modalOpen, setModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+244 923 ');
  const [unit, setUnit] = useState<GymUnit>('Talatona');
  const [planId, setPlanId] = useState(db.plans[0]?.id || 'plan-essencial');
  const [trainerId, setTrainerId] = useState(db.trainers[0]?.id || 'tr-1');
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>('Ativa');
  const [validUntil, setValidUntil] = useState('2026-12-30');
  const [goal, setGoal] = useState('Condicionamento e saúde');

  const filtered = useMemo(() => {
    return db.clients.filter((c) => {
      const matchesStatus =
        statusFilter === 'Todos' || c.membershipStatus === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [db.clients, statusFilter, query]);

  const openCreate = () => {
    setEditingId(undefined);
    setName('');
    setEmail('');
    setPhone('+244 923 ');
    setUnit('Talatona');
    setPlanId(db.plans[0]?.id || 'plan-essencial');
    setTrainerId(db.trainers[0]?.id || 'tr-1');
    setMembershipStatus('Ativa');
    setValidUntil('2026-12-30');
    setGoal('Ganho de força e saúde');
    setModalOpen(true);
  };

  const openEdit = (cl: ClientProfile) => {
    setEditingId(cl.id);
    setName(cl.name);
    setEmail(cl.email);
    setPhone(cl.phone);
    setUnit(cl.unit);
    setPlanId(cl.planId);
    setTrainerId(cl.trainerId);
    setMembershipStatus(cl.membershipStatus);
    setValidUntil(cl.validUntil);
    setGoal(cl.goal);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      showToast('Indica o nome completo do cliente.', 'error');
      return;
    }
    if (!isValidAngolaPhone(phone)) {
      showToast('Usa um contacto válido (+244 9XX XXX XXX).', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Indica um e-mail válido.', 'error');
      return;
    }

    const existing = editingId ? db.clients.find((c) => c.id === editingId) : undefined;
    upsertClient({
      id: editingId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: existing?.password || '123456',
      avatar: existing?.avatar || ASSETS.avatarClientMale,
      unit,
      goal: goal.trim(),
      planId,
      membershipStatus,
      validUntil,
      trainerId,
      birthDate: existing?.birthDate || '1994-05-12',
      emergencyContact: existing?.emergencyContact || '+244 923 000 000',
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Gestão de Clientes & Inscrições</h2>
          <p className="text-xs text-[#4A635D]">
            Regista membros, altera planos e gere estados de inscrição.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('admin-trainers')}
            className="min-h-[42px] px-3.5 rounded-xl bg-white border border-[#D4E0DC] text-xs font-semibold text-[#062C24]"
          >
            Gerir Treinadores
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="min-h-[42px] px-4 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6D857E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por nome, +244 ou e-mail..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-[#D4E0DC] bg-white text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Todos', 'Ativa', 'A expirar', 'Expirada'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#062C24] text-white'
                  : 'bg-white border border-[#E2EAE7] text-[#4A635D]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-2xl border border-[#E2EAE7] divide-y divide-[#EEF3F1]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#4A635D]">
            Nenhum cliente encontrado.
          </div>
        ) : (
          filtered.map((cl) => {
            const plan = db.plans.find((p) => p.id === cl.planId);
            const pt = db.trainers.find((t) => t.id === cl.trainerId);
            return (
              <div
                key={cl.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <AvatarImage src={cl.avatar} alt={cl.name} sizeClass="w-12 h-12" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#062C24] truncate">{cl.name}</p>
                      <StatusLabel status={cl.membershipStatus} />
                    </div>
                    <p className="text-xs text-[#4A635D] font-mono tabular-nums mt-0.5">
                      {cl.phone} · {cl.unit}
                    </p>
                    <p className="text-xs text-[#4A635D] mt-0.5 truncate">
                      {plan?.name} (até {formatDatePt(cl.validUntil)}) · PT {pt?.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openEdit(cl)}
                  className="min-h-[40px] px-3.5 rounded-xl border border-[#D4E0DC] hover:bg-[#F6F9F8] text-xs font-semibold text-[#062C24] flex items-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar / Inscrição</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Client Modal */}
      <ModalSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Cliente & Inscrição' : 'Registar Novo Cliente'}
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Nome Completo</label>
            <input
              type="text"
              required
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
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
              />
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
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Estado da Inscrição
              </label>
              <select
                value={membershipStatus}
                onChange={(e) => setMembershipStatus(e.target.value as MembershipStatus)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="Ativa">Ativa</option>
                <option value="A expirar">A expirar</option>
                <option value="Expirada">Expirada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Plano</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                {db.plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Válido até
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Personal Trainer Associado
            </label>
            <select
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              {db.trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.unit})
                </option>
              ))}
            </select>
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

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            {editingId ? 'Guardar Alterações' : 'Registar Cliente'}
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const AdminTrainersScreen: React.FC = () => {
  const { db, upsertTrainer, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+244 923 ');
  const [unit, setUnit] = useState<GymUnit>('Talatona');
  const [specialty, setSpecialty] = useState('Hipertrofia & Funcional');
  const [certification, setCertification] = useState('Certificado CFE-AO');
  const [scheduleHours, setScheduleHours] = useState('07:00 – 15:00 · Seg a Sáb');
  const [active, setActive] = useState(true);

  const openCreate = () => {
    setEditingId(undefined);
    setName('');
    setEmail('');
    setPhone('+244 923 ');
    setUnit('Talatona');
    setSpecialty('Musculação & Condicionamento');
    setCertification('Certificado CFE-AO');
    setScheduleHours('07:00 – 15:00 · Seg a Sáb');
    setActive(true);
    setModalOpen(true);
  };

  const openEdit = (tr: TrainerProfile) => {
    setEditingId(tr.id);
    setName(tr.name);
    setEmail(tr.email);
    setPhone(tr.phone);
    setUnit(tr.unit);
    setSpecialty(tr.specialty);
    setCertification(tr.certification);
    setScheduleHours(tr.scheduleHours);
    setActive(tr.active);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || !isValidAngolaPhone(phone) || !isValidEmail(email)) {
      showToast('Verifica o nome, e-mail e contacto +244 do treinador.', 'error');
      return;
    }
    const existing = editingId ? db.trainers.find((t) => t.id === editingId) : undefined;
    upsertTrainer({
      id: editingId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: existing?.password || '123456',
      avatar: existing?.avatar || ASSETS.avatarTrainerMale,
      unit,
      specialty: specialty.trim(),
      experienceYears: existing?.experienceYears || 4,
      certification: certification.trim(),
      bio: existing?.bio || 'Personal Trainer certificado na equipa KIMAKWAMI FITNESS.',
      active,
      scheduleHours: scheduleHours.trim(),
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Equipa de Personal Trainers</h2>
          <p className="text-xs text-[#4A635D]">Gere os treinadores e unidades em Luanda.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar PT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {db.trainers.map((tr) => {
          const clientCount = db.clients.filter((c) => c.trainerId === tr.id).length;
          return (
            <div
              key={tr.id}
              className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <AvatarImage src={tr.avatar} alt={tr.name} sizeClass="w-13 h-13" />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#062C24] truncate">{tr.name}</h3>
                    <p className="text-xs text-[#059669] font-semibold truncate">
                      {tr.specialty}
                    </p>
                    <p className="text-xs text-[#4A635D] font-mono tabular-nums mt-0.5">
                      {tr.phone} · {tr.unit}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(tr)}
                  className="min-h-[38px] px-3 rounded-xl border border-[#D4E0DC] text-xs font-semibold text-[#062C24]"
                >
                  Editar
                </button>
              </div>
              <div className="pt-2 border-t border-[#EEF3F1] flex items-center justify-between text-xs text-[#4A635D]">
                <span>{tr.scheduleHours}</span>
                <span className="font-mono font-bold text-[#062C24]">
                  {clientCount} clientes · {tr.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ModalSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Personal Trainer' : 'Novo Personal Trainer'}
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Telemóvel (+244)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
              />
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
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Estado</label>
              <select
                value={active ? '1' : '0'}
                onChange={(e) => setActive(e.target.value === '1')}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Especialidade</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Horário</label>
            <input
              type="text"
              value={scheduleHours}
              onChange={(e) => setScheduleHours(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Guardar Treinador
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const AdminPlansScreen: React.FC = () => {
  const { db, upsertPlan, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [priceKz, setPriceKz] = useState('45000');
  const [durationDays, setDurationDays] = useState('30');
  const [benefitsText, setBenefitsText] = useState('');
  const [active, setActive] = useState(true);

  const openCreate = () => {
    setEditingId(undefined);
    setName('');
    setSubtitle('');
    setPriceKz('45000');
    setDurationDays('30');
    setBenefitsText('Acesso total às instalações\nAvaliação física inicial');
    setActive(true);
    setModalOpen(true);
  };

  const openEdit = (p: MembershipPlan) => {
    setEditingId(p.id);
    setName(p.name);
    setSubtitle(p.subtitle);
    setPriceKz(String(p.priceKz));
    setDurationDays(String(p.durationDays));
    setBenefitsText(p.benefits.join('\n'));
    setActive(p.active);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseInt(priceKz, 10);
    const numericDays = parseInt(durationDays, 10);
    if (!name.trim() || isNaN(numericPrice) || numericPrice <= 0) {
      showToast('Preenche o nome e um valor válido em Kwanza.', 'error');
      return;
    }
    upsertPlan({
      id: editingId,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Plano oficial KIMAKWAMI FITNESS',
      priceKz: numericPrice,
      durationDays: numericDays || 30,
      benefits: benefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      active,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Planos e Mensalidades</h2>
          <p className="text-xs text-[#4A635D]">Valores definidos em Kwanza (Kz).</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Plano</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {db.plans.map((plan) => {
          const subscribers = db.clients.filter((c) => c.planId === plan.id).length;
          return (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#059669]">
                    {plan.durationDays} dias · {subscribers} clientes ·{' '}
                    {plan.active ? 'Ativo' : 'Inativo'}
                  </p>
                  <h3 className="text-base font-extrabold text-[#062C24] mt-0.5">{plan.name}</h3>
                  <p className="text-xs text-[#4A635D] mt-0.5">{plan.subtitle}</p>
                </div>
                <p className="text-lg font-extrabold font-mono tabular-nums text-[#062C24] shrink-0">
                  {formatKz(plan.priceKz)}
                </p>
              </div>

              <ul className="space-y-1 text-xs text-[#4A635D] pt-2 border-t border-[#EEF3F1]">
                {plan.benefits.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => openEdit(plan)}
                className="min-h-[40px] px-4 rounded-xl border border-[#D4E0DC] text-xs font-semibold text-[#062C24] hover:bg-[#F6F9F8]"
              >
                Editar Plano
              </button>
            </div>
          );
        })}
      </div>

      <ModalSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Plano' : 'Criar Novo Plano'}
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Nome do Plano</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Descrição Curta</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Preço (Kz)</label>
              <input
                type="number"
                required
                value={priceKz}
                onChange={(e) => setPriceKz(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Duração (dias)</label>
              <input
                type="number"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Estado</label>
              <select
                value={active ? '1' : '0'}
                onChange={(e) => setActive(e.target.value === '1')}
                className="w-full min-h-[44px] px-2.5 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Benefícios (um por linha)
            </label>
            <textarea
              rows={3}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Guardar Plano
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const AdminFinanceScreen: React.FC = () => {
  const { db, recordPayment, updatePaymentStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pago' | 'Pendente'>('Todos');
  const [methodFilter, setMethodFilter] = useState<string>('Todos');
  const [newModal, setNewModal] = useState(false);

  const [clientId, setClientId] = useState(db.clients[0].id);
  const [planId, setPlanId] = useState(db.plans[0].id);
  const [amountKz, setAmountKz] = useState(String(db.plans[0].priceKz));
  const [method, setMethod] = useState<PaymentMethod>('Multicaixa Express');
  const [payStatus, setPayStatus] = useState<'Pago' | 'Pendente'>('Pago');

  const totalPaid = db.payments
    .filter((p) => p.status === 'Pago')
    .reduce((acc, p) => acc + p.amountKz, 0);
  const totalPending = db.payments
    .filter((p) => p.status === 'Pendente')
    .reduce((acc, p) => acc + p.amountKz, 0);

  const filtered = db.payments
    .filter((p) => statusFilter === 'Todos' || p.status === statusFilter)
    .filter((p) => methodFilter === 'Todos' || p.method === methodFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handlePlanChange = (nextPlanId: string) => {
    setPlanId(nextPlanId);
    const p = db.plans.find((pl) => pl.id === nextPlanId);
    if (p) setAmountKz(String(p.priceKz));
  };

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment({
      clientId,
      planId,
      amountKz: parseInt(amountKz, 10) || 35000,
      method,
      status: payStatus,
    });
    setNewModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Pagamentos & Histórico Financeiro</h2>
          <p className="text-xs text-[#4A635D]">Controlo de mensalidades em Kwanza (Kz).</p>
        </div>
        <button
          type="button"
          onClick={() => setNewModal(true)}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Pagamento</span>
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-[#E2EAE7] p-4">
          <p className="text-xs text-[#4A635D]">Total Recebido</p>
          <p className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-[#059669] mt-1">
            {formatKz(totalPaid)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2EAE7] p-4">
          <p className="text-xs text-[#4A635D]">Pendente de Cobrança</p>
          <p className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-amber-700 mt-1">
            {formatKz(totalPending)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {(['Todos', 'Pago', 'Pendente'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold ${
                statusFilter === st
                  ? 'bg-[#062C24] text-white'
                  : 'bg-white border border-[#E2EAE7] text-[#4A635D]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          aria-label="Filtrar por método de pagamento"
          className="min-h-[38px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-xs font-semibold text-[#062C24]"
        >
          <option value="Todos">Todos os métodos</option>
          <option value="Multicaixa Express">Multicaixa Express</option>
          <option value="TPA Ginásio">TPA Ginásio</option>
          <option value="Transferência Bancária">Transferência Bancária</option>
          <option value="Numerário">Numerário</option>
        </select>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-2xl border border-[#E2EAE7] divide-y divide-[#EEF3F1]">
        {filtered.map((pay) => {
          const cl = db.clients.find((c) => c.id === pay.clientId);
          return (
            <div
              key={pay.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#062C24] truncate">
                  {cl?.name || 'Cliente'} · {pay.planName}
                </p>
                <p className="text-xs text-[#4A635D] font-mono tabular-nums mt-0.5">
                  {formatDatePt(pay.date)} · {pay.method} · {pay.reference}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-extrabold font-mono tabular-nums text-[#062C24]">
                    {formatKz(pay.amountKz)}
                  </p>
                  <StatusLabel status={pay.status} />
                </div>
                {pay.status === 'Pendente' && (
                  <button
                    type="button"
                    onClick={() => updatePaymentStatus(pay.id, 'Pago')}
                    className="min-h-[38px] px-3 rounded-xl bg-[#059669] text-white text-xs font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Liquidar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal */}
      <ModalSheet
        open={newModal}
        onClose={() => setNewModal(false)}
        title="Registar Pagamento"
        subtitle="Pagamentos marcados como Pago renovam automaticamente a inscrição."
      >
        <form onSubmit={handleRecord} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Cliente</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              {db.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.membershipStatus})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Plano</label>
            <select
              value={planId}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              {db.plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatKz(p.priceKz)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Valor (Kz)
              </label>
              <input
                type="number"
                required
                value={amountKz}
                onChange={(e) => setAmountKz(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Estado</label>
              <select
                value={payStatus}
                onChange={(e) => setPayStatus(e.target.value as 'Pago' | 'Pendente')}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">
              Método de Pagamento
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
            >
              <option value="Multicaixa Express">Multicaixa Express</option>
              <option value="TPA Ginásio">TPA Ginásio</option>
              <option value="Transferência Bancária">Transferência Bancária</option>
              <option value="Numerário">Numerário</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Registar no Sistema
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};

export const AdminReportsScreen: React.FC = () => {
  const {
    db,
    sendBroadcastNotification,
    markAllNotificationsRead,
    resetDemoData,
    logout,
  } = useApp();

  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole | 'all'>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<AppNotification['category']>('Comunicado');

  const growthPoints = [
    { label: 'Jul', value: 42 },
    { label: 'Ago', value: 49 },
    { label: 'Set', value: 56 },
    { label: 'Out', value: 64 },
    { label: 'Nov', value: 68 + db.clients.length },
  ];

  const planPopularity = db.plans.map((p) => ({
    label: p.name.split(' ')[0],
    value: db.clients.filter((c) => c.planId === p.id).length,
    highlight: p.popular,
  }));

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    sendBroadcastNotification({ targetRole, title, message, category });
    setTitle('');
    setMessage('');
    setBroadcastOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#062C24]">Relatórios & Comunicados</h2>
          <p className="text-xs text-[#4A635D]">Análise estatística e notificações gerais.</p>
        </div>
        <button
          type="button"
          onClick={() => setBroadcastOpen(true)}
          className="min-h-[44px] px-4 rounded-xl bg-[#84CC16] text-[#062C24] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
        >
          <Megaphone className="w-4 h-4" />
          <span>Enviar Aviso</span>
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <h3 className="text-base font-bold text-[#062C24]">Crescimento de Membros Ativos</h3>
          <EvolutionLineChart points={growthPoints} unit="membros" color="#059669" />
        </section>

        <section className="bg-white rounded-2xl border border-[#E2EAE7] p-5 space-y-3">
          <h3 className="text-base font-bold text-[#062C24]">Distribuição por Plano</h3>
          <SimpleBarChart data={planPopularity} formatValue={(v) => `${v} clientes`} />
        </section>
      </div>

      {/* Global Notifications Feed */}
      <section className="bg-white rounded-2xl border border-[#E2EAE7] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF3F1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#059669]" />
            <h3 className="text-base font-bold text-[#062C24]">Notificações & Comunicados</h3>
          </div>
          <button
            type="button"
            onClick={() => markAllNotificationsRead('admin', db.admins[0]?.id || 'adm-1')}
            className="text-xs font-semibold text-[#059669]"
          >
            Marcar lidas
          </button>
        </div>
        <div className="divide-y divide-[#EEF3F1]">
          {db.notifications.slice(0, 6).map((n) => (
            <div key={n.id} className="p-4 space-y-1">
              <div className="flex justify-between gap-2 text-xs">
                <span className="font-bold text-[#062C24]">{n.title}</span>
                <span className="font-mono text-[#6D857E] shrink-0">{n.createdAt}</span>
              </div>
              <p className="text-xs text-[#4A635D]">{n.message}</p>
              <p className="text-[11px] text-[#059669] font-semibold">
                Destino: {n.targetRole === 'all' ? 'Todos' : n.targetRole} · {n.category}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={logout}
          className="flex-1 min-h-[46px] rounded-xl border border-[#D4E0DC] bg-white text-[#062C24] text-xs font-bold flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminar Sessão / Trocar Perfil</span>
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

      {/* Broadcast Modal */}
      <ModalSheet
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        title="Enviar Notificação Geral"
        subtitle="O comunicado será entregue imediatamente ao público selecionado."
      >
        <form onSubmit={handleBroadcast} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Destinatários
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as UserRole | 'all')}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="all">Todos os utilizadores</option>
                <option value="client">Apenas Clientes</option>
                <option value="trainer">Apenas Personal Trainers</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AppNotification['category'])}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] bg-white text-sm"
              >
                <option value="Comunicado">Comunicado</option>
                <option value="Inscrição">Inscrição</option>
                <option value="Pagamento">Pagamento</option>
                <option value="Agenda">Agenda</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Horário especial de feriado"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#062C24] mb-1">Mensagem</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreve o aviso para os membros do ginásio..."
              className="w-full p-3 rounded-xl border border-[#D4E0DC] text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#062C24] text-white font-bold text-sm"
          >
            Publicar Notificação
          </button>
        </form>
      </ModalSheet>
    </div>
  );
};
