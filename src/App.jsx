import { checkForAccessibility } from './utils/utils'

/* eslint-disable no-undef */
function App() {
  const checkAccessibility = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: checkForAccessibility,
        },
        (data) => {
          const resultDiv = document.getElementById('results')
          resultDiv.innerHTML = data[0].result
        }
      )
    })
  }
  return (
    <>
      <h3>Accessibility manager</h3>
      <button id="checkForAccessibility" onClick={checkAccessibility}>
        Check accessibility
      </button>
      <div id="results"></div>
    </>
  )
}

export default App
