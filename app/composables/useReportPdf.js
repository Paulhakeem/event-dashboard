export default function useReportPdf() {
  const exportPdf = ({ reportElement, startDate, endDate }) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !reportElement) return;

    const reportTitle = "Admin Performance Report";
    const dateRange = `${startDate} to ${endDate}`;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            :root { color-scheme: light; }
            * { box-sizing: border-box; }
            @page { size: A4; margin: 14mm; }
            body {
              margin: 0;
              background: #fff;
              color: #24303b;
              font-family: "Segoe UI", Arial, sans-serif;
              font-size: 10pt;
              line-height: 1.45;
            }
            .print-shell { max-width: 180mm; margin: 0 auto; }
            .print-cover {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 24px;
              padding: 0 0 18px;
              margin-bottom: 18px;
              border-bottom: 3px solid #9c4e8b;
            }
            .brand-mark {
              display: inline-block;
              margin-bottom: 8px;
              color: #9c4e8b;
              font-size: 9pt;
              font-weight: 700;
              letter-spacing: .14em;
              text-transform: uppercase;
            }
            .print-cover h1 { margin: 0; color: #17212b; font-size: 24pt; line-height: 1.1; }
            .print-cover p { margin: 7px 0 0; color: #64717d; font-size: 10pt; }
            .print-meta { min-width: 150px; padding: 11px 13px; border: 1px solid #e6e9ed; border-radius: 8px; background: #f8fafb; color: #53616d; font-size: 9pt; }
            .print-meta strong { display: block; margin-bottom: 3px; color: #26333e; font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; }
            #admin-report { display: block; }
            #admin-report > header, #admin-report > form, #admin-report > .bg-red-50 { display: none !important; }
            #admin-report > div { margin: 0 0 14px; }
            #admin-report > div.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; }
            #admin-report > div.grid > div { min-height: 65px; padding: 11px; border: 1px solid #e5e8ec; border-radius: 7px; background: #fff; }
            #admin-report > div.grid > div p:first-child { margin: 0 0 4px; color: #697681; font-size: 8pt; }
            #admin-report > div.grid > div p:last-child { margin: 0; color: #192530; font-size: 14pt; font-weight: 700; }
            section { break-inside: avoid; page-break-inside: avoid; margin: 0 0 14px; padding: 14px; border: 1px solid #e1e5e9; border-radius: 7px; background: #fff; }
            section h3 { margin: 0; color: #24313c; font-size: 12pt; }
            section p { color: #65727d; }
            section > p { margin: 4px 0 12px; font-size: 9pt; }
            table { width: 100%; border-collapse: collapse; font-size: 9pt; }
            thead { display: table-header-group; }
            th { padding: 8px 7px; color: #fff; background: #9c4e8b; font-size: 8pt; font-weight: 700; text-align: left; text-transform: uppercase; letter-spacing: .04em; }
            th:first-child { border-radius: 4px 0 0 4px; }
            th:last-child { border-radius: 0 4px 4px 0; }
            td { padding: 8px 7px; border-bottom: 1px solid #edf0f2; vertical-align: top; }
            tbody tr:nth-child(even) { background: #fafbfc; }
            .text-gray-400, .text-gray-500 { color: #65727d !important; }
            .bg-gray-50 { background: #f6f8f9 !important; }
            .h-44 { height: 125px !important; }
            .overflow-x-auto { overflow: visible !important; }
            .flex { display: flex; }
            .grid { display: grid; }
            .gap-5 { gap: 14px; }
            button, form, input, select { display: none !important; }
            .print-footer { margin-top: 18px; padding-top: 9px; border-top: 1px solid #e1e5e9; color: #84909a; font-size: 8pt; text-align: center; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              section { box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          <main class="print-shell">
            <header class="print-cover">
              <div>
                <span class="brand-mark">Event Dashboard</span>
                <h1>${reportTitle}</h1>
                <p>Financial, booking, payment, and platform performance overview</p>
              </div>
              <div class="print-meta"><strong>Report period</strong>${dateRange}<br /><strong style="margin-top:8px">Generated</strong>${new Date().toLocaleDateString()}</div>
            </header>
            ${reportElement.innerHTML}
            <footer class="print-footer">Confidential administrative report · Generated from the Event Dashboard</footer>
          </main>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return { exportPdf };
}
