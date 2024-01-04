import{_ as W,d as B,i as _,b as $,e,m as w,v as h,t as r,Y as F,A as T,l as A,u as E,c as v,B as M,n as N,r as V,o as U,x as S,C as y,W as g,w as I}from"./index-f0fab120.js";import{I as H}from"./IntroTextComponent-4d620565.js";import{S as J}from"./SelectNetworkInput-a373f77a.js";import{_ as L}from"./chevron_left-0423cb29.js";import"./delete-8b454e7f.js";const O=B({name:"ViewWalletCreateSelection",components:{IntroTextComponent:H,SelectNetworkInput:J},setup(){const a=F(),l=T(),k=A(),{t}=E(),f=v(()=>M.networkType),n=v(()=>N.chainNetworkName),x=V(""),p=o=>{const c=o.target.files[0],s=new FileReader;s.onload=i=>{const C=y.enc.Base64.parse(i.target.result);try{const m=JSON.parse(C.toString(y.enc.Utf8));if(m.networkName===void 0||m.networkName!==n.value)a.require({message:t("wallet.importMsg",{network:n.value}),header:t("wallet.confirmImport"),acceptLabel:t("general.yes"),rejectLabel:t("general.no"),icon:"pi pi-exclamation-triangle",accept:()=>{var u=d(m);l.add({severity:u.status,detail:u.msg,group:"br-custom",life:3e3}),k.push({name:"Home"})}});else{var b=d(m);l.add({severity:b.status,detail:b.msg,group:"br-custom",life:3e3})}}catch{let u=t("wallet.importFail");l.add({severity:"error",detail:u,group:"br-custom",life:5e3})}},s.readAsText(c)},d=o=>{let c="success",s=t("wallet.importSuccess");if(g.checkIsNewFormat(o))try{g.importWalletNewFormat(I.wallets,o,n.value,f.value)}catch(i){c="error",i.name==="SAME_NAME"?s=t("wallet.walletNameExist"):s=t("wallet.unableImport")}else try{g.importWltOldFormat(I.wallets,o,n.value,f.value)}catch(i){c="error",i.name==="SAME_NAME"?s=t("wallet.walletNameExist"):s=t("wallet.unableImport")}return{msg:s,status:c}};return{networkState:N,walletFile:x,readWalletBackup:p}}}),R={class:"container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 gap-4"},j={class:"md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md"},q=e("img",{src:L,class:"w-5 inline-block"},null,-1),D={class:"text-lg text-center mt-16 font-semibold"},Y={class:"text-xxs text-center text-blue-primary font-bold uppercase"},z={class:"text-xs mt-8 ml-auto mr-auto w-8/12 text-center mb-5"},G={class:"cursor-pointer"},K={class:"mt-3 font-bold text-xs text-center blue-btn py-2 px-10 block ml-auto mr-auto w-8/12"},P={class:"text-center text-xs mt-6 mb-1"},Q={class:"text-center text-xs text-blue-primary font-semibold"},X=e("div",{class:"h-28"},null,-1);function Z(a,l,k,t,f,n){const x=_("IntroTextComponent"),p=_("router-link"),d=_("SelectNetworkInput");return U(),$("div",null,[e("div",R,[w(x),e("div",j,[w(p,{to:{name:"ViewWalletCreateSelection"},class:"text-xs m-2 text-blue-link items-center flex"},{default:h(()=>[q,S("Back")]),_:1}),e("div",D,r(a.$t("wallet.createWallet")),1),e("div",Y,r(a.$t("wallet.fromBackUp")),1),e("div",z,r(a.$t("wallet.backUpDescription")),1),w(d),e("label",G,[e("span",K,r(a.$t("wallet.importFile")),1),e("input",{type:"file",onChange:l[0]||(l[0]=(...o)=>a.readWalletBackup&&a.readWalletBackup(...o)),ref:"walletFile",hidden:""},null,544)]),e("div",P,r(a.$t("wallet.haveWallet")),1),e("div",Q,[w(p,{to:{name:"Home"}},{default:h(()=>[S(r(a.$t("wallet.signInHere"))+" >",1)]),_:1})]),X])])])}const le=W(O,[["render",Z]]);export{le as default};