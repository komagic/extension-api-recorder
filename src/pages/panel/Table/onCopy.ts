function fallbackCopyTextToClipboard(text) {
  const input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}
export default function onCopy(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Async: Copying to clipboard was successful!');
    },
    err => {
      console.warn('Async: Could not copy text: ', err, 'try fallbackCopyTextToClipboard');
      fallbackCopyTextToClipboard(text);
    },
  );
}
