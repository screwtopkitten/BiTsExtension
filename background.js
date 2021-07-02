
console.log("Background running")

chrome.runtime.onMessage.addListener(receiver);

window.thing = 'this is bad code';

function receiver(request, sender, sendResponse){
    console.log(request);
    thing = request.text;
}

async function getJson(file){
    const response = await fetch(file);
    const data = await response.json();
    return data;
}

async function setup(){
const menuitems = await getJson('menuitems.json');
menuitems.forEach(entry =>{
    chrome.contextMenus.create({
        "id": entry.id,
        "title": entry.title,
        "parentId": entry.parentId,
        "contexts": ["selection", "link", "image", "video", "audio"]
    });
});
}

// create a context menu
const mainmenu =[
    { "id": "OSINT", "title": "OSINT","contexts": ["selection", "link", "image", "video", "audio"]}
];

console.log(mainmenu);
mainmenu.forEach(entry =>{
    chrome.contextMenus.create(entry);
});

const menutopics =[
    { "id": "IP", "title": "IP", "parentId": "OSINT","contexts": ["selection", "link", "image", "video", "audio"]},
    { "id": "Domain", "title": "Domain", "parentId": "OSINT","contexts": ["selection", "link", "image", "video", "audio"]},
    { "id": "Hash", "title": "Hash", "parentId": "OSINT","contexts": ["selection", "link", "image", "video", "audio"]},
    { "id": "URL", "title": "URL", "parentId": "OSINT", "contexts": ["selection", "link", "image", "video", "audio"]}

    
];
    console.log(menutopics)
    menutopics.forEach(entry =>{
        chrome.contextMenus.create(entry);
    });

setup();

// create empty artifact variable
var artifact = "";

function unsanitizeArtifact(artifact) {
    while(artifact.includes("[.]")) {
        artifact = artifact.replace("[.]", ".");
    }

    if(artifact.includes("hxxp://")) {
        artifact = artifact.replace("hxxp://", "http://");
    }

    if(artifact.includes("hxxps://")) {
        artifact = artifact.replace("hxxps://", "https://");
    }
    return artifact;
}


async function urlPicker(urls, text){
    let url_items = await getJson('menuitems.json');
    let url = url_items.find(obj => obj.id === urls);
    let address = url.URL + text;
    console.log(address);
    chrome.tabs.create({url: address});
}
/*
 * The click event listener: 
 * where we perform the approprate action 
 * given the ID of the menu item that was clicked
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // identify context type and strip leading and trailing spaces
    console.log(info);
    if (info.selectionText) {
        artifact = String(info.selectionText).trim();
    } else if (info.linkUrl) {
        var link = new URL(info.linkUrl);
        artifact = link.host;
    } else if (info.srcUrl) {
        var src = new URL(info.srcUrl);
        artifact = src.host;
    }

    // unsanitize artifact if it is secured against clicking
    artifact = unsanitizeArtifact(artifact);

    urlPicker(info.menuItemId, artifact);
    
});
