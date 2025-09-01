import { forwardRef } from 'react';

export const Label = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      className={`block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

// export { Label };