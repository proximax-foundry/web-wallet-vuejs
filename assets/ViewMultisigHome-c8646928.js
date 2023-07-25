import{d as ee,u as te,D as se,c as C,w as n,r as V,E as M,B as i,q as re,W as ae,k as j,o as c,b as u,e as a,s as v,t as d,z as F,A as B,f,F as ne,i as le,C as D,aU as oe,a0 as K,n as b,_ as ie}from"./index-f81de996.js";import{c as de}from"./functions-ee8fa276.js";import{M as ce}from"./multisigUtils-558cd5cc.js";import{A as ue,a as me}from"./AccountTabs-9e5c8eeb.js";import"./jdenticon-module-7161194d.js";import"./TextInput-3c8a9d79.js";import"./TextInputClean-1671b736.js";import"./icon-key-5b3f7dda.js";const fe="/web-wallet-vuejs/assets/chevron_right-3f95020a.svg",pe={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},ge={class:"p-6 border-2 border-t-0"},ve={key:0,class:"flex cursor-pointer"},be={class:"border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold"},ye={class:"text-xs font-semibold"},Ae={class:"border p-4 my-3"},we={class:"flex flex-col gap-2"},he=["onClick"],xe={class:"text-txs font-semibold text-blue-primary"},_e={class:"flex"},ke=["id","copyValue","copySubject","title"],Ie={key:0,class:"w-5 h-5 ml-auto",src:fe},Le={key:0,class:"text-blue-primary text-xs text-center font-semibold"},Ce={class:"flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center justify-center"},Me={key:0},We=a("div",{class:"gray-line my-8"},null,-1),$e={class:"text-xs font-semibold"},Se={class:"border p-4 mt-3"},Ve={key:0,class:"w-full"},Fe={key:1,class:"text-blue-primary text-xs text-center font-semibold"},Ne={key:2,class:"flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center"},Pe={key:0},Re=ee({__name:"ViewMultisigHome",props:{address:String},setup(y){const N=y,{t:H}=te(),U=se(),m=C(()=>{if(!n.currentLoggedInWallet)return null;let e=n.currentLoggedInWallet.accounts.find(t=>t.address==N.address)||n.currentLoggedInWallet.others.find(t=>t.address==N.address);return e||null}),A=e=>i.Address.createFromRawAddress(e).plain(),p=e=>{let t=A(e);return(n.currentLoggedInWallet.accounts.find(r=>r.address==t)||n.currentLoggedInWallet.others.find(r=>r.address==t))!=null},P=e=>{let t=i.Address.createFromRawAddress(e).plain();return!!n.currentLoggedInWallet.others.find(s=>s.address==t)},w=V(!1),W=M.networkType,x=e=>i.Address.createFromPublicKey(e,W),R=e=>n.currentLoggedInWallet.accounts.find(t=>t.address==x(e).plain())?n.currentLoggedInWallet.accounts.find(t=>t.address==x(e).plain()):n.currentLoggedInWallet.others.find(t=>t.address==x(e).plain()),O=e=>{const t=i.PublicAccount.createFromPublicKey(e,W).address.plain(),s=n.currentLoggedInWallet.contacts.find(r=>r.address==t);return s?s.name:R(e)?R(e).name:`Cosigner-${x(e).plain().substr(-4)}`};let q=C(()=>{if(!m.value)return[];let e=[];return m.value.multisigInfo.filter(s=>s.level==1).forEach(s=>e.push({name:O(s.publicKey),address:i.PublicAccount.createFromPublicKey(s.publicKey,W).address.pretty()})),e}),z=ce.checkIsMultiSig(m.value?m.value.address:"");w.value=z;const Z=e=>{let t=document.getElementById(e).getAttribute("copyValue"),s=document.getElementById(e).getAttribute("copySubject");de(t),U.add({severity:"info",detail:s+" "+H("general.copied"),group:"br-custom",life:3e3})},_=V(!1),k=re(),T=e=>{n.currentLoggedInWallet.accounts.find(t=>t.name==e)&&n.currentLoggedInWallet.setDefaultAccountByName(e)},I=e=>{let t=n.currentLoggedInWallet.accounts.find(s=>s.address==e)||n.currentLoggedInWallet.others.find(s=>s.address==e);return t?t.name:""},G=e=>{if(p(e)&&!_.value&&!P(e)?(T(I(i.Address.createFromRawAddress(e).plain())),K(i.Address.createFromRawAddress(e).plain()),k.push({name:"ViewAccountDetails",params:{address:A(e)}})):p(e)&&k.push({name:"ViewAccountDetails",params:{address:A(e)}}),!b.currentNetworkProfile)return"";p(e)||window.open(b.currentNetworkProfile.chainExplorer.url+"/"+b.currentNetworkProfile.chainExplorer.addressRoute+"/"+e)},$=C(()=>{let e=[];if(!M.isReady||!M.chainAPI||!m.value)return e;const t=[...m.value.multisigInfo.filter(r=>r.level<0)],s=Math.min(...t.map(r=>r.level));if(s==1/0)return e;for(let r=0;r<Math.abs(s);r++){const l=t.filter(o=>o.level==-Math.abs(r+1)).map(o=>ae.createAddressFromPublicKey(o.publicKey,M.networkType).pretty());e.push({key:(r+1).toString(),label:"Level "+(r+1).toString(),selectable:!1,children:l.map((o,h)=>{const E=n.currentLoggedInWallet.accounts.find(S=>S.address==i.Address.createFromRawAddress(o).plain())||n.currentLoggedInWallet.accounts.find(S=>S.address==i.Address.createFromRawAddress(o).plain());return{type:"child",key:"0-"+h.toString(),balance:E?E.balance:null,label:I(i.Address.createFromRawAddress(o).plain())?I(i.Address.createFromRawAddress(o).plain()):o,data:o,selectable:!0}})})}return e}),L=C(()=>$.value.length),J=e=>{if(p(e.data)&&!_.value&&!P(e.data)?(T(I(i.Address.createFromRawAddress(e.data).plain())),K(i.Address.createFromRawAddress(e.data).plain()),k.push({name:"ViewAccountDetails",params:{address:A(e.data)}})):p(e.data)&&k.push({name:"ViewAccountDetails",params:{address:A(e.data)}}),!b.currentNetworkProfile)return"";p(e.data)||window.open(b.currentNetworkProfile.chainExplorer.url+"/"+b.currentNetworkProfile.chainExplorer.addressRoute+"/"+e.data)},g=V({}),Q=()=>{for(let e of $.value)Y(e);g.value={...g.value}},X=()=>{g.value={}},Y=e=>{e.children&&e.children.length&&(g.value[e.key]=!0)};return(e,t)=>{const s=j("router-link"),r=j("font-awesome-icon");return c(),u("div",null,[a("div",pe,[v(ue,{address:y.address,class:"mb-6"},null,8,["address"]),v(me,{address:y.address,selected:"multisig"},null,8,["address"]),a("div",ge,[w.value?(c(),u("div",ve,[a("div",be,d(e.$t("general.multisig")),1),v(s,{to:{name:"ViewMultisigScheme",params:{address:y.address}},class:"border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold"},{default:F(()=>[B(d(e.$t("general.scheme")),1)]),_:1},8,["to"])])):f("v-if",!0),a("div",ye,d(e.$t("multisig.accountCosignatories")),1),a("div",Ae,[a("div",we,[(c(!0),u(ne,null,le(D(q),(l,o)=>(c(),u("div",{key:o},[a("div",{class:"border w-full cursor-pointer rounded-md p-3",onClick:h=>G(l.address)},[a("div",xe,d(l.name),1),a("div",_e,[a("div",{id:`cosignerAddress${o}`,copyValue:l.address,copySubject:e.$t("general.address"),title:l.address,class:"truncate md:text-clip md:w-auto text-txs font-bold mt-1"},d(l.address),9,ke),v(r,{icon:"copy",onMouseover:t[0]||(t[0]=h=>_.value=!0),onMouseout:t[1]||(t[1]=h=>_.value=!1),title:e.$t("general.copy"),onClick:h=>Z(`cosignerAddress${o}`),class:"ml-2 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title","onClick"]),p(l.address)?(c(),u("img",Ie)):f("v-if",!0)])],8,he)]))),128))]),w.value?f("v-if",!0):(c(),u("div",Le,d(e.$t("general.ntgToShow")),1)),a("div",Ce,[w.value?f("v-if",!0):(c(),u("span",Me,d(e.$t("multisig.noCosigner",{name:m.value?m.value.name:""})),1))])]),v(s,{to:{name:w.value?"ViewMultisigEditAccount":"ViewMultisigConvertAccount",params:{address:y.address}},class:"blue-btn py-2 px-2"},{default:F(()=>[B(d(e.$t("multisig.manageCosignatories")),1)]),_:1},8,["to"]),We,a("div",$e,d(e.$t("multisig.cosignatoryOf")),1),a("div",Se,[L.value?(c(),u("div",Ve,[a("button",{class:"mr-5 w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",onClick:t[2]||(t[2]=l=>Q())}," Expand All "),a("button",{class:"w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",onClick:t[3]||(t[3]=l=>X())}," Collapse All "),v(D(oe),{expandedKeys:g.value,"onUpdate:expandedKeys":t[4]||(t[4]=l=>g.value=l),value:$.value,filter:!0,filterMode:"strict",onNodeSelect:J,selectionMode:"single",class:"mt-4"},{default:F(l=>[a("div",null,d(l.node.label),1)]),_:1},8,["expandedKeys","value"])])):f("v-if",!0),L.value?f("v-if",!0):(c(),u("div",Fe,d(e.$t("general.ntgToShow")),1)),L.value?f("v-if",!0):(c(),u("div",Ne,[L.value?f("v-if",!0):(c(),u("span",Pe,d(e.$t("multisig.noMultisig",{name:m.value?m.value.name:""})),1))]))])])])])}}});const Oe=ie(Re,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/account/submodule/multisig/views/ViewMultisigHome.vue"]]);export{Oe as default};