console.log('loaded google slide comment stream')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const broadcastChannel = new BroadcastChannel('comment_channel');

  const extractComment = (mutationRecords: MutationRecord[]): string[] => {
    const nodes = mutationRecords.filter(record => {
      const element = record.target as Element;

      return element.className === 'punch-ask-question-questions-list'
    }).map(record => record.addedNodes[0]);
    // console.log(nodes);
    const comments = Array.from(nodes).map(node => {
      const element = node as HTMLElement;
      const commentElement = element.children[1].children[2] as HTMLElement;

      return commentElement.innerText
    });
    // console.log(comments);
    return comments;
  }

  const observeElement = document.querySelector<HTMLDivElement>('.punch-ask-question-questions-list');
  const observer = new MutationObserver(function(records) {
    // console.log(records);console.log('callback that runs when observer is triggered');
    broadcastChannel.postMessage(extractComment(records));
  });

  observer.observe(observeElement, {subtree: true, childList: true});

  sendResponse({result: true});
});