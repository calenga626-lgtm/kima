export function formatKz(amount: number): string {
  const formatted = new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${formatted} Kz`;
}

export function formatDatePt(isoDate: string): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('T')[0].split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];
  const mIndex = Math.max(0, Math.min(11, parseInt(month, 10) - 1));
  return `${day} ${months[mIndex]} ${year}`;
}

export function formatShortDatePt(isoDate: string): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('T')[0].split('-');
  if (parts.length !== 3) return isoDate;
  const [, month, day] = parts;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mIndex = Math.max(0, Math.min(11, parseInt(month, 10) - 1));
  return `${day} ${months[mIndex]}`;
}

export function daysUntil(isoDate: string): number {
  const today = new Date('2026-11-17T00:00:00');
  const target = new Date(`${isoDate.split('T')[0]}T00:00:00`);
  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isValidAngolaPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  return /^\+2449\d{8}$/.test(cleaned);
}

export function formatAngolaPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+244') && digits.length === 13) {
    return `+244 ${digits.slice(4, 7)} ${digits.slice(7, 10)} ${digits.slice(10, 13)}`;
  }
  return phone;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
