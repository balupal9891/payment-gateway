import React, { createContext, useContext, useState, ReactNode } from 'react';

type Mode = 'production' | 'test';

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>('production');

  const toggleMode = () => {
    setModeState(prev => prev === 'production' ? 'test' : 'production');
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

