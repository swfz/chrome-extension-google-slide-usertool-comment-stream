import { log } from 'console';

const messageHandler = (response) => {
  if (chrome.runtime.lastError) {
    console.error('Error: ', chrome.runtime.lastError.message);
  } else {
    console.log('Response recieved: ', response);
  }
};

// const getFromStoragePromise = (key) => {
//    new Promise((resolve, reject) => {
//     chrome.storage.sync.get([key], (result) => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };

// const getFromStorage = async(key) => {
//   return (await getFromStoragePromise(key))[0][key]
// }

const info = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(args);
  }
};

export { messageHandler, info };
