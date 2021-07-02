
  let urls = [
    {
      "element": '#feed-threatpost',
      "url": 'https://threatpost.com/feed'
    },
    {
      "element": '#feed-isc',
      "url": 'https://isc.sans.edu/rssfeed.xml'
    },
    {
      "element": '#feed-hackerone',
      "url": 'https://www.hackerone.com/blog.rss'
    },
    {
      "element": '#feed-portswigger',
      "url": 'https://portswigger.net/daily-swig/rss'
    }
    
    
  ];
  

  const date = new Date();
  document.querySelector('#date').innerHTML = date.toDateString();
    
  urls.forEach(entry =>{
    const textarea = document.querySelector(entry.element);
    feednami.load(entry.url)
    .then(feed => {
      textarea.value = ''
      console.log(feed);
      for(let entry of feed.entries){
          //create a list element
          let article = document.createElement('article');
          //add HTML content to list items
          article.innerHTML = `<h3>${entry.title}</h3>${entry.summary}</br></br><a href="${entry.link}" target="_blank" class="newslink">Read Full Article</a>`;
          //append HTML content to list 
          textarea.appendChild(article);
      }
    });
  });


