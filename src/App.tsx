import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'


type ToolConfig = {
  color?: string;
  font?: string;
  speedPx?: number;
  sizeEm?: number;
}

function App() {
  const [config, setConfig] = useState<ToolConfig>()

  const handleColorChange = (event) => {
    setConfig((prev) => ({...prev, color: event.target.value}))
  }
  const handleFontChange = (event) => {
    setConfig((prev) => ({...prev, font: event.target.value}))
  }
  const handleSpeedPxChange = (event) => {
    setConfig((prev) => ({...prev, speedPx: event.target.value}))
  }
  const handleSizeEmChange = (event) => {
    setConfig((prev) => ({...prev, sizeEm: event.target.value}))
  }

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.storage.sync.set({config});

    chrome.tabs.sendMessage(tab.id, {message: 'hoge'}, (res) => console.log('response', res));
  }

  useEffect(() => {
    chrome.storage.sync.get(['config'], ({config}) => {
      setConfig(config);
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>GoogleSlide Comment Stream</p>
        <form>
          <label htmlFor="color">Comment Color</label>
          <input id="color" type="color" onChange={handleColorChange} value={config?.color}></input>
          <br />

          <label htmlFor="font">Comment Font</label>
          <input id="font" type="text" size={5} onChange={handleFontChange} value={config?.font}></input>
          <br />

          <label htmlFor="speed">Comment Speed(px/animation frame)</label>
          <input id="speed" type="number" size={4} onChange={handleSpeedPxChange} value={config?.speedPx}></input>
          <br />

          <label htmlFor="size">Comment Size(em)</label>
          <input id="size" type="number" onChange={handleSizeEmChange} value={config?.sizeEm}></input>
          <br />
        </form>

        <button onClick={handleClick}>Start</button>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
