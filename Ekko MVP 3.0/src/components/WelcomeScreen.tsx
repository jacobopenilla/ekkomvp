import React from 'react';
import { Button } from './ui/button';
import ekkoLogo from 'figma:asset/09677f0a7b0a5632626e10aef8631b5602a532e4.png';

interface WelcomeScreenProps {
  onNavigate: (screen: 'login' | 'register') => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img src={ekkoLogo} alt="Ekko" className="w-80 h-auto" />
        </div>
        
        <p className="text-[#333] text-center">
          Conecta con microemprendimientos locales y compra productos únicos cerca de ti
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4 mt-8">
          <Button
            onClick={() => onNavigate('login')}
            className="w-full bg-[#007AFF] text-white hover:bg-[#0051D5] h-12"
          >
            Iniciar sesión
          </Button>
          
          <Button
            onClick={() => onNavigate('register')}
            className="w-full border-2 border-[#007AFF] bg-transparent text-[#007AFF] hover:bg-[#007AFF] hover:text-white transition-colors h-12"
          >
            Crear cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
