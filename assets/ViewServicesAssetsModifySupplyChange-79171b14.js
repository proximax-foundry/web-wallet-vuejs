import"./vue-86063517.js";import{u as xe}from"./vue-router-21fffbbf.js";import{P as ke}from"./PasswordInput-5c999bbb.js";import{S as Se}from"./SupplyInputClean-dff4a06e.js";import{_ as ce,A as b,n as C,H as h,f as Ce,w as W,p as z,T as Te,q as O,v as ne,W as Me}from"./index-913a8781.js";import{o as n,z as c,A as t,g as r,e as F,c as i,r as m,w as T,B as V,C as Fe,a as w,l as M,p as j,bq as Ae,F as Le,k as Ne,m as Ie}from"./@vue-a9ecc9f1.js";import{T as Pe}from"./TransactionFeeDisplay-dcd42b38.js";import{A as Y}from"./assetsUtils-9b013976.js";import{t as Ve}from"./jdenticon-e4458e79.js";import{u as Ee}from"./vue-i18n-728f748b.js";import{e as Be,u as De}from"./primevue-e09f7e84.js";import{M as We}from"./multisigUtils-17e6fac7.js";import{_ as je}from"./icon-asset-2a9ae6ea.js";import{_ as G}from"./icon-info-8b4f1351.js";import"./@js-joda-d98eb16f.js";import"./tsjs-xpx-chain-sdk-84426b6a.js";import"./rxjs-1250b26d.js";import"./tslib-8dbab242.js";import"./@noble-f8eff84a.js";import"./js-sha3-d7d4f583.js";import"./node-stdlib-browser-23a8bc7f.js";import"./buffer-6d367910.js";import"./base64-js-50a5cdf9.js";import"./ieee754-44f7831e.js";import"./process-2209b2b3.js";import"./utf8-c941a4a0.js";import"./bip39-936aefa9.js";import"./axios-b48d2c29.js";import"./flatbuffers-edc4f8d7.js";import"./ws-0a714537.js";import"./crypto-js-e64ac54c.js";import"./crypto-browserify-4fd8cccd.js";import"./randombytes-685e9383.js";import"./safe-buffer-c463177b.js";import"./create-hash-92c04a28.js";import"./inherits-804453d8.js";import"./md5.js-8d474739.js";import"./hash-base-bb85fc42.js";import"./readable-stream-2241ee9e.js";import"./events-86ccc6d8.js";import"./util-06f7ff32.js";import"./is-arguments-86164331.js";import"./has-tostringtag-7c6352d6.js";import"./has-symbols-cd7870b9.js";import"./call-bind-9e7f09da.js";import"./get-intrinsic-f35014ba.js";import"./has-proto-8ede3a55.js";import"./function-bind-68631a08.js";import"./has-ab8e2922.js";import"./is-generator-function-06dfaf9d.js";import"./which-typed-array-cf6b6a29.js";import"./for-each-f57c5052.js";import"./is-callable-7492318c.js";import"./available-typed-arrays-61974ec7.js";import"./gopd-bab4d6bd.js";import"./is-typed-array-037eef20.js";import"./util-deprecate-c3aabb3c.js";import"./string_decoder-ef7b01fe.js";import"./ripemd160-58dcfa02.js";import"./sha.js-cea3da2e.js";import"./cipher-base-aee0e03d.js";import"./stream-browserify-7496a08f.js";import"./create-hmac-e8b5ea4a.js";import"./browserify-sign-a708a95f.js";import"./browserify-rsa-bfbdcbb6.js";import"./bn.js-1ae23332.js";import"./elliptic-75e883ee.js";import"./minimalistic-assert-4cc49674.js";import"./minimalistic-crypto-utils-6f869a51.js";import"./brorand-03f0f79d.js";import"./hash.js-4f5dfe73.js";import"./hmac-drbg-87799258.js";import"./parse-asn1-465c125b.js";import"./asn1.js-405e93e4.js";import"./safer-buffer-2ac6237e.js";import"./evp_bytestokey-e91543fa.js";import"./browserify-aes-ce20a0e6.js";import"./buffer-xor-87a7236a.js";import"./pbkdf2-e2ae8643.js";import"./browserify-cipher-c4c37ca3.js";import"./browserify-des-3f7e64d9.js";import"./des.js-d262604a.js";import"./diffie-hellman-c8260aab.js";import"./miller-rabin-de27bf02.js";import"./create-ecdh-ffe720e9.js";import"./public-encrypt-fc0568a2.js";import"./randomfill-2874e5f1.js";import"./mathjs-2a513dae.js";import"./@babel-484168fe.js";import"./typed-function-4896e4f1.js";import"./decimal.js-d133ee8e.js";import"./complex.js-cf2520e8.js";import"./fraction.js-39e7906a.js";import"./javascript-natural-sort-c4dd0c27.js";import"./escape-latex-c8a96e7a.js";import"./seedrandom-c8f991ad.js";import"./tiny-emitter-56d49cfd.js";import"./crypto-random-string-d158262e.js";import"./jose-92e5544c.js";import"./vue-loading-overlay-b89251b1.js";import"./jspdf-30014160.js";import"./fflate-8981c52c.js";import"./vue-debounce-3bbbf8c6.js";import"./mitt-f7ef348c.js";/* empty css                   */import"./maska-6f10db43.js";import"./@fortawesome-014b81f2.js";import"./vue3-blocks-tree-e53499e3.js";import"./@intlify-16888cd3.js";import"./proximax-logo-ecfc3767.js";const Ue={props:{placeholder:String,errorMessage:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean},emits:["update:modelValue"],name:"SelectModificationType",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},watch:{showError:function(s){s?(this.borderColor="border-2 border-red-primary",this.textErr=!0):(this.borderColor="border-2 border-gray-300",this.textErr=!1)}}},He={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},qe={class:"uppercase text-gray-500 text-txs text-left mb-2"},Re={class:"flex items-center"},ze=["value","disabled","checked"],Oe={for:"increase",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},Ye=["value","disabled","checked"],Ge={for:"decrease",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},Je={class:"h-3 mb-2"},Qe={key:0,class:"error error-text text-left"};function Xe(s,l,p,e,U,f){return n(),c("div",null,[t("div",He,[t("div",qe,r(p.title),1),t("div",Re,[t("input",{id:"increase",type:"radio",name:"modificationType",value:p.modelValue,disabled:p.disabled,class:"h-5 w-5",onChange:l[0]||(l[0]=v=>s.$emit("update:modelValue","increase")),checked:p.modelValue=="increase"},null,40,ze),t("label",Oe,r(s.$t("general.increase")),1),t("input",{id:"decrease",type:"radio",name:"modificationType",value:p.modelValue,disabled:p.disabled,class:"h-5 w-5",onChange:l[1]||(l[1]=v=>s.$emit("update:modelValue","decrease")),checked:p.modelValue=="decrease"},null,40,Ye),t("label",Ge,r(s.$t("general.decrease")),1)])]),t("div",Je,[U.textErr||p.showError?(n(),c("div",Qe,r(p.errorMessage),1)):F("v-if",!0)])])}const Ze=ce(Ue,[["render",Xe],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/SelectModificationType.vue"]]),Ke={name:"ViewServicesAssetsModifySupplyChange",directives:{tooltip:Be},components:{PasswordInput:ke,SupplyInputClean:Se,SelectModificationType:Ze,TransactionFeeDisplay:Pe},props:{assetId:String,address:String},setup(s){const{t:l}=Ee(),p=xe();De();let e=9e14;const U=i(()=>b.nativeToken.label),f=m(!1),v=m(""),H=m(""),A=m(!1),L=m(!1),N=m(!1),J="^[^ ]{8,}$",I=m(!1),a=m(!1),_=m(""),de=i(()=>b.nativeToken.label),ue=i(()=>C.currentNetworkProfileConfig?h.convertToExact(C.currentNetworkProfileConfig.lockedFundsPerAggregate,b.nativeToken.divisibility):0),me=i(()=>C.currentNetworkProfileConfig?h.convertToCurrency(C.currentNetworkProfileConfig.lockedFundsPerAggregate,b.nativeToken.divisibility):0),te=i(()=>C.currentNetworkProfile?h.convertToExact(Ce.getLockFundFee(),b.nativeToken.divisibility):0),Q=i(()=>ue.value+te.value),pe=i(()=>!(v.value.match(J)&&g.value>0&&!f.value&&!$.value&!q.value)),ve=i(()=>d.value?d.value.name:""),x=i(()=>d.value?d.value.address:""),X=i(()=>d.value?d.value.balance:0),se=i(()=>{if(d.value)return h.toCurrencyFormat(d.value.balance,b.nativeToken.divisibility)}),g=m("0"),oe=h.createAddress(s.address).plain();let d=i(()=>W.currentLoggedInWallet?W.currentLoggedInWallet.accounts.find(o=>o.address==oe)||W.currentLoggedInWallet.others.find(o=>o.address==oe):null);const fe=m(z(x.value));let re=new Te("ThemeStyleConfig");re.init();const ge=m(Ve(s.address,40,re.jdenticonConfig)),k=m("increase");let Z=9e14;const u=i(()=>d.value?d.value.assets.find(o=>o.idHex===s.assetId):null),E=i(()=>u.value?u.value.amount:0),K=i(()=>u.value?u.value.idHex:""),be=i(()=>u.value?u.value.transferable:!1),ie=i(()=>u.value?u.value.supplyMutable:!1),B=i(()=>u.value?u.value.divisibility:0),S=i(()=>u.value?u.value.supply/Math.pow(10,u.value.divisibility):0),y=i(()=>{if(!d.value)return{hasCosigner:!1,cosignerList:[]};if(C.currentNetworkProfileConfig){let o=We.getCosignerInWallet(d.value?d.value.publicKey:""),ae=[];return o.cosignerList.forEach(R=>{ae.push({publicKey:R,name:O(R).name,balance:O(R).balance,address:O(R).address})}),o.cosignerList=ae,{hasCosigner:o.hasCosigner,cosignerList:o.cosignerList}}else return{hasCosigner:!1,cosignerList:[]}});_.value=y.value.cosignerList.length>0?y.value.cosignerList[0].address:"",T(y,o=>{o.cosignerList.length>0&&(_.value=o.cosignerList.length>0?y.value.cosignerList[0].address:"")});const q=i(()=>y.value.cosignerList.length==0&&z(x.value)),$=i(()=>q.value?X.value<D.value:X.value<D.value+Q.value),ee=i(()=>y.value.cosignerList.length>0?y.value.cosignerList.length>1?_.value:O(y.value.cosignerList[0].publicKey).address:""),he=i(()=>b.isReady?h.convertToCurrency(Y.getMosaicSupplyChangeTransactionFee(s.assetId,k.value,parseFloat(g.value),B.value),b.nativeToken.divisibility):"0"),D=i(()=>b.isReady?h.convertToExact(Y.getMosaicSupplyChangeTransactionFee(s.assetId,k.value,parseFloat(g.value),B.value),b.nativeToken.divisibility):0);T(ie,o=>{o?(N.value=!1,L.value=!1,A.value=!1):(N.value=!0,L.value=!0,A.value=!0)},{immediate:!0});const ye=()=>{if(!Me.verifyWalletPassword(W.currentLoggedInWallet.name,C.chainNetworkName,v.value)){H.value=l("general.walletPasswordInvalid",{name:W.currentLoggedInWallet.name});return}ee.value?Y.changeAssetSupplyMultiSig(ee.value,v.value,K.value,k.value,g.value,B.value,x.value):Y.changeAssetSupply(x.value,v.value,K.value,k.value,g.value,B.value),p.push({name:"ViewAccountPendingTransactions",params:{address:x.value}})};T(k,o=>{o=="increase"?f.value=parseFloat(g.value)>Z-S.value:S.value==E.value?f.value=parseFloat(g.value)>S.value-1:f.value=parseFloat(g.value)>E.value}),T(g,o=>{k.value=="increase"?f.value=parseFloat(o)>Z-S.value:S.value==E.value?f.value=parseFloat(o)>S.value-1:f.value=parseFloat(o)>E.value});const le=i(()=>z(x.value)?parseFloat(Q.value)+D.value:D.value),_e=i(()=>h.amountFormatterSimple(le.value,0)),P=o=>{A.value=o,L.value=o,N.value=o};T(le,o=>{se.value<o?P(!0):P(!1)}),T($,o=>{P(!!o)}),T(q,o=>{P(!!o)});const we=i(()=>{let o=ne(_.value)?ne(_.value).balance:0;return h.toCurrencyFormat(o)});return{currentNativeTokenName:U,selectedAccName:ve,selectedAccAdd:x,balance:se,balanceNumber:X,showNoBalance:$,lockFundTxFee:te,lockFundCurrency:me,lockFundTotalFee:Q,totalFeeFormatted:_e,showSupplyErr:f,err:H,walletPassword:v,disableModify:pe,showPasswdError:I,supply:g,disabledPassword:A,disabledSupply:L,currencyName:de,isMultiSig:z,isMultiSigBool:fe,selectAsset:K,selectIncreaseDecrease:k,modifyAsset:ye,transactionFee:he,transactionFeeExact:D,assetSupply:S,assetAmount:E,assetDivisibility:B,assetTransferable:be,assetMutable:ie,getMultiSigCosigner:y,cosignerBalanceInsufficient:a,cosignerAddress:_,cosigner:ee,isNotCosigner:q,disabledSelectIncreaseDecrease:N,Helper:h,svgString:ge,maxAmount:e,maxAssetSupply:Z,checkCosignBalance:we}}},$e={class:"w-10/12 ml-auto mr-auto"},et={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},tt={class:"xl:col-span-2 p-6 lg:p-12"},st={class:"lg:flex lg:justify-between lg:items-center"},ot={class:"font-semibold mb-4 inline-block mt-1"},rt={class:"flex items-center"},it=["innerHTML"],lt={class:"ml-2"},at={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},nt={class:"font-bold text-black text-sm"},ct={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},dt={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},ut=t("div",{class:"inline-block text-xs"},"Asset is immutable",-1),mt={key:1,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},pt={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},vt={class:"inline-block text-xs"},ft={key:2,class:"rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center"},gt={class:"rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"},bt={class:"inline-block text-xs"},ht={key:3,class:"error error_box"},yt={class:"text-right w-full"},_t={key:0,class:"inline-block"},wt={class:"text-tsm text-left mt-3"},xt={key:0,class:"font-bold"},kt={key:0,class:"error"},St={key:1,class:"font-bold"},Ct=["value"],Tt={key:2,class:"error"},Mt={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},Ft=t("img",{src:je},null,-1),At={class:"ml-1"},Lt={class:"uppercase text-blue-primary font-semibold text-xxs"},Nt={class:"text-black text-sm font-bold"},It={class:"border border-gray-200 p-4 rounded mt-5"},Pt={class:"lg:grid lg:grid-cols-2"},Vt={class:"my-3"},Et={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},Bt={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},Dt={class:"text-black font-bold text-sm"},Wt={class:"my-3"},jt={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},Ut={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},Ht={class:"text-black font-bold text-sm"},qt={class:"my-3"},Rt={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},zt={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},Ot={class:"uppercase text-black font-bold text-sm"},Yt={class:"my-3"},Gt={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},Jt={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},Qt={class:"uppercase text-black font-bold text-sm"},Xt={class:"lg:grid lg:grid-cols-2 mt-5"},Zt={class:"bg-navy-primary py-6 px-12 xl:col-span-1"},Kt={class:"text-xs text-white mt-5 mb-1.5"},$t=["disabled"],es={class:"text-center"};function ts(s,l,p,e,U,f){const v=V("font-awesome-icon"),H=V("SelectModificationType"),A=V("SupplyInputClean"),L=V("TransactionFeeDisplay"),N=V("PasswordInput"),J=V("router-link"),I=Fe("tooltip");return n(),c("div",null,[t("div",$e,[t("div",et,[t("div",tt,[t("div",st,[t("div",ot,r(s.$t("asset.modifyAssetSupply")),1),t("div",rt,[t("div",{innerHTML:e.svgString,class:"inline-block"},null,8,it),t("div",lt,[t("div",at,r(s.$t("asset.assetCreatedBy")),1),t("div",nt,r(e.selectedAccName),1)])])]),e.assetMutable?F("v-if",!0):(n(),c("div",ct,[t("div",dt,[w(v,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),ut])),e.showNoBalance?(n(),c("div",mt,[t("div",pt,[w(v,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),t("div",vt,r(s.$t("general.insufficientBalance")),1)])):e.isNotCosigner?(n(),c("div",ft,[t("div",gt,[w(v,{icon:"exclamation",class:"text-yellow-500 h-3 w-3 absolute",style:{top:"5px",left:"7px"}})]),t("div",bt,r(s.$t("general.noCosigner")),1)])):F("v-if",!0),e.err!=""?(n(),c("div",ht,r(e.err),1)):F("v-if",!0),t("div",yt,[e.getMultiSigCosigner.cosignerList.length>0?(n(),c("div",_t,[t("div",wt,[M(r(s.$t("general.initiateBy"))+": ",1),e.getMultiSigCosigner.cosignerList.length==1?(n(),c("span",xt,[M(r(e.getMultiSigCosigner.cosignerList[0].name)+" ("+r(s.$t("general.balance"))+": "+r(e.Helper.amountFormatterSimple(e.getMultiSigCosigner.cosignerList[0].balance,0))+" "+r(e.currentNativeTokenName)+") ",1),e.getMultiSigCosigner.cosignerList[0].balance<e.lockFundTotalFee?(n(),c("span",kt,"- "+r(s.$t("general.insufficientBalance")),1)):F("v-if",!0)])):(n(),c("span",St,[j(t("select",{"onUpdate:modelValue":l[0]||(l[0]=a=>e.cosignerAddress=a)},[(n(!0),c(Le,null,Ne(e.getMultiSigCosigner.cosignerList,(a,_)=>(n(),c("option",{value:a.address,key:_},r(a.name)+" ("+r(s.$t("general.balance"))+": "+r(a.balance)+" "+r(e.currentNativeTokenName)+")",9,Ct))),128))],512),[[Ae,e.cosignerAddress]])])),e.cosignerBalanceInsufficient?(n(),c("div",Tt,"- "+r(s.$t("general.insufficientBalance")),1)):F("v-if",!0)])])):F("v-if",!0)]),t("div",Mt,[Ft,t("div",At,[t("div",Lt,r(s.$t("general.assetId")),1),t("div",Nt,r(e.selectAsset),1)])]),t("div",It,[t("div",Pt,[t("div",Vt,[t("div",Et,[M(r(s.$t("asset.currentSupply")),1),j(t("img",Bt,null,512),[[I,{value:"<tiptext>"+s.$t("asset.supplyMsg2")+"<br>"+s.$t("asset.supplyMsg3")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",Dt,r(e.assetAmount),1)]),t("div",Wt,[t("div",jt,[M(r(s.$t("general.divisibility")),1),j(t("img",Ut,null,512),[[I,{value:"<tiptext>"+s.$t("asset.divisibilityMsg4")+"<br><br>"+s.$t("asset.divisibilityMsg2")+"<br>"+s.$t("asset.divisibilityMsg3")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",Ht,r(e.assetDivisibility),1)]),t("div",qt,[t("div",Rt,[M(r(s.$t("general.transferable")),1),j(t("img",zt,null,512),[[I,{value:"<tiptext>"+s.$t("asset.transferableMsg")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",Ot,r(e.assetTransferable?s.$t("general.yes"):s.$t("general.no")),1)]),t("div",Yt,[t("div",Gt,[M(r(s.$t("general.supplyMutable")),1),j(t("img",Jt,null,512),[[I,{value:"<tiptext>"+s.$t("asset.supplyMutableMsg")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",Qt,r(e.assetMutable?s.$t("general.yes"):s.$t("general.no")),1)])])]),t("div",Xt,[w(H,{title:s.$t("asset.modificationType"),class:"lg:mr-4",modelValue:e.selectIncreaseDecrease,"onUpdate:modelValue":l[1]||(l[1]=a=>e.selectIncreaseDecrease=a)},null,8,["title","modelValue"]),w(A,{disabled:e.showNoBalance||e.isNotCosigner,modelValue:e.supply,"onUpdate:modelValue":l[2]||(l[2]=a=>e.supply=a),balance:e.maxAssetSupply-e.assetSupply.value,placeholder:s.$t("asset.quantityOf",{value:e.selectIncreaseDecrease}),type:"text",icon:"coins",showError:e.showSupplyErr,errorMessage:e.selectIncreaseDecrease=="increase"?" The total asset supply should not exceed 900T":" You have exceeded the maximum value for decrease asset supply.",decimal:Number(e.assetDivisibility),class:"lg:ml-4"},null,8,["disabled","modelValue","balance","placeholder","showError","errorMessage","decimal"])])]),t("div",Zt,[w(L,{"transaction-fee":e.transactionFee,"total-fee-formatted":e.totalFeeFormatted,"get-multi-sig-cosigner":e.getMultiSigCosigner,"check-cosign-balance":e.checkCosignBalance,"lock-fund-currency":e.lockFundCurrency,"lock-fund-tx-fee":String(e.lockFundTxFee),balance:e.balance,"selected-acc-add":e.selectedAccAdd},null,8,["transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),t("div",Kt,r(s.$t("general.enterPasswordContinue")),1),w(N,{placeholder:s.$t("general.password"),errorMessage:s.$t("general.passwordRequired"),showError:e.showPasswdError,modelValue:e.walletPassword,"onUpdate:modelValue":l[3]||(l[3]=a=>e.walletPassword=a),disabled:e.disabledPassword},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),t("button",{type:"submit",class:"mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white",disabled:e.disableModify,onClick:l[4]||(l[4]=(...a)=>e.modifyAsset&&e.modifyAsset(...a))},r(s.$t("asset.modifyAssetSupply")),9,$t),t("div",es,[w(J,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:Ie(()=>[M(r(s.$t("general.cancel")),1)]),_:1})])])])])])}const ir=ce(Ke,[["render",ts],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/views/ViewServicesAssetsModifySupplyChange.vue"]]);export{ir as default};
