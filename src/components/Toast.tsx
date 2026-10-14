import React from 'react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 bg-[#ffffff] text-[#131b2e] px-5 py-3.5 rounded-xl shadow-2xl border border-[#dae2fd] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          toast.type === 'error'
            ? 'bg-rose-100 text-rose-700'
            : toast.type === 'info'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-[#25d366]/20 text-[#006d2f]'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {toast.type === 'error' ? 'priority_high' : toast.type === 'info' ? 'info' : 'done'}
        </span>
      </div>
      <span className="text-[13px] font-semibold text-[#131b2e]">{toast.message}</span>
    </div>
  );
};
