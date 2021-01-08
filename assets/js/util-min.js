class FWAjaxRQ{constructor(e){this.request=e}onloaded(){this.status>=200&&this.status<400?this.options.hasOwnProperty("success")&&this.options.success(this.response):this.options.hasOwnProperty("fail")&&this.options.fail(this.response),this.options.hasOwnProperty("always")&&this.options.always(this.response)}onfailed(){this.options.hasOwnProperty("fail")&&this.options.fail(this.response),this.options.hasOwnProperty("always")&&this.options.always(this.response)}done(e){return this.request.options.success=e,this}fail(e){return this.request.options.fail=e,this}always(e){return this.request.options.always=e,this}}var framework={makeQString:function(e){let t="",o="";for(var n in e)e.hasOwnProperty(n)&&(t+=o+encodeURI(n+"="+e[n]),o="&");return t},ajax:function(e,t){let o=new XMLHttpRequest,n=t.hasOwnProperty("method")?t.method:"GET",a=t.hasOwnProperty("data")?"object"==typeof t.data?framework.makeQString(t.data):t.data:"",i=t.hasOwnProperty("type")?t.type:""!==a?"application/x-www-form-urlencoded; charset=UTF-8":"text/plain; charset=UTF-8",r=new FWAjaxRQ(o);return o.options=t,o.open(n,e,!t.hasOwnProperty("async")||t.async),o.setRequestHeader("Content-Type",i),o.onload=r.onloaded,o.onerror=r.onfailed,o.send(a),r},getJSON:function(e,t,o){var n=new XMLHttpRequest;n.open("GET",e,!0),n.setRequestHeader("Accept","application/json"),n.onload=function(){this.status>=200&&this.status<400?t(JSON.parse(this.response)):o(this)},n.onerror=function(){o(this)},n.send()},mktoggle:function(e,t){return'<i class="'+e+" fas fa-toggle-"+(t?"on":"off")+'"></i>'},tick:function(e){return framework.mktoggle("",e)},toggle:function(e){fwdom.toggleClass([e],["fa-toggle-off","fa-toggle-on"])},buildFWLink:function(){let e=base;return arguments.forEach((function(t){""!==e&&(e+="/"+t)})),e+"/"},dotoggle:function(e,t,o,n){fwdom.stop(e);let a=t.classList;if(!a.contains("fadis"))if(a.contains("htick")){const e=t.nextElementSibling;e.value=1==e.value?0:1,framework.toggle(t)}else{let e=t.closest("[data-id]");e instanceof jQuery&&(e=e[0]),framework.ajax(framework.buildFWLink("ajax/toggle",o,e.getAttribute("data-id"),n),{method:putorpatch}).done((function(){framework.toggle(t)})).fail((function(e){fwdom.alert("<h3>Toggle failed</h3>"+e.responseText)}))}},deletebean:function(e,t,o,n,a,i=""){fwdom.stop(e),""===i&&(i="this "+o),fwdom.confirm("Are you sure you you want to delete "+i+"?",(function(e){e&&framework.ajax(framework.buildFWLink("ajax/bean",o,n),{method:"DELETE"}).done(a).fail((function(e){fwdom.alert("<h3>Delete failed</h3>"+e.responseText)}))}))},editcall:function(e){return framework.ajax(framework.buildFWLink("ajax",e.op,e.bean,e.pk,e.name),{method:putorpatch,data:{value:e.value}})},removeNode:function(e){var t=[e];if(e.hasAttribute("rowspan")){let o=parseInt(e.getAttribute("rowspan"))-1;for(;o>0;)t[o]=t[o-1].elementSibling}for(let e of t)e.parentNode.removeChild(e)},fadetodel:function(e,t=null){e.classList.add("fader"),e.style.opacity="0",setTimeout((function(){framework.removeNode(e),null!==t&&t()}),1500)},dodelbean:function(e,t,o,n="",a=null){let i=t.closest("[data-id]");i instanceof jQuery&&(i=i[0]),framework.deletebean(e,t,o,i.getAttribute("data-id"),(function(){framework.fadetodel(i,a)}),n)},containerClick:function(e){fwdom.stop(e);const t=e.target.classList;e.data.clicks.forEach((function(o){let[n,a,i]=o;t.contains(n)&&a(e,e.target,e.data.bean,i)}))},tableClick:framework.containerClick,goFWLink:function(e,t,o,n="/"){let a=e.closest("[data-id]");a instanceof jQuery&&(a=a[0]),window.location.href=framework.buildFWLink(t,o,a.getAttribute("data-id"),n)},goedit:function(e,t,o){framework.goFWLink(t,"admin/edit",o)},goLink:function(e){window.location.href=e.target.getAttribute("href")},goview:function(e,t,o){framework.goFWLink(t,"admin/view",o)},beanCreate:function(e,t,o,n){framework.ajax(framework.buildFWLink("ajax/bean",e),{method:"POST",data:t}).done(o).fail((function(t){fwdom.alert("<h3>Failed to create new "+e+"</h3>"+t.responseText)})).always((function(){document.getElementById(n).disabled=!1}))},addMore:function(e){fwdom.stop(e);const t=document.getElementById("mrow"),o=t.previousElementSibling.cloneNode(!0);for(var n of o.getElementsByTagName("input"))"checkbox"==n.getAttribute("type")||"radio"==n.getAttribute("type")?n.checked=!1:n.value="";for(n of o.getElementsByTagName("textarea"))n.innerHTML="";for(n of o.getElementsByTagName("option"))n.selected=!1;for(n of o.getElementsByTagName("select"))n.children[0].selected=!0;t.parentNode.insertBefore(o,t)},easeInOut:function(e,t,o,n,a){return Math.ceil(e+Math.pow(1/o*n,a)*(t-e))},doBGFade:function(e,t,o,n,a,i,r){e.bgFadeInt&&window.clearInterval(e.bgFadeInt);let s=0;e.bgFadeInt=window.setInterval((function(){e.css("backgroundcolor","rgb("+framework.easeInOut(t[0],o[0],a,s,r)+","+framework.easeInOut(t[1],o[1],a,s,r)+","+framework.easeInOut(t[2],o[2],a,s,r)+")"),s+=1,s>a&&(e.css("backgroundcolor",n),window.clearInterval(e.bgFadeInt))}),i)}};
//# sourceMappingURL=util-min.js.map