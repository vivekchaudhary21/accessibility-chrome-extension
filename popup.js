document
  .getElementById('checkForAccessibility')
  .addEventListener('click', () => {
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
  })

function checkForAccessibility() {
  let accessibilityIssues = []
  const errorStyle = '3px solid red'

  function rgbSeparator(rgb) {
    let sep = rgb.indexOf(',') > -1 ? ',' : ' '
    rgb = rgb.substr(4).split(')')[0].split(sep)
    return rgb
  }

  function sRGBToLinear(sRGB) {
    if (sRGB <= 0.04045) {
      return sRGB / 12.92
    } else {
      return sRGB <= 0.04045
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    }
  }

  function RGBToLinearRGB(rgb) {
    // Convert the RGB values from 0-255 to 0-1 range

    let [r, g, b] = rgbSeparator(rgb)

    r = r / 255
    g = g / 255
    b = b / 255

    // Apply the sRGB to Linear RGB conversion
    let linearR = sRGBToLinear(r).toFixed(2)
    let linearG = sRGBToLinear(g).toFixed(2)
    let linearB = sRGBToLinear(b).toFixed(2)

    return {
      r: linearR,
      g: linearG,
      b: linearB,
    }
  }

  // 1.Check for missing alt attributes in images
  document.querySelectorAll('img').forEach((img) => {
    if (!img.alt) {
      accessibilityIssues.push(`Image missing alt attribute: ${img.src}.`)
    }
  })

  // 2. Check to have not more than one h1 heading
  const heading = document.querySelectorAll('h1')
  if (heading.length > 1) {
    accessibilityIssues.push('More than one main heading.')
  }

  // 3. Use of ARIA Landmarks: Appropriately use ARIA landmarks (e.g., <header>, <main>, <footer>) for better navigation.
  const headerTag = document.querySelectorAll('header')
  if (headerTag === 0) {
    accessibilityIssues.push('Page missing Header tag.')
  }
  const mainTag = document.querySelectorAll('main')
  if (mainTag === 0) {
    accessibilityIssues.push('Page missing Main tag.')
  }
  const footerTag = document.querySelectorAll('footer')
  if (mainTag === 0) {
    accessibilityIssues.push('Page missing footer tag.')
  }

  // 4.Readable Fonts: Use legible fonts and sufficient text size (at least 16px for body text).
  document.querySelectorAll('p').forEach((para) => {
    const paraFontSize = window
      .getComputedStyle(para, null)
      .getPropertyValue('font-size')

    if (paraFontSize < '16px') {
      accessibilityIssues.push('All paragraph should have minimum size of 16px')
      para.style.border = errorStyle
    }
  })

  // 5.Color Contrast: Ensure sufficient contrast between text and background (WCAG recommends a ratio of at least 4.5:1).
  let rgbBgColor = window
    .getComputedStyle(document.body, null)
    .getPropertyValue('background-color')

  const linearBgColor = RGBToLinearRGB(rgbBgColor)
  const bgColorContrast =
    0.2126 * linearBgColor.r +
    0.7152 * linearBgColor.g +
    0.0722 * linearBgColor.b +
    0.05

  document.querySelectorAll('p').forEach((para) => {
    const rgbParaColor = window
      .getComputedStyle(para, null)
      .getPropertyValue('color')
    const linearParaColor = RGBToLinearRGB(rgbParaColor)
    const paraColorContrast = Number(
      (
        0.2126 * linearParaColor.r +
        0.7152 * linearParaColor.g +
        0.0722 * linearParaColor.b +
        0.05
      ).toFixed(2)
    )

    const ratio = bgColorContrast / paraColorContrast

    if (ratio < 4.5) {
      console.log(ratio, para.textContent)
      para.style.backgroundColor = errorStyle
      accessibilityIssues.push('Contrast ratio inappropriate.')
    }
  })

  return accessibilityIssues.length
    ? accessibilityIssues.join('<br>')
    : 'No accessibility issues found!'
}
