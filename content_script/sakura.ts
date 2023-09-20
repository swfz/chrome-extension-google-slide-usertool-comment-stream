console.log('loaded google slide comment stream');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('subscribe plant comment when page changed started');

  const broadcastChannel = new BroadcastChannel('plant_comment_channel');

  const handleEvent = (event) => {
    chrome.storage.sync.get(['config'], ({ config }) => {
      if(config.plant) {
        const textarea = document.querySelector<HTMLTextAreaElement>('.punch-ask-question-submit-question-dialog-question-textarea');
        if (textarea === null) {
          return
        }
        textarea.click();

        const anonimity = document.querySelector<HTMLInputElement>('.docs-material-gm-labeled-checkbox-checkbox');
        if (anonimity?.ariaChecked === 'false') {
          anonimity.click();
        }

        const inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
        textarea.value = event.data;
        textarea.dispatchEvent(inputEvent);

        const button = document.querySelector('.punch-ask-question-submit-button')

        const mousedownEvent = new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window, button: 0 });
        button?.dispatchEvent(mousedownEvent);

        const mouseupEvent = new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window, button: 0 });
        button?.dispatchEvent(mouseupEvent);
      }
    });
  };

  broadcastChannel.onmessage = handleEvent;
  sendResponse({ screenType: 'usertool', message: 'A listener has been added to the usertool.' });
});