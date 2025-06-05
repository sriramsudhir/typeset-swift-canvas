
import React, { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { FileText, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { parseLatexContent, generatePDFContent, type ParsedLatexContent } from '@/utils/latexParser';

interface PDFPreviewProps {
  isCompiled?: boolean;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ isCompiled = false }) => {
  const { activeFile } = useProject();
  const { toast } = useToast();
  const [parsedContent, setParsedContent] = useState<ParsedLatexContent | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    // Load MathJax
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
      document.head.appendChild(script);

      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script2.async = true;
      document.head.appendChild(script2);

      script2.onload = () => {
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']]
          },
          svg: {
            fontCache: 'global'
          }
        };
      };
    }
  }, []);

  useEffect(() => {
    if (activeFile && activeFile.type === 'tex' && isCompiled) {
      console.log('Parsing LaTeX content:', activeFile.content);
      const parsed = parseLatexContent(activeFile.content);
      console.log('Parsed content:', parsed);
      setParsedContent(parsed);
    }
  }, [activeFile, isCompiled]);

  useEffect(() => {
    if (isCompiled && window.MathJax && window.MathJax.typesetPromise) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
  }, [isCompiled, parsedContent]);

  const handleDownload = () => {
    if (!isCompiled || !parsedContent) {
      toast({
        title: "Cannot download",
        description: "Please compile the document first.",
        variant: "destructive"
      });
      return;
    }

    const pdfBase64 = generatePDFContent(parsedContent);
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = `${activeFile?.name?.replace('.tex', '') || 'document'}.pdf`;
    link.click();

    toast({
      title: "Download started",
      description: "Your PDF is being downloaded.",
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? Math.min(prev + 25, 200) : Math.max(prev - 25, 50);
      return newZoom;
    });
  };

  const renderPreview = () => {
    if (!activeFile || activeFile.type !== 'tex') {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Select a .tex file to preview</p>
          </div>
        </div>
      );
    }

    if (!isCompiled) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Click "Compile" to generate PDF preview</p>
            <p className="text-sm mt-2">Edit your LaTeX code in the editor and compile to see changes</p>
          </div>
        </div>
      );
    }

    if (!parsedContent) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Processing LaTeX content...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-auto">
        <div 
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-8 min-h-full border border-gray-200 transition-all duration-200"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Title page */}
          {(parsedContent.title || parsedContent.author || parsedContent.date) && (
            <div className="text-center mb-12 border-b border-gray-200 pb-8">
              {parsedContent.title && (
                <h1 className="text-4xl font-bold mb-6 text-gray-900">{parsedContent.title}</h1>
              )}
              {parsedContent.author && (
                <p className="text-xl mb-3 text-gray-700">{parsedContent.author}</p>
              )}
              {parsedContent.date && (
                <p className="text-base text-gray-600">
                  {parsedContent.date === '\\today' ? new Date().toLocaleDateString() : parsedContent.date}
                </p>
              )}
            </div>
          )}

          {/* Sections */}
          {parsedContent.sections.length > 0 && (
            <div className="space-y-8">
              {parsedContent.sections.map((section, index) => (
                <section key={index}>
                  <h2 className={`font-bold mb-4 text-gray-900 border-l-4 border-blue-500 pl-4 ${
                    section.level === 1 ? 'text-2xl' : section.level === 2 ? 'text-xl' : 'text-lg'
                  }`}>
                    {section.level === 1 ? `${index + 1}. ` : ''}{section.title}
                  </h2>
                </section>
              ))}
            </div>
          )}

          {/* Math expressions */}
          {parsedContent.mathExpressions.length > 0 && (
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Mathematical Expressions</h3>
              {parsedContent.mathExpressions.map((math, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-200">
                  <div className="text-center text-lg">
                    ${math}$
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lists */}
          {parsedContent.lists.length > 0 && (
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Lists</h3>
              {parsedContent.lists.map((list, listIndex) => (
                <div key={listIndex} className="bg-gray-50 p-6 rounded-lg">
                  {list.type === 'itemize' ? (
                    <ul className="list-disc pl-6 space-y-2">
                      {list.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <ol className="list-decimal pl-6 space-y-2">
                      {list.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">{item}</li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content preview from raw text */}
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Document Content</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {activeFile.content
                  .replace(/\\documentclass\{[^}]+\}/g, '')
                  .replace(/\\usepackage\{[^}]+\}/g, '')
                  .replace(/\\begin\{document\}/g, '')
                  .replace(/\\end\{document\}/g, '')
                  .replace(/\\title\{[^}]+\}/g, '')
                  .replace(/\\author\{[^}]+\}/g, '')
                  .replace(/\\date\{[^}]+\}/g, '')
                  .replace(/\\maketitle/g, '')
                  .replace(/\\section\{[^}]+\}/g, '')
                  .replace(/\\subsection\{[^}]+\}/g, '')
                  .replace(/\\[a-zA-Z]+\{[^}]*\}/g, '')
                  .replace(/\\\[[\s\S]*?\\\]/g, '')
                  .replace(/\$\$[\s\S]*?\$\$/g, '')
                  .replace(/\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/g, '')
                  .trim() || 'No content text found.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Enhanced Preview toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-700">PDF Preview</span>
          <div className={`w-3 h-3 rounded-full ${isCompiled ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`} 
               title={isCompiled ? "Compiled successfully" : "Not compiled"}></div>
          {isCompiled && <span className="text-xs text-green-600 font-medium">✓ Ready</span>}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!isCompiled}
            onClick={() => handleZoom('out')}
            className="hover:bg-gray-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-500 px-3 font-medium min-w-[50px] text-center">
            {zoom}%
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!isCompiled}
            onClick={() => handleZoom('in')}
            className="hover:bg-gray-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-2" />
          <Button variant="ghost" size="sm" disabled={!isCompiled} className="hover:bg-gray-100">
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!isCompiled}
            onClick={handleDownload}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
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
