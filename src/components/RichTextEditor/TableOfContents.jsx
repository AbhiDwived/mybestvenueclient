import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, List } from 'lucide-react';

const TableOfContents = ({ content, isVisible = true }) => {
  const [toc, setToc] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (content) {
      generateTOC(content);
    }
  }, [content]);

  const generateTOC = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const tocItems = Array.from(headings).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      const id = `heading-${index}`;
      
      // Add ID to heading if it doesn't exist
      if (!heading.id) {
        heading.id = id;
      }
      
      return {
        id: heading.id || id,
        text,
        level,
        element: heading
      };
    });
    
    setToc(tocItems);
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  if (!isVisible || toc.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <List size={18} className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Table of Contents</h3>
        </div>
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {!isCollapsed && (
        <nav className="space-y-1">
          {toc.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(item.id)}
              className={`
                block w-full text-left py-1 px-2 rounded text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors
                ${item.level === 1 ? 'font-semibold' : ''}
                ${item.level === 2 ? 'ml-4' : ''}
                ${item.level === 3 ? 'ml-8' : ''}
                ${item.level === 4 ? 'ml-12' : ''}
                ${item.level === 5 ? 'ml-16' : ''}
                ${item.level === 6 ? 'ml-20' : ''}
              `}
            >
              {item.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;