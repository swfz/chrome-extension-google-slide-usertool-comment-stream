import { ChangeEvent, useEffect, useState } from 'react';
import './App.css';

type ToolConfig = {
  color?: string;
  font?: string;
  speedPx?: number;
  sizePx?: number;
  clap?: string;
};

function App() {
  const [config, setConfig] = useState<ToolConfig>();
  const [status, setStatus] = useState<string>();

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

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id === undefined) {
      return;
    }

    chrome.storage.sync.set({ config });
    chrome.tabs.sendMessage(tab.id, { config }, (res) => console.log('response', res));

    setStatus('Started!!');
  };

  useEffect(() => {
    chrome.storage.sync.get(['config'], ({ config }) => {
      setConfig(config);
    });
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
        </form>

        <div className="preview">
          <div style={{ verticalAlign: 'bottom', color: config?.color, fontSize: config?.sizePx, fontFamily: config?.font }}>Preview</div>
        </div>

        <br />
        <button onClick={handleClick}>Start</button>

        <div>{status}</div>
      </header>
    </div>
  );
}

export default App;
