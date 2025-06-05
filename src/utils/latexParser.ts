
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

  // Extract sections
  const sectionPattern = /\\(section|subsection|subsubsection)\{([^}]+)\}/g;
  let sectionMatch;
  while ((sectionMatch = sectionPattern.exec(content)) !== null) {
    const level = sectionMatch[1] === 'section' ? 1 : sectionMatch[1] === 'subsection' ? 2 : 3;
    result.sections.push({
      title: sectionMatch[2],
      level,
      content: '',
      math: []
    });
  }

  // Extract math expressions
  const mathPatterns = [
    /\\\[([^\]]+)\\\]/g, // Display math \[...\]
    /\$\$([^$]+)\$\$/g,  // Display math $$...$$
    /\$([^$]+)\$/g,      // Inline math $...$
    /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, // Equation environment
    /\\begin\{align\}([\s\S]*?)\\end\{align\}/g, // Align environment
  ];

  mathPatterns.forEach(pattern => {
    let mathMatch;
    while ((mathMatch = pattern.exec(content)) !== null) {
      result.mathExpressions.push(mathMatch[1].trim());
    }
  });

  // Extract lists
  const itemizePattern = /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g;
  const enumeratePattern = /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g;

  let listMatch;
  while ((listMatch = itemizePattern.exec(content)) !== null) {
    const items = listMatch[1].match(/\\item\s+([^\n\\]+)/g)?.map(item => 
      item.replace(/\\item\s+/, '').trim()
    ) || [];
    result.lists.push({ type: 'itemize', items });
  }

  while ((listMatch = enumeratePattern.exec(content)) !== null) {
    const items = listMatch[1].match(/\\item\s+([^\n\\]+)/g)?.map(item => 
      item.replace(/\\item\s+/, '').trim()
    ) || [];
    result.lists.push({ type: 'enumerate', items });
  }

  return result;
};

export const generatePDFContent = (parsedContent: ParsedLatexContent): string => {
  // Generate a more realistic PDF content for download
  let pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
`;

  if (parsedContent.title) {
    pdfContent += `(${parsedContent.title}) Tj\n`;
  }
  if (parsedContent.author) {
    pdfContent += `0 -20 Td (By: ${parsedContent.author}) Tj\n`;
  }

  pdfContent += `ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000217 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF`;

  return btoa(pdfContent);
};
