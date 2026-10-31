import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  let colorStyles = 'bg-gray-100 text-gray-700 border-gray-200';

  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'paid':
    case 'ready':
    case 'resolved':
    case 'accepted':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;
    case 'checked in':
    case 'in progress':
    case 'cleaning':
    case 'authorized':
      colorStyles = 'bg-blue-50 text-blue-800 border-blue-200';
      break;
    case 'checked out':
    case 'completed':
    case 'inspected':
      colorStyles = 'bg-purple-50 text-purple-800 border-purple-200';
      break;
    case 'cancelled':
    case 'failed':
    case 'dirty':
    case 'declined':
      colorStyles = 'bg-red-50 text-red-800 border-red-200';
      break;
    case 'refunded':
    case 'refund processing':
    case 'refund pending':
    case 'pending':
    case 'pending quote':
    case 'maintenance':
    case 'occupied':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${padding} ${colorStyles} capitalize`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {status}
    </span>
  );
}
