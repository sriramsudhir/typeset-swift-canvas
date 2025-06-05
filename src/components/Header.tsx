
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, User, Settings, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">LaTeX Editor</h1>
        </div>
        <div className="text-sm text-gray-500">
          My LaTeX Project
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button variant="ghost" size="sm">
          <User className="w-4 h-4 mr-2" />
          Account
        </Button>
      </div>
    </header>
  );
};
