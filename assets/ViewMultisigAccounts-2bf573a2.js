import{d as U,A as Z,u as z,z as v,c as T,w as g,r as A,W as D,B as c,a4 as G,a as H,i as X,o as r,b as m,e as n,t as a,y,m as M,f,k as q,v as B,aZ as J}from"./index-f0fab120.js";import{_ as C}from"./proximax-logo-ecfc3767.js";import{c as O}from"./functions-f2e6f536.js";const Q={class:"md:px-40 xl:px-64"},Y={class:"border rounded-md p-3 flex flex-col shadow-lg filter mb-2 w-full"},P={class:"text-blue-primary font-semibold text-xs"},ee={class:"flex items-center my-1"},te=["id","copyValue","copySubject"],se={class:"flex items-center"},ne={class:"text-xs font-bold"},le={key:0,class:"text-xs font-bold"},oe={class:"text-xxs mt-0.5"},ae={class:"ml-1 text-xs font-bold"},ce=n("img",{src:C,class:"h-4 w-4"},null,-1),ie={key:0,class:"text-blue-primary"},de={key:1,class:"text-blue-primary text-sm font-semibold my-4"},re={class:"border rounded-md p-3 flex flex-col shadow-lg filter mb-2 w-full"},ue={class:"text-blue-primary font-semibold text-xs"},me={class:"flex items-center my-1"},fe=["id","copyValue","copySubject"],pe={key:0,class:"flex items-center"},ge={class:"text-xs font-bold"},ye={key:0,class:"text-xs font-bold"},be={class:"text-xxs mt-0.5"},ve={class:"ml-1 text-xs font-bold"},he=n("img",{src:C,class:"h-4 w-4"},null,-1),Ae=U({__name:"ViewMultisigAccounts",props:{address:String},setup(p){const I=p,V=Z(),{t:L}=z(),k=s=>{let e=document.getElementById(s).getAttribute("copyValue"),l=document.getElementById(s).getAttribute("copySubject");O(e),V.add({severity:"info",detail:l+" "+L("general.copied"),group:"br-custom",life:3e3})},h=v.Address.createFromRawAddress(I.address).plain(),_=T(()=>g.currentLoggedInWallet?(g.currentLoggedInWallet.accounts.find(e=>e.address==h)||g.currentLoggedInWallet.others.find(e=>e.address==h)).balance:0),u=s=>{if(s==null)return{left:null,right:null};let e=s.toString().split(".");return e[1]!=null?{left:e[0],right:e[1]}:{left:e[0],right:null}},S=A([]),W=async()=>{const s=[];try{const e=await c.chainAPI.accountAPI.getMultisigAccountGraphInfo(v.Address.createFromRawAddress(I.address));for(const[l,t]of e.multisigAccounts){const d=l;for(const o of t){const{account:x,cosignatories:$,multisigAccounts:F,minApproval:N,minRemoval:R}=o,E={publicKey:x.publicKey,level:d,cosignatories:$.map(w=>w.publicKey),multisigAccounts:F.map(w=>w.publicKey),minApproval:N,minRemoval:R,balance:0};s.push(E)}}return s}catch{return s}},i=A(null),j=async()=>{const s=i.value.map(e=>v.PublicAccount.createFromPublicKey(e.publicKey,c.networkType).address);try{const e=await c.chainAPI.accountAPI.getAccountsInfo(s);for(let l=0;l<i.value.length;l++){const t=e.findIndex(o=>o.publicKey==i.value[l].publicKey);if(t==-1)continue;const d=e[t].mosaics.find(o=>o.id.toHex()==c.nativeToken.assetId);d&&(i.value[l].balance=d.amount.compact()/Math.pow(10,c.nativeToken.divisibility))}}catch{}},b=T(()=>{let s=[];if(!i.value)return s;const e=[...i.value.filter(t=>t.level<0)],l=Math.min(...e.map(t=>t.level));if(l==1/0)return s;for(let t=0;t<Math.abs(l);t++){const d=e.filter(o=>o.level==-Math.abs(t+1)).map(o=>({address:D.createAddressFromPublicKey(o.publicKey,c.networkType).pretty(),balance:o.balance}));s.push({key:(t+1).toString(),label:"Level "+(t+1).toString(),selectable:!1,children:d.map((o,x)=>({type:"child",key:"0-"+x.toString(),balance:o.balance,label:g.currentLoggedInWallet.convertAddressToName(v.Address.createFromRawAddress(o.address).plain(),!0),address:o.address,selectable:!0}))})}return s}),K=G();return K.run(()=>{const s=A(!1),e=H(c,async l=>{l.isReady&&!s.value&&(s.value=!0,i.value=await W(),await j(),e(),K.stop())},{immediate:!0})}),(s,e)=>{const l=X("font-awesome-icon");return r(),m("div",Q,[n("div",Y,[n("div",P,a(y(g).currentLoggedInWallet.convertAddressToName(y(h))),1),n("div",ee,[n("div",{id:p.address.substring(-4),copyValue:p.address,copySubject:s.$t("general.address"),class:"truncate font-semibold text-xs mt-1"},a(p.address),9,te),M(l,{icon:"copy",title:s.$t("general.copy"),onClick:e[0]||(e[0]=t=>k(p.address.substring(-4))),class:"ml-2 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title"])]),n("div",se,[n("div",ne,a(u(_.value).left),1),u(_.value).right!=null?(r(),m("div",le,".")):f("",!0),n("div",oe,a(u(_.value).right),1),n("div",ae,a(y(c).nativeToken.label),1),ce])]),b.value.length?f("",!0):(r(),m("div",ie,"This account is not cosignatory of any accounts.")),b.value.length?(r(),m("div",de,"Cosignatories of")):f("",!0),b.value.length?(r(),q(y(J),{key:2,expandedKeys:S.value,"onUpdate:expandedKeys":e[1]||(e[1]=t=>S.value=t),value:b.value,filter:!0,filterMode:"strict",selectionMode:"single",class:"w-full"},{default:B(t=>[n("div",null,a(t.node.label),1)]),child:B(t=>[n("div",re,[n("div",ue,a(t.node.label),1),n("div",me,[n("div",{id:t.node.address.substring(-4),copyValue:t.node.address,copySubject:s.$t("general.address"),class:"truncate font-semibold text-xs mt-1"},a(t.node.address),9,fe),M(l,{icon:"copy",title:s.$t("general.copy"),onClick:d=>k(t.node.address.substring(-4)),class:"ml-2 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title","onClick"])]),t.node.balance?(r(),m("div",pe,[n("div",ge,a(u(t.node.balance).left),1),u(t.node.balance).right!=null?(r(),m("div",ye,".")):f("",!0),n("div",be,a(u(t.node.balance).right),1),n("div",ve,a(y(c).nativeToken.label),1),he])):f("",!0)])]),_:1},8,["expandedKeys","value"])):f("",!0)])}}});export{Ae as default};