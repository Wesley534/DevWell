// frontend/src/components/ui/Textarea.jsx
import React from 'react';

export const Textarea = ({ className, ...props }) => (
    <textarea
        className={`border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
        {...props}
    />
);