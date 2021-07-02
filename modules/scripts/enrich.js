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
        parseString(val);
      });
  });

  document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('copy');
    // onClick's logic below:
    link.addEventListener('click', function() {
        const selector = document.querySelector('#prettyprint');
        CopyToClipboard(selector.id);
    });
});



function parseString(text){
    const ipRegex = text.match(/\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ig);   
    const sha256Regex = text.match(/\b([a-f0-9]{64})\b/ig);
    const domainRegex = text.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig);
    try{
        if(ipRegex.length <= 20){
            ipRegex.forEach(item => getIP(item));
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
            sha256Regex.forEach(item => getHash(item));
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
            domainRegex.forEach(item => getDNS(item));
        }
        else{
            alert(` ${domainRegex.length} domains in search criteria which exceeds the maximum of 20 `);
        }
    }
    catch{
        console.log("No domain in search string")
    }

    
  }


//Get IP Enrichment information
async function getIP(ip){   
  const creds = await getCreds('config.json');
  const textarea = reportHeader(ip);
      apiurls = [
          {
              "header": "Shodan",
              "api":`https://api.shodan.io/shodan/host/${ip}?key=${creds.apikeys.shodanapi}`,
              "options":{
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                    }
                }
          },
          {
              "header": "Greynoise",
              "api": `https://api.greynoise.io/v3/community/${ip}`,
              "options": {
                method: 'GET',
                headers:{
                    Accept: 'application/json',
                }
              }
          },
          {
            "header": "Threatcrowd",
            "api": `https://www.threatcrowd.org/searchApi/v2/ip/report/?ip=${ip}`,
            "options": {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                    }
                }
        },
          {
            "header": "Geolocation info",
            "api": `http://ip-api.com/json/${ip}`,
            "options": {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                    }
                }
        }
      ];  
    if(creds.apikeys.shodanenabled === false){
        apiurls.splice(0,1);
    }

  apiurls.forEach(element => {
      const article = document.createElement('div');
      getAPI(element).then(x =>{ prettyOutput(x, element.header,article,textarea);});     
  });
}

//Get Hash Enrichment information
async function getHash(hash){   
    const creds = await getCreds('config.json');
    const textarea = reportHeader(hash);
        apiurls = [
              {
                  "header": "Virustotal",
                  "api": `https://www.virustotal.com/api/v3/files/${hash}`,
                  "options":{
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'x-apikey': `${creds.apikeys.virustotalapi}`
                        }
                    }
                }
        ];  
    if(creds.apikeys.vtenabled === false){
        apiurls.splice(0,1);
        alert('To use Hash enrichment please enter a VT apikey in config.json and enable the feature')
    }
    else{
        apiurls.forEach(element => {
            const article = document.createElement('div');
            getAPI(element).then(x =>{ prettyOutput(x, element.header,article,textarea);});     
        });
    }
  }

//Get DNS Enrichment information
async function getDNS(domain){   
    const creds = await getCreds('config.json');
    const textarea = reportHeader(domain);
        apiurls = [
                {
                    "header": "URL Scan",
                    "api": `https://urlscan.io/api/v1/search/?q=task.url:${domain},&size=1`,
                    "options":{
                      method: 'GET',
                      headers: {
                          Accept: 'application/json',
                          }
                      }
                  },
        ];  
    apiurls.forEach(element => {
        const article = document.createElement('div');
        getAPI(element).then(x =>{ prettyOutput(x, element.header,article,textarea);});     
    });
  }


async function getCreds(file){   
    try{
        const response = await fetch(file);
        const json = await response.json();
        return json;
    }
    catch{
        console.log('Unable to read from file');

    }
}

async function getAPI(apiobject){   
    try{
        const response = await fetch(apiobject.api, apiobject.options);
        const json = await response.json();
        console.log(json);
        return json;
    }
    catch{
        console.log('Unable to read from API');
    }

  }

function reportHeader(heading){
    const selector = document.querySelector('#prettyprint');
    const textarea = document.createElement('div');
    const rand = Math.random().toString(16).substr(2, 8);
    textarea.className ="text";
    textarea.id = rand;
    textarea.innerHTML=`<h2>Lookup Report for: ${heading}</h2>`;
    selector.appendChild(textarea);
    return textarea;
}

function prettyOutput(json, html_element, article, textarea){
    if(html_element == "Geolocation info"){
        try{
            article.innerHTML = `
            <h3>${html_element}</h3>
                <b>ASN:</b> ${json.as}</br>
                <b>ISP:</b> ${json.isp}</br>
                <b>Org:</b> ${json.org}</br>
                <b>City:</b> ${json.city}</br>
                <b>Region:</b> ${json.regionName}</br>
                <b>Country:</b> ${json.country}</br>
                <b>lat:</b> ${json.lat} <b>lon:</b> ${json.lon}</br>
            `;
            }
        catch{
            article.innerHTML = `<b>Unable to read from geolocation API</b></br>`
        }
}
    if(html_element == "Shodan"){
      try{
          switch (json.error){
              case 'No information available for that IP.':
                  console.log('errors yall');
                  article.innerHTML =`
                  <h3>${html_element}</h3>
                  <p>No information available from Shodan</p>
                  `;
                  break;
              case undefined:
                  article.innerHTML = `
                  <h3>${html_element}</h3>
                      <b>Last Updated: </b>${json.last_update}
                      <b>IP:</b> ${json.ip_str} Ports: ${json.ports}</br>               
                      <b>Hostname:</b> ${json.hostnames}</br>
                      <b>Domains:</b> ${json.domains}</br>         
                  `;
                  break;
              }          
          }
      catch{
          article.innerHTML = `<b>Unable to read from Shodan API</b></br>`
      }
  }
  if(html_element == "Greynoise"){
      try{
            if(typeof json.last_seen ==='undefined'){
                article.innerHTML = `
                <h3>${html_element}</h3>                
                  <b>Message:</b> ${json.message}</br>    
            `;
            }
            else{
                article.innerHTML = `
                <h3>${html_element}</h3>               
                  <b>Last Seen:</b> ${json.last_seen}</br>
                  <b>Classification:</b> ${json.classification}</br>
                  <b>Noise:</b> ${json.noise}  <b>Riot:</b> ${json.riot}</br>    
                  <b>Message:</b> ${json.message}</br>
                  <b>link:</b> <a href="${json.link}", target="_blank">${json.link}</a>    
            `;
            }       
                        
          }
      catch{
          article.innerHTML = `<b>Unable to read from Greynoise API</b></br>`
      }
  }
      if(html_element == "Virustotal"){
          try{
                article.innerHTML = `
                <h3>${html_element}</h3>
                    <b>Name:</b> ${json.data.attributes.meaningful_name}</br>
                    <b>Type:</b> ${json.data.attributes.magic} <b>Type Description:</b> ${json.data.attributes.type_description}</br>
                    </br>
                    <b>Community Score</b></br>
                    <b>Harmless:</b> ${json.data.attributes.total_votes.harmless} <b>Malicious:</b> ${json.data.attributes.total_votes.malicious}</br>
                    </br>
                    <b>Last Analysis Stats</b></br>
                    <b>Harmless:</b> ${json.data.attributes.last_analysis_stats.harmless}</br>
                    <b>Malicious:</b> ${json.data.attributes.last_analysis_stats.malicious}</br>
                    <b>Suspicious:</b> ${json.data.attributes.last_analysis_stats.suspicious}</br>
                    <b>Timeout:</b> ${json.data.attributes.last_analysis_stats.timeout}</br>
                    <b>Undetected:</b> ${json.data.attributes.last_analysis_stats.undetected}</br> 
                    </br>
                    <b>Signature info</b></br>
                    <b>Name:</b> ${json.data.attributes.signature_info["original name"]}</br>
                    <b>Description:</b>  ${json.data.attributes.signature_info.description}</br>
                    <b>file version:</b> ${json.data.attributes.signature_info["file version"]}</br>
                    <b>Copyright:</b> ${json.data.attributes.signature_info.copyright}</br>
                    <b>Verified:</b> ${json.data.attributes.signature_info.verified}</br>
                    <b>Signers:</b> ${json.data.attributes.signature_info.signers}</br>
                    <b>Signing Date:</b> ${json.data.attributes.signature_info["signing date"]}</br>
              `;
              }
          catch{
              article.innerHTML = `<b>Unable to read or locate information from Virustotal API</b></br>`
          }
        }
        if(html_element == "URL Scan"){
            try{
                article.innerHTML = `
                <h3>${html_element}</h3>
  
                    <b>Last Scan Details</b></b>
                    <b>Domain:</b> ${json.results[0].task.domain}</br>
                    <b>Scan time:</b> ${json.results[0].task.time} <b>ScanType:</b> ${json.results[0].task.visibility} ${json.results[0].task.method}</br>
                    <b>unique IPs:</b> ${json.results[0].stats.uniqIPs} <b>Console Msgs:</b> ${json.results[0].stats.consoleMsgs}</br>
                    <b>Data Length:</b> ${json.results[0].stats.dataLength} <b>Requests:</b> ${json.results[0].stats.requests}</br>
                    </br>
                    <b>IP:</b> ${json.results[0].page.ip} <b>ASN:</b> ${json.results[0].page.asn} ${json.results[0].page.asnname} <b>Country:</b> ${json.results[0].page.country}</br>
                    <b>status code:</b> ${json.results[0].page.status} <b>Mime Type:</b> ${json.results[0].page.mimeType} <b>Server:</b> ${json.results[0].page.server}</br>
                    </br>
                    <b>Scan Link:</b> <a href="${json.results[0].result}", target="_blank">${json.results[0].result}</a></br>
                    <b>Total Scan Entries:</b> ${json.total}
  
                `;
                }
            catch{
                article.innerHTML = `<b>Unable to read from URL Scan API</b></br>`
            }
          }
          if(html_element == "Threatcrowd"){
            try{
                console.log(json.response_code);
                switch(json.response_code){
                    case '0':
                        article.innerHTML = `
                    <h3>${html_element}</h3>
                    No results from threatcrowd
                    `;
                    break;
                    case '1':
                        article.innerHTML = `
                        <h3>${html_element}</h3>
                        `; 
                        json.resolutions.forEach(element =>{
                            const body = document.createElement('li');
                            body.className= "text";
                            body.innerHTML=`
                            <b>Domain:</b> ${element.domain} 
                            <b>Last Resolved:</b> ${element.last_resolved} 
                             `
                            article.appendChild(body);
                            });
                    }
                }
            catch{
                article.innerHTML = `<b>Unable to read from Threatcrowd API</b></br>`
            }
          }

  textarea.appendChild(article);
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
