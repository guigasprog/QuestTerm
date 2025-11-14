'use client';

import React, { useState, forwardRef } from 'react';

interface InputLineProps {
  onCommandSubmit: (command: string) => void;
}

export const InputLine = forwardRef<HTMLInputElement, InputLineProps>(
  ({ onCommandSubmit }, ref) => {
    
    const [command, setCommand] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (command.trim() === '') return;
      
      onCommandSubmit(command);
      setCommand('');
    };

    return (
      <form onSubmit={handleSubmit} className="flex">
        <span className="text-green-400 mr-2">{'>'}</span>
        <input
          ref={ref}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="bg-transparent border-none text-green-400 w-full focus:outline-none"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    );
  }
);

InputLine.displayName = 'InputLine';