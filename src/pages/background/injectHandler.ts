export const injectHandler = (target: chrome.scripting.InjectionTarget) => {
  chrome.scripting.executeScript({
    target,
    files: ['assets/js/xhr.js'],
    world: 'MAIN',
    injectImmediately: true,
  });
};
