import{av as E}from"./index-f81de996.js";function I(o,n,t){return parseInt(o.substr(n,t),16)}function T(o){return o|=0,o<0?"00":o<16?"0"+o.toString(16):o<256?o.toString(16):"ff"}function R(o,n,t){return t=t<0?t+6:t>6?t-6:t,T(255*(t<1?o+(n-o)*t:t<3?n:t<4?o+(n-o)*(4-t):o))}function k(o){if(/^#[0-9a-f]{3,8}$/i.test(o)){let n;const t=o.length;if(t<6){const r=o[1],s=o[2],i=o[3],f=o[4]||"";n="#"+r+r+s+s+i+i+f+f}return(t==7||t>8)&&(n=o),n}}function G(o,n,t){let r;if(n==0){const s=T(t*255);r=s+s+s}else{const s=t<=.5?t*(n+1):t+n-t*n,i=t*2-s;r=R(i,s,o*6+2)+R(i,s,o*6)+R(i,s,o*6-2)}return"#"+r}function H(o,n,t){const r=[.55,.5,.5,.46,.6,.55,.55],s=r[o*6+.5|0];return t=t<.5?t*s*2:s+(t-.5)*(1-s)*2,G(o,n,t)}const N=typeof window<"u"?window:typeof self<"u"?self:typeof E<"u"?E:{},j={V:"jdenticon_config",n:"config"};var P={};function K(o,n){const t=typeof o=="object"&&o||P[j.n]||N[j.V]||{},r=t.lightness||{},s=t.saturation||{},i="color"in s?s.color:s,f=s.grayscale,a=t.backColor,h=t.padding;function u(d,S){let p=r[d];return p&&p.length>1||(p=S),function(e){return e=p[0]+e*(p[1]-p[0]),e<0?0:e>1?1:e}}function b(d){const S=t.hues;let p;return S&&S.length>0&&(p=S[0|.999*d*S.length]),typeof p=="number"?(p/360%1+1)%1:d}return{W:b,o:typeof i=="number"?i:.5,D:typeof f=="number"?f:0,p:u("color",[.4,.8]),F:u("grayscale",[.3,.9]),G:k(a),X:typeof o=="number"?o:typeof h=="number"?h:n}}class A{constructor(n,t){this.x=n,this.y=t}}class y{constructor(n,t,r,s){this.q=n,this.t=t,this.H=r,this.Y=s}I(n,t,r,s){const i=this.q+this.H,f=this.t+this.H,a=this.Y;return a===1?new A(i-t-(s||0),this.t+n):a===2?new A(i-n-(r||0),f-t-(s||0)):a===3?new A(this.q+t,f-n-(r||0)):new A(this.q+n,this.t+t)}}const W=new y(0,0,0,0);class Z{constructor(n){this.J=n,this.u=W}g(n,t){const r=t?-2:2,s=[];for(let i=t?n.length-2:0;i<n.length&&i>=0;i+=r)s.push(this.u.I(n[i],n[i+1]));this.J.g(s)}h(n,t,r,s){const i=this.u.I(n,t,r,r);this.J.h(i,r,s)}i(n,t,r,s,i){this.g([n,t,n+r,t,n+r,t+s,n,t+s],i)}j(n,t,r,s,i,f){const a=[n+r,t,n+r,t+s,n,t+s,n,t];a.splice((i||0)%4*2,2),this.g(a,f)}K(n,t,r,s,i){this.g([n+r/2,t,n+r,t+s/2,n+r/2,t+s,n,t+s/2],i)}}function v(o,n,t,r){o=o%14;let s,i,f,a,h,u;o?o==1?(f=0|t*.5,a=0|t*.8,n.j(t-f,0,f,a,2)):o==2?(f=0|t/3,n.i(f,f,t-f,t-f)):o==3?(h=t*.1,u=t<6?1:t<8?2:0|t*.25,h=h>1?0|h:h>.5?1:h,n.i(u,u,t-h-u,t-h-u)):o==4?(i=0|t*.15,f=0|t*.5,n.h(t-f-i,t-f-i,f)):o==5?(h=t*.1,u=h*4,u>3&&(u=0|u),n.i(0,0,t,t),n.g([u,u,t-h,u,u+(t-u-h)/2,t-h],!0)):o==6?n.g([0,0,t,0,t,t*.7,t*.4,t*.4,t*.7,t,0,t]):o==7?n.j(t/2,t/2,t/2,t/2,3):o==8?(n.i(0,0,t,t/2),n.i(0,t/2,t/2,t/2),n.j(t/2,t/2,t/2,t/2,1)):o==9?(h=t*.14,u=t<4?1:t<6?2:0|t*.35,h=t<8?h:0|h,n.i(0,0,t,t),n.i(u,u,t-u-h,t-u-h,!0)):o==10?(h=t*.12,u=h*3,n.i(0,0,t,t),n.h(u,u,t-h-u,!0)):o==11?n.j(t/2,t/2,t/2,t/2,3):o==12?(i=t*.25,n.i(0,0,t,t),n.K(i,i,t-i,t-i,!0)):!r&&(i=t*.4,f=t*1.2,n.h(i,i,f)):(s=t*.42,n.g([0,0,t,0,t,t-s*2,t-s,t,0,t]))}function F(o,n,t){o=o%4;let r;o?o==1?n.j(0,t/2,t,t/2,0):o==2?n.K(0,0,t,t):(r=t/6,n.h(r,r,t-2*r)):n.j(0,0,t,t,0)}function M(o,n){return o=n.W(o),[H(o,n.D,n.F(0)),H(o,n.o,n.p(.5)),H(o,n.D,n.F(1)),H(o,n.o,n.p(1)),H(o,n.o,n.p(0))]}function q(o,n,t){const r=K(t,.08);r.G&&o.m(r.G);let s=o.k;const i=.5+s*r.X|0;s-=i*2;const f=new Z(o),a=0|s/4,h=0|i+s/2-a*2,u=0|i+s/2-a*2;function b(g,w,O,m,B){const D=I(n,O,1);let L=m?I(n,m,1):0;o.L(S[p[g]]);for(let C=0;C<B.length;C++)f.u=new y(h+B[C][0]*a,u+B[C][1]*a,a,L++%4),w(D,f,a,C);o.M()}const d=I(n,-7)/268435455,S=M(d,r),p=[];let e;function c(g){if(g.indexOf(e)>=0){for(let w=0;w<g.length;w++)if(p.indexOf(g[w])>=0)return!0}}for(let g=0;g<3;g++)e=I(n,8+g,1)%S.length,(c([0,4])||c([2,3]))&&(e=1),p.push(e);b(0,F,2,3,[[1,0],[2,0],[2,3],[1,3],[0,1],[3,1],[3,2],[0,2]]),b(1,F,4,5,[[0,0],[3,0],[3,3],[0,3]]),b(2,v,1,null,[[1,1],[2,1],[2,2],[1,2]]),o.finish()}function V(o){var r=0,s=0,i=encodeURI(o)+"%80",f=[],a,h=[],u=1732584193,b=4023233417,d=~u,S=~b,p=3285377520,e=[u,b,d,S,p],c=0,g="";function w(O,m){return O<<m|O>>>32-m}for(;r<i.length;s++)f[s>>2]=f[s>>2]|(i[r]=="%"?parseInt(i.substring(r+1,r+=3),16):i.charCodeAt(r++))<<(3-(s&3))*8;for(a=((s+7>>6)+1)*16,f[a-1]=s*8-8;c<a;c+=16){for(r=0;r<80;r++)s=w(u,5)+p+(r<20?(b&d^~b&S)+1518500249:r<40?(b^d^S)+1859775393:r<60?(b&d^b&S^d&S)+2400959708:(b^d^S)+3395469782)+(h[r]=r<16?f[c+r]|0:w(h[r-3]^h[r-8]^h[r-14]^h[r-16],1)),p=S,S=d,d=w(b,30),b=u,u=s;e[0]=u=e[0]+u|0,e[1]=b=e[1]+b|0,e[2]=d=e[2]+d|0,e[3]=S=e[3]+S|0,e[4]=p=e[4]+p|0}for(r=0;r<40;r++)g+=(e[r>>3]>>>(7-(r&7))*4&15).toString(16);return g}function Y(o){return/^[0-9a-f]{11,}$/i.test(o)&&o}function J(o){return V(o==null?"":""+o)}function _(o){return(o*10+.5|0)/10}class X{constructor(){this.v=""}g(n){let t="";for(let r=0;r<n.length;r++)t+=(r?"L":"M")+_(n[r].x)+" "+_(n[r].y);this.v+=t+"Z"}h(n,t,r){const s=r?0:1,i=_(t/2),f=_(t),a="a"+i+","+i+" 0 1,"+s+" ";this.v+="M"+_(n.x)+" "+_(n.y+t/2)+a+f+",0"+a+-f+",0"}}class ${constructor(n){this.A,this.B={},this.N=n,this.k=n.k}m(n){const t=/^(#......)(..)?/.exec(n),r=t[2]?I(t[2],0)/255:1;this.N.m(t[1],r)}L(n){this.A=this.B[n]||(this.B[n]=new X)}M(){}g(n){this.A.g(n)}h(n,t,r){this.A.h(n,t,r)}finish(){const n=this.B;for(let t in n)n.hasOwnProperty(t)&&this.N.O(t,n[t].v)}}const U={P:"http://www.w3.org/2000/svg",R:"width",S:"height"};class Q{constructor(n){this.k=n,this.C='<svg xmlns="'+U.P+'" width="'+n+'" height="'+n+'" viewBox="0 0 '+n+" "+n+'">'}m(n,t){t&&(this.C+='<rect width="100%" height="100%" fill="'+n+'" opacity="'+t.toFixed(2)+'"/>')}O(n,t){this.C+='<path fill="'+n+'" d="'+t+'"/>'}toString(){return this.C+"</svg>"}}function z(o,n,t){const r=new Q(n);return q(new $(r),Y(o)||J(o),t),r.toString()}typeof document<"u"&&document.querySelectorAll.bind(document);export{z as t};