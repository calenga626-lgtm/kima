import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, User } from 'lucide-react';
import { MembershipStatus, PaymentStatus, SessionStatus } from '../types/kimakwami';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSlogan = false,
}) => {
  const iconDim = size === 'sm' ? 30 : size === 'lg' ? 48 : 36;
  const titleClass =
    size === 'sm'
      ? 'text-sm font-extrabold tracking-tight'
      : size === 'lg'
      ? 'text-2xl font-extrabold tracking-tight'
      : 'text-base font-extrabold tracking-tight';

  const primaryText = variant === 'light' ? 'text-white' : 'text-[#062C24]';
  const accentText = variant === 'light' ? 'text-[#A3E635]' : 'text-[#059669]';
  const sloganText = variant === 'light' ? 'text-emerald-100/80' : 'text-[#4A635D]';

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <svg
        width={iconDim}
        height={iconDim}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="48"
          height="48"
          rx="14"
          fill={variant === 'light' ? '#0B3F34' : '#062C24'}
        />
        <path
          d="M14 12V36"
          stroke="#FFFFFF"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M33 13L20.5 24L33 35"
          stroke="#10B981"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 12L35 19.5"
          stroke="#A3E635"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`font-display whitespace-nowrap ${titleClass} ${primaryText}`}>
          KIMAKWAMI <span className={accentText}>FITNESS</span>
        </span>
        {showSlogan && (
          <span className={`text-[11px] font-medium mt-1 ${sloganText}`}>
            A tua evolução. A nossa missão.
          </span>
        )}
      </div>
    </div>
  );
};

interface AvatarImageProps {
  src?: string;
  alt: string;
  sizeClass?: string;
  className?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  sizeClass = 'w-11 h-11',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br from-[#062C24] to-[#059669] text-white flex items-center justify-center shrink-0 ${className}`}
        aria-label={alt}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${sizeClass} rounded-full object-cover object-top bg-[#E8EFECE6] shrink-0 ${className}`}
    />
  );
};

export const StatusLabel: React.FC<{
  status: MembershipStatus | SessionStatus | PaymentStatus;
}> = ({ status }) => {
  if (status === 'Ativa' || status === 'Confirmada' || status === 'Pago' || status === 'Concluída') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }
  if (status === 'A expirar' || status === 'Pendente') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
        <Clock3 className="w-3.5 h-3.5 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 whitespace-nowrap">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};
