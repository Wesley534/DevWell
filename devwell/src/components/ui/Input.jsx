import { forwardRef } from 'react';

const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-md border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition duration-200 ease-in-out ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };