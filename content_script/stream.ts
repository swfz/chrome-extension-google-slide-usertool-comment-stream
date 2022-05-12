console.log('loaded google slide comment stream')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('comment stream started.')
  chrome.storage.sync.get(['config'], ({config}) => {
    const broadcastChannel = new BroadcastChannel('comment_channel');

    const addComment = (comment: string) => {
      const element = document.createElement("p");
      element.innerText = comment;

      const iframeElement: HTMLIFrameElement = document.querySelector('.punch-present-iframe');
      const boxElement = iframeElement.contentWindow.document.querySelector('.punch-viewer-content');

      boxElement.appendChild(element);

      const beltPerContainer = 0.12;
      const containerHeight = boxElement.clientHeight * (1 - beltPerContainer);

      const random = Math.random();
      const elementTop = ((containerHeight - element.clientHeight) * random);

      const moveUnit = config.speedPx || 5;
      const fontSize = config.sizeEm || 4;
      const textColor = config.color || "#000";
      const textFont = config.font

      const windowWidth = document.body.clientWidth;
      element.style.transform = `translateX(${windowWidth}px)`;
      element.style.color = textColor;
      element.style.fontFamily = textFont;
      element.style.fontSize = `${fontSize}em`;
      element.style.position = 'absolute';
      element.style.top = `${elementTop}px`;
      element.style.whiteSpace = 'nowrap';
      let moveX = windowWidth;

      const elementWidth = element.clientWidth;

      const moveAnimation = () => {
        if (moveX >= -elementWidth) {
          moveX = moveX - moveUnit;
          element.style.transform = `translateX(${moveX}px)`;
          requestAnimationFrame(moveAnimation);
        }
      };
      moveAnimation();
    }

    const handleEvent = (event) => {
      event.data.forEach(comment => addComment(comment));
    }

    broadcastChannel.onmessage = handleEvent;

    sendResponse({result: true});
  })
});