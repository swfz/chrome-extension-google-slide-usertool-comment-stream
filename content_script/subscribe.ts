const sample = () => {
  console.log('content script subscriber build by vite')
}

sample()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content_script');
  console.log(message);
  console.log(sender);
  console.log(sendResponse);

  const broadcastChannel = new BroadcastChannel('comment_channel');

  const extractComment = (mutationRecords) => {
    const nodes = mutationRecords.filter(record => record.target.className === 'punch-ask-question-questions-list').map(record => record.addedNodes[0]);
    console.log(nodes);
    const comments = Array.from(nodes).map(node => node.children[1].children[2].innerText);
    console.log(comments);
    return comments;
  }

  const observeElement = document.querySelector('.punch-ask-question-questions-list');
  const observer = new MutationObserver(function(records) {
    console.log(records);console.log('callback that runs when observer is triggered');
    broadcastChannel.postMessage(extractComment(records));
  });

  observer.observe(observeElement, {subtree: true, childList: true});

  sendResponse({result: true});
});