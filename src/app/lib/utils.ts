import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getProgressColor(progress: number) {
  if (progress === 0) return 'bg-red-500';
  if (progress <= 0.7) return 'bg-amber-500';
  return 'bg-green-500';
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'not_started':
      return 'bg-red-500';
    case 'in_progress':
      return 'bg-amber-500';
    case 'completed':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export function formatStatus(status: string) {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
} 