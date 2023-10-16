// components/Input.tsx
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} />
    </div>
  );
};

export default Input;
