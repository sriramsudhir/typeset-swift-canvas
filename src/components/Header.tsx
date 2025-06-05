
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, User, Settings, HelpCircle, Crown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LaTeX Studio
          </h1>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          📄 My LaTeX Project
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button variant="ghost" size="sm" className="hover:bg-gray-100 transition-colors">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-600 transition-colors">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade
        </Button>
        <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          <User className="w-4 h-4 mr-2" />
          Account
        </Button>
      </div>
    </header>
  );
};
