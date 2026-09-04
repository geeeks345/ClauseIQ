import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-7xl font-black text-cyan-400 mb-2">404</h1>
      <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        The legal intelligence view you are looking for does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">
          <Home className="w-4 h-4 mr-2" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
