
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { FileText, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFPreviewProps {
  isCompiled?: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ isCompiled = false }) => {
  const { activeFile } = useProject();

  const renderPreview = () => {
    if (!activeFile || activeFile.type !== 'tex') {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Select a .tex file to preview</p>
          </div>
        </div>
      );
    }

    if (!isCompiled) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Click "Compile" to generate PDF preview</p>
          </div>
        </div>
      );
    }

    // Simple LaTeX to HTML conversion for demo
    const content = activeFile.content;
    const hasTitle = content.includes('\\title{');
    const hasAuthor = content.includes('\\author{');
    const hasDate = content.includes('\\date{');
    const hasMath = content.includes('\\[') || content.includes('\\begin{equation}');

    return (
      <div className="h-full bg-gray-100 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto bg-white shadow-lg p-12 min-h-full">
          {/* Title page elements */}
          {hasTitle && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Sample LaTeX Document</h1>
              {hasAuthor && <p className="text-lg mb-2">Your Name</p>}
              {hasDate && <p className="text-sm text-gray-600">June 5, 2025</p>}
            </div>
          )}

          {/* Content sections */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-800 leading-relaxed mb-4">
                Here is the energy equation combining rest mass energy and kinetic energy:
              </p>
              {hasMath && (
                <div className="text-center my-6">
                  <div className="inline-block bg-gray-50 p-4 rounded border">
                    <span className="text-lg font-serif italic">
                      E = mc² + ½mv²
                    </span>
                  </div>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Mathematical Expressions</h2>
              <p className="text-gray-800 leading-relaxed mb-4">
                Some mathematical expressions:
              </p>
              <div className="text-center my-6">
                <div className="inline-block bg-gray-50 p-4 rounded border">
                  <span className="text-lg font-serif italic">
                    ∫₀^∞ e^(-x²) dx = √π/2  (1)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">2.1 Lists</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Preview toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">PDF Preview</span>
          <div className={`w-2 h-2 rounded-full ${isCompiled ? 'bg-green-500' : 'bg-gray-400'}`} 
               title={isCompiled ? "Compiled successfully" : "Not compiled"}></div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" disabled={!isCompiled}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-500 px-2">100%</span>
          <Button variant="ghost" size="sm" disabled={!isCompiled}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-2" />
          <Button variant="ghost" size="sm" disabled={!isCompiled}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled={!isCompiled}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-hidden">
        {renderPreview()}
      </div>
    </div>
  );
};
