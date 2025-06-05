import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface ParsedLatexContent {
  title?: string;
  author?: string;
  date?: string;
  sections: {
    title: string;
    level: number;
    content: string;
    math: string[];
  }[];
  mathExpressions: string[];
  lists: {
    type: 'itemize' | 'enumerate';
    items: string[];
  }[];
}

export const parseLatexContent = (content: string): ParsedLatexContent => {
  const result: ParsedLatexContent = {
    sections: [],
    mathExpressions: [],
    lists: []
  };

  // Extract title, author, date
  const titleMatch = content.match(/\\title\{([^}]+)\}/);
  const authorMatch = content.match(/\\author\{([^}]+)\}/);
  const dateMatch = content.match(/\\date\{([^}]+)\}/);

  if (titleMatch) result.title = titleMatch[1];
  if (authorMatch) result.author = authorMatch[1];
  if (dateMatch) result.date = dateMatch[1];

  // Extract sections with content
  const sections = content.split(/\\(section|subsection|subsubsection)\{/);
  sections.shift(); // Remove content before first section

  for (let i = 0; i < sections.length; i += 2) {
    const level = sections[i] === 'section' ? 1 : sections[i] === 'subsection' ? 2 : 3;
    const sectionContent = sections[i + 1];
    if (sectionContent) {
      const titleEnd = sectionContent.indexOf('}');
      const title = sectionContent.substring(0, titleEnd);
      const content = sectionContent.substring(titleEnd + 1).trim();
      
      result.sections.push({
        title,
        level,
        content,
        math: []
      });
    }
  }

  // Extract math expressions with improved regex
  const mathPatterns = [
    /\\\[([\s\S]*?)\\\]/g,
    /\$\$([\s\S]*?)\$\$/g,
    /\$([^$]+)\$/g,
    /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g,
    /\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g,
  ];

  mathPatterns.forEach(pattern => {
    let mathMatch;
    while ((mathMatch = pattern.exec(content)) !== null) {
      result.mathExpressions.push(mathMatch[1].trim());
    }
  });

  // Extract lists with improved parsing
  const listEnvironments = [
    { type: 'itemize' as const, pattern: /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g },
    { type: 'enumerate' as const, pattern: /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g }
  ];

  listEnvironments.forEach(({ type, pattern }) => {
    let listMatch;
    while ((listMatch = pattern.exec(content)) !== null) {
      const items = listMatch[1]
        .split('\\item')
        .slice(1)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      result.lists.push({ type, items });
    }
  });

  return result;
};

export const generatePDFContent = async (parsedContent: ParsedLatexContent): Promise<Uint8Array> => {
  const docDefinition = {
    content: [
      parsedContent.title && { text: parsedContent.title, style: 'title' },
      parsedContent.author && { text: parsedContent.author, style: 'author' },
      parsedContent.date && { text: parsedContent.date, style: 'date' },
      ...parsedContent.sections.map(section => ({
        text: section.title,
        style: `h${section.level}`,
        margin: [0, 10, 0, 5]
      })),
      ...parsedContent.mathExpressions.map(math => ({
        text: math,
        style: 'math',
        margin: [0, 5, 0, 5]
      })),
      ...parsedContent.lists.map(list => ({
        ul: list.type === 'itemize' ? list.items : undefined,
        ol: list.type === 'enumerate' ? list.items : undefined,
        margin: [20, 5, 0, 5]
      }))
    ].filter(Boolean),
    styles: {
      title: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      author: {
        fontSize: 14,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      date: {
        fontSize: 12,
        alignment: 'center',
        margin: [0, 0, 0, 30]
      },
      h1: {
        fontSize: 18,
        bold: true
      },
      h2: {
        fontSize: 16,
        bold: true
      },
      h3: {
        fontSize: 14,
        bold: true
      },
      math: {
        font: 'Courier',
        alignment: 'center'
      }
    }
  };

  return new Promise((resolve) => {
    pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
      resolve(buffer);
    });
  });
};