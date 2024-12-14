function prn(something){
  console.log(something)
}

function injectedFunction() {
  console.log(document.getElementsByClassName("adsbygoogle"));
  for (var i of document.getElementsByClassName("adsbygoogle")) {
    i.remove();
  }
  setTimeout(injectedFunction, 2500);
}

// function setScroll() {
//   function clearAd(){
//     for (var i of document.getElementsByClassName("adsbygoogle")) {
//       i.remove();
//     }
//   }
//   document.addEventListener("scroll", (e)=>{
//     console.log("hi")
//     setTimeout(clearAd, 500);
//   })
// }

function non_rec() {
  console.log(document.getElementsByClassName("adsbygoogle"));
  for (var i of document.getElementsByClassName("adsbygoogle")) {
    i.remove();
  }
}

var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?ust\.space\.com/;
chrome.tabs.onUpdated.addListener((tabId, info) => {
  // ...check the URL of the active tab against our pattern and...
  chrome.tabs.get(tabId).then((tab) =>{
    if (tab.url.startsWith("https://ust.space/")) {
        if (info.status === "complete"){
          chrome.scripting.executeScript({
            target : {tabId : tab.id},
            func : prn,
            args: ["Finished loading"]
          });
          chrome.scripting.executeScript({
            target : {tabId : tab.id},
            func : injectedFunction,
          });
        }
        else {
          chrome.scripting.executeScript({
            target : {tabId : tab.id},
            func : non_rec,
          });
        }
    }
  })
});
