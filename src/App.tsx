import { ChangeEvent, useEffect, useState } from 'react';
import './App.css';

type Config = {
  color?: string;
  font?: string;
  speedPx?: number;
  sizePx?: number;
  clap?: string;
  plant?: boolean;
};

function App() {
  const [config, setConfig] = useState<Config>();
  const [status, setStatus] = useState<string>();
  const [presenter, setPresenter] = useState<number | null>();

  const fonts = ['メイリオ', 'ＭＳ ゴシック', 'ＭＳ 明朝', 'HGS行書体', 'HGP創英角ﾎﾟｯﾌﾟ体'];

  const claps = ['none', 'black', 'white', 'pink'];

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, color: event.target.value }));
  };
  const handleFontChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setConfig((prev) => ({ ...prev, font: event.target.value }));
  };
  const handleSpeedPxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, speedPx: parseInt(event.target.value) }));
  };
  const handleSizePxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, sizePx: parseInt(event.target.value) }));
  };
  const handleClapChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setConfig((prev) => ({ ...prev, clap: event.target.value }));
  };
  const handlePlantChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, plant: event.target.checked }));
  };

  const handleStart = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id === undefined) {
      return;
    }

    chrome.storage.sync.set({ config });
    chrome.tabs.sendMessage(tab.id, { command: 'Load' }, (res) => {
      setStatus(res.message);
      if (res.screenType === 'presenter') {
        chrome.storage.sync.set({ presenter: tab.id });
      }
    });
  };

  const handleDownloadComments = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id === undefined) {
      return;
    }

    chrome.tabs.sendMessage(tab.id, { command: 'Download' }, (res) => {
      if (res.comments) {
        const jsonData = JSON.stringify(res.comments);
        const mimeType = 'application/json';
        const fileContent = new Blob([jsonData], { type: mimeType });
        chrome.downloads.download(
          {
            filename: 'usertool-comments.json',
            url: URL.createObjectURL(fileContent),
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            }
          }
        );
        setStatus(`${res.comments.length}件のコメントを保存します`);
      }
    });
  };

  useEffect(() => {
    (async () => {
      chrome.storage.sync.get(['config'], ({ config }) => {
        setConfig(config);
      });

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.storage.sync.get(['presenter'], ({ presenter }) => {
        if (tab.id === presenter) {
          setPresenter(presenter);
        } else {
          setPresenter(null);
        }
      });
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>GoogleSlide Comment Stream</h1>
        <p>スライド側とユーザーツール側両方で「Start」をクリックしてください</p>
        <form>
          <label htmlFor="color">Comment Color: </label>
          <input id="color" type="color" onChange={handleColorChange} value={config?.color || '#000000'}></input>
          <br />

          <label htmlFor="font">Comment Font: </label>
          <select value={config?.font} onChange={handleFontChange}>
            {fonts.map((font) => {
              return (
                <option key={font} value={font}>
                  {font}
                </option>
              );
            })}
          </select>
          <br />

          <label htmlFor="speed">Speed(px/frame): </label>
          <input id="speed" type="number" onChange={handleSpeedPxChange} value={config?.speedPx || 5}></input>
          <br />

          <label htmlFor="size">Size(px): </label>
          <input id="size" type="number" onChange={handleSizePxChange} value={config?.sizePx || 50}></input>
          <br />

          <label htmlFor="clap">Clap(color): </label>
          <select value={config?.clap} onChange={handleClapChange}>
            {claps.map((value) => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>

          <br />

          <label htmlFor="plant">Use Plant(require option configuration): </label>
          <input id="plant" type="checkbox" onChange={handlePlantChange} checked={config?.plant}></input>
        </form>

        <div className="preview">
          <div style={{ verticalAlign: 'bottom', color: config?.color, fontSize: config?.sizePx, fontFamily: config?.font }}>Preview</div>
        </div>

        <br />
        <button onClick={handleStart}>Start</button>
        {presenter ? <button onClick={handleDownloadComments}>DownloadComments</button> : ''}
        <div>{status}</div>
      </header>
    </div>
  );
}

export default App;
