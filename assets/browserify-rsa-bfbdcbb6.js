import"./node-stdlib-browser-23a8bc7f.js";import{r as h}from"./bn.js-1ae23332.js";import{r as v}from"./randombytes-685e9383.js";import{b as g}from"./buffer-6d367910.js";var u,i;function p(){if(i)return u;i=1;var n=h(),l=v();function s(e){var r=m(e),o=r.toRed(n.mont(e.modulus)).redPow(new n(e.publicExponent)).fromRed();return{blinder:o,unblinder:r.invm(e.modulus)}}function m(e){var r=e.modulus.byteLength(),o;do o=new n(l(r));while(o.cmp(e.modulus)>=0||!o.umod(e.prime1)||!o.umod(e.prime2));return o}function d(e,r){var o=s(r),f=r.modulus.byteLength(),t=new n(e).mul(o.blinder).umod(r.modulus),b=t.toRed(n.mont(r.prime1)),c=t.toRed(n.mont(r.prime2)),w=r.coefficient,R=r.prime1,y=r.prime2,B=b.redPow(r.exponent1).fromRed(),a=c.redPow(r.exponent2).fromRed(),q=B.isub(a).imul(w).umod(R).imul(y);return a.iadd(q).imul(o.unblinder).umod(r.modulus).toArrayLike(g.Buffer,"be",f)}return d.getr=m,u=d,u}export{p as r};