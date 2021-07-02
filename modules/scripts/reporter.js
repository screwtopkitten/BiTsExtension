try{
  let bgpage = chrome.extension.getBackgroundPage();
  console.log(bgpage.thing);
  let word = bgpage.thing.trim();
}
catch{
  console.log("unable to auto copy string");
}
try{
  regMatch(word);
}
catch{
  console.log('error unable to automatically copy string');
}

  document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('link');
    // onClick's logic below:
    link.addEventListener('click', function() {
      const val = document.querySelector('input').value;
      regMatch(val);
    });
});
document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('copy');
  // onClick's logic below:
  link.addEventListener('click', function() {
      const selector = document.querySelector('#reporter');
      CopyToClipboard(selector.id);
  });
});

function regMatch(input)
  {
    console.log(input);
    const selector = document.querySelector('#reporter');
    const ips = input.match(/\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ig);
    const links = input.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig);
    const sha256 = input.match(/\b([a-f0-9]{64})\b/ig);
    const base64 = input.match(/\b(?:[a-zA-Z0-9+\/]{4})*(?:|(?:[a-zA-Z0-9+\/]{3}=)|(?:[a-zA-Z0-9+\/]{2}==)|(?:[a-zA-Z0-9+\/]{1}===))$/igm);
    console.log(ips);
    console.log(links);
    console.log(sha256);
    console.log(base64)
    try{
      ips.forEach(ip => {
        if(ip.length > 0){
          const textarea = document.createElement('li');
          const rand = Math.random().toString(16).substr(2, 8);
            textarea.className ="text";
            textarea.id = rand;
            textarea.innerText=`${ip}`;
            selector.appendChild(textarea);
        }
          });
        }
    catch{
      console.log('No IPs');
    }
    try{
      links.forEach(link => {
        if(link.length > 0){
        const textarea = document.createElement('li');
        const rand = Math.random().toString(16).substr(2, 8);
          textarea.className ="text";
          textarea.id = rand;
          textarea.innerText=`${link}`;
          selector.appendChild(textarea);
        }
          });
    }
    catch{
      console.log('No links');
    }
    try{
      sha256.forEach(hash => {
        if(hash.length > 0){
        const textarea = document.createElement('li');
        const rand = Math.random().toString(16).substr(2, 8);
          textarea.className ="text";
          textarea.id = rand;
          textarea.innerText=`${hash}`;
          selector.appendChild(textarea);
        }
          });
    }
    catch{
      console.log('No sha256 Hashes');
    }
    try{
      base64.forEach(b64 => {
        if(b64.length > 0){
        const textarea = document.createElement('li');
        const rand = Math.random().toString(16).substr(2, 8);
          textarea.className ="text";
          textarea.id = rand;
          textarea.innerText=`${b64}`;
          selector.appendChild(textarea);
        }
          });
    }
    catch{
      console.log('No base64 strings');
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