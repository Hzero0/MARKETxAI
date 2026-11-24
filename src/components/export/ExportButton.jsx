import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, Printer, ChevronDown, FileText } from 'lucide-react';
import { exportUtils } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';

export const ExportButton = ({ data, filename = "report.csv", title = "Marketing Report", textContent = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { showSuccess } = useToast();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    exportUtils.exportToCSV(data, filename);
    showSuccess("Exported CSV successfully!");
    setIsOpen(false);
  };

  const handleExportText = () => {
    const content = textContent || JSON.stringify(data, null, 2);
    exportUtils.exportToText(content, filename.replace('.csv', '.txt'));
    showSuccess("Exported report summary as text!");
    setIsOpen(false);
  };

  const handlePrint = () => {
    let tableHtml = "";
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      tableHtml = `
        <table>
          <thead>
            <tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.map(row => `<tr>${keys.map(k => `<td>${typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k]}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      `;
    } else if (textContent) {
      tableHtml = `<pre>${textContent}</pre>`;
    }

    exportUtils.printReport(title, tableHtml);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all shadow-xs focus:outline-none"
      >
        <Download className="w-3.5 h-3.5 text-indigo-600" />
        Export
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white border border-slate-200 ring-1 ring-black/5 divide-y divide-slate-100 z-50 animate-fadeIn">
          <div className="py-1">
            {data && (
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Download CSV
              </button>
            )}
            <button
              onClick={handleExportText}
              className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-600" />
              Download Text / JSON
            </button>
          </div>
          <div className="py-1">
            <button
              onClick={handlePrint}
              className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-violet-600" />
              Print / Save PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
