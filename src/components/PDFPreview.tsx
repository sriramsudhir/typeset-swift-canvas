
import React, { useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { FileText, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
    if (isCompiled && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [isCompiled]);

  const handleDownload = () => {
    if (!isCompiled) {
      toast({
        title: "Cannot download",
        description: "Please compile the document first.",
        variant: "destructive"
      });
      return;
    }

    // Simulate PDF download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKExhVGVYIERvY3VtZW50KQovQ3JlYXRvciAoTGF0ZXggRWRpdG9yKQovUHJvZHVjZXIgKExhdGV4IEVkaXRvcikKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDE3OCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjI1MQolJUVPRgo=';
    link.download = `${activeFile?.name || 'document'}.pdf`;
    link.click();

    toast({
      title: "Download started",
      description: "Your PDF is being downloaded.",
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
          </div>
        </div>
      );
    }

    // Enhanced LaTeX to HTML conversion with MathJax support
    const content = activeFile.content;
    const hasTitle = content.includes('\\title{');
    const hasAuthor = content.includes('\\author{');
    const hasDate = content.includes('\\date{');

    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-12 min-h-full border border-gray-200">
          {/* Title page elements */}
          {hasTitle && (
            <div className="text-center mb-12 border-b border-gray-200 pb-8">
              <h1 className="text-4xl font-bold mb-6 text-gray-900">Sample LaTeX Document</h1>
              {hasAuthor && <p className="text-xl mb-3 text-gray-700">Your Name</p>}
              {hasDate && <p className="text-base text-gray-600">June 5, 2025</p>}
            </div>
          )}

          {/* Content sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-blue-500 pl-4">1. Introduction</h2>
              <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                Here is the energy equation combining rest mass energy and kinetic energy:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-200 my-8">
                <div className="text-center">
                  <span className="text-xl" dangerouslySetInnerHTML={{ __html: '$$E = mc^2 + \\frac{1}{2}mv^2$$' }} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-green-500 pl-4">2. Mathematical Expressions</h2>
              <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                Some mathematical expressions and integrals:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-200 my-8">
                <div className="text-center">
                  <span className="text-xl" dangerouslySetInnerHTML={{ __html: '$$\\int_0^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2} \\quad (1)$$' }} />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-200 my-8">
                <div className="text-center">
                  <span className="text-xl" dangerouslySetInnerHTML={{ __html: '$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$' }} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">2.1 Lists and Enumerations</h3>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li className="text-lg">First mathematical concept</li>
                  <li className="text-lg">Second mathematical concept</li>
                  <li className="text-lg">Third mathematical concept</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-red-500 pl-4">3. Advanced Mathematics</h2>
              <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                Matrix operations and linear algebra:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-200 my-8">
                <div className="text-center">
                  <span className="text-xl" dangerouslySetInnerHTML={{ __html: '$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$$' }} />
                </div>
              </div>
            </section>
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
          <Button variant="ghost" size="sm" disabled={!isCompiled} className="hover:bg-gray-100">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-500 px-3 font-medium">100%</span>
          <Button variant="ghost" size="sm" disabled={!isCompiled} className="hover:bg-gray-100">
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
