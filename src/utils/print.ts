/**
 * Print engine - opens a clean, US-branded print document.
 * Used for learner progress summaries, case logs, certificates, reports etc.
 */
export function printHtml(title: string, bodyHtml: string) {
  const win = window.open('', '_blank', 'width=900,height=750');
  if (!win) return;
  const styles = `
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #17212B; padding: 40px; margin: 0; }
    h1 { font-size: 20px; margin: 0 0 4px; color: #17324D; }
    h2 { font-size: 15px; margin: 0 0 16px; color: #5E6B78; font-weight: 500; }
    .letterhead { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #17324D; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 20px; font-weight: 700; color: #17324D; }
    .sub { font-size: 12px; color: #5E6B78; margin-top: 2px; }
    .right { text-align: right; font-size: 12px; color: #5E6B78; line-height: 1.6; }
    .doc-title { text-align: center; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 8px 0 20px; border-bottom: 1px solid #DDE3EA; padding-bottom: 12px; color: #17324D; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 12px; }
    th { text-align: left; background: #F5F7FA; padding: 8px 10px; border-bottom: 1px solid #DDE3EA; color: #5E6B78; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; }
    td { padding: 8px 10px; border-bottom: 1px solid #EDF0F4; }
    .meta { display: flex; gap: 48px; margin-top: 16px; }
    .meta .label { color: #5E6B78; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta .value { font-size: 14px; font-weight: 600; margin-top: 2px; }
    .section { font-size: 12px; font-weight: 700; color: #17324D; text-transform: uppercase; letter-spacing: 0.5px; margin: 24px 0 8px; }
    .sign { display: flex; justify-content: space-between; margin-top: 56px; }
    .sign .block { text-align: center; font-size: 12px; color: #5E6B78; }
    .sign .line { width: 180px; border-top: 1px solid #8D9BA9; margin-top: 56px; padding-top: 6px; }
    .footer { margin-top: 40px; font-size: 11px; color: #5E6B78; border-top: 1px solid #DDE3EA; padding-top: 12px; text-align: center; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .g { background: #D8F3E3; color: #18553C; } .a { background: #F5E9D3; color: #82541D; } .r { background: #F8DFE1; color: #862B32; } .b { background: #DCEBF7; color: #215286; }
    @media print { body { padding: 12mm; } .no-print { display: none; } }
  `;
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>${styles}</style>
</head>
<body>${bodyHtml}</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 350);
}

export const LETTERHEAD = `
<div class="letterhead">
  <div>
    <div class="brand">MedCampus 360</div>
    <div class="sub">Northbridge University School of Medicine</div>
    <div class="sub">Boston, Massachusetts &middot; Academic Year 2026-2027</div>
  </div>
  <div class="right">
    <div>Medical Education &amp; Clinical Learning Platform</div>
    <div>learners, rotations, competencies, compliance</div>
  </div>
</div>`;