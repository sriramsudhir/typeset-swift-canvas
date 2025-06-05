
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { EditorLayout } from '@/components/EditorLayout';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <EditorLayout />
        </div>
        <Toaster />
      </div>
    </ProjectProvider>
  );
};

export default Index;
