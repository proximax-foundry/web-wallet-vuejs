import{_ as B,D as G,u as Z,r as y,c as w,w as a,E as O,H as F,I as ee,g as E,q as te,k as $,o as c,b as d,e,t as b,s as C,f as x,F as T,i as V,B as se,a0 as le,p as Q,j as R,d as ne,a as U,l as oe,a1 as ae,z as re,S as ie,a2 as ce,m as ue}from"./index-f81de996.js";import"./index-295c9a1a.js";import{c as de}from"./functions-ee8fa276.js";import{t as me}from"./jdenticon-module-7161194d.js";import{_ as fe}from"./proximax-logo-ecfc3767.js";import{_ as ve,a as ge}from"./icon-key-5b3f7dda.js";import{_ as pe}from"./icon-multisig-2a7c5e5f.js";import{_ as _e}from"./icon-green-tick-1b766454.js";import{_ as q}from"./icon-arrow-down-83b4f5a8.js";import{T as be}from"./TextInputClean-1671b736.js";const ye="/web-wallet-vuejs/assets/icon-default-account-drop-down-03c40c1e.svg";const he={name:"AccountTile",props:["account"],setup(l){const r=G(),{t:g}=Z(),s=y(""),p=y(!1),k=w(()=>{if(a.currentLoggedInWallet){let i=[];return a.currentLoggedInWallet.labels.forEach(v=>{let A=!1;v.addresses.includes(l.account.address)&&(A=!0),i.push({name:v.name,isLabeled:A})}),i}else return[]}),h=async i=>{if(!a.currentLoggedInWallet)return;let v=a.currentLoggedInWallet.labels.find(j=>j.name==i),A=se.Address.createFromRawAddress(l.account.address).plain();if(!v)return;let K=v.addresses.findIndex(j=>j==A);if(K>=0){v.removeAddress(K),a.wallets.saveMyWalletOnlytoLocalStorage(a.currentLoggedInWallet),r.add({severity:"info",summary:"Label",detail:t.value+" is removed as "+i,group:"br-custom",life:5e3});return}v.addresses.push(A),a.wallets.saveMyWalletOnlytoLocalStorage(a.currentLoggedInWallet),r.add({severity:"info",summary:"Label",detail:t.value+" is added as "+i,group:"br-custom",life:5e3})},t=w(()=>{const i=a.currentLoggedInWallet.contacts.find(v=>v.address==l.account.address);return i?i.name:l.account.name}),o=w(()=>{let i=!1,v=a.currentLoggedInWallet.accounts.find(A=>A.name==l.account.name);return v&&v.getDirectParentMultisig().length==0&&(i=!0),i}),n=w(()=>O.nativeToken.label),m=w(()=>O.nativeToken.divisibility),_=w(()=>F.toCurrencyFormat(l.account.balance,m.value)),W=w(()=>{let i=_.value.split(".");return i[1]!=null?{left:i[0],right:i[1]}:{left:i[0],right:null}});let f=new ee("ThemeStyleConfig");f.init();const u=y(me(l.account.address,50,f.jdenticonConfig)),I=E().appContext.config.globalProperties.emitter,M=i=>{let v=document.getElementById(i).getAttribute("copyValue"),A=document.getElementById(i).getAttribute("copySubject");de(v),r.add({severity:"info",detail:A+" "+g("general.copied"),group:"br-custom",life:3e3})},S=w(()=>!!l.account.getDirectParentMultisig().length),H=i=>{const v=a.currentLoggedInWallet.others.find(A=>A.address==i);return v!=null&&v.type=="MULTISIG"&&(s.value=v.address),v},X=i=>F.createAddress(i).pretty(),N=y(!1),P=y(!1);I.on("PAGE_CLICK",()=>{!N.value&&!p.value||!N.value&&p.value&&(p.value=!1)});const z=te(),Y=()=>{if(H(l.account.address)==null)a.currentLoggedInWallet.setDefaultAccountByName(l.account.name);else return};return{currentNativeTokenName:n,splitBalance:W,svgString:u,otherAccount:H,prettyAddress:X,copy:M,isMultiSig:S,accountName:t,displayDefaultAccountMenu:p,multisig_add:s,isHover:N,isHoverCopy:P,isNormalAcc:o,labels:k,updateLabel:h,navigate:()=>{N.value||P.value||(l.account.type?z.push({name:"ViewAccountDetails",params:{address:l.account.address}}):(Y(),le(l.account.address),z.push({name:"ViewAccountDetails",params:{address:l.account.address}})))}}}},D=l=>(Q("data-v-45923937"),l=l(),R(),l),xe={class:"flex gap-2"},we=["innerHTML"],Le={class:"flex flex-col"},Ie={class:"text-blue-primary font-bold text-xs mb-0.5"},Ae={class:"flex justify-around"},ke=["id","title","copyValue","copySubject"],Ce={class:"flex"},We={class:"text-xs font-bold"},Me={key:0,class:"text-xs font-bold"},$e={class:"text-xxs mt-0.5"},Se={class:"ml-1 text-xs font-bold"},Te=D(()=>e("img",{src:fe,class:"h-4 w-4"},null,-1)),De={class:"flex gap-2"},Ne=["title"],Ve=D(()=>e("img",{src:ve,class:"h-4 w-4"},null,-1)),je={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},Be=["title"],Ee=D(()=>e("img",{src:pe,class:"h-3 w-3 mr-1"},null,-1)),He={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},Pe=["title"],ze=D(()=>e("img",{src:ge,class:"h-4 w-4 mr-1"},null,-1)),Ke={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},Oe={class:"absolute flex invisible 2xl:visible pt-4 explicitLeft"},Fe={key:0,class:"text-xs mr-3 border bg-gray-300 rounded-md p-1"},Ue={class:"ml-auto mt-auto mb-auto"},Ge={key:0,class:"mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2",role:"menu","aria-orientation":"vertical","aria-labelledby":"options-menu"},Qe={role:"none",class:"my-2"},Re=D(()=>e("div",{class:"p-2 z-20 text-xs text-gray-400"},"Change Labels",-1)),qe=["onClick"],Je={class:"text-xs"},Xe={key:0,src:_e,class:"h-4 w-4"};function Ye(l,r,g,s,p,k){const h=$("font-awesome-icon");return c(),d("div",{class:"border rounded-lg border-gray-200 p-3 filter shadow-lg cursor-pointer",onClick:r[8]||(r[8]=t=>s.navigate())},[e("div",xe,[e("div",{class:"mt-auto mb-auto",innerHTML:s.svgString},null,8,we),e("div",Le,[e("div",Ie,b(s.accountName),1),e("div",Ae,[e("div",{id:g.account.address,title:s.prettyAddress(g.account.address),class:"text-xs font-bold mt-0.5 mr-2 truncate md:text-clip w-44 md:w-full",copyValue:s.prettyAddress(g.account.address),copySubject:l.$t("general.address")},b(s.prettyAddress(g.account.address)),9,ke),C(h,{onMouseover:r[0]||(r[0]=t=>s.isHoverCopy=!0),onMouseout:r[1]||(r[1]=t=>s.isHoverCopy=!1),icon:"copy",onClick:r[2]||(r[2]=t=>s.copy(g.account.address)),class:"w-5 h-5 text-blue-primary cursor-pointer inline-block"})]),e("div",Ce,[e("div",We,b(s.splitBalance.left),1),s.splitBalance.right!=null?(c(),d("div",Me,".")):x("v-if",!0),e("div",$e,b(s.splitBalance.right),1),e("div",Se,b(s.currentNativeTokenName),1),Te]),e("div",De,[g.account.default?(c(),d("div",{key:0,class:"px-1 py-0.5 flex items-center bg-blue-primary rounded-sm",title:l.$t("general.defaultTitle")},[Ve,e("p",je,b(l.$t("general.default")),1)],8,Ne)):x("v-if",!0),s.isMultiSig?(c(),d("div",{key:1,class:"px-1 py-0.5 flex items-center bg-green-500 rounded-sm",title:l.$t("general.multisigTitle")},[Ee,e("p",He,b(l.$t("general.multisig")),1)],8,Be)):x("v-if",!0),s.isMultiSig&&!s.otherAccount(g.account.address)?(c(),d("div",{key:2,class:"px-1 py-0.5 flex items-center bg-purple-500 rounded-sm",title:l.$t("general.ownerTitle")},[ze,e("p",Ke,b(l.$t("general.owner")),1)],8,Pe)):x("v-if",!0)])]),e("div",Oe,[(c(!0),d(T,null,V(s.labels,(t,o)=>(c(),d("div",{key:o},[t.isLabeled?(c(),d("div",Fe,b(t.name),1)):x("v-if",!0)]))),128))]),e("div",Ue,[e("img",{src:ye,class:"h-6 w-6 cursor-pointer",onMouseover:r[3]||(r[3]=t=>s.isHover=!0),onMouseout:r[4]||(r[4]=t=>s.isHover=!1),onClick:r[5]||(r[5]=t=>s.displayDefaultAccountMenu=!0)},null,32),e("div",{class:"relative",onMouseover:r[6]||(r[6]=t=>s.isHover=!0),onMouseout:r[7]||(r[7]=t=>s.isHover=!1)},[s.displayDefaultAccountMenu?(c(),d("div",Ge,[e("div",Qe,[x(` <router-link  :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.details')}}</router-link> `),x(' <hr class="solid"> '),Re,(c(!0),d(T,null,V(s.labels,(t,o)=>(c(),d("div",{key:o},[e("div",{onClick:n=>s.updateLabel(t.name),class:"flex justify-between p-2 cursor-pointer"},[e("div",Je,b(t.name),1),t.isLabeled?(c(),d("img",Xe)):x("v-if",!0)],8,qe)]))),128))])])):x("v-if",!0)],32)])])])}const Ze=B(he,[["render",Ye],["__scopeId","data-v-45923937"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/account/components/AccountTile.vue"]]),et={class:"flex flex-col"},tt=e("div",null,"Labels",-1),st={key:0,src:q,class:"w-3 ml-2 h-3",style:{"margin-top":"0.12em"}},lt={key:1,src:q,class:"w-3 ml-2 h-3",style:{"margin-top":"0.12em",transform:"rotate(180deg)"}},nt={key:0,class:"relative"},ot={class:"absolute border-t-0 w-52 border bg-white"},at={class:"flex flex-col max-h-44 overflow-auto"},rt=["onClick"],it={class:"text-xs mt-0.5"},ct=e("div",null,"Create Label",-1),ut={key:0,class:"popup-outer fixed flex z-50"},dt={class:"modal-popup-box"},mt={key:0,class:"error error_box mb-3"},ft=e("div",{class:"text-center my-2 text-xs font-semibold"},"Create Label",-1),vt={name:"LabelComponent"},gt=ne({...vt,setup(l){const g=E().appContext.config.globalProperties.emitter,s=G(),p=y(!1),k=y(!1),h=y(!1),t=y(""),o=y(""),n=y([]),m=w(()=>a.currentLoggedInWallet?a.currentLoggedInWallet.labels:[]);for(let f=0;f<m.value.length;f++)n.value.push(!1);U(m,(f,u)=>{n.value=[];for(let L=0;L<f.length;L++)n.value.push(!1)},{deep:!0}),U(n,f=>{let u=[];f.length==m.value.length&&(f.forEach((L,I)=>{L&&u.push(m.value[I].name)}),g.emit("filterByLabel",u))},{deep:!0});const _=async()=>{if(!a.currentLoggedInWallet)return;if(o.value=o.value.trim(),o.value==""){t.value="Label name cannot be empty.";return}if(a.currentLoggedInWallet.labels.find(L=>L.name==o.value)){t.value="Label is already existed in wallet.";return}let u=new ae(o.value,[]);a.currentLoggedInWallet.addLabel(u),await a.wallets.saveMyWalletOnlytoLocalStorage(a.currentLoggedInWallet),t.value="",o.value="",s.add({severity:"info",summary:"Label",detail:"New Label is Created",group:"br-custom",life:5e3}),k.value=!1},W=async f=>{a.currentLoggedInWallet&&(a.currentLoggedInWallet.removeLabel(f),await a.wallets.saveMyWalletOnlytoLocalStorage(a.currentLoggedInWallet),s.add({severity:"info",summary:"Label",detail:"Label is removed",group:"br-custom",life:5e3}),h.value=!1)};return(f,u)=>{const L=$("font-awesome-icon");return c(),d(T,null,[e("div",et,[e("div",{onClick:u[0]||(u[0]=I=>p.value=!p.value),class:"border p-2 cursor-pointer w-52 bg-white text-xs justify-between flex"},[tt,p.value?(c(),d("img",lt)):(c(),d("img",st))]),p.value?(c(),d("div",nt,[e("div",ot,[e("div",at,[(c(!0),d(T,null,V(m.value,(I,M)=>(c(),d("div",{key:M},[e("div",{onClick:S=>h.value?"":n.value[M]=!n.value[M],class:oe(`${n.value[M]?"bg-blue-300 flex cursor-pointer p-2 hover:bg-blue-300 ":"flex cursor-pointer p-2 hover:bg-blue-300 "}`)},[C(L,{icon:"tag",class:"w-4 h-4 mr-3 thin"}),e("div",it,b(I.name),1),C(L,{icon:"trash",onMouseover:u[1]||(u[1]=S=>h.value=!0),onMouseout:u[2]||(u[2]=S=>h.value=!1),onClick:S=>W(M),title:"Remove label",class:"ml-auto w-3 h-3 cursor-pointer mt-0.5"},null,8,["onClick"])],10,rt)]))),128)),e("div",{onClick:u[3]||(u[3]=I=>{k.value=!0,p.value=!1}),class:"text-xs cursor-pointer flex gap-3 p-2 hover:bg-blue-300"},[C(L,{icon:"plus",class:"w-3 h-3 mr-1"}),ct])])])])):x("v-if",!0)]),k.value?(c(),d("div",ut,[e("div",dt,[e("div",null,[t.value!=""?(c(),d("div",mt,b(t.value),1)):x("v-if",!0),ft,C(be,{placeholder:"Label Name",modelValue:o.value,"onUpdate:modelValue":u[4]||(u[4]=I=>o.value=I)},null,8,["modelValue"]),e("div",{onClick:u[5]||(u[5]=I=>_()),class:"blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto"},b(f.$t("general.confirm")),1),e("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:u[6]||(u[6]=I=>k.value=!1)},b(f.$t("general.cancel")),1)])])])):x("v-if",!0)],64)}}}),pt=B(gt,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/account/components/LabelComponent.vue"]]);const _t={name:"ViewAccountDisplayAll",components:{AccountTile:Ze,LabelComponent:pt},setup(){const r=E().appContext.config.globalProperties.emitter;w(()=>{if(!a.currentLoggedInWallet)return[];let t=a.currentLoggedInWallet.accounts.map(n=>({name:n.name,balance:n.balance,address:n.address,publicKey:n.publicKey,isMultisig:!!n.getDirectParentMultisig().length,multisigInfo:n.multisigInfo})),o=a.currentLoggedInWallet.others.filter(n=>n.type==="MULTISIG").map(n=>({name:n.name,balance:n.balance,address:n.address,publicKey:n.publicKey,isMultisig:!0,multisigInfo:n.multisigInfo}));return t.concat(o)});const g=y([]),s=w(()=>{if(a.currentLoggedInWallet)if(a.currentLoggedInWallet.others){const t=a.currentLoggedInWallet.accounts.concat(a.currentLoggedInWallet.others);let o=[];return g.value.forEach(n=>{let m=a.currentLoggedInWallet.labels.find(_=>_.name==n);m&&m.addresses.forEach(_=>{let W=t.find(f=>f.address==_);o.push(W)})}),o=Array.from(new Set(o)),g.value.length?o:t}else{const t=a.currentLoggedInWallet.accounts;let o=[];return g.value.forEach(n=>{let m=a.currentLoggedInWallet.labels.find(_=>_.name==n);m&&m.addresses.forEach(_=>{let W=t.find(f=>f.address==_);o.push(W)})}),o=Array.from(new Set(o)),g.value.length?o:t}else return null});r.on("filterByLabel",t=>{g.value=t});const p=y(""),k=w(()=>{const t=p.value.toLowerCase();return p.value==""?h(s.value):s.value.filter(o=>o.name.toLowerCase().includes(t)||o.address.toLowerCase().includes(t.replace(/-/g,"")))});function h(t){if(t!==null){var o=t.reduce((n,m)=>(n.some(_=>_.address===m.address&&_.name===m.name)||n.push(m),n),[]);return o}}return{accounts:s,filterQuery:p,filteredAccounts:k}}},J=l=>(Q("data-v-447b24e0"),l=l(),R(),l),bt={class:"my-4 w-11/12 ml-auto mr-auto flex flex-col sm:flex-row justify-between"},yt=J(()=>e("div",{class:"absolute invisible 2xl:visible text-gray-500 mt-1 explicitLeft"},"Labels",-1)),ht={class:"mt-3 sm:mt-0 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2"},xt={class:"mt-2 py-3"},wt={class:"w-11/12 ml-auto mr-auto flex flex-col gap-3"},Lt={class:"flex items-center"},It=["placeholder"],At=J(()=>e("div",{class:"mb-36"},null,-1));function kt(l,r,g,s,p,k){const h=$("LabelComponent"),t=$("router-link"),o=$("font-awesome-icon"),n=$("AccountTile");return c(),d("div",null,[e("div",bt,[C(h),yt,C(t,{to:{name:"ViewAccountCreateSelectType"}},{default:re(()=>[e("div",ht,"+ "+b(l.$t("general.createNewAcc")),1)]),_:1})]),e("div",xt,[e("div",wt,[e("div",Lt,[C(o,{icon:"search",class:"text-blue-link mr-1"}),ie(e("input",{"onUpdate:modelValue":r[0]||(r[0]=m=>s.filterQuery=m),type:"text",class:"py-2 px-2 outline-none text-xs text-black",placeholder:l.$t("general.search")},null,8,It),[[ce,s.filterQuery]])]),(c(!0),d(T,null,V(s.filteredAccounts,(m,_)=>(c(),ue(n,{key:_,account:m},null,8,["account"]))),128))])]),At])}const Et=B(_t,[["render",kt],["__scopeId","data-v-447b24e0"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/account/views/ViewAccountDisplayAll.vue"]]);export{Et as default};