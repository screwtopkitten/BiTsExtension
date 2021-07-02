try{
  let bgpage = chrome.extension.getBackgroundPage();
  console.log(bgpage.thing);
  let word = bgpage.thing.trim();
}
catch{
  console.log("unable to copy string from page")
}


  try{
    parseString(word);
  }
  catch{
    console.log("No automatic strings copied please enter manually");
  }

  document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('link');
    // onClick's logic below:
    link.addEventListener('click', function() {
      const val = document.querySelector('input').value;
      Base64_Decode(val);
    });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('copy');
  // onClick's logic below:
  link.addEventListener('click', function() {
      const selector = document.querySelector('#results');
      CopyToClipboard(selector.id);
  });
});


  function parseString(text){
    const base64 = text.match(/\b(?:[a-zA-Z0-9+\/]{4})*(?:|(?:[a-zA-Z0-9+\/]{3}=)|(?:[a-zA-Z0-9+\/]{2}==)|(?:[a-zA-Z0-9+\/]{1}===))$/igm);   
    console.log(base64);
    base64.forEach(item => { if(item.length){Base64_Decode(item)}});
  }

  function Base64_Decode(input)
  {
    try{
      const selector = document.querySelector('#results');
      const frame = document.createElement('div');
      frame.innerHTML=`<h3>${input}</h3>`
      const results = document.createElement('textarea');
      results.className="textarea";
        const decoded = atob(input);
        results.innerText = decoded;
        frame.appendChild(results);
        selector.appendChild(frame);
    }
    catch{
      alert("error could not process entered string");
      console.log("Error unable to decode string");
    }

    
  }

  function CopyToClipboard(id)
  {
    try{
      const r = document.createRange();
      r.selectNode(document.getElementById(id));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(r);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
    catch{
      console.log("Error unable to copy output");
    }

  }


 