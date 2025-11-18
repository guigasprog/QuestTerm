'use client'; 

import React, { useRef, useEffect } from 'react';
import { useTerminalLogic } from '@/hooks/useTerminalLogic';
import { InputLine } from '@/components/InputLine';

export default function Home() {
  const { history, executeCommand } = useTerminalLogic();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <main
      ref={scrollContainerRef}
      className="bg-black text-green-400 font-mono h-screen w-screen p-4 overflow-y-auto"
      onClick={focusInput}
    >
      {history.map((line, index) => (
        <pre 
          key={index} 
          dangerouslySetInnerHTML={{ __html: line }}
          className="whitespace-pre-wrap"
        />
      ))}
      
      <InputLine ref={inputRef} onCommandSubmit={executeCommand} />
    </main>
  );
}