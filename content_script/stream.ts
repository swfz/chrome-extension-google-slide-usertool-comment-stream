const sample1 = () => {
  console.log('content script stream build by vite')
}

sample1()


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.storage.sync.get(['config'], ({config}) => {
    console.log('content_script');
    console.log(message);
    console.log(sender);
    console.log(sendResponse);

    const broadcastChannel = new BroadcastChannel('comment_channel');

    const addComment = (comment: string) => {
      const element = document.createElement("p");
      element.innerText = comment;

      const boxElement = document.querySelector('.punch-present-iframe').contentWindow.document.querySelector('.punch-viewer-content');

      console.log('called addComment');

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
      element.style.font = textFont;
      element.style['font-size'] = `${fontSize}em`;
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