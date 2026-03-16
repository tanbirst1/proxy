export default {
 async fetch(request) {

  const target = "https://animes4all.rpmvid.com/";

  const res = await fetch(target, {
   headers: {
    "User-Agent": request.headers.get("User-Agent")
   }
  });

  let html = await res.text();


/* ---------- EASYLIST DOMAIN BLOCK ---------- */

const blockedDomains = [
"doubleclick.net",
"googlesyndication.com",
"adservice.google.com",
"propellerads.com",
"popads.net",
"adsterra.com",
"exoclick.com"
];

blockedDomains.forEach(domain=>{
 const regex = new RegExp(`<[^>]+${domain}[^>]*>.*?<\\/[^>]+>`, "gi");
 html = html.replace(regex,"");
});


/* ---------- EASYLIST STYLE CSS FILTER ---------- */

const adSelectors = [
".ads",
".ad-container",
".ad-banner",
"#ads",
".popads",
".advertisement",
".banner-ad",
".adsbox"
];

adSelectors.forEach(sel=>{
 const regex = new RegExp(`<[^>]+class=["'][^"']*${sel.replace(".","")}[^"']*["'][^>]*>.*?<\\/[^>]+>`, "gi");
 html = html.replace(regex,"");
});


/* ---------- REMOVE IFRAMES ---------- */

html = html.replace(/<iframe[^>]*>.*?<\/iframe>/gi,"");


/* ---------- REMOVE AD SCRIPTS ---------- */

html = html.replace(/<script[^>]+src=["'][^"']*(ads|pop|banner)[^"']*["'][^>]*><\/script>/gi,"");


/* ---------- INJECT CLIENT BLOCKER ---------- */

const blocker = `
<script>
(function(){
const blocked=["doubleclick","googlesyndication","popads","propeller"];

const open=window.open;
window.open=function(url){
 if(!url)return null;
 if(blocked.some(d=>url.includes(d))) return null;
 return open.apply(this,arguments);
};

document.addEventListener("click",e=>{
 const a=e.target.closest("a");
 if(a && a.href==="#"){
  e.preventDefault();
  e.stopImmediatePropagation();
 }
},true);

})();
</script>
`;

html = html.replace("</body>", blocker + "</body>");

return new Response(html,{
 headers:{ "content-type":"text/html;charset=UTF-8" }
});

 }
  }
