import{u as V,A as F,r as f,c as _,h as E,n as h,W as J,w as d,_ as L,i as $,o as a,b as o,e as l,m as W,v as B,t as n,f as u,T as Z,F as A,d as q,C as D,x as N,k as I,j as P,g as Y}from"./index-f0fab120.js";import{_ as G}from"./PasswordInput.vue_vue_type_script_setup_true_lang-50f7a698.js";const K={name:"ConfirmDeleteWalletModal",props:["walletName"],components:{PasswordInput:G},setup(e){const{t:s}=V(),c=F();E().appContext.config.globalProperties.emitter;const p="^[^ ]{8,}$",m=f(""),i=f(""),r=f(!1),v=_(()=>!m.value.match(p));return{err:i,disableDelete:v,deleteWallet:b=>{var k=h.chainNetworkName,w=J.verifyWalletPassword(b,k,m.value);w==!0?(d.wallets.removeWalletByNetworkNameAndName(k,b),c.add({severity:"success",summary:s("general.notification"),detail:s("wallet.walletRemoved"),group:"br-custom",life:5e3})):(i.value=s("general.walletPasswordInvalid",{name:b}),m.value="")},walletPassword:m,toggleModal:r}}},Q="/web-wallet-vuejs/assets/icon-delete-0decb859.svg",X="/web-wallet-vuejs/assets/icon-delete-wallet-4d732b98.svg",ee={key:0,class:"popup-outer fixed flex z-50 text-black mt-10"},te={class:"modal-popup-box"},le={key:0,class:"error error_box mb-3 text-center"},se={class:"text-center mt-2 text-md font-normal"},ae=l("img",{src:X,class:"ml-auto mr-auto"},null,-1),oe={class:"text-black text-center text-xs mt-2 font-normal"},ne={class:"font-bold text-center text-xs mt-2"},re={class:"w-92"},ie={class:"text-center"},de={class:"mt-3"},ce=["disabled"];function me(e,s,c,t,p,m){const i=$("PasswordInput");return a(),o(A,null,[l("img",{onClick:s[0]||(s[0]=r=>t.toggleModal=!t.toggleModal),src:Q,class:"cursor-pointer inline"}),W(Z,{enterActiveClass:"animate__animated animate__fadeInDown",leaveActiveClass:"animate__animated animate__fadeOutUp"},{default:B(()=>[t.toggleModal?(a(),o("div",ee,[l("div",te,[t.err!=""?(a(),o("div",le,n(t.err),1)):u("",!0),l("div",se,n(e.$t("wallet.walletDeletion")),1),ae,l("div",oe,n(e.$t("wallet.deleteMessage")),1),l("div",ne,n(e.$t("wallet.deleteWarning")),1),l("div",re,[l("div",ie,[l("div",de,[W(i,{class:"w-8/12 ml-auto mr-auto",placeholder:e.$t("general.password"),errorMessage:e.$t("general.passwordRequired"),modelValue:t.walletPassword,"onUpdate:modelValue":s[1]||(s[1]=r=>t.walletPassword=r),icon:"lock"},null,8,["placeholder","errorMessage","modelValue"]),l("button",{onClick:s[2]||(s[2]=r=>t.deleteWallet(c.walletName)),class:"red-btn px-4 py-3 font-semibold cursor-pointer text-center ml-auto mt-3 mr-auto w-8/12 disabled:opacity-50 disabled:cursor-auto",disabled:t.disableDelete},n(e.$t("wallet.confirmDelete")),9,ce),l("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-3",onClick:s[3]||(s[3]=r=>{t.toggleModal=!t.toggleModal,t.walletPassword="",t.err=""})},n(e.$t("general.cancel")),1)])])])])])):u("",!0)]),_:1}),t.toggleModal?(a(),o("div",{key:0,onClick:s[4]||(s[4]=r=>t.toggleModal=!t.toggleModal),class:"fixed inset-0 bg-opacity-60 z-20 bg-gray-100"})):u("",!0)],64)}const we=L(K,[["render",me]]),ue=q({name:"WalletTile",components:{ConfirmDeleteWalletModal:we},props:{wallet:{type:Object,default:null}},setup(e){const s=f(!1);V();const c="^[^ ]{8,}$",t=f(""),p=f(""),m=_(()=>!t.value.match(c)),i=_(()=>{let w=!0;return e.wallet.name==d.currentLoggedInWallet.name&&(w=!1),w}),r=()=>{s.value=!0},v=w=>{var y=h.chainNetworkName;d.wallets.removeWalletByNetworkNameAndName(y,w)},M=w=>{var y=h.chainNetworkName;const T=d.wallets.filterByNetworkNameAndName(y,w).convertToSimpleWallet();let U=D.enc.Utf8.parse(JSON.stringify(T)),j=D.enc.Base64.stringify(U);const O=Date.now(),g=new Date(O),R=g.getFullYear(),S=g.getMonth()+1<10?`0${g.getMonth()+1}`:g.getMonth()+1,H=g.getDate()<10?`0${g.getDate()}`:g.getDate(),z=new Blob([j],{type:""}),C=window.URL.createObjectURL(z),x=document.createElement("a");x.style.display="none",x.href=C,x.download=`${w}_${y}_${R}-${S}-${H}.wlt`,document.body.appendChild(x),x.click(),window.URL.revokeObjectURL(C)},b=_(()=>d.currentLoggedInWallet?d.currentLoggedInWallet.name:""),k=_(()=>d.currentLoggedInWallet);return{exportWallet:M,getModal:r,showModal:s,disableDelete:m,err:p,isLogin:k,walletState:d,deleteWallet:v,currentWalletName:b,canDelete:i}}}),ge={class:"p-1"},_e={class:"bg-white border rounded-lg border-gray-200 shadow-lg group"},pe={class:"flex justify-between items-center"},ve={class:"ml-4 mt-5 mb-5 mr-5 text-txs text-left"},fe={key:0,class:"font-bold text-blue-primary flex items-center"},be={key:0,class:"w-36 inline truncate"},xe={key:1,class:"w-36 inline-block truncate"},he={key:2,class:"ml-0 mt-4"},ke={key:1,class:"font-bold text-blue-primary flex items-center"},ye={class:"w-32 inline-block truncate"},$e={class:"text-txs pt-1 text-black-400"},We={key:0,class:"xl:mr-3 xl:ml-0 text-xs font-bold"},Ne=l("svg",{class:"color-blue-primary",id:"file_upload_black_24dp",xmlns:"http://www.w3.org/2000/svg",width:"15",height:"15",viewBox:"0 0 20 20"},[l("path",{d:"M15.667,13.167v2.5h-10v-2.5H4v2.5a1.672,1.672,0,0,0,1.667,1.667h10a1.672,1.672,0,0,0,1.667-1.667v-2.5Zm-9.167-5L7.675,9.342l2.158-2.15V14H11.5V7.192l2.158,2.15,1.175-1.175L10.667,4Z",fill:"#007cff"})],-1),Le={class:"font-semibold text-txs"},Me={key:1,class:"xl:mr-1 xl:ml-5 text-xs font-bold"};function Ce(e,s,c,t,p,m){const i=$("ConfirmDeleteWalletModal");return a(),o("div",ge,[l("div",_e,[l("div",pe,[l("div",ve,[e.isLogin?(a(),o("div",fe,[e.isLogin?(a(),o("div",be,[N(n(e.wallet.name)+" ",1),e.canDelete?(a(),I(i,{key:0,walletName:e.wallet.name},null,8,["walletName"])):u("",!0)])):u("",!0),e.isLogin?u("",!0):(a(),o("div",xe,n(e.wallet.name),1)),e.isLogin?u("",!0):(a(),o("div",he))])):(a(),o("div",ke,[l("div",ye,n(e.wallet.name),1)])),l("div",$e,[N(n(e.$t("wallet.numberOfAccounts"))+": ",1),l("span",null,n(e.wallet.accounts.length),1)])]),e.isLogin?(a(),o("div",We,[l("button",{class:"bg-transparent font-bold py-2 ml-2 mr-2 rounded inline-flex items-center",onClick:s[0]||(s[0]=r=>e.exportWallet(e.wallet.name))},[Ne,l("span",Le,n(e.$t("general.export")),1)])])):(a(),o("div",Me,[e.isLogin?u("",!0):(a(),I(i,{key:0,walletName:e.wallet.name},null,8,["walletName"]))]))])])])}const De=L(ue,[["render",Ce]]);const Ie={name:"ViewWallets",components:{WalletTile:De},setup(){const e=_(()=>d.currentLoggedInWallet);return{wallets:_(()=>{var c=d.wallets.filterByNetworkName(h.chainNetworkName);return c}),walletState:d,networkState:h,isLogin:e}}},Pe={class:"p-1 text-gray-700"},Ve={key:0,class:"mt-8 text-center w-full"},Be={class:"inline-block"};function Ae(e,s,c,t,p,m){const i=$("WalletTile"),r=$("router-link");return a(),o("div",Pe,[l("h1",{class:P(`${t.isLogin?"":"text-white"} text-lg mt-10 xl:mb-5 md:text-xl sm:mb-5  text-center`)},n(e.$t("wallet.myWallets")),3),l("div",{class:P(`${t.isLogin?"":"text-white"} text-sm md:px-5 xl:px-5 xl:mt-0 text-center`)},n(e.$t("wallet.walletsAvailable")),3),(a(!0),o(A,null,Y(t.wallets,v=>(a(),o("div",{class:"mt-4",key:v},[W(i,{class:"w-96 ml-auto mr-auto",wallet:v},null,8,["wallet"])]))),128)),t.isLogin?u("",!0):(a(),o("div",Ve,[l("div",Be,[W(r,{to:{name:"Home"},class:"flex items-center text-xs blue-btn py-4 px-10"},{default:B(()=>[N(n(e.$t("wallet.backHome")),1)]),_:1})])]))])}const Oe=L(Ie,[["render",Ae],["__scopeId","data-v-0dd729c1"]]);export{Oe as default};