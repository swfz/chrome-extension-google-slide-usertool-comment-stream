import { rejects } from 'assert';
import { resolve } from 'path';

const messageHandler = (response) => {
  if (chrome.runtime.lastError) {
    console.error('Error: ', chrome.runtime.lastError.message);
  } else {
    console.log('Response recieved: ', response);
  }
};

const runtimeSendMessage = (message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};

const getFromStorage = (keys) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
};

export { messageHandler, runtimeSendMessage, getFromStorage };
