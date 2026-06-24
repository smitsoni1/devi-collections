import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export default function Breadcrumb({ pageName }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium mb-6 animate-fade-in">
      <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-brand-600 transition-colors">
        <FiHome className="w-4 h-4" /> Home
      </Link>
      <FiChevronRight className="w-4 h-4 text-gray-400" />
      <span className="text-gray-900">{pageName}</span>
    </div>
  );
}
