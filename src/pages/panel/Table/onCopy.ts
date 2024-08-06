const compatibilityCopy = (text: string) => {
  const input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  let result;
  try {
    result = document.execCommand('copy'); // 尝试复制
  } catch (err) {
    console.error('useClipboard: copy failed', err);
  } finally {
    document.body.removeChild(input);
  }
  return result;
};
export default function onCopy(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Async: Copying to clipboard was successful!');
    },
    err => {
      console.warn('Async: Could not copy text: ', err, 'try fallbackCopyTextToClipboard');
      compatibilityCopy(text);
    },
  );
}
