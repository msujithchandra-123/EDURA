
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, className, children, ...props }) => {
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500';
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>}
      <select
        id={id}
        className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errorStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};
