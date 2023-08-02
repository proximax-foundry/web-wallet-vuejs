import{d as h}from"./tsjs-xpx-chain-sdk-84426b6a.js";import"./vue-86063517.js";import{u as We}from"./vue-router-21fffbbf.js";import{u as Fe}from"./primevue-e09f7e84.js";import{_ as _e,W as be,w as k,n as $,A,I as Ee,H as fe,D as Ve,f as he,M as J}from"./index-913a8781.js";import{u as je}from"./vue-i18n-728f748b.js";import{P as He}from"./PasswordInput-5c999bbb.js";import{r as v,B as ce,o as s,z as o,A as t,g as n,a as E,m as ee,e as I,T as we,F as U,w as Be,l as G,k as Q,D as Z,u as Oe,aW as Ge,aT as Ue}from"./@vue-a9ecc9f1.js";import{_ as qe}from"./proximax-logo-ecfc3767.js";import{_ as ze}from"./xarcade-logo-c4d3fd5c.js";import{_ as Xe}from"./metx-logo-27f23eae.js";import{_ as Ye}from"./icon-proximax-logo-gray-c2486ce1.js";import"./@js-joda-d98eb16f.js";import"./rxjs-1250b26d.js";import"./tslib-8dbab242.js";import"./@noble-f8eff84a.js";import"./js-sha3-d7d4f583.js";import"./node-stdlib-browser-23a8bc7f.js";import"./buffer-6d367910.js";import"./base64-js-50a5cdf9.js";import"./ieee754-44f7831e.js";import"./process-2209b2b3.js";import"./utf8-c941a4a0.js";import"./bip39-936aefa9.js";import"./axios-b48d2c29.js";import"./flatbuffers-edc4f8d7.js";import"./ws-0a714537.js";import"./crypto-js-e64ac54c.js";import"./crypto-browserify-4fd8cccd.js";import"./randombytes-685e9383.js";import"./safe-buffer-c463177b.js";import"./create-hash-92c04a28.js";import"./inherits-804453d8.js";import"./md5.js-8d474739.js";import"./hash-base-bb85fc42.js";import"./readable-stream-2241ee9e.js";import"./events-86ccc6d8.js";import"./util-06f7ff32.js";import"./is-arguments-86164331.js";import"./has-tostringtag-7c6352d6.js";import"./has-symbols-cd7870b9.js";import"./call-bind-9e7f09da.js";import"./get-intrinsic-f35014ba.js";import"./has-proto-8ede3a55.js";import"./function-bind-68631a08.js";import"./has-ab8e2922.js";import"./is-generator-function-06dfaf9d.js";import"./which-typed-array-cf6b6a29.js";import"./for-each-f57c5052.js";import"./is-callable-7492318c.js";import"./available-typed-arrays-61974ec7.js";import"./gopd-bab4d6bd.js";import"./is-typed-array-037eef20.js";import"./util-deprecate-c3aabb3c.js";import"./string_decoder-ef7b01fe.js";import"./ripemd160-58dcfa02.js";import"./sha.js-cea3da2e.js";import"./cipher-base-aee0e03d.js";import"./stream-browserify-7496a08f.js";import"./create-hmac-e8b5ea4a.js";import"./browserify-sign-a708a95f.js";import"./browserify-rsa-bfbdcbb6.js";import"./bn.js-1ae23332.js";import"./elliptic-75e883ee.js";import"./minimalistic-assert-4cc49674.js";import"./minimalistic-crypto-utils-6f869a51.js";import"./brorand-03f0f79d.js";import"./hash.js-4f5dfe73.js";import"./hmac-drbg-87799258.js";import"./parse-asn1-465c125b.js";import"./asn1.js-405e93e4.js";import"./safer-buffer-2ac6237e.js";import"./evp_bytestokey-e91543fa.js";import"./browserify-aes-ce20a0e6.js";import"./buffer-xor-87a7236a.js";import"./pbkdf2-e2ae8643.js";import"./browserify-cipher-c4c37ca3.js";import"./browserify-des-3f7e64d9.js";import"./des.js-d262604a.js";import"./diffie-hellman-c8260aab.js";import"./miller-rabin-de27bf02.js";import"./create-ecdh-ffe720e9.js";import"./public-encrypt-fc0568a2.js";import"./randomfill-2874e5f1.js";import"./mathjs-2a513dae.js";import"./@babel-484168fe.js";import"./typed-function-4896e4f1.js";import"./decimal.js-d133ee8e.js";import"./complex.js-cf2520e8.js";import"./fraction.js-39e7906a.js";import"./javascript-natural-sort-c4dd0c27.js";import"./escape-latex-c8a96e7a.js";import"./seedrandom-c8f991ad.js";import"./tiny-emitter-56d49cfd.js";import"./crypto-random-string-d158262e.js";import"./jose-92e5544c.js";import"./vue-loading-overlay-b89251b1.js";import"./jspdf-30014160.js";import"./fflate-8981c52c.js";import"./vue-debounce-3bbbf8c6.js";import"./mitt-f7ef348c.js";/* empty css                   */import"./maska-6f10db43.js";import"./@fortawesome-014b81f2.js";import"./vue3-blocks-tree-e53499e3.js";import"./@intlify-16888cd3.js";const Je={name:"CosignPasswordModal",props:{transactionHash:String,disabled:Boolean},components:{PasswordInput:He},emits:["return-password"],setup(r,{emit:i}){let d=v(!1),e=v(""),y=v("");return{verifyWalletPwPk:()=>{e.value==""?y.value="Please insert wallet password to show Private Key":be.verifyWalletPassword(k.currentLoggedInWallet.name,$.chainNetworkName,e.value)?(d.value=!d.value,i("return-password",e.value),e.value="",y.value=""):y.value="Wallet password is incorrect"},toggleModal:d,err:y,walletPasswd:e}}},Qe=["disabled"],Ze={key:0,class:"popup-outer-lang fixed flex z-50"},$e={class:"modal-popup-box text-center"},et={key:0,class:"error error_box mb-3"},tt={class:"text-center mt-2 text-xs font-semibold"};function nt(r,i,d,e,y,g){const m=ce("PasswordInput");return s(),o(U,null,[t("button",{class:"cursor-pointer text-white bg-blue-primary px-7 py-2 lg:px-12 lg:py-3 rounded-md text-xs lg:text-tsm inline-block font-bold border-2 border-blue-primary hover:opacity-80 transition-all duration-300 disabled:opacity-50",onClick:i[0]||(i[0]=l=>e.toggleModal=!e.toggleModal),disabled:d.disabled},n(r.$t("transaction.approve")),9,Qe),E(we,{"enter-active-class":"animate__animated animate__fadeInDown","leave-active-class":"animate__animated animate__fadeOutUp"},{default:ee(()=>[e.toggleModal?(s(),o("div",Ze,[t("div",$e,[e.err!=""?(s(),o("div",et,n(e.err),1)):I("v-if",!0),t("div",tt,n(r.$t("general.enterPassword")),1),E(m,{class:"mt-3",modelValue:e.walletPasswd,"onUpdate:modelValue":i[1]||(i[1]=l=>e.walletPasswd=l),placeholder:r.$t("general.enterPassword"),errorMessage:r.$t("general.passwordRequired")},null,8,["modelValue","placeholder","errorMessage"]),t("button",{onClick:i[2]||(i[2]=l=>e.verifyWalletPwPk()),class:"blue-btn py-2 font-semibold cursor-pointer text-center w-7/12 mt-5 inline-block"},n(r.$t("general.confirm")),1),t("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:i[3]||(i[3]=l=>{e.toggleModal=!e.toggleModal,e.walletPasswd=""})},n(r.$t("general.cancel")),1)])])):I("v-if",!0)]),_:1}),e.toggleModal?(s(),o("div",{key:0,onClick:i[4]||(i[4]=l=>e.toggleModal=!e.toggleModal),class:"fixed inset-0 bg-opacity-60 bg-gray-100 z-20"})):I("v-if",!0)],64)}const it=_e(Je,[["render",nt],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/transaction/components/CosignPasswordModal.vue"]]);class R{static findAllLevelCosigners(i){let d=[],e=[...i.keys()];for(let y=0;y<e.length;++y){let g=e[y],m=i.get(g),l=R.findCosigners(m);d=d.concat(l)}return d=Array.from(new Set(d)),d}static findCosigners(i){let d=[];for(let e=0;e<i.length;++e)i[e].minApproval===0&&i[e].minRemoval===0&&d.push(i[e].account.publicKey);return d}static isFulllySigned(i,d){if(i.isMultisig()){let e=i.minApproval;return i.cosignatories.filter(g=>d.includes(g.publicKey)).length>=e}else return d.includes(i.account.publicKey)}static async isModifyMultisigFullySigned(i,d){let e=i.modifications.filter(m=>m.type===h.MultisigCosignatoryModificationType.Remove).length,y=i.modifications.filter(m=>m.type===h.MultisigCosignatoryModificationType.Add).length,g=i.modifications.filter(m=>m.type===h.MultisigCosignatoryModificationType.Add).map(m=>m.cosignatoryPublicAccount.publicKey);try{let m=await A.chainAPI.accountAPI.getMultisigAccountInfo(i.signer.address),l=m.minApproval,c=m.minRemoval,a=m.cosignatories.map(N=>N.publicKey).filter(N=>d.includes(N)),C=!0;(i.minApprovalDelta!==0||i.minRemovalDelta!==0)&&(C=a.length>=l);let q=!0;e&&(q=a.length>=c);let V=!0;return y&&(V=g.filter(ne=>d.includes(ne)).length===g.length),C&&q&&V}catch{let l=!0;return y&&(l=g.filter(a=>d.includes(a)).length===g.length),l}}static async getAllDeepModifyMultisigCosigners(i){let d=[];i.modifications.filter(l=>l.type===h.MultisigCosignatoryModificationType.Remove).length,i.modifications.filter(l=>l.type===h.MultisigCosignatoryModificationType.Add).length;let e=i.modifications.filter(l=>l.type===h.MultisigCosignatoryModificationType.Add).map(l=>l.cosignatoryPublicAccount.publicKey);i.modifications.filter(l=>l.type===h.MultisigCosignatoryModificationType.Remove).map(l=>l.cosignatoryPublicAccount.publicKey);let y=[],g=[],m=i.signer.publicKey;try{let l=await A.chainAPI.accountAPI.getMultisigAccountInfo(i.signer.address),c=l.minApproval,x=l.minRemoval;y=l.cosignatories.map(a=>a.publicKey)}catch{d.push(m)}g=y.concat(e);for(let l=0;l<g.length;++l)try{let c=await A.chainAPI.accountAPI.getMultisigAccountGraphInfo(h.Address.createFromPublicKey(g[l],A.networkType)),x=R.findAllLevelCosigners(c.multisigAccounts);d=d.concat(x)}catch{d.push(g[l])}return d=Array.from(new Set(d)),d}static async getAllFlatModifyMultisigCosigners(i){let d=[];i.modifications.filter(g=>g.type===h.MultisigCosignatoryModificationType.Remove).length,i.modifications.filter(g=>g.type===h.MultisigCosignatoryModificationType.Add).length;let e=i.modifications.filter(g=>g.type===h.MultisigCosignatoryModificationType.Add).map(g=>g.cosignatoryPublicAccount.publicKey);i.modifications.filter(g=>g.type===h.MultisigCosignatoryModificationType.Remove).map(g=>g.cosignatoryPublicAccount.publicKey);let y=[];i.signer.publicKey;try{let g=await A.chainAPI.accountAPI.getMultisigAccountInfo(i.signer.address),m=g.minApproval,l=g.minRemoval;y=g.cosignatories.map(c=>c.publicKey)}catch{}return d=y.concat(e),d=Array.from(new Set(d)),d}}const rt="/web-wallet-vuejs/assets/digital-signature-success-9d53a1a9.png",st="/web-wallet-vuejs/assets/digital-signature-not-signed-f4603dfb.png",ot="/web-wallet-vuejs/assets/icon-down-caret-747a1a7b.svg";const lt={name:"ViewTransactionSign",components:{CosignPasswordModal:it},props:{txnHash:String},setup(r){const{t:i}=je(),d=Fe(),e=We(),y=v(!1);Oe().appContext.config.globalProperties.emitter;const m=v(!0),l=v(""),c=v(""),x=v(""),a=v("");v("");const C=v(""),q=v(""),V=v(""),te=v([]),N=v([]),ne=v([]),ge=v(!1),pe=v(!1);let D=null,K=[],ie=[],Ae=[],xe=[],re=[],se=[],oe=[],ue=[],me=[],w=[],F=k.currentLoggedInWallet.selectDefaultAccount()?k.currentLoggedInWallet.selectDefaultAccount():k.currentLoggedInWallet.accounts[0];l.value=F.address;let z=F.publicKey;x.value=F.name;let Te=p=>{let u=p.split(" ");return fe.toCurrencyFormat(u[0])},ke=p=>p.split(" ")[1],Ie=p=>p.replace(/\(/g,"").replace(/\)/g,"").split(" ")[2];const Pe=p=>$.currentNetworkProfile?$.currentNetworkProfile.chainExplorer.url+"/"+$.currentNetworkProfile.chainExplorer.assetInfoRoute+"/"+p:"",Ce=()=>{K.find(u=>u===z)===void 0?ge.value=!0:w.find(b=>b===z)!==void 0&&(pe.value=!0)},ye=v([]),Le=async()=>{let p=new Ve(k.currentLoggedInWallet,F);try{D=await A.chainAPI.transactionAPI.getPartialTransaction(r.txnHash);let u=D.signer.address.plain();C.value=k.currentLoggedInWallet.convertAddressToNamePretty(u),a.value=fe.formatDeadline(D.deadline.adjustedValue.compact()),V.value=i("transaction.aggregateBonded");let b=he.castToAggregate(D);K.push(b.signer.publicKey),ue=b.cosignatures.map(T=>T.signer.publicKey),me=ue.concat([D.signer.publicKey]),w=[...me];let L=[];for(let T=0;T<b.innerTransactions.length;++T){let f=await p.extractPartialInnerTransaction(b.innerTransactions[T]),le=k.currentLoggedInWallet.convertAddressToNamePretty(f.signerAddressPlain),De={Type:f.typeName,PublicKey:f.signer,Address:le};f.signerAddressPretty===le?re.push(i("general.signer")):re.push(le),N.value.push(De),f.infoInfoList=f.infos.filter(_=>!_.label&&_.type===J.INFO),f.infoGreenList=f.infos.filter(_=>!_.label&&_.type===J.GREEN),f.infoRedList=f.infos.filter(_=>!_.label&&_.type===J.RED),f.infoList=f.infos.filter(_=>_.type===J.NONE),L.push(f),console.log(f);let X=b.innerTransactions[T].signer;Ae.push(X.publicKey);let S=[];if(b.innerTransactions[T].type===h.TransactionType.MODIFY_MULTISIG_ACCOUNT){let _=b.innerTransactions[T],j=await R.getAllDeepModifyMultisigCosigners(_);S=j;let M=await R.getAllFlatModifyMultisigCosigners(_);for(let P=0;P<M.length;++P)try{let B=await A.chainAPI.accountAPI.getMultisigAccountGraphInfo(h.PublicAccount.createFromPublicKey(M[P],A.networkType).address),W=B.multisigAccounts.keys().sort((O,ae)=>O-ae);for(let O=0;O<W.length;++O){const ae=W[O],de=B.multisigAccounts.get(ae);for(let Y=0;Y<de.length;++Y)R.isFulllySigned(de[Y],w)&&w.push(de[Y].account.publicKey)}}catch{}w=Array.from(new Set(w));let H=M.every(P=>w.includes(P));se.push(H),oe.push(j.includes(z))}else{try{let _=await A.chainAPI.accountAPI.getMultisigAccountGraphInfo(X.address),j=Array.from(_.multisigAccounts.keys()).sort((M,H)=>M-H);for(let M=0;M<j.length;++M){const H=j[M],P=_.multisigAccounts.get(H);let B=R.findCosigners(P);S=S.concat(B);for(let W=0;W<P.length;++W)R.isFulllySigned(P[W],w)&&w.push(P[W].account.publicKey)}w=Array.from(new Set(w)),S=Array.from(new Set(S))}catch{S=[X.publicKey]}oe.push(S.includes(z)),se.push(w.includes(X.publicKey))}xe.push(S),K=K.concat(S)}K=Array.from(new Set(K)),ye.value=K,ie=K.filter(T=>!w.includes(T)),Ce(),te.value=L}catch(u){console.log(u)}},Se=p=>{let u=w.includes(p),b=ie.includes(p);return u&&!b},Me=p=>{let u=h.Address.createFromPublicKey(p,A.networkType);return Re(u.address)},Ke=p=>h.Address.createFromPublicKey(p,A.networkType).pretty(),Re=p=>{let u="";const b=k.currentLoggedInWallet.contacts.find(L=>L.address===p);if(b)u=b.name;else{const L=k.currentLoggedInWallet.accounts.find(f=>f.address===p);L&&(u=L.name);const T=k.currentLoggedInWallet.others.find(f=>f.address===p);T&&(u=T.name)}return u||i("general.cosigner")},Ne=p=>k.currentLoggedInWallet?k.currentLoggedInWallet.convertAddressToNamePretty(p):p,ve=()=>{Le()};if(A.isReady)ve();else{let p=Be(A,u=>{u.isReady&&(ve(),p())})}return{currentAddress:l,showModal:y,innerTransactions:te,innerTransactionsSimple:N,viewTxn:m,viewInnerTxn:ne,deadline:a,signerAddress:C,signerName:q,currentAddressFormatted:c,currentName:x,txnTypeLabel:V,invalidCosigner:ge,signAggTxn:p=>{if(D!==null){let u=be.decryptPrivateKey(new h.Password(p),F.encrypted,F.iv);const b=h.Account.createFromPrivateKey(u,A.networkType,1);let L=he.cosignTransaction(D,b);A.chainAPI.transactionAPI.announceAggregateBondedCosignature(L),e.push({name:"ViewAccountPendingTransactions",params:{address:l.value}})}else d.add({severity:"error",summary:i("transaction.waitForLoad"),life:2e3,group:"br-custom"})},displaySDA:Te,displayLinkNamespace:Ie,displayAssetId:ke,isSigned:pe,innerRelatedList:oe,innerSignedList:se,innerSignersNameList:re,convertName:Ne,InnerTxnLegendType:Ee,allTxnCosigners:ye,pendingCosigners:ie,signedSigners:w,isHasSigned:Se,displayAccountLabel:Me,displayAccountAddress:Ke,explorerLink:Pe}}},at=r=>(Ge("data-v-4fd3c88f"),r=r(),Ue(),r),dt={class:"md:w-8/12 lg:w-10/12 xl:w-6/12 ml-2 mr-2 md:ml-auto md:mr-auto mt-5"},ct={class:"border-2 border-gray-200"},gt={key:0,class:"w-full text-center pt-10 pl-10 pr-10"},pt={class:"text-xl"},ut={class:"mt-5 text-tsm"},mt={class:"mt-1 text-tsm font-bold"},yt={key:1,class:"w-full text-center pt-10 pl-10 pr-10"},vt={class:"text-xl"},ft={class:"mt-5 text-tsm"},ht=at(()=>t("div",{class:"inline-block h-3 w-3 bg-yellow-300 ml-1"},null,-1)),_t={class:"mt-1 text-tsm font-bold"},bt={key:2,class:"w-full text-center pt-10 pl-10 pr-10"},wt={class:"text-xl"},At={class:"mt-1 text-tsm font-bold"},xt={class:"w-full text-center pb-10 pl-10 pr-10"},Tt={class:"mt-10"},kt={key:0,src:rt,class:"w-14 inline-block ml-2"},It={key:1,src:st,class:"w-14 inline-block ml-2"},Pt={class:"text-left ml-3 inline-block"},Ct={class:"uppercase text-blue-primary text-txs font-bold"},Lt={class:"uppercase text-xxs text-gray-500 mt-1"},St={class:"border-2 mt-5"},Mt={class:"text-tsm"},Kt={class:"text-xs text-blue-primary uppercase flex justify-evenly items-center"},Rt={class:"my-4 text-sm"},Nt={key:0},Dt={class:"mt-10"},Wt={key:0},Ft={key:0},Et={key:1},Vt={key:2},jt={key:3},Ht={key:1},Bt={key:0},Ot={key:1},Gt={key:2},Ut={key:3},qt={key:2},zt={key:3},Xt={class:"flex items-center"},Yt={key:0,src:qe,class:"inline-block h-7 w-7 mx-2 border-2 rounded-3xl"},Jt={key:1,src:ze,class:"inline-block h-7 w-7 mx-2 border-2 rounded-3xl"},Qt={key:2,src:Xe,class:"inline-block h-7 w-7 mx-2 border-2 rounded-3xl"},Zt={key:3,src:Ye,class:"inline-block h-7 w-7 mx-2 border-2 rounded-3xl"},$t={key:4,class:"text-blue-600"},en={key:5,class:"text-blue-600"},tn={key:6,class:"text-blue-600"},nn=["href"],rn={class:"text-gray-400 cursor-pointer"},sn=["href"],on={class:"text-blue-600 cursor-pointer"},ln={key:0,class:"flex items-center h-14 lg:h-28 justify-center"},an={key:1,class:"flex items-center h-14 lg:h-28 justify-center"};function dn(r,i,d,e,y,g){const m=ce("router-link"),l=ce("CosignPasswordModal");return s(),o("div",null,[t("div",dt,[t("div",ct,[e.isSigned?(s(),o("div",gt,[t("div",pt,n(r.$t("transaction.noActionRequired")),1),t("div",ut,n(r.$t("transaction.haveApproved",e.innerTransactions.length)),1),t("div",mt,n(r.$t("general.deadline"))+": "+n(e.deadline),1)])):e.invalidCosigner?(s(),o("div",bt,[t("div",wt,n(r.$t("transaction.noActionRequired")),1),t("div",At,n(r.$t("general.deadline"))+": "+n(e.deadline),1)])):(s(),o("div",yt,[t("div",vt,n(r.$t("transaction.actionRequired")),1),t("div",ft,[G(n(r.$t("transaction.approveConfirmation",e.innerTransactions.length))+" ",1),ht,G(")")]),t("div",_t,n(r.$t("general.deadline"))+": "+n(e.deadline),1)])),t("div",xt,[t("div",Tt,[(s(!0),o(U,null,Q(e.allTxnCosigners,(c,x)=>(s(),o("div",{class:"flex items-center border-t border-gray-200 py-2",key:x},[e.isHasSigned(c)?(s(),o("img",kt)):(s(),o("img",It)),t("div",Pt,[t("div",Ct,n(e.displayAccountLabel(c))+" "+n(e.isHasSigned(c)?"("+r.$t("general.signed")+")":""),1),t("div",Lt,n(e.displayAccountAddress(c)),1)])]))),128))])])]),t("div",St,[t("div",{class:"cursor-pointer flex justify-between p-3",onClick:i[0]||(i[0]=c=>e.viewTxn=!e.viewTxn)},[t("div",Mt,n(r.$t("transaction.txInfo")),1),t("div",Kt,[G(n(r.$t("general.view")),1),t("img",{src:ot,class:Z(["ml-2 transition-all duration-200",`${e.viewTxn?"rotate-180 transform":""}`])},null,2)])]),E(we,{name:"slide"},{default:ee(()=>[e.viewTxn?(s(),o("div",{key:0,class:Z(["p-3",`${e.innerTransactions.length>0?"border-t-2 border-gray-200":""}`])},[t("div",Rt,n(e.txnTypeLabel),1),t("div",{class:Z(["table_div pb-5",`${e.innerTransactions.length>0?"border-b-2 border-gray-200 mb-5":""}`])},[t("div",null,[t("div",null,n(r.$t("dashboard.txHash")),1),t("div",null,n(d.txnHash),1)]),t("div",null,[t("div",null,n(r.$t("general.signer")),1),t("div",null,n(e.signerAddress),1)])],2),e.innerTransactions.length>0?(s(),o("div",Nt,[t("div",Dt,n(r.$t("general.transaction",e.innerTransactions.length))+" ("+n(e.innerTransactions.length)+")",1),(s(!0),o(U,null,Q(e.innerTransactions,(c,x)=>(s(),o("div",{class:"mt-3 border border-gray-200 p-1",key:x},[t("div",{class:Z(["table_div",e.innerRelatedList[x]?"highlighted":""])},[t("div",null,[t("div",null,n(r.$t("dashboard.type")),1),t("div",null,n(c.typeName),1)]),t("div",null,[t("div",null,n(r.$t("transaction.signerPk")),1),t("div",null,n(c.signer),1)]),t("div",null,[t("div",null,n(r.$t("general.signer")),1),t("div",null,n(e.convertName(c.signerAddressPlain)),1)]),t("div",null,[t("div",null,n(r.$t("transaction.fullySigned")),1),t("div",null,n(e.innerSignedList[x]),1)]),(s(!0),o(U,null,Q(c.infoList,(a,C)=>(s(),o("div",{key:C},[t("div",null,n(a.label?a.label:""),1),t("div",null,n(a.short?a.short:a.value),1)]))),128)),c.infoGreenList.length>0?(s(),o("div",Wt,[c.legendType===e.InnerTxnLegendType.ADD_REMOVE?(s(),o("div",Ft,n(r.$t("general.add")),1)):c.legendType===e.InnerTxnLegendType.TRUE_FALSE?(s(),o("div",Et,n(r.$t("general.true")),1)):c.legendType===e.InnerTxnLegendType.BUY_SELL?(s(),o("div",Vt,n(r.$t("transaction.buy")),1)):c.legendType===e.InnerTxnLegendType.ALLOW_BLOCK?(s(),o("div",jt,n(r.$t("transaction.allow")),1)):I("v-if",!0),t("div",null,n(c.infoGreenList.map(a=>a.short?a.short:a.value).join(", ")),1)])):I("v-if",!0),c.infoRedList.length>0?(s(),o("div",Ht,[c.legendType===e.InnerTxnLegendType.ADD_REMOVE?(s(),o("div",Bt,n(r.$t("general.remove")),1)):c.legendType===e.InnerTxnLegendType.TRUE_FALSE?(s(),o("div",Ot,n(r.$t("general.false")),1)):c.legendType===e.InnerTxnLegendType.BUY_SELL?(s(),o("div",Gt,n(r.$t("transaction.sell")),1)):c.legendType===e.InnerTxnLegendType.ALLOW_BLOCK?(s(),o("div",Ut,n(r.$t("general.block")),1)):I("v-if",!0),t("div",null,n(c.infoRedList.map(a=>a.short?a.short:a.value).join(", ")),1)])):I("v-if",!0),c.infoInfoList.length>0?(s(),o("div",qt,[t("div",null,n(r.$t("dashboard.info")),1),t("div",null,n(c.infoInfoList.map(a=>a.short?a.short:a.value).join(", ")),1)])):I("v-if",!0),c.sdas.length>0?(s(),o("div",zt,[t("div",null,n(r.$t("general.sda",2)),1),t("div",null,[(s(!0),o(U,null,Q(c.sdas,(a,C)=>(s(),o("div",{key:C},[t("div",Xt,[t("div",null,n(e.displaySDA(a)),1),a.toLowerCase().includes("xpx")?(s(),o("img",Yt)):a.toLowerCase().includes("xar")?(s(),o("img",Jt)):a.toLowerCase().includes("met")?(s(),o("img",Qt)):(s(),o("img",Zt)),a.toLowerCase().includes("xpx")?(s(),o("span",$t,"XPX")):a.toLowerCase().includes("xar")?(s(),o("span",en,"XAR")):a.toLowerCase().includes("metx")?(s(),o("span",tn,"METX")):a.split(" ").length==2?(s(),o("a",{key:7,href:e.explorerLink(e.displayAssetId(a)),target:"_new"},[t("div",rn,n(e.displayAssetId(a)),1)],8,nn)):(s(),o("a",{key:8,href:e.explorerLink(e.displayAssetId(a)),target:"_new"},[t("div",on,n(e.displayLinkNamespace(a)),1)],8,sn))])]))),128))])])):I("v-if",!0)],2)]))),128))])):I("v-if",!0)],2)):I("v-if",!0)]),_:1})]),e.isSigned?(s(),o("div",an,[E(m,{to:{name:"ViewAccountPendingTransactions",params:{address:e.currentAddress}},class:"text-gray-600 bg-white px-5 py-2 lg:px-10 lg:py-3 rounded-md text-xs lg:text-tsm inline-block border-2 border-gray-200 mr-5"},{default:ee(()=>[G(n(r.$t("general.close")),1)]),_:1},8,["to"])])):(s(),o("div",ln,[E(m,{to:{name:"ViewAccountPendingTransactions",params:{address:e.currentAddress}},class:"text-gray-600 bg-white px-5 py-2 lg:px-10 lg:py-3 rounded-md text-xs lg:text-tsm inline-block border-2 border-gray-200 mr-5"},{default:ee(()=>[G(n(r.$t("transaction.doThisLater")),1)]),_:1},8,["to"]),E(l,{transactionHash:d.txnHash,disabled:e.invalidCosigner||e.isSigned,onReturnPassword:e.signAggTxn},null,8,["transactionHash","disabled","onReturnPassword"])]))])])}const dr=_e(lt,[["render",dn],["__scopeId","data-v-4fd3c88f"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/transaction/views/ViewTransactionSign.vue"]]);export{dr as default};