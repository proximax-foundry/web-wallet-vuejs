import"./vue-86063517.js";import{u as xe}from"./vue-router-21fffbbf.js";import{P as Ce}from"./PasswordInput-5c999bbb.js";import{D as Ne}from"./DurationInputClean-e0d194f9.js";import{T as De}from"./TransactionFeeDisplay-dcd42b38.js";import{_ as Fe,n as s,U as Te,u as Pe,A as g,C as Le,r as Se,H as l,f as Ie,p as J,w as x,T as Ae,q as W,v as ne,W as Me}from"./index-913a8781.js";import{N as D}from"./namespaceUtils-48729f5d.js";import{t as Be}from"./jdenticon-e4458e79.js";import{u as Ee}from"./primevue-e09f7e84.js";import{M as Ve}from"./multisigUtils-17e6fac7.js";import{u as We}from"./vue-i18n-728f748b.js";import{_ as Ue}from"./icon-namespace-e5424a8b.js";import{r,c as i,w as A,B as M,o as m,z as v,A as o,g as n,a as F,e as T,l as Q,p as He,bq as Re,F as je,k as qe,m as ze}from"./@vue-a9ecc9f1.js";import"./@js-joda-d98eb16f.js";import"./icon-info-8b4f1351.js";import"./proximax-logo-ecfc3767.js";import"./tsjs-xpx-chain-sdk-84426b6a.js";import"./rxjs-1250b26d.js";import"./tslib-8dbab242.js";import"./@noble-f8eff84a.js";import"./js-sha3-d7d4f583.js";import"./node-stdlib-browser-23a8bc7f.js";import"./buffer-6d367910.js";import"./base64-js-50a5cdf9.js";import"./ieee754-44f7831e.js";import"./process-2209b2b3.js";import"./utf8-c941a4a0.js";import"./bip39-936aefa9.js";import"./axios-b48d2c29.js";import"./flatbuffers-edc4f8d7.js";import"./ws-0a714537.js";import"./crypto-js-e64ac54c.js";import"./crypto-browserify-4fd8cccd.js";import"./randombytes-685e9383.js";import"./safe-buffer-c463177b.js";import"./create-hash-92c04a28.js";import"./inherits-804453d8.js";import"./md5.js-8d474739.js";import"./hash-base-bb85fc42.js";import"./readable-stream-2241ee9e.js";import"./events-86ccc6d8.js";import"./util-06f7ff32.js";import"./is-arguments-86164331.js";import"./has-tostringtag-7c6352d6.js";import"./has-symbols-cd7870b9.js";import"./call-bind-9e7f09da.js";import"./get-intrinsic-f35014ba.js";import"./has-proto-8ede3a55.js";import"./function-bind-68631a08.js";import"./has-ab8e2922.js";import"./is-generator-function-06dfaf9d.js";import"./which-typed-array-cf6b6a29.js";import"./for-each-f57c5052.js";import"./is-callable-7492318c.js";import"./available-typed-arrays-61974ec7.js";import"./gopd-bab4d6bd.js";import"./is-typed-array-037eef20.js";import"./util-deprecate-c3aabb3c.js";import"./string_decoder-ef7b01fe.js";import"./ripemd160-58dcfa02.js";import"./sha.js-cea3da2e.js";import"./cipher-base-aee0e03d.js";import"./stream-browserify-7496a08f.js";import"./create-hmac-e8b5ea4a.js";import"./browserify-sign-a708a95f.js";import"./browserify-rsa-bfbdcbb6.js";import"./bn.js-1ae23332.js";import"./elliptic-75e883ee.js";import"./minimalistic-assert-4cc49674.js";import"./minimalistic-crypto-utils-6f869a51.js";import"./brorand-03f0f79d.js";import"./hash.js-4f5dfe73.js";import"./hmac-drbg-87799258.js";import"./parse-asn1-465c125b.js";import"./asn1.js-405e93e4.js";import"./safer-buffer-2ac6237e.js";import"./evp_bytestokey-e91543fa.js";import"./browserify-aes-ce20a0e6.js";import"./buffer-xor-87a7236a.js";import"./pbkdf2-e2ae8643.js";import"./browserify-cipher-c4c37ca3.js";import"./browserify-des-3f7e64d9.js";import"./des.js-d262604a.js";import"./diffie-hellman-c8260aab.js";import"./miller-rabin-de27bf02.js";import"./create-ecdh-ffe720e9.js";import"./public-encrypt-fc0568a2.js";import"./randomfill-2874e5f1.js";import"./mathjs-2a513dae.js";import"./@babel-484168fe.js";import"./typed-function-4896e4f1.js";import"./decimal.js-d133ee8e.js";import"./complex.js-cf2520e8.js";import"./fraction.js-39e7906a.js";import"./javascript-natural-sort-c4dd0c27.js";import"./escape-latex-c8a96e7a.js";import"./seedrandom-c8f991ad.js";import"./tiny-emitter-56d49cfd.js";import"./crypto-random-string-d158262e.js";import"./jose-92e5544c.js";import"./vue-loading-overlay-b89251b1.js";import"./jspdf-30014160.js";import"./fflate-8981c52c.js";import"./vue-debounce-3bbbf8c6.js";import"./mitt-f7ef348c.js";/* empty css                   */import"./maska-6f10db43.js";import"./@fortawesome-014b81f2.js";import"./vue3-blocks-tree-e53499e3.js";import"./@intlify-16888cd3.js";const Oe={name:"ViewServicesNamespaceExtend",components:{PasswordInput:Ce,DurationInputClean:Ne,TransactionFeeDisplay:De},props:{namespaceId:String,address:String},setup(a){const{t:f}=We(),X=xe();Ee();const e=r(null),U=r(!1),u=r("1"),w=r(""),B=r(""),k=r(!1),P=r(!1),H="^[^ ]{8,}$",c=r(!1),b=r(""),ie=r(!1),se=r(!1),C=r(""),E=r(0),R=r(0),V=r(0),j=r(!1),L=i(()=>s.currentNetworkProfileConfig?Math.floor(Te.configReturn(s.currentNetworkProfileConfig.maxNamespaceDuration,Pe.DAY)):0),le=i(()=>g.readBlockHeight),ce=i(()=>g.nativeToken.label);(async()=>{const t=Le.buildAPIEndpoint(s.selectedAPIEndpoint,s.currentNetworkProfile?s.currentNetworkProfile.httpPort:3e3),d=new Se(t);E.value=await d.chainAPI.getBlockchainHeight()})();const de=i(()=>{let t=[];const d=D.listRootNamespaces(y.value);return t.push.apply(t,d),t}),ue=i(()=>g.nativeToken.label),N=i(()=>s.currentNetworkProfileConfig?u.value>0?l.convertToExact(s.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock*D.calculateDuration(u.value),g.nativeToken.divisibility):l.convertToExact(s.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock,g.nativeToken.divisibility):0),me=i(()=>l.toCurrencyFormat(N.value,6)),ve=i(()=>s.currentNetworkProfileConfig?l.convertToExact(s.currentNetworkProfileConfig.lockedFundsPerAggregate,g.nativeToken.divisibility):0),pe=i(()=>s.currentNetworkProfileConfig?l.amountFormatterSimple(s.currentNetworkProfileConfig.lockedFundsPerAggregate,g.nativeToken.divisibility):0),q=i(()=>s.currentNetworkProfile?l.convertToExact(Ie.getLockFundFee(),g.nativeToken.divisibility):0),S=i(()=>(p.value?p.value.cosignerList.length:0)==0&&J(y.value)),ge=r(q.value.toString()),z=i(()=>ve.value+q.value),fe=i(()=>!(w.value.match(H)&&!U.value&&!oe.value&&!S.value)),Z=r(""),y=r(""),O=r(""),Y=r(""),K=i(()=>x.currentLoggedInWallet?x.currentLoggedInWallet.selectDefaultAccount():null),he=r(K.value?J(K.value.address):!1),$=l.createAddress(a.address).plain();let h=i(()=>x.currentLoggedInWallet?x.currentLoggedInWallet.accounts.find(t=>t.address==$)||x.currentLoggedInWallet.others.find(t=>t.address==$):null);h.value&&(Z.value=h.value.name,y.value=h.value.address,O.value=l.toCurrencyFormat(h.value.balance,g.nativeToken.divisibility),Y.value=h.value.balance);let ee=new Ae("ThemeStyleConfig");ee.init();const be=r(Be(a.address,40,ee.jdenticonConfig));if(h.value){let t=h.value.namespaces.find(d=>d.idHex===a.namespaceId);if(t!=null){R.value=t.endHeight;const d=t.name.split(".");d.length>1?b.value=d[0]:b.value=t.name}}const te=r("0"),I=r(0);try{te.value=l.convertToCurrency(D.getRootNamespaceTransactionFee(b.value,u.value),g.nativeToken.divisibility),I.value=l.convertToExact(D.getRootNamespaceTransactionFee(b.value,u.value),g.nativeToken.divisibility)}catch{}let G=!1;A(u,t=>{if(t>L.value)u.value=L.value;else{let d=R.value-E.value,_=0;V.value=Math.ceil(d/(24*60*4)),parseInt(t)+V.value>L.value?(_=L.value-V.value,u.value=_.toString(),j.value=!0,G=!0):(G||(j.value=!1),G=!1)}});const we=()=>{u.value="1"},ae=i(()=>J(l.createAddress(a.address).plain())?parseFloat(z.value)+N.value+I.value:N.value+I.value),ke=i(()=>l.amountFormatterSimple(ae.value,0));A(ae,t=>{O.value<t&&!S.value?k.value=!0:k.value=!1}),A(le,t=>{E.value=t});const ye=()=>{if(!Me.verifyWalletPassword(x.currentLoggedInWallet.name,s.chainNetworkName,w.value)){B.value=f("general.walletPasswordInvalid",{name:x.currentLoggedInWallet.name});return}re.value?D.extendNamespaceMultisig(re.value,w.value,b.value,u.value,y.value):D.extendNamespace(y.value,w.value,b.value,u.value),X.push({name:"ViewAccountPendingTransactions",params:{address:y.value}})},p=i(()=>{if(h.value)if(s.currentNetworkProfileConfig){let t=Ve.getCosignerInWallet(h.value?h.value.publicKey:""),d=[];return t.cosignerList.forEach(_=>{d.push({publicKey:_,name:W(_).name,balance:W(_).balance,address:W(_).address})}),t.cosignerList=d,{hasCosigner:t.hasCosigner,cosignerList:t.cosignerList}}else return{hasCosigner:!1,cosignerList:[]}});C.value=p.value&&p.value.cosignerList.length>0?p.value.cosignerList[0].address:"",A(p,t=>{t&&t.cosignerList.length>0&&(C.value=t.cosignerList.length>0?p.value.cosignerList[0].address:"")});const oe=i(()=>S.value?Y.value<N.value+I.value:Y.value<N.value+I.value+z.value);A(S,t=>{t?(k.value=!0,P.value=!0):(k.value=!1,P.value=!1)});const re=i(()=>p.value.cosignerList.length>0?p.value.cosignerList.length>1?C.value:W(p.value.cosignerList[0].publicKey).address:""),_e=i(()=>{let t=ne(C.value)?ne(C.value).balance:0;return l.toCurrencyFormat(t)});return{namespaceSelect:e,selectedAccName:Z,selectedAccAdd:y,balance:O,showNoBalance:oe,err:B,walletPassword:w,disableCreate:fe,showPasswdError:c,disabledPassword:k,showDuration:ie,disabledDuration:P,duration:u,showDurationErr:U,isMultiSigBool:he,rentalFee:N,rentalFeeCurrency:me,lockFundTxFee:q,lockFundCurrency:pe,currencyName:ue,lockFundTxFeeCurrency:ge,lockFundTotalFee:z,totalFeeFormatted:ke,selectNamespace:b,namespaceOption:de,extendNamespace:ye,transactionFee:te,getMultiSigCosigner:p,cosignerBalanceInsufficient:se,cosignerAddress:C,isNotCosigner:S,block:E,endBlock:R,numDaysleft:V,showMaxDaysLabel:j,svgString:be,Helper:l,currentNativeTokenName:ce,maxDurationInDays:L,setDefaultDuration:we,checkCosignBalance:_e}}},Ye={class:"w-10/12 ml-auto mr-auto"},Ge={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},Je={class:"xl:col-span-2 p-6 lg:p-12"},Qe={class:"lg:flex lg:justify-between lg:items-center"},Xe={class:"font-semibold mb-4 inline-block mt-1"},Ze={class:"flex items-center"},Ke=["innerHTML"],$e={class:"ml-2"},et={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},tt={class:"font-bold text-black text-sm"},at={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},ot={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},rt={class:"inline-block text-xs"},nt={key:1,class:"rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center"},it={class:"rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"},st={class:"inline-block text-xs"},lt={key:2,class:"error error_box"},ct={class:"text-right w-full"},dt={key:0,class:"inline-block"},ut={class:"text-tsm text-left mt-3"},mt={key:0,class:"font-bold"},vt={key:0,class:"error"},pt={key:1,class:"font-bold"},gt=["value"],ft={key:2,class:"error"},ht={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},bt=o("img",{src:Ue},null,-1),wt={class:"ml-1"},kt={class:"uppercase text-blue-primary font-semibold text-xxs"},yt={class:"text-black text-sm font-bold"},_t={key:3,class:"text-xs inline-block text-gray-400"},xt={class:"bg-navy-primary py-6 px-12 xl:col-span-1"},Ct={class:"text-xs text-white my-5"},Nt=["disabled"],Dt={class:"text-center"};function Ft(a,f,X,e,U,u){const w=M("font-awesome-icon"),B=M("DurationInputClean"),k=M("TransactionFeeDisplay"),P=M("PasswordInput"),H=M("router-link");return m(),v("div",null,[o("div",Ye,[o("div",Ge,[o("div",Je,[o("div",Qe,[o("div",Xe,n(a.$t("general.extendDuration")),1),o("div",Ze,[o("div",{innerHTML:e.svgString,class:"inline-block"},null,8,Ke),o("div",$e,[o("div",et,n(a.$t("namespace.namespaceCreatedBy")),1),o("div",tt,n(e.selectedAccName),1)])])]),e.showNoBalance?(m(),v("div",at,[o("div",ot,[F(w,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),o("div",rt,n(a.$t("general.insufficientBalance")),1)])):e.isNotCosigner?(m(),v("div",nt,[o("div",it,[F(w,{icon:"exclamation",class:"text-yellow-500 h-3 w-3 absolute",style:{top:"5px",left:"7px"}})]),o("div",st,n(a.$t("general.noCosigner")),1)])):T("v-if",!0),e.err!=""?(m(),v("div",lt,n(e.err),1)):T("v-if",!0),o("div",ct,[(e.getMultiSigCosigner?e.getMultiSigCosigner.cosignerList.length:0>0)?(m(),v("div",dt,[o("div",ut,[Q(n(a.$t("general.initiateBy"))+": ",1),e.getMultiSigCosigner.cosignerList.length==1?(m(),v("span",mt,[Q(n(e.getMultiSigCosigner.cosignerList[0].name)+" ("+n(a.$t("general.balance"))+": "+n(e.Helper.amountFormatterSimple(e.getMultiSigCosigner.cosignerList[0].balance,0))+" "+n(e.currentNativeTokenName)+") ",1),e.getMultiSigCosigner.cosignerList[0].balance<e.lockFundTotalFee?(m(),v("span",vt,"- "+n(a.$t("general.insufficientBalance")),1)):T("v-if",!0)])):(m(),v("span",pt,[He(o("select",{"onUpdate:modelValue":f[0]||(f[0]=c=>e.cosignerAddress=c)},[(m(!0),v(je,null,qe(e.getMultiSigCosigner.cosignerList,(c,b)=>(m(),v("option",{value:c.address,key:b},n(c.name)+" ("+n(a.$t("general.balance"))+": "+n(c.balance)+" "+n(e.currentNativeTokenName)+")",9,gt))),128))],512),[[Re,e.cosignerAddress]])])),e.cosignerBalanceInsufficient?(m(),v("div",ft,"- "+n(a.$t("general.insufficientBalance")),1)):T("v-if",!0)])])):T("v-if",!0)]),o("div",ht,[bt,o("div",wt,[o("div",kt,n(a.$t("general.namespace")),1),o("div",yt,n(e.selectNamespace),1)])]),F(B,{class:"mt-5",disabled:e.disabledDuration,modelValue:e.duration,"onUpdate:modelValue":f[1]||(f[1]=c=>e.duration=c),onSetDefaultDuration:e.setDefaultDuration,max:e.maxDurationInDays,placeholder:a.$t("namespace.duration"),showError:e.showDurationErr,toolTip:a.$t("namespace.durationMsg")+`<br>${e.maxDurationInDays===365?"1 "+a.$t("general.year"):""} (${e.maxDurationInDays}`+a.$t("general.day",e.maxDurationInDays)+")."},null,8,["disabled","modelValue","onSetDefaultDuration","max","placeholder","showError","toolTip"]),e.showMaxDaysLabel?(m(),v("div",_t,n(a.$t("namespace.durationMsg2"))+" "+n(e.maxDurationInDays-e.numDaysleft)+" "+n(a.$t("general.day",e.maxDurationInDays-e.numDaysleft)),1)):T("v-if",!0)]),o("div",xt,[F(k,{"namespace-rental-fee-currency":e.rentalFeeCurrency,"transaction-fee":e.transactionFee,"total-fee-formatted":e.totalFeeFormatted,"get-multi-sig-cosigner":e.getMultiSigCosigner,"check-cosign-balance":e.checkCosignBalance,"lock-fund-currency":e.lockFundCurrency,"lock-fund-tx-fee":String(e.lockFundTxFee),balance:e.balance,"selected-acc-add":e.selectedAccAdd},null,8,["namespace-rental-fee-currency","transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),o("div",Ct,n(a.$t("general.enterPasswordContinue")),1),F(P,{placeholder:a.$t("general.password"),errorMessage:a.$t("general.passwordRequired"),showError:e.showPasswdError,modelValue:e.walletPassword,"onUpdate:modelValue":f[2]||(f[2]=c=>e.walletPassword=c),disabled:e.disabledPassword},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),o("button",{type:"submit",class:"mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white",disabled:e.disableCreate,onClick:f[3]||(f[3]=(...c)=>e.extendNamespace&&e.extendNamespace(...c))},n(a.$t("general.extendDuration")),9,Nt),o("div",Dt,[F(H,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:ze(()=>[Q(n(a.$t("general.cancel")),1)]),_:1})])])])])])}const So=Fe(Oe,[["render",Ft],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/namespaces/views/ViewServicesNamespaceExtend.vue"]]);export{So as default};