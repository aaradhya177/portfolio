const RESUME_FILENAME = 'Aaradhya_Mehra_Resume.pdf';
const RESUME_PATH = '/resume.pdf';

export function downloadResume() {
  const link = document.createElement('a');
  link.href = RESUME_PATH;
  link.download = RESUME_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
