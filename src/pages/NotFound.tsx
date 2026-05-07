import { Link } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 mb-8 animate-bounce">
        <Ghost className="w-12 h-12" />
      </div>
      <h1 className="text-8xl font-bold font-display text-slate-900 dark:text-white mb-4">404</h1>
      <p className="text-2xl font-medium text-slate-500 mb-8 max-w-md">
        Parece que esta página se perdeu nos arquivos da contabilidade.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para o Início
      </Link>
    </div>
  );
}
