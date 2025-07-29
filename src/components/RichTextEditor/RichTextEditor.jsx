import React, { useRef, useCallback, useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link, Image, Table, Code, Quote,
  Undo, Redo, Type, Palette, Minus, FileText
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, onImageUpload }) => {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  const updateTOC = useCallback(() => {
    if (!editorRef.current) return;
    
    const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocPlaceholder = editorRef.current.querySelector('#toc-placeholder');
    
    if (tocPlaceholder && headings.length > 0) {
      let tocHTML = '<ul style="margin: 0; padding-left: 20px; list-style: none;">';
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent.trim();
        const id = `heading-${index}`;
        
        if (!heading.id) {
          heading.id = id;
        }
        
        const indent = (level - 1) * 16;
        tocHTML += `<li style="margin: 4px 0; padding-left: ${indent}px;"><a href="#${heading.id}" style="color: #007bff; text-decoration: none; font-size: ${16 - level}px;" onclick="document.getElementById('${heading.id}').scrollIntoView({behavior: 'smooth'});">${text}</a></li>`;
      });
      
      tocHTML += '</ul>';
      tocPlaceholder.innerHTML = tocHTML;
    }
  }, []);

  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    
    // Auto-add IDs to headings and update TOC
    if (command === 'formatBlock' && value && value.startsWith('h')) {
      setTimeout(() => {
        const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          if (!heading.id) {
            const text = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            heading.id = `${text}-${index}` || `heading-${index}`;
          }
        });
        updateTOC();
      }, 100);
    }
    
    // Update TOC after any content change
    setTimeout(updateTOC, 100);
    
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, updateTOC]);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file && onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        execCommand('insertImage', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }, [onImageUpload, execCommand]);

  const insertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      
      execCommand('insertHTML', tableHTML);
    }
  }, [execCommand]);

  const insertTOC = useCallback(() => {
    const tocHTML = `
      <div class="table-of-contents" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #495057;">📋 Table of Contents</h3>
        <div id="toc-placeholder" style="color: #6c757d; font-style: italic;">Table of contents will be generated automatically from your headings (H1-H6)</div>
      </div>
    `;
    execCommand('insertHTML', tocHTML);
  }, [execCommand]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => execCommand('undo')} className="p-2 hover:bg-gray-200 rounded" title="Undo">
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => execCommand('redo')} className="p-2 hover:bg-gray-200 rounded" title="Redo">
          <Redo size={16} />
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>

        <div className="relative">
          <button type="button" onClick={() => setShowFontSize(!showFontSize)} className="p-2 hover:bg-gray-200 rounded flex items-center" title="Font Size">
            <Type size={16} />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10">
              {fontSizes.map(size => (
                <button key={size} type="button" onClick={() => { execCommand('fontSize', size); setShowFontSize(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-100">
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded" title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded" title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded" title="Underline">
          <Underline size={16} />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <div className="relative">
          <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 hover:bg-gray-200 rounded" title="Text Color">
            <Palette size={16} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 bg-white border rounded shadow-lg p-2 z-10">
              <div className="grid grid-cols-5 gap-1">
                {colors.map(color => (
                  <button key={color} type="button" onClick={() => { execCommand('foreColor', color); setShowColorPicker(false); }} className="w-6 h-6 rounded border" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded" title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded" title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded" title="Align Right">
          <AlignRight size={16} />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
          <ListOrdered size={16} />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <select onChange={(e) => { if (e.target.value) { execCommand('formatBlock', e.target.value); e.target.value = ''; } }} className="px-2 py-1 border rounded text-sm" defaultValue="">
          <option value="">Heading</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="p">Paragraph</option>
        </select>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button type="button" onClick={insertLink} className="p-2 hover:bg-gray-200 rounded" title="Insert Link">
          <Link size={16} />
        </button>
        
        <label className="p-2 hover:bg-gray-200 rounded cursor-pointer" title="Insert Image">
          <Image size={16} />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <button type="button" onClick={insertTable} className="p-2 hover:bg-gray-200 rounded" title="Insert Table">
          <Table size={16} />
        </button>

        <button type="button" onClick={() => execCommand('insertHTML', '<hr>')} className="p-2 hover:bg-gray-200 rounded" title="Insert Horizontal Line">
          <Minus size={16} />
        </button>

        <button type="button" onClick={() => execCommand('formatBlock', 'blockquote')} className="p-2 hover:bg-gray-200 rounded" title="Quote">
          <Quote size={16} />
        </button>

        <button type="button" onClick={() => execCommand('formatBlock', 'pre')} className="p-2 hover:bg-gray-200 rounded" title="Code Block">
          <Code size={16} />
        </button>

        <button type="button" onClick={insertTOC} className="p-2 hover:bg-gray-200 rounded" title="Insert Table of Contents">
          <FileText size={16} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => {
          if (onChange) onChange(e.target.innerHTML);
          setTimeout(updateTOC, 100);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[400px] p-4 focus:outline-none"
        style={{ lineHeight: '1.6', fontSize: '16px' }}
      />
    </div>
  );
};

export default RichTextEditor;