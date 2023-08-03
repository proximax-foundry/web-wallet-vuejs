import{a6 as C}from"./index-42fb6041.js";var E={isNotUTF8:v,getCharLength:x,getCharCode:m,getStringFromBytes:w,getBytesForCharCode:c,setBytesFromCharCode:F,setBytesFromString:I};function v(r,o,i){try{w(r,o,i,!0)}catch{return!0}return!1}function x(r){return(r&240)==240?4:(r&224)==224?3:(r&192)==192?2:r==(r&127)?1:0}function m(r,o,i){var n=0,u="";if(o=o||0,r.length-o<=0)throw new Error("No more characters remaining in array.");if(i=i||x(r[o]),i==0)throw new Error(r[o].toString(2)+" is not a significative byte (offset:"+o+").");if(i===1)return r[o];if(r.length-o<i)throw new Error("Expected at least "+i+" bytes remaining in array.");if(u="00000000".slice(0,i)+1+"00000000".slice(i+1),r[o]&parseInt(u,2))throw Error("Index "+o+": A "+i+" bytes encoded char cannot encode the "+(i+1)+"th rank bit to 1.");for(u="0000".slice(0,i+1)+"11111111".slice(i+1),n+=(r[o]&parseInt(u,2))<<--i*6;i;){if((r[o+1]&128)!==128||(r[o+1]&64)===64)throw Error("Index "+(o+1)+': Next bytes of encoded char must begin with a "10" bit sequence.');n+=(r[++o]&63)<<--i*6}return n}function w(r,o,i,n){var u,a=[];for(o=o|0,i=typeof i=="number"?i:r.byteLength||r.length;o<i;o++){if(u=x(r[o]),o+u>i){if(n)throw Error("Index "+o+": Found a "+u+" bytes encoded char declaration but only "+(i-o)+" bytes are available.")}else a.push(String.fromCodePoint(m(r,o,u)));o+=u-1}return a.join("")}function c(r){if(r<128)return 1;if(r<2048)return 2;if(r<65536)return 3;if(r<2097152)return 4;throw new Error("CharCode "+r+" cannot be encoded with UTF8.")}function F(r,o,i,n){if(r=r|0,o=o||[],i=i|0,n=n||c(r),n==1)o[i]=r;else for(o[i++]=(parseInt("1111".slice(0,n),2)<<8-n)+(r>>>--n*6);n>0;)o[i++]=r>>>--n*6&63|128;return o}function I(r,o,i,n,u){r=r||"",o=o||[],i=i|0,n=typeof n=="number"?n:o.byteLength||1/0;for(var a=0,p=r.length;a<p;a++){var l=c(r[a].codePointAt(0));if(u&&i+l>n)throw new Error('Not enought bytes to encode the char "'+r[a]+'" at the offset "'+i+'".');F(r[a].codePointAt(0),o,i,l),i+=l}return o}const U=C(E);export{U};