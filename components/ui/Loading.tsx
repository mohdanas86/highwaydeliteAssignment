/**
 * Loading Component
 * Various loading states and spinners
 */

import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center';
  
  const renderSpinner = () => (
    <div className="flex flex-col items-center gap-3">
      <svg
        className={`animate-spin text-blue-600 ${sizes[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );
  
  const renderDots = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex space-x-2">
        <div className={`${sizes[size]} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${sizes[size]} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${sizes[size]} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
      </div>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );
  
  const renderPulse = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} bg-blue-600 rounded-full animate-pulse`} />
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );
  
  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };
  
  return <div className={containerClass}>{renderVariant()}</div>;
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

export const ExperienceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <LoadingSkeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <LoadingSkeleton className="h-5 w-20" />
          <LoadingSkeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
};
