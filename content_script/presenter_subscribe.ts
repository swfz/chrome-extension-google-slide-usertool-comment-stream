chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const observeElement = document.querySelector<HTMLDivElement>('.punch-viewer-speaker-questions');

  if (observeElement === null) {
    return;
  }

  console.log('subscribe presenter usertool started');

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

  sendResponse({ result: true });
});