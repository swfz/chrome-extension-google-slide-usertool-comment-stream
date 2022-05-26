console.log('loaded google slide comment stream')

const clapFilters = {
  black: 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(26%) hue-rotate(88deg) brightness(87%) contrast(105%)',
  white: 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%)',
  pink: 'brightness(0) saturate(100%) invert(29%) sepia(69%) saturate(6456%) hue-rotate(316deg) brightness(103%) contrast(107%)'
}

const commentElementStyle = (config, windowWidth, top) => {
  return {
    transform: `translateX(${windowWidth}px)`,
    color: config.color || '#000',
    fontFamily: config.font,
    fontSize: `${(config.sizePx || 4)}px`,
    position: 'absolute',
    top: `${top}px`,
    whiteSpace: 'nowrap'
  }
}

const clapElementStyle = (top) => {
  return {
    position: 'absolute',
    top: `${top}px`,
    right: `0px`,
    opacity: '0'
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('comment stream started.')

  const iframeElement: HTMLIFrameElement = document.querySelector('.punch-present-iframe');
  const boxElement = iframeElement.contentWindow.document.querySelector('.punch-viewer-content');
  const clapElement = document.createElement("div");

  const beltPerContainer = 0.12;
  const containerHeight = boxElement.clientHeight * (1 - beltPerContainer);

  // TODO: 50決め打ちの箇所動的にする
  const clapElementTop = containerHeight - clapElement.clientHeight - 50;

  const p = document.createElement("p");
  p.style.margin = '0';

  const img = document.createElement("img");
  const imageUrl = chrome.runtime.getURL("images/sign_language_black_24dp.svg");
  img.src = imageUrl;

  clapElement.appendChild(p)
  clapElement.appendChild(img)
  boxElement.appendChild(clapElement);

  const clapElementStyles = clapElementStyle(clapElementTop)
  Object.entries(clapElementStyles).forEach(([k,v]) => clapElement.style[k] = v)

  chrome.storage.sync.get(['config'], ({config}) => {
    const broadcastChannel = new BroadcastChannel('comment_channel');

    const addComment = (comment: string) => {
      const element = document.createElement("p");
      element.innerText = comment;

      boxElement.appendChild(element);

      const random = Math.random();
      const elementTop = ((containerHeight - element.clientHeight) * random);

      const moveUnit = config.speedPx || 5;

      const windowWidth = document.body.clientWidth;
      const commentStyles = commentElementStyle(config, windowWidth, elementTop);
      Object.entries(commentStyles).forEach(([k,v]) => element.style[k] = v)

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

    const renderClaps = (recievedClaps: number) => {
      p.innerText = `+${recievedClaps.toString()}`;

      clapElement.style.filter = clapFilters[config.clap] || clapFilters['black'];
      let opacity = 1;
      const clapAnimation = () => {
        if (opacity >= 0) {
          opacity = opacity - 0.01;
          clapElement.style.opacity = opacity.toString();
          requestAnimationFrame(clapAnimation);
        }
      }
      clapAnimation();
    }

    const handleEvent = (event) => {
      const claps = event.data.reduce((n, comment) => n + comment.match(/8/g)?.length, 0);
      const comments = event.data.filter(comment => !comment.match(/^8+$/));

      if (claps > 0) {
        renderClaps(claps)
      }
      comments.forEach(comment => addComment(comment));
    }

    broadcastChannel.onmessage = handleEvent;

    sendResponse({result: true});
  })
});