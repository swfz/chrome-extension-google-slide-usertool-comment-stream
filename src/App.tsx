import { ChangeEvent, useEffect, useState } from 'react';
import './App.css';

type Config = {
  platform?: string;
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

  const platforms: Config['platform'][] = ['gslide', 'zoom'];
  const fonts = ['メイリオ', 'ＭＳ ゴシック', 'ＭＳ 明朝', 'HGS行書体', 'HGP創英角ﾎﾟｯﾌﾟ体'];

  const claps = ['none', 'black', 'white', 'pink'];

  const handlePlatformChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setConfig((prev) => ({ ...prev, platform: event.target.value }));
  };
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
    chrome.tabs.sendMessage(tab.id, { command: 'Load', platform: config?.platform, tabId: tab.id }, (res) => {
      console.log(res);

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
          },
        );
        setStatus(`${res.comments.length}件のコメントを保存します`);
      }
    });
  };

  const sampleComments = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id === undefined) {
      return;
    }

    const comments = [`${Date.now()} サンプルコメント8888`];
    chrome.tabs.sendMessage(tab.id, { command: 'SendSubscribedComments', comments }, (res) => {
      console.log(res);
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
        <h2>GoogleSlide Comment Stream</h2>
        <p>Click "Start" on both the slide side and the presenter user tools side</p>
        <form>
          <div className="pseudo-table">
            <div className="pseudo-row">
              <label htmlFor="platform" className="pseudo-cell">
                Subscribe Platform:{' '}
              </label>
              <div className="pseudo-cell">
                <select value={config?.platform || 'gslide'} onChange={handlePlatformChange}>
                  {platforms.map((platform) => {
                    return (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="pseudo-row">
              <label htmlFor="color" className="pseudo-cell">
                Comment Color:{' '}
              </label>
              <div className="pseudo-cell">
                <input id="color" type="color" onChange={handleColorChange} value={config?.color || '#000000'}></input>
              </div>
            </div>

            <div className="pseudo-row">
              <label htmlFor="font" className="pseudo-cell">
                Comment Font:{' '}
              </label>
              <div className="pseudo-cell">
                <select value={config?.font} onChange={handleFontChange}>
                  {fonts.map((font) => {
                    return (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="pseudo-row">
              <label htmlFor="speed" className="pseudo-cell">
                Speed(px/frame):{' '}
              </label>
              <div className="pseudo-cell">
                <input id="speed" type="number" onChange={handleSpeedPxChange} value={config?.speedPx || 5}></input>
              </div>
            </div>

            <div className="pseudo-row">
              <label htmlFor="size" className="pseudo-cell">
                Size(px):{' '}
              </label>
              <div className="pseudo-cell">
                <input id="size" type="number" onChange={handleSizePxChange} value={config?.sizePx || 50}></input>
              </div>
            </div>

            <div className="pseudo-row">
              <label htmlFor="clap" className="pseudo-cell">
                Clap(color):{' '}
              </label>
              <div className="pseudo-cell">
                <select value={config?.clap} onChange={handleClapChange}>
                  {claps.map((value) => {
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="pseudo-row">
              <label htmlFor="plant" className="pseudo-cell">
                Use Plant(require option configuration):{' '}
              </label>
              <div className="pseudo-cell">
                <input id="plant" type="checkbox" onChange={handlePlantChange} checked={config?.plant}></input>
              </div>
            </div>
          </div>
        </form>

        <div className="preview">
          <div style={{ verticalAlign: 'bottom', color: config?.color, fontSize: config?.sizePx, fontFamily: config?.font }}>Preview</div>
        </div>

        <br />
        <button onClick={handleStart}>Start</button>
        {presenter ? <button onClick={handleDownloadComments}>DownloadComments</button> : ''}
        <button onClick={sampleComments}>Sample</button>
        <div>{status}</div>
      </header>
    </div>
  );
}

export default App;
