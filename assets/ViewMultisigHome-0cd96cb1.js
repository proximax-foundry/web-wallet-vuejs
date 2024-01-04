import{d as ee,u as te,A as se,c as $,w as n,r as F,B as C,z as i,l as re,W as ae,i as B,o as c,b as u,e as a,m as v,t as d,v as V,x as D,f as p,F as ne,g as le,y as j,aZ as oe,a0 as K,n as y}from"./index-f0fab120.js";import{c as ie}from"./functions-f2e6f536.js";import{M as de}from"./multisigUtils-0873cd27.js";import{A as ce,_ as ue}from"./AccountTabs.vue_vue_type_script_setup_true_lang-f659e8e4.js";import"./jdenticon-module-f8a9db48.js";import"./TextInput-806b984f.js";import"./TextInputClean-5d304c85.js";import"./icon-key-5b3f7dda.js";const me="/web-wallet-vuejs/assets/chevron_right-3f95020a.svg",pe={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},fe={class:"p-6 border-2 border-t-0"},ge={key:0,class:"flex cursor-pointer"},ve={class:"border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold"},ye={class:"text-xs font-semibold"},Ae={class:"border p-4 my-3"},be={class:"flex flex-col gap-2"},we=["onClick"],he={class:"text-txs font-semibold text-blue-primary"},xe={class:"flex"},_e=["id","copyValue","copySubject","title"],ke={key:0,class:"w-5 h-5 ml-auto",src:me},Ie={key:0,class:"text-blue-primary text-xs text-center font-semibold"},Le={class:"flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center justify-center"},$e={key:0},Ce=a("div",{class:"gray-line my-8"},null,-1),We={class:"text-xs font-semibold"},Me={class:"border p-4 mt-3"},Se={key:0,class:"w-full"},Fe={key:1,class:"text-blue-primary text-xs text-center font-semibold"},Ve={key:2,class:"flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center"},Ne={key:0},He=ee({__name:"ViewMultisigHome",props:{address:String},setup(A){const N=A,{t:H}=te(),U=se(),m=$(()=>{if(!n.currentLoggedInWallet)return null;let e=n.currentLoggedInWallet.accounts.find(t=>t.address==N.address)||n.currentLoggedInWallet.others.find(t=>t.address==N.address);return e||null}),b=e=>i.Address.createFromRawAddress(e).plain(),f=e=>{let t=b(e);return(n.currentLoggedInWallet.accounts.find(r=>r.address==t)||n.currentLoggedInWallet.others.find(r=>r.address==t))!=null},P=e=>{let t=i.Address.createFromRawAddress(e).plain();return!!n.currentLoggedInWallet.others.find(s=>s.address==t)},w=F(!1),W=C.networkType,x=e=>i.Address.createFromPublicKey(e,W),R=e=>n.currentLoggedInWallet.accounts.find(t=>t.address==x(e).plain())?n.currentLoggedInWallet.accounts.find(t=>t.address==x(e).plain()):n.currentLoggedInWallet.others.find(t=>t.address==x(e).plain()),O=e=>{const t=i.PublicAccount.createFromPublicKey(e,W).address.plain(),s=n.currentLoggedInWallet.contacts.find(r=>r.address==t);return s?s.name:R(e)?R(e).name:`Cosigner-${x(e).plain().substr(-4)}`};let Z=$(()=>{if(!m.value)return[];let e=[];return m.value.multisigInfo.filter(s=>s.level==1).forEach(s=>e.push({name:O(s.publicKey),address:i.PublicAccount.createFromPublicKey(s.publicKey,W).address.pretty()})),e}),z=de.checkIsMultiSig(m.value?m.value.address:"");w.value=z;const q=e=>{let t=document.getElementById(e).getAttribute("copyValue"),s=document.getElementById(e).getAttribute("copySubject");ie(t),U.add({severity:"info",detail:s+" "+H("general.copied"),group:"br-custom",life:3e3})},_=F(!1),k=re(),T=e=>{n.currentLoggedInWallet.accounts.find(t=>t.name==e)&&n.currentLoggedInWallet.setDefaultAccountByName(e)},I=e=>{let t=n.currentLoggedInWallet.accounts.find(s=>s.address==e)||n.currentLoggedInWallet.others.find(s=>s.address==e);return t?t.name:""},G=e=>{if(f(e)&&!_.value&&!P(e)?(T(I(i.Address.createFromRawAddress(e).plain())),K(i.Address.createFromRawAddress(e).plain()),k.push({name:"ViewAccountDetails",params:{address:b(e)}})):f(e)&&k.push({name:"ViewAccountDetails",params:{address:b(e)}}),!y.currentNetworkProfile)return"";f(e)||window.open(y.currentNetworkProfile.chainExplorer.url+"/"+y.currentNetworkProfile.chainExplorer.addressRoute+"/"+e)},M=$(()=>{let e=[];if(!C.isReady||!C.chainAPI||!m.value)return e;const t=[...m.value.multisigInfo.filter(r=>r.level<0)],s=Math.min(...t.map(r=>r.level));if(s==1/0)return e;for(let r=0;r<Math.abs(s);r++){const l=t.filter(o=>o.level==-Math.abs(r+1)).map(o=>ae.createAddressFromPublicKey(o.publicKey,C.networkType).pretty());e.push({key:(r+1).toString(),label:"Level "+(r+1).toString(),selectable:!1,children:l.map((o,h)=>{const E=n.currentLoggedInWallet.accounts.find(S=>S.address==i.Address.createFromRawAddress(o).plain())||n.currentLoggedInWallet.accounts.find(S=>S.address==i.Address.createFromRawAddress(o).plain());return{type:"child",key:"0-"+h.toString(),balance:E?E.balance:null,label:I(i.Address.createFromRawAddress(o).plain())?I(i.Address.createFromRawAddress(o).plain()):o,data:o,selectable:!0}})})}return e}),L=$(()=>M.value.length),J=e=>{if(f(e.data)&&!_.value&&!P(e.data)?(T(I(i.Address.createFromRawAddress(e.data).plain())),K(i.Address.createFromRawAddress(e.data).plain()),k.push({name:"ViewAccountDetails",params:{address:b(e.data)}})):f(e.data)&&k.push({name:"ViewAccountDetails",params:{address:b(e.data)}}),!y.currentNetworkProfile)return"";f(e.data)||window.open(y.currentNetworkProfile.chainExplorer.url+"/"+y.currentNetworkProfile.chainExplorer.addressRoute+"/"+e.data)},g=F({}),Q=()=>{for(let e of M.value)Y(e);g.value={...g.value}},X=()=>{g.value={}},Y=e=>{e.children&&e.children.length&&(g.value[e.key]=!0)};return(e,t)=>{const s=B("router-link"),r=B("font-awesome-icon");return c(),u("div",null,[a("div",pe,[v(ce,{address:A.address,class:"mb-6"},null,8,["address"]),v(ue,{address:A.address,selected:"multisig"},null,8,["address"]),a("div",fe,[w.value?(c(),u("div",ge,[a("div",ve,d(e.$t("general.multisig")),1),v(s,{to:{name:"ViewMultisigScheme",params:{address:A.address}},class:"border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold"},{default:V(()=>[D(d(e.$t("general.scheme")),1)]),_:1},8,["to"])])):p("",!0),a("div",ye,d(e.$t("multisig.accountCosignatories")),1),a("div",Ae,[a("div",be,[(c(!0),u(ne,null,le(j(Z),(l,o)=>(c(),u("div",{key:o},[a("div",{class:"border w-full cursor-pointer rounded-md p-3",onClick:h=>G(l.address)},[a("div",he,d(l.name),1),a("div",xe,[a("div",{id:`cosignerAddress${o}`,copyValue:l.address,copySubject:e.$t("general.address"),title:l.address,class:"truncate md:text-clip md:w-auto text-txs font-bold mt-1"},d(l.address),9,_e),v(r,{icon:"copy",onMouseover:t[0]||(t[0]=h=>_.value=!0),onMouseout:t[1]||(t[1]=h=>_.value=!1),title:e.$t("general.copy"),onClick:h=>q(`cosignerAddress${o}`),class:"ml-2 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title","onClick"]),f(l.address)?(c(),u("img",ke)):p("",!0)])],8,we)]))),128))]),w.value?p("",!0):(c(),u("div",Ie,d(e.$t("general.ntgToShow")),1)),a("div",Le,[w.value?p("",!0):(c(),u("span",$e,d(e.$t("multisig.noCosigner",{name:m.value?m.value.name:""})),1))])]),v(s,{to:{name:w.value?"ViewMultisigEditAccount":"ViewMultisigConvertAccount",params:{address:A.address}},class:"blue-btn py-2 px-2"},{default:V(()=>[D(d(e.$t("multisig.manageCosignatories")),1)]),_:1},8,["to"]),Ce,a("div",We,d(e.$t("multisig.cosignatoryOf")),1),a("div",Me,[L.value?(c(),u("div",Se,[a("button",{class:"mr-5 w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",onClick:t[2]||(t[2]=l=>Q())}," Expand All "),a("button",{class:"w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",onClick:t[3]||(t[3]=l=>X())}," Collapse All "),v(j(oe),{expandedKeys:g.value,"onUpdate:expandedKeys":t[4]||(t[4]=l=>g.value=l),value:M.value,filter:!0,filterMode:"strict",onNodeSelect:J,selectionMode:"single",class:"mt-4"},{default:V(l=>[a("div",null,d(l.node.label),1)]),_:1},8,["expandedKeys","value"])])):p("",!0),L.value?p("",!0):(c(),u("div",Fe,d(e.$t("general.ntgToShow")),1)),L.value?p("",!0):(c(),u("div",Ve,[L.value?p("",!0):(c(),u("span",Ne,d(e.$t("multisig.noMultisig",{name:m.value?m.value.name:""})),1))]))])])])])}}});export{He as default};