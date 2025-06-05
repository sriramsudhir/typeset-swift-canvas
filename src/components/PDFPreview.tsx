import React, { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { FileText, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { parseLatexContent, generatePDFContent } from '@/utils/latexParser';

interface PDFPreviewProps {
  isCompiled?: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ isCompiled = false }) => {
  const { activeFile } = useProject();
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (activeFile && activeFile.type === 'tex' && isCompiled) {
      const parsedContent = parseLatexContent(activeFile.content);
      generatePDFContent(parsedContent).then((pdfBuffer) => {
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
      });
    }
  }, [activeFile, isCompiled]);

  const handleDownload = async () => {
    if (!isCompiled || !activeFile) {
      toast({
        title: "Cannot download",
        description: "Please compile the document first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedContent = parseLatexContent(activeFile.content);
      const pdfBuffer = await generatePDFContent(parsedContent);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeFile.name.replace('.tex', '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your PDF is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 25 : prev - 25;
      return Math.min(Math.max(newZoom, 25), 400);
    });
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
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

    if (!pdfUrl) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <RotateCw className="w-16 h-16 mx-auto mb-4 animate-spin" />
            <p className="text-lg">Generating PDF preview...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-auto">
        <div 
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-8 min-h-full border border-gray-200 transition-all duration-200"
          style={{ 
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center'
          }}
        >
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[800px] border-0"
            title="PDF Preview"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
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
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!isCompiled}
            onClick={handleRotate}
            className="hover:bg-gray-100"
          >
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

      <div className="flex-1 overflow-hidden">
        {renderPreview()}
      </div>
    </div>
  );
};