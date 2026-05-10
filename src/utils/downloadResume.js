const RESUME_FILENAME = 'Aaradhya_Mehra_Resume.pdf';

export function downloadResume() {
  const link = document.createElement('a');
  link.href = `/${RESUME_FILENAME}`;
  link.download = RESUME_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
