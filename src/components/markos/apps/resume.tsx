import { Download, FileText, Maximize2 } from "lucide-react";

export function ResumeApp() {
  return (
    <div className="resume-app">
      <div className="resume-toolbar">
        <div><FileText size={17} /><span><b>Mark-Steyn-CV.pdf</b><small>1 page</small></span></div>
        <a className="win-button" href="/cv.pdf" download><Download size={15} /> Download</a>
        <a className="icon-button" href="/cv.pdf" target="_blank" rel="noreferrer" aria-label="Open resume in new tab"><Maximize2 size={16} /></a>
      </div>
      <iframe title="Mark Steyn CV" src="/cv.pdf#view=FitH&toolbar=0" />
    </div>
  );
}
