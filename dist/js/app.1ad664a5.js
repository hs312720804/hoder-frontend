(function(n,e){"object"===typeof exports&&"object"===typeof module?module.exports=e():"function"===typeof define&&define.amd?define([],e):"object"===typeof exports?exports["hoderSaas"]=e():n["hoderSaas"]=e()})(self,(function(){return function(){var n={77520:function(n,e,t){"use strict";t.a(n,(async function(n,r){try{t.r(e),t.d(e,{bootstrap:function(){return n},mount:function(){return o},unmount:function(){return i}});t(65962);const{bootstrap:n,mount:o,unmount:i}=await t.e(808).then(t.bind(t,99808));r()}catch(o){r(o)}}),1)},65962:function(n,e,t){window.__POWERED_BY_QIANKUN__&&(t.p=window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__)}},e={};function t(r){var o=e[r];if(void 0!==o)return o.exports;var i=e[r]={id:r,loaded:!1,exports:{}};return n[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}t.m=n,function(){t.amdD=function(){throw new Error("define cannot be used indirect")}}(),function(){var n="function"===typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",e="function"===typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",r="function"===typeof Symbol?Symbol("webpack error"):"__webpack_error__",o=function(n){n&&!n.d&&(n.d=1,n.forEach((function(n){n.r--})),n.forEach((function(n){n.r--?n.r++:n()})))},i=function(t){return t.map((function(t){if(null!==t&&"object"===typeof t){if(t[n])return t;if(t.then){var i=[];i.d=0,t.then((function(n){u[e]=n,o(i)}),(function(n){u[r]=n,o(i)}));var u={};return u[n]=function(n){n(i)},u}}var f={};return f[n]=function(){},f[e]=t,f}))};t.a=function(t,u,f){var c;f&&((c=[]).d=1);var a,d,s,l=new Set,p=t.exports,h=new Promise((function(n,e){s=e,d=n}));h[e]=p,h[n]=function(n){c&&n(c),l.forEach(n),h["catch"]((function(){}))},t.exports=h,u((function(t){var o;a=i(t);var u=function(){return a.map((function(n){if(n[r])throw n[r];return n[e]}))},f=new Promise((function(e){o=function(){e(u)},o.r=0;var t=function(n){n!==c&&!l.has(n)&&(l.add(n),n&&!n.d&&(o.r++,n.push(o)))};a.map((function(e){e[n](t)}))}));return o.r?f:u()}),(function(n){n?s(h[r]=n):d(p),o(c)})),c&&(c.d=0)}}(),function(){t.n=function(n){var e=n&&n.__esModule?function(){return n["default"]}:function(){return n};return t.d(e,{a:e}),e}}(),function(){t.d=function(n,e){for(var r in e)t.o(e,r)&&!t.o(n,r)&&Object.defineProperty(n,r,{enumerable:!0,get:e[r]})}}(),function(){t.f={},t.e=function(n){return Promise.all(Object.keys(t.f).reduce((function(e,r){return t.f[r](n,e),e}),[]))}}(),function(){t.u=function(n){return"js/"+n+"."+{104:"757b31e0",119:"16c43b31",474:"e2f4b140",546:"acea023e",711:"912f469e",808:"807d5ba3",846:"e9cf6f77",848:"170cf267"}[n]+".js"}}(),function(){t.miniCssF=function(n){return"css/"+n+"."+{104:"98474841",119:"25e37ecf",474:"58509cca",546:"25e37ecf",711:"5ebf709a",808:"e126429d",846:"a6240eb7",848:"1a3af7d3"}[n]+".css"}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(n){if("object"===typeof window)return window}}()}(),function(){t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)}}(),function(){var n={},e="hoderSaas:";t.l=function(r,o,i,u){if(n[r])n[r].push(o);else{var f,c;if(void 0!==i)for(var a=document.getElementsByTagName("script"),d=0;d<a.length;d++){var s=a[d];if(s.getAttribute("src")==r||s.getAttribute("data-webpack")==e+i){f=s;break}}f||(c=!0,f=document.createElement("script"),f.charset="utf-8",f.timeout=120,t.nc&&f.setAttribute("nonce",t.nc),f.setAttribute("data-webpack",e+i),f.src=r),n[r]=[o];var l=function(e,t){f.onerror=f.onload=null,clearTimeout(p);var o=n[r];if(delete n[r],f.parentNode&&f.parentNode.removeChild(f),o&&o.forEach((function(n){return n(t)})),e)return e(t)},p=setTimeout(l.bind(null,void 0,{type:"timeout",target:f}),12e4);f.onerror=l.bind(null,f.onerror),f.onload=l.bind(null,f.onload),c&&document.head.appendChild(f)}}}(),function(){t.r=function(n){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})}}(),function(){t.nmd=function(n){return n.paths=[],n.children||(n.children=[]),n}}(),function(){t.p="/violet-api/hoder_web/"}(),function(){if("undefined"!==typeof document){var n=function(n,e,t,r,o){var i=document.createElement("link");i.rel="stylesheet",i.type="text/css";var u=function(t){if(i.onerror=i.onload=null,"load"===t.type)r();else{var u=t&&("load"===t.type?"missing":t.type),f=t&&t.target&&t.target.href||e,c=new Error("Loading CSS chunk "+n+" failed.\n("+f+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=u,c.request=f,i.parentNode.removeChild(i),o(c)}};return i.onerror=i.onload=u,i.href=e,t?t.parentNode.insertBefore(i,t.nextSibling):document.head.appendChild(i),i},e=function(n,e){for(var t=document.getElementsByTagName("link"),r=0;r<t.length;r++){var o=t[r],i=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(i===n||i===e))return o}var u=document.getElementsByTagName("style");for(r=0;r<u.length;r++){o=u[r],i=o.getAttribute("data-href");if(i===n||i===e)return o}},r=function(r){return new Promise((function(o,i){var u=t.miniCssF(r),f=t.p+u;if(e(u,f))return o();n(r,f,null,o,i)}))},o={143:0};t.f.miniCss=function(n,e){var t={104:1,119:1,474:1,546:1,711:1,808:1,846:1,848:1};o[n]?e.push(o[n]):0!==o[n]&&t[n]&&e.push(o[n]=r(n).then((function(){o[n]=0}),(function(e){throw delete o[n],e})))}}}(),function(){var n={143:0};t.f.j=function(e,r){var o=t.o(n,e)?n[e]:void 0;if(0!==o)if(o)r.push(o[2]);else{var i=new Promise((function(t,r){o=n[e]=[t,r]}));r.push(o[2]=i);var u=t.p+t.u(e),f=new Error,c=function(r){if(t.o(n,e)&&(o=n[e],0!==o&&(n[e]=void 0),o)){var i=r&&("load"===r.type?"missing":r.type),u=r&&r.target&&r.target.src;f.message="Loading chunk "+e+" failed.\n("+i+": "+u+")",f.name="ChunkLoadError",f.type=i,f.request=u,o[1](f)}};t.l(u,c,"chunk-"+e,e)}};var e=function(e,r){var o,i,u=r[0],f=r[1],c=r[2],a=0;if(u.some((function(e){return 0!==n[e]}))){for(o in f)t.o(f,o)&&(t.m[o]=f[o]);if(c)c(t)}for(e&&e(r);a<u.length;a++)i=u[a],t.o(n,i)&&n[i]&&n[i][0](),n[i]=0},r=self["webpackJsonp_hoderSaas"]=self["webpackJsonp_hoderSaas"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var r=t(77520);return r}()}));