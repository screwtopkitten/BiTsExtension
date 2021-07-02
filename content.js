console.log("Chrome Extension Ready to go?")

window.addEventListener('mouseup',highlightedText);

function highlightedText(){
  let selectedText = window.getSelection().toString().trim();
  console.log(selectedText);
  if (selectedText.length > 0){
    let message = {
      text: selectedText
    };
    chrome.runtime.sendMessage(message);
  }
}
