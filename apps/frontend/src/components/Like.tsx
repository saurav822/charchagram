'use client'
import React from 'react';

interface LikeProps {
  isLiked?: boolean;
  onClick?: () => void;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  countShow?: boolean;
}

export default function Like({ 
  isLiked = false, 
  onClick = () => {}, 
  count = 0, 
  size = 'md',
  className = '',
  countShow = true
}: LikeProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center space-x-1 cursor-pointer ${className}`} onClick={onClick}>
      {isLiked ? (
        <svg className={`${sizeClasses[size]} fill-[#273F4F]`} viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className={`${sizeClasses[size]} fill-transparent stroke-[#273F4F] stroke-2`} viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
      {countShow && <span>{count}</span>}
    </div>
  );
}
