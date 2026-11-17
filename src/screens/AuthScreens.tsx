import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  MapPin,
  Shield,
  TrendingUp,
  User,
  UserCheck,
} from 'lucide-react';
import { ASSETS } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { GymUnit, UserRole } from '../types/kimakwami';
import { formatKz, isValidAngolaPhone, isValidEmail } from '../utils/formatters';
import { BrandLogo } from '../components/BrandLogo';

export const WelcomeScreen: React.FC = () => {
  const { navigate, loginDemo } = useApp();

  return (
    <div className="min-h-screen bg-[#062C24] text-white flex flex-col">
      {/* Top minimal bar */}
      <header className="px-5 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <BrandLogo variant="light" size="md" />
        <button
          type="button"
          onClick={() => navigate('login')}
          className="min-h-[44px] px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors whitespace-nowrap"
        >
          Entrar na Conta
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 pb-10 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider text-[#A3E635] uppercase">
              Luanda · Talatona & Miramar
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-[1.1] text-balance">
              A tua evolução.{' '}
              <span className="text-[#A3E635]">A nossa missão.</span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed max-w-xl">
              Plataforma digital da KIMAKWAMI FITNESS para gerir a tua adesão, treinar com planos
              personalizados, marcar sessões com Personal Trainers e acompanhar cada marco da tua
              evolução física em Angola.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate('login')}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] font-bold text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>Aceder à Plataforma</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('register')}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center transition-colors whitespace-nowrap"
            >
              Criar Conta de Cliente
            </button>
          </div>

          {/* Instant 3-Role Demo Access */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs font-medium text-emerald-100/75 mb-3">
              Acesso rápido demonstrativo por perfil
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => loginDemo('client')}
                className="min-h-[52px] px-3.5 py-2.5 rounded-xl bg-[#0B3F34] hover:bg-[#115345] border border-white/10 text-left flex items-center gap-3 transition-colors"
              >
                <User className="w-5 h-5 text-[#A3E635] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Cliente</div>
                  <div className="text-[11px] text-emerald-100/70 truncate">Kiluanje Mateus</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginDemo('trainer')}
                className="min-h-[52px] px-3.5 py-2.5 rounded-xl bg-[#0B3F34] hover:bg-[#115345] border border-white/10 text-left flex items-center gap-3 transition-colors"
              >
                <UserCheck className="w-5 h-5 text-[#A3E635] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Personal Trainer</div>
                  <div className="text-[11px] text-emerald-100/70 truncate">Wilson Kiala</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginDemo('admin')}
                className="min-h-[52px] px-3.5 py-2.5 rounded-xl bg-[#0B3F34] hover:bg-[#115345] border border-white/10 text-left flex items-center gap-3 transition-colors"
              >
                <Shield className="w-5 h-5 text-[#A3E635] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Administrador</div>
                  <div className="text-[11px] text-emerald-100/70 truncate">Tchissola Baptista</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0B3F34] aspect-video">
            <img
              src={ASSETS.heroGym}
              alt="Espaço de treino moderno da KIMAKWAMI FITNESS em Luanda"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031B16]/85 via-[#031B16]/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#A3E635]">Unidade Talatona & Miramar</p>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Equipamento de alto rendimento e acompanhamento técnico
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-100 shrink-0">
                <MapPin className="w-4 h-4 text-[#A3E635]" />
                <span>Namibe, AO</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0B3F34] border border-white/10">
              <Dumbbell className="w-5 h-5 text-[#A3E635] mb-2" />
              <p className="text-xs font-bold text-white">Planos à medida</p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">Séries, cargas e metas</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B3F34] border border-white/10">
              <TrendingUp className="w-5 h-5 text-[#A3E635] mb-2" />
              <p className="text-xs font-bold text-white">Evolução real</p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">Gráficos de bioimpedância</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B3F34] border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#A3E635] mb-2" />
              <p className="text-xs font-bold text-white">Gestão em Kz</p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">Multicaixa e renovações</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
  const { navigate, loginDemo, loginWithCredentials } = useApp();
  const [role, setRole] = useState<UserRole>('client');
  const [identifier, setIdentifier] = useState('kiluanje@kimakwami.ao');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const selectRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setError('');
    if (nextRole === 'client') setIdentifier('kiluanje@kimakwami.ao');
    else if (nextRole === 'trainer') setIdentifier('wilson.kiala@kimakwami.ao');
    else setIdentifier('admin@kimakwami.ao');
    setPassword('123456');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) {
      setError('Indica o teu e-mail ou contacto +244.');
      return;
    }
    if (password.length < 4) {
      setError('A palavra-passe deve ter pelo menos 4 caracteres.');
      return;
    }
    const ok = loginWithCredentials(role, identifier, password);
    if (!ok) {
      setError('Credenciais inválidas para este perfil. Usa os dados de demonstração abaixo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9F8] flex flex-col justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <BrandLogo variant="dark" size="md" showSlogan />
          <button
            type="button"
            onClick={() => navigate('welcome')}
            className="min-h-[44px] px-3 text-xs font-semibold text-[#4A635D] hover:text-[#062C24]"
          >
            Boas-vindas
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE7] p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-[#062C24]">Autenticação</h1>
            <p className="text-xs text-[#4A635D] mt-1">
              Escolhe o teu perfil de acesso ou entra diretamente com uma conta de demonstração.
            </p>
          </div>

          {/* Segmented Role Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EFF4F2]">
            {(
              [
                { id: 'client', label: 'Cliente' },
                { id: 'trainer', label: 'Treinador' },
                { id: 'admin', label: 'Admin' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectRole(tab.id)}
                className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  role === tab.id
                    ? 'bg-[#062C24] text-white'
                    : 'text-[#4A635D] hover:text-[#062C24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1.5">
                E-mail ou Telemóvel (+244)
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ex: kiluanje@kimakwami.ao"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] bg-white text-sm text-[#062C24] focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1.5">
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] pl-3.5 pr-11 rounded-xl border border-[#D4E0DC] bg-white text-sm text-[#062C24] focus:outline-none focus:border-[#059669]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#4A635D]"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-[#062C24] hover:bg-[#0B3F34] text-white font-semibold text-sm transition-colors"
            >
              Entrar como {role === 'client' ? 'Cliente' : role === 'trainer' ? 'Personal Trainer' : 'Administrador'}
            </button>
          </form>

          {/* 1-tap Demo Shortcut */}
          <div className="pt-4 border-t border-[#E8EFECE6] space-y-2.5">
            <p className="text-xs font-semibold text-[#4A635D]">
              Contas de demonstração (1 toque):
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => loginDemo('client')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6E2] hover:border-[#059669] bg-[#F8FBFA] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-[#062C24]">Entrar como Cliente</div>
                  <div className="text-[11px] text-[#4A635D]">Kiluanje Mateus · Plano Trimestral</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#059669]" />
              </button>

              <button
                type="button"
                onClick={() => loginDemo('trainer')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6E2] hover:border-[#059669] bg-[#F8FBFA] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-[#062C24]">Entrar como Personal Trainer</div>
                  <div className="text-[11px] text-[#4A635D]">Wilson Kiala · Unidade Talatona</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#059669]" />
              </button>

              <button
                type="button"
                onClick={() => loginDemo('admin')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6E2] hover:border-[#059669] bg-[#F8FBFA] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-[#062C24]">Entrar como Administrador</div>
                  <div className="text-[11px] text-[#4A635D]">Tchissola Baptista · Gestão Geral</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#059669]" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#4A635D]">
          Novo na KIMAKWAMI FITNESS?{' '}
          <button
            type="button"
            onClick={() => navigate('register')}
            className="font-bold text-[#059669] hover:underline"
          >
            Criar conta de cliente
          </button>
        </p>
      </div>
    </div>
  );
};

export const RegisterScreen: React.FC = () => {
  const { db, navigate, registerClient } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+244 923 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [unit, setUnit] = useState<GymUnit>('Talatona');
  const [planId, setPlanId] = useState(db.plans[0]?.id || 'plan-essencial');
  const [goal, setGoal] = useState('Ganho de massa muscular e energia');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 3) {
      setError('Indica o teu nome completo.');
      return;
    }
    if (!isValidAngolaPhone(phone)) {
      setError('Usa um número angolano válido (ex: +244 923 456 789).');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Indica um endereço de e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }
    registerClient({ name, phone, email, password, unit, planId, goal });
  };

  return (
    <div className="min-h-screen bg-[#F6F9F8] px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <BrandLogo variant="dark" size="sm" />
          <button
            type="button"
            onClick={() => navigate('login')}
            className="min-h-[44px] px-3 text-xs font-semibold text-[#059669]"
          >
            Já tenho conta
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE7] p-5 sm:p-6 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-[#062C24]">Nova Inscrição de Cliente</h1>
            <p className="text-xs text-[#4A635D] mt-1">
              Registo demonstrativo com ativação imediata do plano escolhido.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: António Kizomba"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Telemóvel Angola (+244)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+244 923 456 789"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm font-mono tabular-nums focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.ao"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#062C24] mb-1">Unidade</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as GymUnit)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm bg-white focus:outline-none focus:border-[#059669]"
                >
                  <option value="Talatona">Talatona</option>
                  <option value="Miramar">Miramar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#062C24] mb-1">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 6 dígitos"
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Plano Inicial (Kz)
              </label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4E0DC] text-sm bg-white focus:outline-none focus:border-[#059669]"
              >
                {db.plans
                  .filter((p) => p.active)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatKz(p.priceKz)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#062C24] mb-1">
                Objetivo Principal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D4E0DC] text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#062C24] font-bold text-sm transition-colors"
            >
              Ativar Conta Demonstrativa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
