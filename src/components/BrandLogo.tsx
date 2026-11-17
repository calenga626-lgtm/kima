import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, User } from 'lucide-react';
import { MembershipStatus, PaymentStatus, SessionStatus } from '../types/kimakwami';

interface BrandMarkIconProps {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
}

export const BrandMarkIcon: React.FC<BrandMarkIconProps> = ({
  size = 38,
  variant = 'dark',
  className = '',
}) => {
  const bgFill = variant === 'light' ? '#0A3A2F' : '#062C24';
  const ringStroke = variant === 'light' ? 'rgba(163, 230, 53, 0.38)' : 'rgba(16, 185, 129, 0.35)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* Architectural Octagonal Crest */}
      <path
        d="M14 3.5H34L44.5 14V34L34 44.5H14L3.5 34V14L14 3.5Z"
        fill={bgFill}
        stroke={ringStroke}
        strokeWidth="1.5"
      />
      {/* Inner Precision Frame */}
      <path
        d="M15.5 6.5H32.5L41.5 15.5V32.5L32.5 41.5H15.5L6.5 32.5V15.5L15.5 6.5Z"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Vertical Pillar of K */}
      <path
        d="M15.5 13V35"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="square"
      />
      {/* Lower Kinetic Thrust */}
      <path
        d="M21 24.5L32.5 35"
        stroke="#10B981"
        strokeWidth="4"
        strokeLinecap="square"
      />
      {/* Ascending Apex Vector */}
      <path
        d="M19.5 25L33 13"
        stroke="#A3E635"
        strokeWidth="4"
        strokeLinecap="square"
      />
    </svg>
  );
};

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
  const iconDim = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;
  const primaryText = variant === 'light' ? 'text-white' : 'text-[#062C24]';
  const accentText = variant === 'light' ? 'text-[#A3E635]' : 'text-[#059669]';
  const sloganText = variant === 'light' ? 'text-emerald-100/75' : 'text-[#4A635D]';

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2.5 shrink-0">
        <BrandMarkIcon size={iconDim} variant={variant} />
        <div className="flex flex-col leading-none">
          <span className={`font-display text-sm font-extrabold tracking-[0.04em] whitespace-nowrap ${primaryText}`}>
            KIMAKWAMI <span className={`font-bold ${accentText}`}>FITNESS</span>
          </span>
          {showSlogan && (
            <span className={`text-[10px] font-medium mt-1 ${sloganText}`}>
              A tua evolução. A nossa missão.
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 shrink-0">
      <BrandMarkIcon size={iconDim} variant={variant} />
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-[0.05em] whitespace-nowrap ${
            size === 'lg' ? 'text-2xl' : 'text-lg'
          } ${primaryText}`}
        >
          KIMAKWAMI
        </span>
        <span
          className={`font-display font-bold tracking-[0.26em] whitespace-nowrap mt-0.5 ${
            size === 'lg' ? 'text-[11px]' : 'text-[10px]'
          } ${accentText}`}
        >
          FITNESS
        </span>
        {showSlogan && (
          <span className={`text-[11px] font-medium mt-1.5 ${sloganText}`}>
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
