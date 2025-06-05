
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { EditorLayout } from '@/components/EditorLayout';
import { ProjectProvider } from '@/contexts/ProjectContext';

const Index = () => {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <EditorLayout />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default Index;
