import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

type ToolConfig = {
  color?: string;
  font?: string;
  speedPx?: number;
  sizeEm?: number;
}

function App() {
  const [config, setConfig] = useState<ToolConfig>()
  const [status, setStatus] = useState<string>()

  const fonts = [
    'メイリオ',
    'ＭＳ ゴシック',
    'ＭＳ 明朝',
    'HGS行書体',
    'HGP創英角ﾎﾟｯﾌﾟ体'
  ]

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({...prev, color: event.target.value}))
  }
  const handleFontChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setConfig((prev) => ({...prev, font: event.target.value}))
  }
  const handleSpeedPxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({...prev, speedPx: parseInt(event.target.value)}))
  }
  const handleSizeEmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({...prev, sizeEm: parseInt(event.target.value)}))
  }

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if(tab.id === undefined) {
      return
    }

    chrome.storage.sync.set({config});
    chrome.tabs.sendMessage(tab.id, {config}, (res) => console.log('response', res));

    setStatus('Started!!')
  }

  useEffect(() => {
    chrome.storage.sync.get(['config'], ({config}) => {
      setConfig(config);
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>GoogleSlide Comment Stream</h1>
        <p>スライド側とユーザーツール側両方で「Start」をクリックしてください</p>
        <form>
          <label htmlFor="color">Comment Color: </label>
          <input id="color" type="color" onChange={handleColorChange} value={config?.color}></input>
          <br />

          <label htmlFor="font">Comment Font: </label>
          <select value={config?.font} onChange={handleFontChange}>
            {fonts.map((font) => {
              return (
                <option key={font} value={font}>{font}</option>
              )
            })}
          </select>
          <br />

          <label htmlFor="speed">Speed(px/frame): </label>
          <input id="speed" type="number" onChange={handleSpeedPxChange} value={config?.speedPx}></input>
          <br />

          <label htmlFor="size">Size(em): </label>
          <input id="size" type="number" onChange={handleSizeEmChange} value={config?.sizeEm}></input>
          <br />
        </form>

        <button onClick={handleClick}>Start</button>

        <div>
          {status}
        </div>
      </header>
    </div>
  )
}

export default App
