var p,f;function m(){if(f)return p;f=1;var e="Function.prototype.bind called on incompatible ",o=Array.prototype.slice,s=Object.prototype.toString,d="[object Function]";return p=function(y){var n=this;if(typeof n!="function"||s.call(n)!==d)throw new TypeError(e+n);for(var i=o.call(arguments,1),t,b=function(){if(this instanceof t){var r=n.apply(this,i.concat(o.call(arguments)));return Object(r)===r?r:this}else return n.apply(y,i.concat(o.call(arguments)))},h=Math.max(0,n.length-i.length),l=[],a=0;a<h;a++)l.push("$"+a);if(t=Function("binder","return function ("+l.join(",")+"){ return binder.apply(this,arguments); }")(b),n.prototype){var u=function(){};u.prototype=n.prototype,t.prototype=new u,u.prototype=null}return t},p}var c,v;function F(){if(v)return c;v=1;var e=m();return c=Function.prototype.bind||e,c}export{F as r};