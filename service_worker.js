/**
 * Cleans up all divs with class "adsbygoogle"
 * @returns number of matching divs before cleanup
 */
function cleanUp() {
  let divs = document.getElementsByClassName("adsbygoogle");
  // count = Math.ceil([].slice.call(divs).length/10)
  for (var i of divs) {
    i.remove();
  }
  return divs.length;
}

/**
 * Removes padding from the document (leftover artifacts from ads)
 */
function resetStyle(){
  document.body.style = "padding: 0px 0px 0px;"
}

var sz = 10;
var run = true;

/**
 * starts ad removal when tab is active
 */
chrome.tabs.onActivated.addListener((object)=>{
  chrome.tabs.get(object.tabId).then((tab)=>{
    if (tab.url.startsWith("https://ust.space/")){
      run = true
      removeAd(tab.id);
    }
  })
})

chrome.tabs.onUpdated.addListener((tabId, info) => {
  chrome.tabs.get(tabId).then((tab) =>{
    if (tab.url.startsWith("https://ust.space/")) {
        if (info.status === "complete"){
          setTimeout(()=>{removeAd(tabId, false, 5)}, 100);
          chrome.scripting.executeScript({
            target : {tabId : tabId},
            func : cleanUp,
          })
        }
        chrome.scripting.executeScript({
          target : {tabId : tabId},
          func : resetStyle,
        })
    }
  })
});

/**
 * listener for tab close event
 */
chrome.tabs.onRemoved.addListener((object)=>{
  // query all tabs and stop script if not open
  if (run){
    run = false 
    chrome.tabs.query({}, (allTabs)=>{ 
      for (var t of allTabs){
        if (object.tabId === t.id){
          global.run = true
        }
      }
    })
  }
  if (run){
    chrome.tabs.get(object.tabId).then((tab)=>{
      if (tab.url.startsWith("https://ust.space/")){
        global.run = false;
      }
    })
  }
})

/**
 * Inject Ad removal code 
 * @param {*} tabId tab id of the tab to inject the code into
 * @param {boolean} [nonstop=true] [optional, default -- `true`] set to false to allow controlling number of function call
 * @param {number} [repetitions=10] [optional, default -- `10`, no effect when `nonstop` = `true`] number of repetitions
 * @param {number} [interval=2500] [optional, default -- `2500`, no effect when `nonstop` = `true`] repetition interval in milliseconds
 */
function removeAd(tabId, nonstop = true, repetitions = 10, interval = 2500){
  // query all tabs and stop script if not open
  if (run){
    // run = false 
    chrome.tabs.query({active: true}, (allTabs)=>{ 
      // for (var t of allTabs){
      //   if (tabId === t.id){
      //     run = true
      //   }
      // }
      if (allTabs[0].id != tabId){
        return
      }
    })
  }
  
  if (run){
    chrome.scripting.executeScript({
      target : {tabId : tabId},
      func : cleanUp,
    }).then((res)=>{
      sz = res[0].result;
      console.log(sz)
    }).catch((e)=>{
      global.run = false;
      console.error(e)
    });

    if (nonstop){
      if (sz > 0){
        setTimeout(()=>{removeAd(tabId)}, 2500)
      } else {
        setTimeout(()=>{removeAd(tabId)}, 10000)
      }
    }
    else if (repetitions > 1) {
      setTimeout(()=>{removeAd(tabId, nonstop, repetitions-1, interval)}, interval)
    }
  }
}