!function(window,Object,Array){var NativeFunction,Rprototype,cookie,cookieDesc,cookieIndex,cookiePair,cookiePairs,elPrototype,innerHTML,nativeAppendChild,nativeAtob,nativeCreateContextualFragment,nativeEval,nativeExecScript,nativeInsertAdjacentElement,nativeInsertAdjacentHTML,nativeInsertBefore,nativeLocalStorage,nativeReplaceChild,nativeSessionStorage,nativeSetImmediate,nativeSetInterval,nativeSetTimeout,nativeWrite,nativeWriteln,outerHTML,valIndex,win,winOrigin,taintedStrings=[],origin=window.location.origin||window.location.protocol+"//"+window.location.host,blacklistRe=/\{\{|\}\}|&#?\w{2,7};?|\b(?:on[a-z]+\W*?=|(?:(?:d\W*a\W*t\W*a\W*?)|(?:v\W*b|j\W*a\W*v\W*a)\W*s\W*c\W*r\W*i\W*p\W*t\W*?):)/gi,getType=function(input){var toString=Object.prototype.toString;if("string"==typeof input||"[object String]"===toString.call(input))return"string";if("[object Object]"===toString.call(input))return"object";try{if(Array.isArray(input))return"array"}catch(e){if("[object Array]"===toString.call(input))return"array"}return"other"},toPlain=function(input){var encURI=window.encodeURI,decURI=window.decodeURI,encURIComp=window.encodeURIComponent,decURIComp=window.decodeURIComponent,depth=0,revMethod=[],deEncode=function(input){var es,eusExtend,origInput,ues;try{for(;decURIComp(input)!==input;)origInput=decURIComp(input),decURI(input)===origInput?(input=decURI(input),revMethod.push(encURI)):(input=origInput,revMethod.push(encURIComp)),++depth}catch(e){if("function"==typeof window.escape&&"function"==typeof window.unescape?(es=window.escape,ues=window.unescape):(eusExtend=function(func){var charsetRe=/(?:[\x00-\x24]|[\x26-\x7f]|[^\x00-\x7f]|%(?:40|2[b-f]|2[0-9]|3[a-e]|[57][b-d]))+/gi;return function(string){return string=string.match(charsetRe),string?func(string.join("")):null}},es=eusExtend(encURIComp),ues=eusExtend(decURIComp)),input=ues(input),revMethod.push(es),++depth,ues(input)!==input)return deEncode(input)}return input};return input=deEncode(input),{output:input,depth:depth,revMethod:revMethod}},reEncode=function(input,depth,revMethod){for(;depth--;)input=revMethod[depth](input);return input},sanitize=function(input){var origInput,hasOwnProperty,index,item,keys,prop,propSanitize,whitelistRe=/[^\w\s\/\^+=$#@!&*|,;:.?%()\[\]{}\-]/g,isModified=!1;if("string"===getType(input))/\S/.test(input)&&(/%\w{2}/.test(input)&&(origInput=toPlain(input),input=origInput.output),whitelistRe.test(input)&&(input=input.replace(whitelistRe,""),isModified=!0),blacklistRe.test(input)&&(input=input.replace(blacklistRe,""),isModified=!0),taintedStrings.push(input),origInput&&(input=reEncode(input,origInput.depth,origInput.revMethod)));else if("object"===getType(input)){propSanitize=function(prop){var value=sanitize(input[prop]);value!==!1&&(input[prop]=value,isModified=!0)};try{keys=Object.getOwnPropertyNames(input);for(index in keys)propSanitize(keys[index])}catch(e){hasOwnProperty=Object.prototype.hasOwnProperty;for(prop in input)hasOwnProperty.call(input,prop)&&propSanitize(prop)}}else if("array"===getType(input))for(index=input.length;index--;)item=sanitize(input[index]),item!==!1&&(input[index]=item,isModified=!0);return!!isModified&&input},parseUrl=function(url){var parser;try{url=new URL(url)}catch(e){parser=document.createElement("a"),parser.href=url,url=parser}return url},auditUrl=function(urlObj){var hash,paramPair,paramIndex,paramModified,pathname,sanParam,search,subIndex,isModified=!1;if(pathname=sanitize(urlObj.pathname),pathname!==!1&&(urlObj.pathname=pathname,isModified=!0),search=urlObj.search){for(paramModified=!1,search=search.slice(1).split("&"),paramIndex=search.length;paramIndex--;){if(paramPair=search[paramIndex].split("="),paramPair.length<3)sanParam=sanitize(paramPair[0]),sanParam!==!1&&(paramPair[0]=sanParam,paramModified=!0),paramPair[1]&&(sanParam=sanitize(paramPair[1]),sanParam!==!1&&(paramPair[1]=sanParam,paramModified=!0));else for(subIndex=paramPair.length;subIndex--;)sanParam=sanitize(paramPair[subIndex]),sanParam!==!1&&(paramModified=!0,paramPair[subIndex]=sanParam);paramModified&&(search[paramIndex]=paramPair.join("="))}paramModified&&(urlObj.search=search.join("&"),isModified=!0)}return hash=urlObj.hash.slice(1),hash&&(hash=sanitize(hash),hash!==!1&&(urlObj.hash=hash,isModified=!0)),!!isModified&&urlObj.href},addListener=function(){return window.addEventListener?function(target,equiv,evName,callback){var nativeAddEventListener="window"===equiv?window.addEventListener:document.addEventListener;nativeAddEventListener.call(target,evName,callback)}:function(target,_,evName,callback){var domLoadedCallback;"DOMContentLoaded"===evName?(domLoadedCallback=function(){"interactive"===target.readyState&&callback()},target.attachEvent("onreadystatechange",domLoadedCallback)):target.attachEvent("on"+evName,callback)}}(),defineProperties=function(obj,properties){for(var origValue,prop,index=properties.length;index--;)prop=properties[index],origValue=prop.value,prop=prop.isDefault?{value:origValue,enumerable:!0,writable:!0,configurable:!0}:prop;try{Object.defineProperties(obj,properties)}catch(e){}},auditWinName=function(winObj){var origName=winObj.name;defineProperties(winObj,{name:{get:function(){return origName},set:function(val){var sanVal=sanitize(val);origName=sanVal!==!1?sanVal:val},enumerable:!0}}),winObj.name=origName},auditWin=function(winObj){var auditFrames,name,referrer,title,onhashchangeFn=function(){var hash=sanitize(winObj.location.hash.slice(1));hash!==!1&&(winObj.location.hash=hash)},onmessageFn=function(ev){var winOrigin,data,index,port,ports=ev.ports;try{winOrigin=ev.origin||ev.originalEvent.origin}catch(e){}if(winOrigin!==origin&&(data=sanitize(ev.data),data!==!1&&defineProperties(ev,{data:{value:data,isDefault:!0}}),ports))for(index=ports.length;index--;)port=ports[index],port.onmessage=onmessageFn};addListener(winObj,"window","hashchange",onhashchangeFn),addListener(winObj,"window","message",onmessageFn),auditUrl(winObj.location),name=winObj.name,name&&(name=sanitize(name),name!==!1&&(winObj.name=name)),title=sanitize(winObj.document.title),title!==!1&&(winObj.document.title=title),referrer=winObj.document.referrer,referrer&&(referrer=auditUrl(parseUrl(referrer)),referrer!==!1&&defineProperties(winObj.document,{referrer:{value:referrer,isDefault:!0}})),auditFrames=function(){var fIndex,currentFrame,getElementsByTagName=document.getElementsByTagName,frames=getElementsByTagName.call(winObj.document,"iframe"),auditFrame=function(currentFrame){var fWindow;try{fWindow=currentFrame.contentWindow,currentFrame.src!==fWindow.location.href&&(auditWinName(fWindow),auditWin(fWindow))}catch(e){}};for(fIndex=frames.length;fIndex--;)currentFrame=frames[fIndex],function(currentFrame){addListener(currentFrame,"document","load",function(){auditFrame(currentFrame)})}(currentFrame)},addListener(winObj.document,"document","DOMContentLoaded",auditFrames)},getPrototypeOf=function(){try{return Object.getPrototypeOf.apply(this,arguments)}catch(e){}},guardWrite=function(nativeWrite){return function(str){var el,els;isSafeArg(str)?nativeWrite.call(document,str):(str=toSafeStr(str),els=document.getElementsByTagName("*"),el=els[els.length-1],el.parentElement.innerHTML=str)}},some=Array.prototype.some||function(fn){for(var index=this.length;index--;)if(fn(this[index]))return!0;return!1},isSafeArg=function(){var validate=function(arg){var isTainted=function(taint){return isNaN(taint)&&taint.length>6&&arg.indexOf(taint)!==-1};return arg=toPlain(arg).output,some.call(taintedStrings,isTainted)};return!some.call(arguments,validate)},guardSink=function(sinkFn){return function(){var args;if(isSafeArg.apply(null,arguments))try{return sinkFn.apply(this,arguments)}catch(e){return args=Array.prototype.slice.call(arguments),sinkFn(args)}}},isUnsafeNode=function(node){var childApplets,childEmbeds,childFrames,childIframes,childObjects,childScripts,nodeName=node.nodeName;try{if(node.hasChildNodes()){if(childApplets=node.getElementsByTagName("applet"),childApplets.length>0)return some.call(childApplets,isUnsafeNode);if(childEmbeds=node.getElementsByTagName("embed"),childEmbeds.length>0)return some.call(childEmbeds,isUnsafeNode);if(childFrames=node.getElementsByTagName("frame"),childFrames.length>0)return some.call(childFrames,isUnsafeNode);if(childIframes=node.getElementsByTagName("iframe"),childIframes.length>0)return some.call(childIframes,isUnsafeNode);if(childObjects=node.getElementsByTagName("object"),childObjects.length>0)return some.call(childObjects,isUnsafeNode);if(childScripts=node.getElementsByTagName("script"),childScripts.length>0)return some.call(childScripts,isUnsafeNode)}}catch(e){}return"SCRIPT"===nodeName?!isSafeArg(node.text)||!isSafeArg(node.src):"OBJECT"===nodeName?!isSafeArg(node.data):"IFRAME"===nodeName||"FRAME"===nodeName||"EMBED"===nodeName?!(isSafeArg(node.src)&&(!node.srcdoc||isSafeArg(node.srcdoc))):"APPLET"===nodeName?!!(!isSafeArg(node.code)||node.codebase&&!isSafeArg(node.codebase)||node.archive&&!isSafeArg(node.archive)):void 0},toSafeNode=function(node){var attrib,attribName,attribs,index;node.innerHTML="",node.hasAttribute("src")&&node.removeAttribute("src"),node.hasAttribute("srcdoc")&&node.removeAttribute("srcdoc"),node.hasAttribute("data")&&node.removeAttribute("data"),node.hasAttribute("code")&&node.removeAttribute("code"),node.hasAttribute("archive")&&node.removeAttribute("archive"),node.hasAttribute("codebase")&&node.removeAttribute("codebase"),node.hasAttribute("object")&&node.removeAttribute("object");try{if(node.hasAttributes())for(attribs=node.attributes,index=attribs.length;index--;)attrib=attribs[index],attribName=attrib.name,/^on./.test(attribName)&&!isSafeArg(attrib.value)&&node.removeAttribute(attribName)}catch(e){}return node},guardMethod=function(method){return function(node){return isUnsafeNode(node)&&(node=toSafeNode(node)),method.apply(this,arguments)}},getOwnPropertyDescriptor=function(){try{return Object.getOwnPropertyDescriptor.apply(this,arguments)}catch(e){}},guardStorage=function(storageObj){return{setItem:function(key,value){isSafeArg(key,value)&&storageObj.setItem(key,value)},getItem:function(key){return storageObj.getItem(key)}}},toSafeStr=function(str){return str.indexOf("<")!==-1&&blacklistRe.test(str)&&(str=str.replace(blacklistRe,""),str=str.replace(/\bsrcdoc=/gi,"redacted=")),str},genDescriptor=function(prop){return{get:function(){return prop.get.call(this)},set:function(val){return isSafeArg(val)||(val=toSafeStr(val)),prop.set.call(this,val)}}};if(auditWin(window),window!==top){win=parent;try{winOrigin=win.location.origin||win.location.protocol+"//"+win.location.host}catch(e){}do try{winOrigin!==origin&&(auditWinName(win),auditWin(win))}catch(e){continue}finally{win=win.parent}while(win!==top)}NativeFunction=window.Function,nativeEval=window.eval,nativeSetInterval=window.setInterval,nativeSetTimeout=window.setTimeout,nativeWrite=document.write,nativeWriteln=document.writeln,document.write=guardWrite(nativeWrite),document.writeln=guardWrite(nativeWriteln),window.eval=guardSink(nativeEval),window.setTimeout=guardSink(nativeSetTimeout),window.setInterval=guardSink(nativeSetInterval),window.Function=function(){var construct=function(){var fn=NativeFunction.apply(null,arguments);fn.constructor=Function;try{Object.setPrototypeOf(fn,Function)}catch(e){fn.__proto__=Function}return fn};return isSafeArg.apply(null,arguments)?construct.apply(null,arguments):construct()},window.Function.prototype=Function;try{elPrototype=window.Element.prototype,nativeAppendChild=elPrototype.appendChild,nativeReplaceChild=elPrototype.replaceChild,nativeInsertBefore=elPrototype.insertBefore,nativeInsertAdjacentHTML=elPrototype.insertAdjacentHTML,nativeInsertAdjacentElement=elPrototype.insertAdjacentElement,innerHTML=getOwnPropertyDescriptor(elPrototype,"innerHTML"),outerHTML=getOwnPropertyDescriptor(elPrototype,"outerHTML"),elPrototype.appendChild=guardMethod(nativeAppendChild),elPrototype.replaceChild=guardMethod(nativeReplaceChild),elPrototype.insertBefore=guardMethod(nativeInsertBefore),elPrototype.insertAdjacentHTML=function(position,html){return isSafeArg(html)||(html=toSafeStr(html)),nativeInsertAdjacentHTML.call(this,position,html)},elPrototype.insertAdjacentElement=function(position,el){return isUnsafeNode(el)&&(el=toSafeNode(el)),nativeInsertAdjacentElement.call(this,position,el)},defineProperties(elPrototype,{innerHTML:genDescriptor(innerHTML),outerHTML:genDescriptor(outerHTML)})}catch(e){}window.execScript&&(nativeExecScript=window.execScript,eval("var execScript;"),window.execScript=guardSink(nativeExecScript)),window.setImmediate&&(nativeSetImmediate=window.setImmediate,window.setImmediate=guardSink(nativeSetImmediate)),window.atob&&(nativeAtob=window.atob,window.atob=function(str){return isSafeArg(str)?nativeAtob(str):str=sanitize(nativeAtob(str))});try{Rprototype=window.Range.prototype,nativeCreateContextualFragment=Rprototype.createContextualFragment,Rprototype.createContextualFragment=function(tagStr){return isSafeArg(tagStr)||(tagStr=""),nativeCreateContextualFragment.call(this,tagStr)}}catch(e){}for(cookie=document.cookie,cookieDesc=function(){try{return getOwnPropertyDescriptor(document,"cookie")||getOwnPropertyDescriptor(getPrototypeOf(document),"cookie")||{get:document.__lookupGetter__("cookie"),set:document.__lookupSetter__("cookie")}}catch(e){}}(),defineProperties(document,{cookie:{get:function(){try{return cookieDesc.get.call(this)}catch(e){return cookie}},set:function(val){if(isSafeArg(val))try{return cookieDesc.set.call(this,val)}catch(e){cookie+=";"+val}}}}),cookiePairs=cookie.split(";"),cookieIndex=cookiePairs.length;cookieIndex--;)for(cookiePair=cookiePairs[cookieIndex].split("="),valIndex=cookiePair.length;valIndex--;)taintedStrings.push(cookiePair[valIndex]);try{window.localStorage&&(nativeLocalStorage=window.localStorage,delete window.localStorage,window.localStorage=guardStorage(nativeLocalStorage)),window.sessionStorage&&(nativeSessionStorage=window.sessionStorage,delete window.sessionStorage,window.sessionStorage=guardStorage(nativeSessionStorage))}catch(e){}}(window,Object,Array);
