import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 placeholder-slate-400 hover:bg-slate-100 focus:hover:bg-white"
      />
    </div>
  );
};

export default Input;
