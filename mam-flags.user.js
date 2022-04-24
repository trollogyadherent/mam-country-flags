// ==UserScript==
// @name        MaM Flags
// @namespace   Violentmonkey Scripts
// @match       https://www.myanonamouse.net/*
// @grant       none
// @version     0.4
// @author      jack
// @description MaM userscript adding imageboard-like country flags next to user links
// ==/UserScript==


/************************/
/* CONFIG */
/**/
/**/ /* How often should the script update site elements? (milliseconds) (default: 2000) */
/**/ var flagUpdateTime = 2000;
/**/
/**/ /* Size of the flags, applied only with non-chan flags (default: 16) */
/**/ var flagWidth = 16;
/**/
/**/ /* On which side of the username should the flags be displayed? 'right' / 'left' (default: 'right') */
/**/ var flagSide = 'right';
/**/
/**/ /* Space between flag and username (default: 5) */
/**/ var flagPadding = 5;
/**/
/**/ /* 4chan style flags (instead of MaM flag svg's, 4chan flag images are used) (default: false) */
/**/ var chan_style = false;
/**/
/**/ /* Show on hover, hide otherwise (default: false) */
/**/ var show_on_hover = false;
/**/
/**/ /* Show while holding specified key, hide otherwise (default: false) */
/**/ var show_on_key = false;
/**/
/**/ /* Key code to show flags (find them here: https://keycode.info/for/control) (default: 17 (the left control key)) */
/**/ var show_key_code = 17;
/**/
/**/ /* Image url for unknown flag (default: 'https://cdn.myanonamouse.net/imagebucket/185207/unknown_flag_16.png') */
/**/ var unknown_flag_url = 'https://cdn.myanonamouse.net/imagebucket/185207/xx.gif';
/**/
/************************/

/************************/
/* Don't touch if you don't know what this does */
/**/ 
/**/ /* How many url's to fetch in one batch */
/**/ var fetchNumber = 5;
/**/ 
/**/ /* How long to wait between each batch */
/**/ var fetchWait = 1000;
/**/ 
/**/ /* Url of the "loading flag" */
/**/ var loading_flag_url = 'https://cdn.myanonamouse.net/imagebucket/185207/flag_loading.png';
/**/ 
/**/ /* Json with usernames and corresponding flags */
/**/ var storageCache = {};
/**/ 
/**/ /* How long should we keep that json? */
/**/ var storageValidityTime = 10 * 86400; // 86400 is the number of seconds in one day (24h). The flag url cache expires after 10 days
/**/ 
/**/ /* 4chan flag tileset map (something like a spritesheet) */
/**/ var flag_offset_dict = {'ad': {'x': 0, 'y': 0}, 'ae': {'x': 16, 'y': 0}, 'af': {'x': 32, 'y': 0}, 'ag': {'x': 48, 'y': 0}, 'ai': {'x': 64, 'y': 0}, 'al': {'x': 80, 'y': 0}, 'am': {'x': 96, 'y': 0}, 'an': {'x': 112, 'y': 0}, 'ao': {'x': 128, 'y': 0}, 'aq': {'x': 144, 'y': 0}, 'ar': {'x': 160, 'y': 0}, 'as': {'x': 176, 'y': 0}, 'at': {'x': 192, 'y': 0}, 'au': {'x': 208, 'y': 0}, 'aw': {'x': 224, 'y': 0}, 'ax': {'x': 240, 'y': 0}, 'az': {'x': 0, 'y': 11}, 'ba': {'x': 16, 'y': 11}, 'bb': {'x': 32, 'y': 11}, 'bd': {'x': 48, 'y': 11}, 'be': {'x': 64, 'y': 11}, 'bf': {'x': 80, 'y': 11}, 'bg': {'x': 96, 'y': 11}, 'bh': {'x': 112, 'y': 11}, 'bi': {'x': 128, 'y': 11}, 'bj': {'x': 144, 'y': 11}, 'bl': {'x': 160, 'y': 11}, 'bm': {'x': 176, 'y': 11}, 'bn': {'x': 192, 'y': 11}, 'bo': {'x': 208, 'y': 11}, 'bq': {'x': 224, 'y': 11}, 'br': {'x': 240, 'y': 11}, 'bs': {'x': 0, 'y': 22}, 'bt': {'x': 16, 'y': 22}, 'bv': {'x': 32, 'y': 22}, 'bw': {'x': 48, 'y': 22}, 'by': {'x': 64, 'y': 22}, 'bz': {'x': 80, 'y': 22}, 'ca': {'x': 96, 'y': 22}, 'catalonia': {'x': 112, 'y': 22}, 'cc': {'x': 128, 'y': 22}, 'cd': {'x': 144, 'y': 22}, 'cf': {'x': 160, 'y': 22}, 'cg': {'x': 176, 'y': 22}, 'ch': {'x': 192, 'y': 22}, 'ci': {'x': 208, 'y': 22}, 'ck': {'x': 224, 'y': 22}, 'cl': {'x': 240, 'y': 22}, 'cm': {'x': 0, 'y': 33}, 'cn': {'x': 16, 'y': 33}, 'co': {'x': 32, 'y': 33}, 'cr': {'x': 48, 'y': 33}, 'cs': {'x': 64, 'y': 33}, 'cu': {'x': 80, 'y': 33}, 'cv': {'x': 96, 'y': 33}, 'cw': {'x': 112, 'y': 33}, 'cx': {'x': 128, 'y': 33}, 'cy': {'x': 144, 'y': 33}, 'cz': {'x': 160, 'y': 33}, 'de': {'x': 176, 'y': 33}, 'dj': {'x': 192, 'y': 33}, 'dk': {'x': 208, 'y': 33}, 'dm': {'x': 224, 'y': 33}, 'do': {'x': 240, 'y': 33}, 'dz': {'x': 0, 'y': 44}, 'ec': {'x': 16, 'y': 44}, 'ee': {'x': 32, 'y': 44}, 'eg': {'x': 48, 'y': 44}, 'eh': {'x': 64, 'y': 44}, 'en': {'x': 80, 'y': 44}, 'er': {'x': 96, 'y': 44}, 'es': {'x': 112, 'y': 44}, 'et': {'x': 128, 'y': 44}, 'eu': {'x': 144, 'y': 44}, 'ev': {'x': 160, 'y': 44}, 'fi': {'x': 176, 'y': 44}, 'fj': {'x': 192, 'y': 44}, 'fk': {'x': 208, 'y': 44}, 'fm': {'x': 224, 'y': 44}, 'fo': {'x': 240, 'y': 44}, 'fr': {'x': 0, 'y': 55}, 'ga': {'x': 16, 'y': 55}, 'gb': {'x': 32, 'y': 55}, 'gd': {'x': 48, 'y': 55}, 'ge': {'x': 64, 'y': 55}, 'gf': {'x': 80, 'y': 55}, 'gg': {'x': 96, 'y': 55}, 'gh': {'x': 112, 'y': 55}, 'gi': {'x': 128, 'y': 55}, 'gl': {'x': 144, 'y': 55}, 'gm': {'x': 160, 'y': 55}, 'gn': {'x': 176, 'y': 55}, 'gp': {'x': 192, 'y': 55}, 'gq': {'x': 208, 'y': 55}, 'gr': {'x': 224, 'y': 55}, 'gs': {'x': 240, 'y': 55}, 'gt': {'x': 0, 'y': 66}, 'gu': {'x': 16, 'y': 66}, 'gw': {'x': 32, 'y': 66}, 'gy': {'x': 48, 'y': 66}, 'hk': {'x': 64, 'y': 66}, 'hm': {'x': 80, 'y': 66}, 'hn': {'x': 96, 'y': 66}, 'hr': {'x': 112, 'y': 66}, 'ht': {'x': 128, 'y': 66}, 'hu': {'x': 144, 'y': 66}, 'id': {'x': 160, 'y': 66}, 'ie': {'x': 176, 'y': 66}, 'il': {'x': 192, 'y': 66}, 'im': {'x': 208, 'y': 66}, 'in': {'x': 224, 'y': 66}, 'io': {'x': 240, 'y': 66}, 'iq': {'x': 0, 'y': 77}, 'ir': {'x': 16, 'y': 77}, 'is': {'x': 32, 'y': 77}, 'it': {'x': 48, 'y': 77}, 'je': {'x': 64, 'y': 77}, 'jm': {'x': 80, 'y': 77}, 'jo': {'x': 96, 'y': 77}, 'jp': {'x': 112, 'y': 77}, 'ke': {'x': 128, 'y': 77}, 'kg': {'x': 144, 'y': 77}, 'kh': {'x': 160, 'y': 77}, 'ki': {'x': 176, 'y': 77}, 'km': {'x': 192, 'y': 77}, 'kn': {'x': 208, 'y': 77}, 'kp': {'x': 224, 'y': 77}, 'kr': {'x': 240, 'y': 77}, 'kw': {'x': 0, 'y': 88}, 'ky': {'x': 16, 'y': 88}, 'kz': {'x': 32, 'y': 88}, 'la': {'x': 48, 'y': 88}, 'lb': {'x': 64, 'y': 88}, 'lc': {'x': 80, 'y': 88}, 'li': {'x': 96, 'y': 88}, 'lk': {'x': 112, 'y': 88}, 'lr': {'x': 128, 'y': 88}, 'ls': {'x': 144, 'y': 88}, 'lt': {'x': 160, 'y': 88}, 'lu': {'x': 176, 'y': 88}, 'lv': {'x': 192, 'y': 88}, 'ly': {'x': 208, 'y': 88}, 'ma': {'x': 224, 'y': 88}, 'mc': {'x': 240, 'y': 88}, 'md': {'x': 0, 'y': 99}, 'me': {'x': 16, 'y': 99}, 'mf': {'x': 32, 'y': 99}, 'mg': {'x': 48, 'y': 99}, 'mh': {'x': 64, 'y': 99}, 'mk': {'x': 80, 'y': 99}, 'ml': {'x': 96, 'y': 99}, 'mm': {'x': 112, 'y': 99}, 'mn': {'x': 128, 'y': 99}, 'mo': {'x': 144, 'y': 99}, 'mp': {'x': 160, 'y': 99}, 'mq': {'x': 176, 'y': 99}, 'mr': {'x': 192, 'y': 99}, 'ms': {'x': 208, 'y': 99}, 'mt': {'x': 224, 'y': 99}, 'mu': {'x': 240, 'y': 99}, 'mv': {'x': 0, 'y': 110}, 'mw': {'x': 16, 'y': 110}, 'mx': {'x': 32, 'y': 110}, 'my': {'x': 48, 'y': 110}, 'mz': {'x': 64, 'y': 110}, 'na': {'x': 80, 'y': 110}, 'nc': {'x': 96, 'y': 110}, 'ne': {'x': 112, 'y': 110}, 'nf': {'x': 128, 'y': 110}, 'ng': {'x': 144, 'y': 110}, 'ni': {'x': 160, 'y': 110}, 'nl': {'x': 176, 'y': 110}, 'no': {'x': 192, 'y': 110}, 'np': {'x': 208, 'y': 110}, 'nr': {'x': 224, 'y': 110}, 'nu': {'x': 240, 'y': 110}, 'nz': {'x': 0, 'y': 121}, 'om': {'x': 16, 'y': 121}, 'pa': {'x': 32, 'y': 121}, 'pe': {'x': 48, 'y': 121}, 'pf': {'x': 64, 'y': 121}, 'pg': {'x': 80, 'y': 121}, 'ph': {'x': 96, 'y': 121}, 'pk': {'x': 112, 'y': 121}, 'pl': {'x': 128, 'y': 121}, 'pm': {'x': 144, 'y': 121}, 'pn': {'x': 160, 'y': 121}, 'pr': {'x': 176, 'y': 121}, 'ps': {'x': 192, 'y': 121}, 'pt': {'x': 208, 'y': 121}, 'pw': {'x': 224, 'y': 121}, 'py': {'x': 240, 'y': 121}, 'qa': {'x': 0, 'y': 132}, 're': {'x': 16, 'y': 132}, 'ro': {'x': 32, 'y': 132}, 'rs': {'x': 48, 'y': 132}, 'ru': {'x': 64, 'y': 132}, 'rw': {'x': 80, 'y': 132}, 'sa': {'x': 96, 'y': 132}, 'sb': {'x': 112, 'y': 132}, 'sc': {'x': 128, 'y': 132}, 'gb-sct': {'x': 144, 'y': 132}, 'sd': {'x': 160, 'y': 132}, 'se': {'x': 176, 'y': 132}, 'sg': {'x': 192, 'y': 132}, 'sh': {'x': 208, 'y': 132}, 'si': {'x': 224, 'y': 132}, 'sj': {'x': 240, 'y': 132}, 'sk': {'x': 0, 'y': 143}, 'sl': {'x': 16, 'y': 143}, 'sm': {'x': 32, 'y': 143}, 'sn': {'x': 48, 'y': 143}, 'so': {'x': 64, 'y': 143}, 'sr': {'x': 80, 'y': 143}, 'ss': {'x': 96, 'y': 143}, 'st': {'x': 112, 'y': 143}, 'sv': {'x': 128, 'y': 143}, 'sx': {'x': 144, 'y': 143}, 'sy': {'x': 160, 'y': 143}, 'sz': {'x': 176, 'y': 143}, 'tc': {'x': 192, 'y': 143}, 'td': {'x': 208, 'y': 143}, 'tf': {'x': 224, 'y': 143}, 'tg': {'x': 240, 'y': 143}, 'th': {'x': 0, 'y': 154}, 'tj': {'x': 16, 'y': 154}, 'tk': {'x': 32, 'y': 154}, 'tl': {'x': 48, 'y': 154}, 'tm': {'x': 64, 'y': 154}, 'tn': {'x': 80, 'y': 154}, 'to': {'x': 96, 'y': 154}, 'tr': {'x': 112, 'y': 154}, 'tt': {'x': 128, 'y': 154}, 'tv': {'x': 144, 'y': 154}, 'tw': {'x': 160, 'y': 154}, 'tz': {'x': 176, 'y': 154}, 'ua': {'x': 192, 'y': 154}, 'ug': {'x': 208, 'y': 154}, 'um': {'x': 224, 'y': 154}, 'us': {'x': 240, 'y': 154}, 'uy': {'x': 0, 'y': 165}, 'uz': {'x': 16, 'y': 165}, 'va': {'x': 32, 'y': 165}, 'vc': {'x': 48, 'y': 165}, 've': {'x': 64, 'y': 165}, 'vg': {'x': 80, 'y': 165}, 'vi': {'x': 96, 'y': 165}, 'vn': {'x': 112, 'y': 165}, 'vu': {'x': 128, 'y': 165}, 'vv': {'x': 144, 'y': 165}, 'wf': {'x': 160, 'y': 165}, 'ws': {'x': 176, 'y': 165}, 'wt': {'x': 192, 'y': 165}, 'unknown': {'x': 208, 'y': 165}, 'ye': {'x': 224, 'y': 165}, 'yt': {'x': 240, 'y': 165}, 'za': {'x': 0, 'y': 176}, 'zm': {'x': 16, 'y': 176}, 'zw': {'x': 32, 'y': 176}};
/**/ 
/**/ /* The 4chan flag tileset itself */
/**/ var flag_tileset_url = 'https://cdn.myanonamouse.net/imagebucket/185207/4chan_flags.png';
/**/ 
/**/ /* How often do we save the cache to disk? */
/**/ var saveCacheToStorageInterval = 10000;
/**/ 
/************************/

function main() {
  loadCacheFromStorage();
  
  transformShoutboxFlags();
  updateFlags();
  setInterval(updateFlags, flagUpdateTime);
  setInterval(transformShoutboxFlags, flagUpdateTime);
  
  setInterval(saveCacheToStorage, saveCacheToStorageInterval);
}

function saveCacheToStorage() {
  /* Loading present cache and adding entried from it to the object that will be saved, in case multiple tabs are updating the cache */
  let jsonString = localStorage.getItem("cache");
  if (jsonString != null && jsonString.length > 0) {
    storageCachePresent = JSON.parse(jsonString);
    for (let i = 0; i < keylen(storageCachePresent); i ++) {
      if(!hasKey(storageCache, keyAtIndex(storageCachePresent, i))) {
        storageCache[keyAtIndex(storageCachePresent, i)] = elemAtIndex(storageCachePresent, i);
      }
    }
  }
  
  /* Saving the cache object as a string in localStorage */
  localStorage.setItem("cache", JSON.stringify(storageCache));
  localStorage.setItem("timestamp", Date.now());
}

function loadCacheFromStorage() {
  let savedTimestamp = localStorage.getItem("timestamp");
  if (savedTimestamp != null) {
    if (Date.now() - parseInt(savedTimestamp) > storageValidityTime) {
      return;
    }
  }
  
  let jsonString = localStorage.getItem("cache");
  if (jsonString != null && jsonString.length > 0) {
    storageCache = JSON.parse(jsonString);
  }
  console.log('storageCache:');
  console.log(storageCache);
}

/* Useful JavaScript object manipulation functions */
function keylen(obj) {
  return Object.keys(obj).length;
}

function keyAtIndex(obj, index) {
  return Object.keys(obj)[index];
}

function elemAtIndex(obj, index) {
  return obj[Object.keys(obj)[index]];
}

function indexOfElem(obj, elem) {
  for (let i = 0; i < keylen(obj); i++) {
    if (keyAtIndex(obj, i) == elem) {
      return i;
    }
  }
  return -1;
}

function hasKey(obj, key) {
  for (let i = 0; i < keylen(obj); i ++) {
    if (keyAtIndex(obj, i) == key) {
      return true;
    }
  }
  return false;
}

/* Compat with MAM+ gift all feature ?? (can't test yet) */
function stripUsername(username) {
  return username.replace(' ☑', '');
}

/* Returns true if we already have a user/flag in storageCache */
function flagInCache(username) {
  username = stripUsername(username);
  
  //return indexOfElem(storageCache, username) >= 0;
  
  for (let i = 0; i < keylen(storageCache); i ++) {
    if (keyAtIndex(storageCache, i) == username) {
      return true;
    }
  }
  return false;
}

/* Returns true if href is in the list of online users. The list is generally huge so we don't want hrefs from it */
function hrefInOnlineUsers(href) {
  return href.parentElement.classList.contains('blockBodyCon');
}

/* Returns true if the href is in the body of a forum post (we don't want these) */
function hrefInForumText(href) {
  return href.parentElement.parentElement.classList.contains('forumText');
}

/* Returns true if href is in the shoutbox */
function hrefInShoutBox(href) {
  return href.parentElement.parentElement.parentElement.parentElement.id == 'shoutbox';
}

/* Transforms a user href url into an api url */
function getApiUrlFromUserUrl(userUrl) {
  // https://www.myanonamouse.net/u/xxxxxx
  return 'https://www.myanonamouse.net/jsonLoad.php?pretty&id=' + userUrl.substring(userUrl.indexOf('/u/') + '/u/'.length)
}

/* Main logic */
function updateFlags() {
  
  /* Getting all links on the site */
  let hrefs = document.getElementsByTagName('a');
  
  /* Filtering user links, also excluding links in forum posts, online users list, and shoutbox */
  let userHrefs = [];
  for (let i = 0; i < hrefs.length; i ++) {
    let href = hrefs[i];  
    if (href.href.startsWith('https://www.myanonamouse.net/u/') && !hrefInOnlineUsers(href) && !hrefInForumText(href) && !hrefInShoutBox(href)) {
      userHrefs.push(href);
    }
  }
  
  ///console.log("MaM Flags: Found " + userHrefs.length + " user links");
  
  /* For each href, if a flag is not attached, attach a "loading flag", while waiting to get the actual info */
  for (let i = 0; i < userHrefs.length; i ++) {
    if (!flagAttached(userHrefs[i])) {
      attachFlag(userHrefs[i], loading_flag_url, "Loading...");
    }
  }
  
  /* User info is fetched in batches, to prevent being rate limited (which should not really occur now but I will keep this mechanism) */
  /* Here is just the preparation of the batches */
  let fetchBatches = [];
  let currentBatch = [];
  for (let i = 0, j = 0; i < userHrefs.length; i ++, j ++) {  
    href = userHrefs[i];
    username = stripUsername(href.innerText);
    if(flagInCache(username)) {
      if (!flagAttached(href)) {
        /* We have this username in cache AND no flag is attached to this href */
        attachFlag(href, storageCache[username]['flag'], storageCache[username]['title']);
      }
    } else {
      currentBatch.push(userHrefs[i]);
    }
    
    /* j lets us know when a url batch "is full" and we should start a new one */
    if (j == fetchNumber - 1 || i == userHrefs.length - 1) {
      j = 0;
      
      /* deepcopying currentBatch */
      let tempBatch = [];
      for (let k = 0; k < currentBatch.length; k ++) {
        tempBatch[k] = currentBatch[k];
      }
      if (tempBatch.length > 0) {
        fetchBatches.push(tempBatch);
      }
      currentBatch = [];
    }
  }
  
  /* For each href-batch... */
  for (let i = 0, fetchCounter = 0; i < fetchBatches.length; i ++) {
    /* Ignoring empty batches */
    if (fetchBatches[i].length == 0) {
      return;
    }
    
    /* ...we trigger a delayed anonymous function call that downolads the data */
    setTimeout(function() {
      /* For each href in the current batch */
      for (let j = 0; j < fetchBatches[i].length; j ++) {
        /* Getting the href element */
        let href = fetchBatches[i][j];
        /* Calling the actual thing that will perform a javascript http request to get the json */
        fetchAndAddFlagImage(href);
      }
    }, fetchWait * fetchCounter);
    fetchCounter ++;
  }
}

/* The piece of code responsible of injecting the html showing the flag */
function attachFlag(href, flagUrl, countryName) {
  /* Removing the "loading" flag, if present */
  let child_to_remove = null;
  let children = href.children;
  for (let i = 0; i < children.length; i ++) {
    if(children[i].hasAttribute('alt') && children[i].alt == 'Country: Loading...') {
      child_to_remove = children[i];
      break;
    }
  }
  if (child_to_remove != null) {
    href.removeChild(child_to_remove);
  }
  
  /* Creating the image to be attached */
  let flagImg = document.createElement('img');
  
  /* Getting the country code from its image url (https://cdn.myanonamouse.net/pic/flags/ca.svg -> ca (canada)) */
  let flag_code = flagUrl.substring(flagUrl.lastIndexOf('/') + 1, flagUrl.lastIndexOf('.'));
  
  /* If we choose to have 4chan style flags, we need to do some extra shenanigans */
  if (chan_style && hasKey(flag_offset_dict, flag_code)) {
    flagImg = document.createElement('span');
    flagImg.style.display = 'inline-block';
    flagImg.style.backgroundImage = "url('" + flag_tileset_url + "')";
    flagImg.style.background = "url('" + flag_tileset_url + "')";
    flagImg.style.backgroundPosition = "-" + flag_offset_dict[flag_code]['x'] + "px -" + flag_offset_dict[flag_code]['y'] + "px";
    flagImg.style.width = '16px';
    flagImg.style.height = '11px';
    
    if (flagSide == 'right') {
      flagImg.style.marginLeft = flagPadding + "px";
    } else {
      flagImg.style.marginRight = flagPadding + "px";
    }
  } else {
    flagImg.src = flagUrl;
    flagImg.width = flagWidth;
    
    if (flagSide == 'right') {
      flagImg.style.paddingLeft = flagPadding + "px";
    } else {
      flagImg.style.paddingRight = flagPadding + "px";
    }
  }
  
  
  flagImg.alt = 'Country: ' + countryName; 
  flagImg.title = countryName;
  
  /* If the show on hover option is active, hide flags by default, show only when user hovering with mouse over a user link */
  if (show_on_hover) {
    flagImg.style.display = 'none';
    
    href.addEventListener('mouseout', function handleMouseOut() {
      flagImg.style.display = 'none';
    });
    
    href.addEventListener('mouseover', function handleMouseOver() {
      flagImg.style.display = 'inline-block';
    });
  }
  
  /* Similar, but holding a key */
  if (show_on_key) {
    flagImg.style.display = 'none';
    
    window.addEventListener('keydown', function handleKeyDown(key) {
      if (key.keyCode == show_key_code) {
        flagImg.style.display = 'inline-block';
      }
    });
    
    window.addEventListener('keyup', function handleKeyUp(key) {
      if (key.keyCode == show_key_code) {
        flagImg.style.display = 'none';
      }
    });
  }
  
  if (flagSide == 'right') {
    href.appendChild(flagImg);
  } else {
    href.prepend(flagImg);
  }
  
  /* Adding a css class that will mark that element as having a flag */
  if (countryName != 'Loading...') {
    href.className += ' flag-attached';
  }
}

/* Returns true if a user href already contains an flag image */
function flagAttached(href) {
  if (href.classList.contains('flag-attached')) {
    return true;
  }
  
  let children = href.children;
  let flagAlreadyAttached = false;
  for (let i = 0; i < children.length; i ++) {
    if((children[i].hasAttribute('alt') && children[i].alt.startsWith('Country') && !children[i].alt.startsWith('Country: Loading...')) || (children[i].style.background.includes(flag_tileset_url))) {
      flagAlreadyAttached = true;
      break;
    }
  }
  return flagAlreadyAttached;
}

/* The thing that talks with the API */
function fetchAndAddFlagImage(href) {
  username = stripUsername(href.innerText);
  
  if (flagInCache(username)) {
    if (!flagAttached(href)) {
      /* No need to fetch anything here */
      attachFlag(href, storageCache[username]['flag'], storageCache[username]['title']);
    }
  } else {
    console.log(storageCache);
    console.log('fetching ' + username);
    fetch(getApiUrlFromUserUrl(href.href)).then(
      /* Getting the JSON */
      function (u) { return u.json(); }
    ).then(function (json) {

      if (flagAttached(href) && flagInCache(username)) {
        return;
      }
      
        let countryCode = json['country_code'];
        let countryName = json['country_name'];
        
        if (countryCode == null || countryName == null) {
          /* User has not set a country */
          attachFlag(href, unknown_flag_url, 'Unknown');
          storageCache[username] = {'flag': unknown_flag_url, 'title': 'Unknown'}
          return;
        }
      
        let flagSrc = 'https://cdn.myanonamouse.net/pic/flags/' + countryCode + '.svg';
      
        storageCache[username] = {'flag': flagSrc, 'title': countryName};
        saveCacheToStorage();
        attachFlag(href, flagSrc, 'Country: ' + countryName, countryName);

    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
  }
}

/* Transform shoutbox flags (puts the to the right and enables 4chan styling) */
function transformShoutboxFlags() {
  //return;
  /* Getting all links on the site */
  let hrefs = document.getElementsByTagName('a');
  
  /* Filtering user links, excluding every thing that is not in the shoutbox */
  let userHrefs_ = [];
  for (let i = 0; i < hrefs.length; i ++) {
    let href = hrefs[i];  
    if (href.href.startsWith('https://www.myanonamouse.net/u/') && hrefInShoutBox(href)) {
      
      /* User quotes and tags don't have flags, filtering them too */
      let foundAttachedClass = false;
      for (let j = 0; j < href.children.length; j ++) {
        if (href.children[j].classList.contains('flag-attached')) {
          foundAttachedClass = true;
          break;
        }
      }
      if (href.previousSibling.textContent == 'More Options' && !flagAttached(href) && !foundAttachedClass) {
        userHrefs_.push(href);
      }
    }
  }
  
  for (let i = 0; i < userHrefs_.length; i ++) {
    if (flagAttached(userHrefs_[i]) || flagAttached(userHrefs_[i].parentElement)) {
      continue;
    }
    let imgElem = userHrefs_[i].getElementsByTagName('span')[0].getElementsByTagName('img')[0];
    if (imgElem != null) {
      let parentSpan = imgElem.parentElement;
      let flagUrl = imgElem.src;
      let countryName = imgElem.title;
      parentSpan.removeChild(imgElem);
      attachFlag(parentSpan, flagUrl, countryName);
    } else {
      let parentElement = userHrefs_[i];//.parentElement;
      attachFlag(parentElement, unknown_flag_url, 'Unknown');
    }
  }
}

/* Triggering main function after page has loaded */
window.addEventListener('load', function() {
    main();
}, false);


window.saveCacheToStorage = saveCacheToStorage
