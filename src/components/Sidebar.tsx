
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  FilePlus, 
  Folder, 
  Search, 
  MoreVertical,
  Trash2,
  BookOpen,
  History
} from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Sidebar: React.FC = () => {
  const { project, activeFile, setActiveFile, addFile, deleteFile } = useProject();
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);

  const handleAddFile = () => {
    if (newFileName.trim()) {
      const extension = newFileName.split('.').pop() || 'tex';
      const type = ['tex', 'bib', 'cls', 'sty'].includes(extension) ? extension as any : 'tex';
      addFile(newFileName, type);
      setNewFileName('');
      setShowNewFile(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'bib': return '📚';
      case 'cls': return '⚙️';
      case 'sty': return '🎨';
      default: return '📄';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Project Files Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center">
            <Folder className="w-4 h-4 mr-2" />
            Project Files
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFile(true)}
            className="h-6 w-6 p-0"
          >
            <FilePlus className="w-3 h-3" />
          </Button>
        </div>

        {showNewFile && (
          <div className="mb-3 space-y-2">
            <Input
              placeholder="filename.tex"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
              className="h-8 text-xs"
              autoFocus
            />
            <div className="flex space-x-1">
              <Button size="sm" onClick={handleAddFile} className="h-6 text-xs">
                Add
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNewFile(false)}
                className="h-6 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {project.files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer group hover:bg-gray-50 ${
                activeFile?.id === file.id ? 'bg-blue-50 border border-blue-200' : ''
              }`}
              onClick={() => setActiveFile(file.id)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className="text-sm">{getFileIcon(file.type)}</span>
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Tools</h3>
        <Button variant="ghost" size="sm" className="w-full justify-start h-8">
          <Search className="w-4 h-4 mr-2" />
          Find & Replace
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start h-8">
          <BookOpen className="w-4 h-4 mr-2" />
          Documentation
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start h-8">
          <History className="w-4 h-4 mr-2" />
          Version History
        </Button>
      </div>

      {/* Compile Status */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Compile Status</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <p className="text-xs text-gray-600">Last compiled: Just now</p>
        <p className="text-xs text-green-600">✓ No errors</p>
      </div>
    </div>
  );
};
