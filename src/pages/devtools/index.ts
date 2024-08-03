try {
  chrome.devtools.panels.create('API Recorder', 'icon-34.png', 'src/pages/panel/index.html');
} catch (e) {
  console.error(e);
}
