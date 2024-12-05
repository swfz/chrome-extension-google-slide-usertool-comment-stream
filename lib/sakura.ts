const addSubscribePageNumber = (iframeElement: HTMLIFrameElement) => {
  const broadcastChannel = new BroadcastChannel('plant_comment_channel');

  if (iframeElement === null) {
    return;
  }
  const observeElement = iframeElement.contentWindow?.document.querySelector<HTMLDivElement>(
    '.docs-material-menu-button-flat-default-caption',
  );

  if (observeElement === null) {
    console.log('not exist observe element');
    return;
  }

  const observer = new MutationObserver(function (records) {
    const added = records.at(-1)?.addedNodes[0]?.textContent;
    const removed = records[0]?.removedNodes[0]?.textContent;

    if (added && removed && added > removed) {
      chrome.storage.sync.get(['sakura'], ({ sakura }) => {
        const plantCommentRows = sakura[added];

        if (plantCommentRows !== undefined) {
          plantCommentRows.forEach((commentRow) => {
            setTimeout(() => {
              broadcastChannel.postMessage(commentRow.comment);
            }, commentRow.seconds * 1000);
          });
        }
      });
    }
  });

  observer.observe(observeElement, { subtree: true, childList: true });
};

export { addSubscribePageNumber };
