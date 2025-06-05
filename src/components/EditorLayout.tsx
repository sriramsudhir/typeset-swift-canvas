
import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { PDFPreview } from './PDFPreview';
import { Button } from '@/components/ui/button';
import { Play, Eye, Code, Split, Maximize2, LayoutPanelLeft, LayoutPanelTop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export const EditorLayout: React.FC = () => {
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);
  const { toast } = useToast();

  const handleCompile = () => {
    setIsCompiling(true);
    setIsCompiled(false);
    
    toast({
      title: "Compiling...",
      description: "Your LaTeX document is being compiled.",
    });
    
    // Simulate compilation with proper processing
    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
      toast({
        title: "Compilation successful!",
        description: "Your document has been compiled successfully.",
      });
    }, 2000);
  };

  const toggleLayout = () => {
    setLayoutDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Enhanced Toolbar */}
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

          {viewMode === 'split' && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLayout}
                className="h-7 px-2"
                title={`Switch to ${layoutDirection === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
              >
                {layoutDirection === 'horizontal' ? (
                  <LayoutPanelLeft className="w-3 h-3" />
                ) : (
                  <LayoutPanelTop className="w-3 h-3" />
                )}
              </Button>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            Status: {isCompiling ? 'Compiling...' : isCompiled ? 'Compiled' : 'Ready'}
          </span>
          <Button variant="ghost" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content with Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'editor' && (
          <div className="h-full">
            <CodeEditor />
          </div>
        )}
        
        {viewMode === 'split' && (
          <ResizablePanelGroup direction={layoutDirection === 'horizontal' ? 'horizontal' : 'vertical'}>
            <ResizablePanel defaultSize={50} minSize={30}>
              <CodeEditor />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <PDFPreview isCompiled={isCompiled} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        
        {viewMode === 'preview' && (
          <div className="h-full">
            <PDFPreview isCompiled={isCompiled} />
          </div>
        )}
      </div>
    </div>
  );
};
