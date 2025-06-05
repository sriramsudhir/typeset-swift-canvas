
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface File {
  id: string;
  name: string;
  content: string;
  type: 'tex' | 'bib' | 'cls' | 'sty';
}

interface Project {
  id: string;
  name: string;
  files: File[];
  activeFileId: string;
}

interface ProjectContextType {
  project: Project;
  setProject: (project: Project) => void;
  activeFile: File | null;
  setActiveFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  addFile: (name: string, type: File['type']) => void;
  deleteFile: (fileId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

const defaultProject: Project = {
  id: '1',
  name: 'My LaTeX Project',
  files: [
    {
      id: '1',
      name: 'main.tex',
      type: 'tex',
      content: `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

\\title{Sample LaTeX Document}
\\author{Your Name}
\\date{\\today}
\\maketitle

\\section{Introduction}
Here is the energy equation combining rest mass energy and kinetic energy:

\\[
E = mc^2 + \\frac{1}{2}mv^2
\\]

\\section{Mathematical Expressions}
Some mathematical expressions:
\\begin{equation}
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
\\end{equation}

\\subsection{Lists}
\\begin{itemize}
\\item First item
\\item Second item
\\item Third item
\\end{itemize}

\\end{document}`
    },
    {
      id: '2',
      name: 'references.bib',
      type: 'bib',
      content: `@article{einstein1905,
  title={Zur Elektrodynamik bewegter K{\"o}rper},
  author={Einstein, Albert},
  journal={Annalen der physik},
  volume={17},
  number={10},
  pages={891--921},
  year={1905},
  publisher={Wiley Online Library}
}`
    }
  ],
  activeFileId: '1'
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project>(defaultProject);

  const activeFile = project.files.find(f => f.id === project.activeFileId) || null;

  const setActiveFile = (fileId: string) => {
    setProject(prev => ({ ...prev, activeFileId: fileId }));
  };

  const updateFileContent = (fileId: string, content: string) => {
    setProject(prev => ({
      ...prev,
      files: prev.files.map(file =>
        file.id === fileId ? { ...file, content } : file
      )
    }));
  };

  const addFile = (name: string, type: File['type']) => {
    const newFile: File = {
      id: Date.now().toString(),
      name,
      type,
      content: type === 'tex' ? '\\documentclass{article}\n\n\\begin{document}\n\n\\end{document}' : ''
    };
    setProject(prev => ({
      ...prev,
      files: [...prev.files, newFile]
    }));
  };

  const deleteFile = (fileId: string) => {
    setProject(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId),
      activeFileId: prev.activeFileId === fileId ? prev.files[0]?.id || '' : prev.activeFileId
    }));
  };

  return (
    <ProjectContext.Provider value={{
      project,
      setProject,
      activeFile,
      setActiveFile,
      updateFileContent,
      addFile,
      deleteFile
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
