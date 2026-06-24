import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const variants = {
  error: {
    icon: FiAlertCircle,
    classes: 'bg-red-500/10 border-red-500/25 text-red-300',
    iconClass: 'text-red-400',
  },
  success: {
    icon: FiCheckCircle,
    classes: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
    iconClass: 'text-emerald-400',
  },
  info: {
    icon: FiInfo,
    classes: 'bg-blue-500/10 border-blue-500/25 text-blue-300',
    iconClass: 'text-blue-400',
  },
  warning: {
    icon: FiAlertTriangle,
    classes: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
    iconClass: 'text-amber-400',
  },
};

export default function Message({ type = 'error', children }) {
  const variant = variants[type] || variants.error;
  const Icon = variant.icon;

  return (
    <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${variant.classes} text-sm`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${variant.iconClass}`} />
      <span>{children}</span>
    </div>
  );
}
