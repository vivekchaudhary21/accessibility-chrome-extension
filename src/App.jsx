// import { checkForAccessibility } from './utils/utils'

/* eslint-disable no-undef */
function App() {
  const checkAccessibility = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          // function: checkForAccessibility,
          files: ['axe.min.js'],
        })
        .then(() => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: function () {
              axe.run(document, (err, results) => {
                if (err) {
                  console.error(err)
                  return
                }

                results.violations.forEach((violation) => {
                  violation.nodes.forEach((node) => {
                    const reason = node.failureSummary
                    const selector = node.target.join(',')
                    const elements = document.querySelectorAll(selector)

                    elements.forEach((element) => {
                      element.title = reason
                      element.style.border = '2px solid red'
                    })
                  })
                })
              })
            },
          })
        })
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
