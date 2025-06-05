
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Download, Settings, User, Crown } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

export const Header: React.FC = () => {
  const { project } = useProject();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">LaTeXCloud</h1>
        </div>
        <div className="hidden md:block h-6 w-px bg-gray-300" />
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-gray-700">{project.name}</h2>
          <p className="text-xs text-gray-500">Last edited: Just now</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300" />
        <Button variant="ghost" size="sm" className="text-amber-600">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade
        </Button>
        <Button variant="ghost" size="sm">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
