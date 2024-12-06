const removelinkBar = (iframeElement: HTMLIFrameElement) => {
  const linkBar = iframeElement.contentWindow?.document.querySelector<HTMLDivElement>('.punch-viewer-questions-link-bar-container');
  const content = iframeElement.contentWindow?.document.querySelector<HTMLDivElement>('.punch-viewer-content');
  const wrapper = iframeElement.contentWindow?.document.querySelector<HTMLDivElement>('.punch-viewer-page-wrapper-container');

  if (linkBar != null && wrapper != null && content != null) {
    linkBar.remove();

    content.style.height = `100%`;
    content.style.width = `100%`;
    content.style.left = '0';
    wrapper.style.height = '100%';
    wrapper.style.width = `100%`;
    wrapper.style.top = '0';
    wrapper.style.left = '0';
  }
};

const clapFilters = {
  black: 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(26%) hue-rotate(88deg) brightness(87%) contrast(105%)',
  white: 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%)',
  pink: 'brightness(0) saturate(100%) invert(29%) sepia(69%) saturate(6456%) hue-rotate(316deg) brightness(103%) contrast(107%)',
};

const commentElementStyle = (config, windowWidth, top) => {
  return {
    transform: `translateX(${windowWidth}px)`,
    color: config.color || '#000',
    fontFamily: config.font,
    fontSize: `${config.sizePx || 50}px`,
    position: 'absolute',
    top: `${top}px`,
    whiteSpace: 'nowrap',
  };
};
const clapElementStyle = (bottom, right) => {
  return {
    width: '100px',
    height: '100px',
    position: 'absolute',
    bottom: `${bottom}px`,
    right: `${right}px`,
    opacity: '0',
  };
};

const renderClaps = (
  recievedClaps: number,
  p: HTMLElement,
  clapElement: HTMLElement,
  clapElementBottom: number,
  clapElementRight: number,
  config,
) => {
  p.innerText = `+${recievedClaps.toString()}`;

  clapElement.style.filter = clapFilters[config.clap] || clapFilters['black'];

  const randomMotion = (range) => {
    // + - range分のランダム数値
    return Math.floor(Math.random() * (range - -range + 1)) + -range;
  };

  let opacity = 1;
  const clapAnimation = () => {
    if (opacity >= 0) {
      opacity = opacity - 0.01;
      clapElement.style.opacity = opacity.toString();
      clapElement.style.bottom = clapElementBottom + randomMotion(2) + 'px';
      clapElement.style.right = clapElementRight + randomMotion(2) + 'px';
      requestAnimationFrame(clapAnimation);
    }
  };
  clapAnimation();
};

const addComment = (comment: string, boxElement: Element, containerHeight: number, config) => {
  console.log('add comment');

  const element = document.createElement('p');
  element.innerText = comment;

  boxElement.appendChild(element);

  const random = Math.random();
  const elementTop = (containerHeight - element.clientHeight) * random;

  const moveUnit = config.speedPx || 5;

  const windowWidth = document.body.clientWidth;
  const commentStyles = commentElementStyle(config, windowWidth, elementTop);
  Object.entries(commentStyles).forEach(([k, v]) => (element.style[k] = v));

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
};

export { clapElementStyle, commentElementStyle, clapFilters, removelinkBar, addComment, renderClaps };
