console.log('loaded google slide comment stream');

const subscribeComments = (observeElement, sendResponse) => {
  const broadcastChannel = new BroadcastChannel('comment_channel');

  const extractComment = (mutationRecords: MutationRecord[]): string[] => {
    console.log(mutationRecords);
    const nodes = mutationRecords
      .filter((record) => {
        const element = record.target as Element;

        return element.className === 'punch-viewer-speaker-questions';
      })
      .map((record) => record.addedNodes[0]);
    const comments = Array.from(nodes).map((node) => {
      const element = node as HTMLElement;
      const commentElement = element.children[1].children[2] as HTMLElement;

      return commentElement.innerText;
    });
    console.log(comments);
    return comments;
  };

  const observer = new MutationObserver(function (records) {
    broadcastChannel.postMessage(extractComment(records));
  });

  observer.observe(observeElement, { subtree: true, childList: true });

  sendResponse({ screenType: 'presenter', message: 'A listener has been added to the PRESENTER side.' });
};

const extractAllComments = (sendResponse) => {
  const commentElements = document.querySelectorAll<HTMLDivElement>('.punch-qanda-question-content');

  const comments = Array.from(commentElements).map((commentElement) => {
    const userElem = commentElement.querySelector('.punch-qanda-question-user-name');
    const timeElem = commentElement.querySelector('.punch-qanda-question-time');
    const textElem = commentElement.querySelector('.punch-qanda-question-text');
    const prosElem = commentElement.querySelector('#\\:3b');
    const againstElem = commentElement.querySelector('#\\:3c');

    return {
      user: userElem?.textContent,
      time: timeElem?.textContent,
      text: textElem?.textContent,
      pros: prosElem?.textContent,
      against: againstElem?.textContent,
    };
  });

  sendResponse({ comments });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const observeElement = document.querySelector<HTMLDivElement>('.punch-viewer-speaker-questions');

  if (observeElement === null) {
    return;
  }

  if (message.command === 'Load') {
    subscribeComments(observeElement, sendResponse);
    console.log('subscribe presenter usertool started');
  } else if (message.command === 'Download') {
    extractAllComments(sendResponse);
  }
});
