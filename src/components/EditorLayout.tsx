
import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { PDFPreview } from './PDFPreview';
import { Button } from '@/components/ui/button';
import { Play, Eye, Code, Split, Maximize2 } from 'lucide-react';

export const EditorLayout: React.FC = () => {
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = () => {
    setIsCompiling(true);
    // Simulate compilation
    setTimeout(() => {
      setIsCompiling(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCompile}
            disabled={isCompiling}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {isCompiling ? 'Compiling...' : 'Compile'}
          </Button>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('editor')}
              className="h-7 px-2"
            >
              <Code className="w-3 h-3 mr-1" />
              Code
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('split')}
              className="h-7 px-2"
            >
              <Split className="w-3 h-3 mr-1" />
              Split
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('preview')}
              className="h-7 px-2"
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Auto-compile: ON</span>
          <Button variant="ghost" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'editor' && (
          <div className="flex-1">
            <CodeEditor />
          </div>
        )}
        
        {viewMode === 'split' && (
          <>
            <div className="flex-1 border-r border-gray-200">
              <CodeEditor />
            </div>
            <div className="flex-1">
              <PDFPreview />
            </div>
          </>
        )}
        
        {viewMode === 'preview' && (
          <div className="flex-1">
            <PDFPreview />
          </div>
        )}
      </div>
    </div>
  );
};
