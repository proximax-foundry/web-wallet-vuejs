function s(){return s=Object.assign?Object.assign.bind():function(t){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},s.apply(this,arguments)}function a(t){"@babel/helpers - typeof";return a=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},a(t)}function m(t,r){if(a(t)!=="object"||t===null)return t;var e=t[Symbol.toPrimitive];if(e!==void 0){var n=e.call(t,r||"default");if(a(n)!=="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(t)}function p(t){var r=m(t,"string");return a(r)==="symbol"?r:String(r)}function b(t,r,e){return r=p(r),r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function l(t,r,e,n,f,c,i){try{var u=t[c](i),o=u.value}catch(y){e(y);return}u.done?r(o):Promise.resolve(o).then(n,f)}function v(t){return function(){var r=this,e=arguments;return new Promise(function(n,f){var c=t.apply(r,e);function i(o){l(c,n,f,i,u,"next",o)}function u(o){l(c,n,f,i,u,"throw",o)}i(void 0)})}}export{v as _,b as a,a as b,s as c};