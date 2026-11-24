/**
 * Export helpers for CSV, Text, and Report windows.
 */

export const exportUtils = {
  /**
   * Downloads data array as CSV file.
   * @param {Array<Object>} data 
   * @param {String} filename 
   */
  exportToCSV(data, filename = "export.csv") {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map(header => {
        let val = row[header];
        if (typeof val === "object") val = JSON.stringify(val);
        const escaped = ("" + (val ?? "")).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Downloads plain text file.
   * @param {String} content 
   * @param {String} filename 
   */
  exportToText(content, filename = "marketing-content.txt") {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Triggers formatted browser print window for generating report.
   * @param {String} title 
   * @param {String} htmlContent 
   */
  printReport(title, htmlContent) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #111; line-height: 1.6; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #d1d5db; padding: 10px 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            .badge { display: inline-block; padding: 4px 8px; font-size: 12px; border-radius: 4px; background: #e0e7ff; color: #3730a3; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>AI Startup Marketing Assistant — ${title}</h1>
          <p><strong>Generated Date:</strong> ${new Date().toLocaleString()}</p>
          <div>${htmlContent}</div>
          <div class="footer">
            Report generated from AI Startup Marketing Assistant Demo System. (Mock Data Output)
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
