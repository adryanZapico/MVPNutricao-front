import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className
}) => {
  const variants = {
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      container: 'bg-green-50 border-green-400 text-green-800',
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      container: 'bg-red-50 border-red-400 text-red-800',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      container: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-600" />,
      container: 'bg-blue-50 border-blue-400 text-blue-800',
    },
  };

  return (
    <div
      className={cn(
        'rounded-md border p-4 flex items-start gap-3 shadow-sm',
        variants[variant].container,
        className
      )}
    >
      <div className="flex-shrink-0">{variants[variant].icon}</div>
      <div className="flex-1">
        {title && <h3 className="text-sm font-medium">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
