try{
  let bgpage = chrome.extension.getBackgroundPage();
  console.log(bgpage.thing);
  var word = bgpage.thing.trim();
  console.log(word);

  parseString(word);
}
catch{
  console.log('error unable to automatically copy string');
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('link');
    // onClick's logic below:
    link.addEventListener('click', function() {
      const val = document.querySelector('input').value;
      console.log(val);
      parseString(val);
    });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('copy');
  // onClick's logic below:
  link.addEventListener('click', function() {
      const selector = document.querySelector('#IOC_search');
      CopyToClipboard(selector.id);
  });
});

function parseString(text){
  const ipRegex = text.match(/\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ig);   
  const domainRegex = text.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig);
  const sha256Regex = text.match(/\b([a-f0-9]{64})\b/ig);

  try{
    if(ipRegex.length <= 20){
      ipRegex.forEach(ip => {if(ip.length > 0) {print(ip)}});
    }
    else{
        alert(` ${ipRegex.length} IPs in search criteria which exceeds the maximum of 20 `);
    }
  }
  catch{
    console.log("No IPs in search string")
    }
  try{
    if(sha256Regex.length <= 20){
      sha256Regex.forEach(sha256 => {if(sha256.length > 0) {print(sha256)}});
    }
    else{
        alert(` ${sha256Regex.length} Hashes in search criteria which exceeds the maximum of 20 `);
    }
  }
  catch{
    console.log("No SHA256 Hash in search string")
  }
  try{
    if(domainRegex.length <= 20){
      domainRegex.forEach(domain => {if(domain.length > 0) {print(domain)}});
    }
    else{
        alert(` ${domainRegex.length} domains in search criteria which exceeds the maximum of 20 `);
    }
  }
  catch{
    console.log("No domain in search string")
  }
}

async function getAPI(url){
  try{
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }
  catch{
    console.log('Unable to fetch content');
  }

}

async function trustarAuth(creds){   
  try{
    const key_string = `${creds.apikeys.trustarapikey}:${creds.apikeys.trustarsecret}`;
    const encoded_string = btoa(key_string);
    const url = 'https://api.trustar.co/oauth/token'
    const options ={
      method: 'POST',
      headers:{"Authorization": `Basic ${encoded_string}`, 
      "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    }
    const response = await fetch(url,options);
    const json = await response.json();
    return json;
  }
  catch{
    console.log('unable to get Oauth token from trustar API');
  }
  
}

async function trustarSearch(searchterm, creds){   
  try{
    const url = 'https://api.trustar.co/api/1.3/indicators/search'
    const search={
      "searchTerm": searchterm
    }
    const options ={
      method: 'POST',
      headers:{"Authorization": `Bearer ${creds.access_token}`,
      "Content-Type": "application/json", 
      "Client-Metatag": "fetch",
      "Client-Type": "API" },
      body: JSON.stringify(search)
    }
    const response = await fetch(url,options);
    const json = await response.json();
    return json;
  }
  catch{
    console.log('unable to get search results from trustar API');
  }
}

async function trustarIndicators(creds,values){   
  try{
    const url = 'https://api.trustar.co/api/1.3/indicators/summaries'
    const options ={
      method: 'POST',
      headers:{"Authorization": `Bearer ${creds.access_token}`,
      "Content-Type": "application/json", 
      "Client-Metatag": "fetch",
      "Client-Type": "API" },
      body: JSON.stringify(values)
    }
    const response = await fetch(url,options);
    const json = await response.json();
    return json;
  }
  catch{
    console.log('unable to obtain indicator summaries from trustar');
  }
}

async function print(search_term){
  const apiconfig = await getAPI('config.json');
  const selector = document.querySelector('#IOC_search');
  const header = document.createElement('div');
  const rand = Math.random().toString(16).substr(2, 8);

  switch(apiconfig.apikeys.trustarenabled){
    case true:
      oauth = await trustarAuth(apiconfig);
      search = await trustarSearch(search_term, oauth);
      let values = search.items.map(item => item['value']);
      const data = await trustarIndicators(oauth,values);
      header.className ="text";
      header.id =rand;
      if(search.totalElements > '0')
      {

        header.innerHTML=`
        <h2> Threat Lookup Report for: ${search_term}</h2></br>
        Matching results Trustar: ${search.totalElements}</br>
        Matching indicator summaries ${data.totalElements}</p>
        `;
      }
      else{
        header.innerHTML=`
        <h2> Threat Lookup Report for: ${search_term}</h2></br>
        Matching results Trustar: ${search.totalElements}</br>
        Matching indicator summaries: 0</p>
        `;
      }

      selector.appendChild(header);
      search.items.forEach(element =>{
      const body = document.createElement('li');
      body.className= "text";
      body.innerHTML=`
      Indicator Type: ${element.indicatorType} 
      Value: ${element.value} 
      `
      selector.appendChild(body);

      });
      if(search.totalElements > '0'){
        data.items.forEach(element => {
          try{
            const body = document.createElement('p');
            body.className= "text";
            body.innerHTML=`
              <b>Source: ${element.source.name}</b></br>
              Type: ${element.type}</br>
              Value: ${element.value}</br> 
              <b>Attributes</b>`
            selector.appendChild(body);
          element.attributes.forEach(item => {
          const attribute =document.createElement('p');
          attribute.innerHTML=`
            item: ${item.name}</br>
            value: ${item.value}
          `
            selector.appendChild(attribute);
          });
        }
      catch{
        alert('error unable to process api request please check console for more verbose messaging');
        console.log('error unable to process trustar api');
        }
        });
      }

      break;
    case false:
      try{
        const publicapi = document.createElement('p');
        publicapi.innerText = "Trustar lookup feature not enabled to enable this feature please enter your trustar APIkey/secret into the config.json file"
        selector.appendChild(publicapi);
       }
       catch{
        alert('error unable to proceed please ensure config.json is present');
        console.log('error unable to proceed please ensure config.json is present');
       }
      break;
  }
    CopyToClipboard(selector.id);
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
    console.log('unable to copy output');
  }

}

