import{_ as Y,d as G,c as g,E as T,u as J,D as Q,n as j,r,I as X,k as y,o as c,b as f,s as i,e as t,z as V,A,t as l,v as O,f as b,m as W,Y as Z,W as B,w as ee,B as te,p as oe,j as le}from"./index-f81de996.js";import{T as se}from"./TextInput-3c8a9d79.js";import{P as ae}from"./PasswordInput-0dd59ef4.js";import{c as re}from"./functions-ee8fa276.js";import{I as ne}from"./IntroTextComponent-12387814.js";import{S as ie}from"./SelectNetworkInput-aa82116a.js";import{t as de}from"./jdenticon-module-7161194d.js";import{E as ce}from"./jspdf.es.min-b2c6edd1.js";import{q as pe}from"./qrcode-f6eb3cfa.js";import{p as ue}from"./pdfPaperWalletBackground-9b716104.js";import{_ as me}from"./chevron_left-0423cb29.js";import{_ as ve}from"./icon-green-tick-1b766454.js";const we=G({name:"ViewWalletCreatePrivateKey",components:{TextInput:se,PasswordInput:ae,IntroTextComponent:ne,SelectNetworkInput:ie},data(){return{showPK:!1}},setup(){const e=g(()=>T.nativeToken.label),{t:o}=J(),S=Q(),$=g(()=>T.networkType),_=g(()=>j.chainNetworkName),P=r(""),I=r(""),d=r(""),p=r(""),u=r(""),m=r(""),a=r(""),s=r(!1),K="^(0x|0X)?[a-fA-F0-9].{63,65}$",M="^[^ ]{8,}$",H=r(!1),C=r(""),N=r(""),x=r(""),E=new X("ThemeStyleConfig");E.init();const U=r(de(C.value,100,E.jdenticonConfig)),D=n=>{let h=document.getElementById(n).getAttribute("copyValue"),v=document.getElementById(n).getAttribute("copySubject");re(h),S.add({severity:"info",detail:v+" "+o("general.copied"),group:"br-custom",life:3e3})},L=g(()=>!(d.value!==""&&p.value.match(M)&&m.value===p.value&&a.value.match(K))),q=g(()=>!a.value.match(K)&&a.value!=""),z=g(()=>m.value!=p.value&&m.value!=""),F=()=>{if(P.value="",new Z().filterByNetworkNameAndName(_.value,d.value))P.value=o("wallet.walletNameExist");else{let h=B.createPassword(p.value);const v=B.addNewWalletWithPrivateKey(ee.wallets,a.value,h,d.value,_.value,$.value);u.value=a.value,I.value=v,x.value=v.name;let w=te.Account.createFromPrivateKey(u.value,$.value,1);C.value=w.address.pretty(),N.value=w.publicKey}},R=(n,h=2,v=0)=>{const w=pe(10,"H");return w.addData(n),w.make(),w.createDataURL(h,v)};return{showPkError:q,networkState:j,err:P,newWallet:I,selectedNetworkName:_,selectedNetworkType:$,walletName:d,passwd:p,confirmPasswd:m,privateKeyInput:a,privateKey:u,showPasswdError:s,showConfirmPasswdError:z,passwdPattern:M,privKeyPattern:K,createWallet:F,disableCreate:L,clearInput:()=>{d.value="",p.value="",m.value="",a.value=""},copy:D,currentNativeTokenName:e,svgString:U,toggleModal:H,saveWalletPaper:()=>{const n=new ce({unit:"px"});n.addImage(ue,"JPEG",120,60,205,132),n.addImage(R(u.value,1,0),151.5,105),n.setFontSize(8),n.setTextColor("#000000"),n.text(C.value,146,164,{maxWidth:132}),n.save("Your_Paper_Wallet")},address:C,publicKey:N,accName:x}}}),k=e=>(oe("data-v-61e9fd37"),e=e(),le(),e),ge={key:0,class:"container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 gap-4"},ye={class:"md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md"},fe=k(()=>t("img",{src:me,class:"w-5 inline-block"},null,-1)),be={class:"text-sm text-center mt-20 font-semibold"},he={class:"text-xxs text-center text-blue-primary mb-5 font-bold uppercase"},ke={class:"w-9/12 ml-auto mr-auto text-xs text-center"},$e={class:"mt-4 w-8/12 ml-auto mr-auto"},_e={key:0,class:"error error_box"},Pe={class:"mt-3 w-8/12 ml-auto mr-auto"},Ie=["disabled"],Ce={class:"mt-12 text-center text-xs mt-6 mb-1"},Ke={class:"text-center text-xs text-blue-primary font-semibold"},Ve=k(()=>t("div",{class:"h-20"},null,-1)),We={key:1,class:"mr-auto ml-auto w-8/12"},Se={class:"mb-8"},Me={class:"border border-green-300 px-6 pb-3 bg-green-50"},Ne={class:"flex items-center gap-3"},xe=k(()=>t("img",{src:ve,class:"h-10 w-10 pt-3 mr-2"},null,-1)),Ee={class:"flex flex-col w-full"},Te={class:"flex"},je={class:"text-xs text-green-500 font-semibold pt-3"},Ae={class:"text-xxs mt-1"},Be={class:"border-2 shadow-lg filter mb-10 bg-white"},He={class:"flex"},Ue=["innerHTML"],De={class:"flex flex-col justify-center ml-4"},Le={class:"flex"},qe={class:"font-semibold text-md"},ze={class:"flex"},Fe=["copyValue","copySubject"],Re={class:"border p-6 bg-white"},Ye={class:"text-xxs text-blue-primary mt-2 font-semibold uppercase"},Ge={class:"flex"},Je=["copyValue","copySubject"],Qe=k(()=>t("div",{class:"my-6 gray-line"},null,-1)),Xe={class:"text-xxs text-blue-primary mt-0.5 font-semibold uppercase"},Oe={class:"flex"},Ze={key:0,class:"break-all font-semibold"},et={class:"flex"},tt=["copyValue","copySubject"],ot={class:"text-txs mt-2 text-red-400 border px-1.5 py-2 border-red-400 rounded-md"},lt=k(()=>t("div",{class:"my-6 gray-line"},null,-1)),st={class:"flex"},at={class:"blue-btn cursor-pointer py-3 px-3"};function rt(e,o,S,$,_,P){const I=y("IntroTextComponent"),d=y("router-link"),p=y("SelectNetworkInput"),u=y("PasswordInput"),m=y("TextInput"),a=y("font-awesome-icon");return c(),f("div",null,[e.newWallet?(c(),f("div",We,[t("div",Se,[t("div",Me,[t("div",Ne,[xe,t("div",Ee,[t("div",Te,[t("div",je,l(e.$t("general.congratz")),1)]),t("div",Ae,l(e.$t("wallet.walletCreated"))+" "+l(e.$t("general.pkWarning")),1)])])])]),t("div",Be,[t("div",He,[t("div",{innerHTML:e.svgString},null,8,Ue),t("div",De,[t("div",Le,[t("div",qe,l(e.accName),1)]),t("div",ze,[t("div",{id:"address",copyValue:e.address,copySubject:e.$t("general.address"),class:"text-xs font-semibold mt-1"},l(e.address),9,Fe),i(a,{icon:"copy",title:e.$t("general.copy"),onClick:o[5]||(o[5]=s=>e.copy("address")),class:"ml-2 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title"])])])])]),t("div",Re,[t("div",Ye,l(e.$t("general.publicKey")),1),t("div",Ge,[t("div",{id:"public",class:"text-xs font-semibold mt-1 break-all",copyValue:e.publicKey,copySubject:e.$t("general.publicKey")},l(e.publicKey),9,Je),i(a,{icon:"copy",onClick:o[6]||(o[6]=s=>e.copy("public")),title:e.$t("general.copy"),class:"ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title"])]),Qe,t("div",null,[t("div",Xe,l(e.$t("general.privateKey")),1),t("div",Oe,[e.toggleModal?b("v-if",!0):(c(),f("div",Ze,"****************************************************************")),e.toggleModal?b("v-if",!0):(c(),W(a,{key:1,icon:"eye",title:e.$t("general.view")+" "+e.$t("general.privateKey"),class:"text-blue-link relative cursor-pointer ml-1",onClick:o[7]||(o[7]=s=>e.toggleModal=!e.toggleModal)},null,8,["title"]))]),t("div",et,[e.toggleModal?(c(),f("div",{key:0,id:"private",class:"text-xs mt-1 font-semibold break-all",type:"text",copyValue:e.privateKey,copySubject:e.$t("general.privateKey")},l(e.privateKey),9,tt)):b("v-if",!0),e.toggleModal?(c(),W(a,{key:1,title:e.$t("general.copy"),icon:"copy",onClick:o[8]||(o[8]=s=>e.copy("private")),class:"ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer"},null,8,["title"])):b("v-if",!0),e.toggleModal?(c(),W(a,{key:2,icon:"eye-slash",title:e.$t("general.hide")+" "+e.$t("general.privateKey"),class:"text-blue-link relative cursor-pointer mt-0.5 ml-1",onClick:o[9]||(o[9]=s=>e.toggleModal=!e.toggleModal)},null,8,["title"])):b("v-if",!0)]),t("div",ot,l(e.$t("general.pkWarning")),1)]),lt,t("div",st,[t("div",{onClick:o[10]||(o[10]=(...s)=>e.saveWalletPaper&&e.saveWalletPaper(...s)),class:"blue-btn cursor-pointer py-3 px-3"},l(e.$t("general.downloadPaperWallet")),1),i(d,{class:"ml-auto",to:{name:"Home"}},{default:V(()=>[t("div",at,l(e.$t("wallet.continueLogIn")),1)]),_:1})])])])):(c(),f("div",ge,[i(I),t("div",ye,[i(d,{to:{name:"ViewWalletCreateSelection"},class:"text-xs m-2 text-blue-primary items-center flex"},{default:V(()=>[fe,A(l(e.$t("general.back")),1)]),_:1}),t("form",{onSubmit:o[4]||(o[4]=O((...s)=>e.createWallet&&e.createWallet(...s),["prevent"]))},[t("div",be,l(e.$t("wallet.createWallet")),1),t("div",he,l(e.$t("general.fromPrivateKey")),1),t("p",ke,l(e.$t("wallet.privateKeyDescription")),1),t("div",$e,[e.err!=""?(c(),f("div",_e,l(e.err),1)):b("v-if",!0)]),i(p),t("div",Pe,[i(u,{placeholder:e.$t("general.privateKey"),errorMessage:e.$t("general.invalidPrivateKey"),icon:"key",showError:e.showPkError,modelValue:e.privateKeyInput,"onUpdate:modelValue":o[0]||(o[0]=s=>e.privateKeyInput=s)},null,8,["placeholder","errorMessage","showError","modelValue"]),i(m,{class:"mt-3",placeholder:e.$t("wallet.namePlaceholder"),errorMessage:e.$t("wallet.nameErrMsg"),modelValue:e.walletName,"onUpdate:modelValue":o[1]||(o[1]=s=>e.walletName=s),icon:"wallet"},null,8,["placeholder","errorMessage","modelValue"]),i(u,{class:"mt-3",placeholder:e.$t("wallet.enterPassword"),errorMessage:e.$t("wallet.passwordErrMsg"),showError:e.showPasswdError,icon:"lock",modelValue:e.passwd,"onUpdate:modelValue":o[2]||(o[2]=s=>e.passwd=s)},null,8,["placeholder","errorMessage","showError","modelValue"]),i(u,{class:"mt-3",placeholder:e.$t("wallet.confirmPassword"),errorMessage:e.$t("wallet.confirmPasswordErrMsg"),showError:e.showConfirmPasswdError,icon:"lock",modelValue:e.confirmPasswd,"onUpdate:modelValue":o[3]||(o[3]=s=>e.confirmPasswd=s)},null,8,["placeholder","errorMessage","showError","modelValue"])]),t("button",{type:"submit",class:"mt-3 text-center font-bold blue-btn py-3 block ml-auto mr-auto w-8/12 disabled:opacity-50",disabled:e.disableCreate},l(e.$t("wallet.createWallet")),9,Ie),t("div",Ce,l(e.$t("wallet.haveWallet")),1),t("div",Ke,[i(d,{to:{name:"Home"}},{default:V(()=>[A(l(e.$t("wallet.signInHere"))+" >",1)]),_:1})]),Ve],32)])]))])}const kt=Y(we,[["render",rt],["__scopeId","data-v-61e9fd37"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/wallet/views/ViewWalletCreatePrivateKey.vue"]]);export{kt as default};