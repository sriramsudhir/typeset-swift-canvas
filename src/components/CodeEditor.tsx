
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';

export const CodeEditor: React.FC = () => {
  const { activeFile, updateFileContent } = useProject();

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No file selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* File tab */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <span className="text-sm font-medium text-gray-700">{activeFile.name}</span>
      </div>
      
      {/* Line numbers and editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div className="bg-gray-50 border-r border-gray-200 px-3 py-4 select-none">
          {activeFile.content.split('\n').map((_, index) => (
            <div key={index} className="text-xs text-gray-400 leading-6 text-right">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Code editor */}
        <div className="flex-1">
          <textarea
            value={activeFile.content}
            onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
            className="w-full h-full p-4 border-none outline-none resize-none font-mono text-sm leading-6 bg-white"
            style={{ tabSize: 2 }}
            spellCheck={false}
          />
        </div>
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-1 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>LaTeX</span>
          <span>UTF-8</span>
          <span>Line {activeFile.content.split('\n').length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>Length: {activeFile.content.length}</span>
        </div>
      </div>
    </div>
  );
};
