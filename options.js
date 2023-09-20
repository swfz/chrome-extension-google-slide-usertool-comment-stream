function options() {

  const textarea = document.getElementById('sakura');
  chrome.storage.sync.get(['sakura'], ({sakura}) => {
    if (sakura) {
      textarea.value = JSON.stringify(sakura, null, 2);
    }
  });

  const handleSave = function(event) {
    const sakuraOption = document.querySelector('textarea[id="sakura"]').value;
    const json = JSON.parse(sakuraOption);
    chrome.storage.sync.set({sakura: json});
  }

  const saveButton = document.getElementById('save');
  saveButton.addEventListener('click', handleSave);
}

options();