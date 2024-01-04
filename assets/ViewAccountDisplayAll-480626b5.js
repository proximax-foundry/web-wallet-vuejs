import{d as R,r as p,A as U,u as te,c as x,w as l,z as se,B as F,H as K,D as le,l as ne,i as M,o as d,b as m,e as t,t as v,m as C,f as W,F as D,g as H,y as oe,$ as ae,a0 as re,I as z,J as Q,_ as G,a as P,j as ie,h as J,a1 as ce,v as ue,O as de,R as me,k as fe}from"./index-f0fab120.js";import{_ as ve}from"./proximax-logo-ecfc3767.js";import{_ as pe,a as ge}from"./icon-key-5b3f7dda.js";import{_ as be}from"./icon-multisig-2a7c5e5f.js";import{c as _e}from"./functions-f2e6f536.js";import{t as ye}from"./jdenticon-module-f8a9db48.js";import{_ as X}from"./icon-arrow-down-83b4f5a8.js";import{T as he}from"./TextInputClean-5d304c85.js";const xe="/web-wallet-vuejs/assets/icon-default-account-drop-down-03c40c1e.svg",N=a=>(z("data-v-aca821aa"),a=a(),Q(),a),Le={class:"flex gap-2"},we=["innerHTML"],Ie={class:"flex flex-col"},$e={class:"text-blue-primary font-bold text-xs mb-0.5"},Ce={class:"flex justify-around"},ke=["id","title","copyValue","copySubject"],Ae={class:"flex"},We={class:"text-xs font-bold"},Se={key:0,class:"text-xs font-bold"},Te={class:"text-xxs mt-0.5"},Me={class:"ml-1 text-xs font-bold"},Ve=N(()=>t("img",{src:ve,class:"h-4 w-4"},null,-1)),De={class:"flex gap-2"},Ne=["title"],Be=N(()=>t("img",{src:pe,class:"h-4 w-4"},null,-1)),Ee={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},je=["title"],He=N(()=>t("img",{src:be,class:"h-3 w-3 mr-1"},null,-1)),Oe={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},Fe=["title"],Ke=N(()=>t("img",{src:ge,class:"h-4 w-4 mr-1"},null,-1)),Pe={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},Re={class:"absolute flex invisible 2xl:visible pt-4 explicitLeft"},Ue={key:0,class:"text-xs mr-3 border bg-gray-300 rounded-md p-1"},ze=R({__name:"AccountTile",props:{account:{}},setup(a){const k=p(),g=U(),{t:b}=te(),_=p(""),I=x(()=>{if(l.currentLoggedInWallet){let e=[];return l.currentLoggedInWallet.labels.forEach(n=>{let w=!1;n.addresses.includes(a.account.address)&&(w=!0),e.push({name:n.name,isLabeled:w})}),e}else return[]}),$=e=>{k.value.toggle(e)},r=x(()=>[{label:"Change Labels",command:()=>{}}].concat(I.value.map(e=>({label:e.name,command:()=>{o(e.name)}})))),o=async e=>{if(!l.currentLoggedInWallet)return;let n=l.currentLoggedInWallet.labels.find(h=>h.name==e),w=se.Address.createFromRawAddress(a.account.address).plain();if(!n)return;let V=n.addresses.findIndex(h=>h==w);if(V>=0){n.removeAddress(V),l.wallets.saveMyWalletOnlytoLocalStorage(l.currentLoggedInWallet),g.add({severity:"info",summary:"Label",detail:s.value+" is removed as "+e,group:"br-custom",life:5e3});return}n.addresses.push(w),l.wallets.saveMyWalletOnlytoLocalStorage(l.currentLoggedInWallet),g.add({severity:"info",summary:"Label",detail:s.value+" is added as "+e,group:"br-custom",life:5e3})},s=x(()=>{const e=l.currentLoggedInWallet.contacts.find(n=>n.address==a.account.address);return e?e.name:a.account.name}),c=x(()=>F.nativeToken.label),f=x(()=>F.nativeToken.divisibility),S=x(()=>K.toCurrencyFormat(a.account.balance,f.value)),u=x(()=>{let e=S.value.split(".");return e[1]!=null?{left:e[0],right:e[1]}:{left:e[0],right:null}});let i=new le("ThemeStyleConfig");i.init();const y=p(ye(a.account.address,50,i.jdenticonConfig)),L=e=>{let n=document.getElementById(e).getAttribute("copyValue"),w=document.getElementById(e).getAttribute("copySubject");_e(n),g.add({severity:"info",detail:w+" "+b("general.copied"),group:"br-custom",life:3e3})},A=x(()=>!!a.account.getDirectParentMultisig().length),T=e=>{const n=l.currentLoggedInWallet.others.find(w=>w.address==e);return n!=null&&n.type=="MULTISIG"&&(_.value=n.address),n},B=e=>K.createAddress(e).pretty(),E=p(!1),j=p(!1),O=ne(),Z=()=>{if(T(a.account.address)==null)l.currentLoggedInWallet.setDefaultAccountByName(a.account.name);else return},q=()=>{var e;E.value||j.value||((e=a.account)!=null&&e.type?O.push({name:"ViewAccountDetails",params:{address:a.account.address}}):(Z(),re(a.account.address),O.push({name:"ViewAccountDetails",params:{address:a.account.address}})))};return(e,n)=>{var V;const w=M("font-awesome-icon");return d(),m("div",{class:"border rounded-lg border-gray-200 p-3 filter shadow-lg cursor-pointer",onClick:n[5]||(n[5]=h=>q())},[t("div",Le,[t("div",{class:"mt-auto mb-auto",innerHTML:y.value},null,8,we),t("div",Ie,[t("div",$e,v(s.value),1),t("div",Ce,[t("div",{id:e.account.address,title:B(e.account.address),class:"text-xs font-bold mt-0.5 mr-2 truncate md:text-clip w-44 md:w-full",copyValue:B(e.account.address),copySubject:e.$t("general.address")},v(B(e.account.address)),9,ke),C(w,{onMouseover:n[0]||(n[0]=h=>j.value=!0),onMouseout:n[1]||(n[1]=h=>j.value=!1),icon:"copy",onClick:n[2]||(n[2]=h=>L(e.account.address)),class:"w-5 h-5 text-blue-primary cursor-pointer inline-block"})]),t("div",Ae,[t("div",We,v(u.value.left),1),u.value.right!=null?(d(),m("div",Se," . ")):W("",!0),t("div",Te,v(u.value.right),1),t("div",Me,v(c.value),1),Ve]),t("div",De,[(V=e.account)!=null&&V.default?(d(),m("div",{key:0,class:"px-1 py-0.5 flex items-center bg-blue-primary rounded-sm",title:e.$t("general.defaultTitle")},[Be,t("p",Ee,v(e.$t("general.default")),1)],8,Ne)):W("",!0),A.value?(d(),m("div",{key:1,class:"px-1 py-0.5 flex items-center bg-green-500 rounded-sm",title:e.$t("general.multisigTitle")},[He,t("p",Oe,v(e.$t("general.multisig")),1)],8,je)):W("",!0),A.value&&!T(e.account.address)?(d(),m("div",{key:2,class:"px-1 py-0.5 flex items-center bg-purple-500 rounded-sm",title:e.$t("general.ownerTitle")},[Ke,t("p",Pe,v(e.$t("general.owner")),1)],8,Fe)):W("",!0)])]),t("div",Re,[(d(!0),m(D,null,H(I.value,(h,ee)=>(d(),m("div",{key:ee},[h.isLabeled?(d(),m("div",Ue,v(h.name),1)):W("",!0)]))),128))]),t("img",{src:xe,class:"h-6 w-6 cursor-pointer my-auto ml-auto",onMouseover:n[3]||(n[3]=h=>E.value=!0),onMouseout:n[4]||(n[4]=h=>E.value=!1),onClick:$},null,32),C(oe(ae),{ref_key:"menu",ref:k,model:r.value,popup:!0},null,8,["model"])])])}}});const Qe=G(ze,[["__scopeId","data-v-aca821aa"]]),Ge={class:"flex flex-col"},Je=t("div",null,"Labels",-1),Xe={key:0,src:X,class:"w-3 ml-2 h-3",style:{"margin-top":"0.12em"}},Ye={key:1,src:X,class:"w-3 ml-2 h-3",style:{"margin-top":"0.12em",transform:"rotate(180deg)"}},Ze={key:0,class:"relative"},qe={class:"absolute border-t-0 w-52 border bg-white"},et={class:"flex flex-col max-h-44 overflow-auto"},tt=["onClick"],st={class:"text-xs mt-0.5"},lt=t("div",null,"Create Label",-1),nt={key:0,class:"popup-outer fixed flex z-50"},ot={class:"modal-popup-box"},at={key:0,class:"error error_box mb-3"},rt=t("div",{class:"text-center my-2 text-xs font-semibold"},"Create Label",-1),it={name:"LabelComponent"},ct=R({...it,setup(a){const g=J().appContext.config.globalProperties.emitter,b=U(),_=p(!1),I=p(!1),$=p(!1),r=p(""),o=p(""),s=p([]),c=x(()=>l.currentLoggedInWallet?l.currentLoggedInWallet.labels:[]);for(let u=0;u<c.value.length;u++)s.value.push(!1);P(c,(u,i)=>{s.value=[];for(let y=0;y<u.length;y++)s.value.push(!1)},{deep:!0}),P(s,u=>{let i=[];u.length==c.value.length&&(u.forEach((y,L)=>{y&&i.push(c.value[L].name)}),g.emit("filterByLabel",i))},{deep:!0});const f=async()=>{if(!l.currentLoggedInWallet)return;if(o.value=o.value.trim(),o.value==""){r.value="Label name cannot be empty.";return}if(l.currentLoggedInWallet.labels.find(y=>y.name==o.value)){r.value="Label is already existed in wallet.";return}let i=new ce(o.value,[]);l.currentLoggedInWallet.addLabel(i),await l.wallets.saveMyWalletOnlytoLocalStorage(l.currentLoggedInWallet),r.value="",o.value="",b.add({severity:"info",summary:"Label",detail:"New Label is Created",group:"br-custom",life:5e3}),I.value=!1},S=async u=>{l.currentLoggedInWallet&&(l.currentLoggedInWallet.removeLabel(u),await l.wallets.saveMyWalletOnlytoLocalStorage(l.currentLoggedInWallet),b.add({severity:"info",summary:"Label",detail:"Label is removed",group:"br-custom",life:5e3}),$.value=!1)};return(u,i)=>{const y=M("font-awesome-icon");return d(),m(D,null,[t("div",Ge,[t("div",{onClick:i[0]||(i[0]=L=>_.value=!_.value),class:"border p-2 cursor-pointer w-52 bg-white text-xs justify-between flex"},[Je,_.value?(d(),m("img",Ye)):(d(),m("img",Xe))]),_.value?(d(),m("div",Ze,[t("div",qe,[t("div",et,[(d(!0),m(D,null,H(c.value,(L,A)=>(d(),m("div",{key:A},[t("div",{onClick:T=>$.value?"":s.value[A]=!s.value[A],class:ie(`${s.value[A]?"bg-blue-300 flex cursor-pointer p-2 hover:bg-blue-300 ":"flex cursor-pointer p-2 hover:bg-blue-300 "}`)},[C(y,{icon:"tag",class:"w-4 h-4 mr-3 thin"}),t("div",st,v(L.name),1),C(y,{icon:"trash",onMouseover:i[1]||(i[1]=T=>$.value=!0),onMouseout:i[2]||(i[2]=T=>$.value=!1),onClick:T=>S(A),title:"Remove label",class:"ml-auto w-3 h-3 cursor-pointer mt-0.5"},null,8,["onClick"])],10,tt)]))),128)),t("div",{onClick:i[3]||(i[3]=L=>{I.value=!0,_.value=!1}),class:"text-xs cursor-pointer flex gap-3 p-2 hover:bg-blue-300"},[C(y,{icon:"plus",class:"w-3 h-3 mr-1"}),lt])])])])):W("",!0)]),I.value?(d(),m("div",nt,[t("div",ot,[t("div",null,[r.value!=""?(d(),m("div",at,v(r.value),1)):W("",!0),rt,C(he,{placeholder:"Label Name",modelValue:o.value,"onUpdate:modelValue":i[4]||(i[4]=L=>o.value=L)},null,8,["modelValue"]),t("div",{onClick:i[5]||(i[5]=L=>f()),class:"blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto"},v(u.$t("general.confirm")),1),t("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:i[6]||(i[6]=L=>I.value=!1)},v(u.$t("general.cancel")),1)])])])):W("",!0)],64)}}});const ut={name:"ViewAccountDisplayAll",components:{AccountTile:Qe,LabelComponent:ct},setup(){const k=J().appContext.config.globalProperties.emitter;x(()=>{if(!l.currentLoggedInWallet)return[];let r=l.currentLoggedInWallet.accounts.map(s=>({name:s.name,balance:s.balance,address:s.address,publicKey:s.publicKey,isMultisig:!!s.getDirectParentMultisig().length,multisigInfo:s.multisigInfo})),o=l.currentLoggedInWallet.others.filter(s=>s.type==="MULTISIG").map(s=>({name:s.name,balance:s.balance,address:s.address,publicKey:s.publicKey,isMultisig:!0,multisigInfo:s.multisigInfo}));return r.concat(o)});const g=p([]),b=x(()=>{if(l.currentLoggedInWallet)if(l.currentLoggedInWallet.others){const r=l.currentLoggedInWallet.accounts.concat(l.currentLoggedInWallet.others);let o=[];return g.value.forEach(s=>{let c=l.currentLoggedInWallet.labels.find(f=>f.name==s);c&&c.addresses.forEach(f=>{let S=r.find(u=>u.address==f);o.push(S)})}),o=Array.from(new Set(o)),g.value.length?o:r}else{const r=l.currentLoggedInWallet.accounts;let o=[];return g.value.forEach(s=>{let c=l.currentLoggedInWallet.labels.find(f=>f.name==s);c&&c.addresses.forEach(f=>{let S=r.find(u=>u.address==f);o.push(S)})}),o=Array.from(new Set(o)),g.value.length?o:r}else return null});k.on("filterByLabel",r=>{g.value=r});const _=p(""),I=x(()=>{const r=_.value.toLowerCase();return _.value==""?$(b.value):b.value.filter(o=>o.name.toLowerCase().includes(r)||o.address.toLowerCase().includes(r.replace(/-/g,"")))});function $(r){if(r!==null){var o=r.reduce((s,c)=>(s.some(f=>f.address===c.address&&f.name===c.name)||s.push(c),s),[]);return o}}return{accounts:b,filterQuery:_,filteredAccounts:I}}},Y=a=>(z("data-v-b8660f73"),a=a(),Q(),a),dt={class:"my-4 w-11/12 ml-auto mr-auto flex flex-col sm:flex-row justify-between"},mt=Y(()=>t("div",{class:"absolute invisible 2xl:visible text-gray-500 mt-1 explicitLeft"},"Labels",-1)),ft={class:"mt-3 sm:mt-0 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2"},vt={class:"mt-2 py-3"},pt={class:"w-11/12 ml-auto mr-auto flex flex-col gap-3"},gt={class:"flex items-center"},bt=["placeholder"],_t=Y(()=>t("div",{class:"mb-36"},null,-1));function yt(a,k,g,b,_,I){const $=M("LabelComponent"),r=M("router-link"),o=M("font-awesome-icon"),s=M("AccountTile");return d(),m("div",null,[t("div",dt,[C($),mt,C(r,{to:{name:"ViewAccountCreateSelectType"}},{default:ue(()=>[t("div",ft,"+ "+v(a.$t("general.createNewAcc")),1)]),_:1})]),t("div",vt,[t("div",pt,[t("div",gt,[C(o,{icon:"search",class:"text-blue-link mr-1"}),de(t("input",{"onUpdate:modelValue":k[0]||(k[0]=c=>b.filterQuery=c),type:"text",class:"py-2 px-2 outline-none text-xs text-black",placeholder:a.$t("general.search")},null,8,bt),[[me,b.filterQuery]])]),(d(!0),m(D,null,H(b.filteredAccounts,(c,f)=>(d(),fe(s,{key:f,account:c},null,8,["account"]))),128))])]),_t])}const At=G(ut,[["render",yt],["__scopeId","data-v-b8660f73"]]);export{At as default};