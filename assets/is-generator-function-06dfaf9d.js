import{r as F}from"./has-tostringtag-7c6352d6.js";var n,a;function g(){if(a)return n;a=1;var u=Object.prototype.toString,c=Function.prototype.toString,f=/^\s*(?:function)?\*/,o=F()(),t=Object.getPrototypeOf,s=function(){if(!o)return!1;try{return Function("return function*() {}")()}catch{}},e;return n=function(r){if(typeof r!="function")return!1;if(f.test(c.call(r)))return!0;if(!o){var p=u.call(r);return p==="[object GeneratorFunction]"}if(!t)return!1;if(typeof e>"u"){var i=s();e=i?t(i):!1}return t(r)===e},n}export{g as r};