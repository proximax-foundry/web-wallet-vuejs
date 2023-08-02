import"./vue-86063517.js";import{u as ke}from"./vue-router-21fffbbf.js";import{P as _e}from"./PasswordInput-5c999bbb.js";import{_ as te,a as xe,A as g,n as L,H as m,f as we,p as ee,w as M,T as Te,q as R,v as de,W as Ce}from"./index-913a8781.js";import{o as a,z as i,A as t,g as o,e as y,d as Se,r as n,c as d,F as me,k as pe,D as ue,u as Ne,w as B,B as W,C as Ae,a as $,l as I,p as U,bq as Fe,m as Le}from"./@vue-a9ecc9f1.js";import{d as Me}from"./tsjs-xpx-chain-sdk-84426b6a.js";import"./@js-joda-d98eb16f.js";import{A as w}from"./assetsUtils-9b013976.js";import{T as $e}from"./TransactionFeeDisplay-dcd42b38.js";import{t as Ie}from"./jdenticon-e4458e79.js";import{u as Ve}from"./vue-i18n-728f748b.js";import{e as Pe,u as Ee}from"./primevue-e09f7e84.js";import{M as Be}from"./multisigUtils-17e6fac7.js";import{_ as We}from"./icon-asset-2a9ae6ea.js";import{_ as G}from"./icon-info-8b4f1351.js";import"./rxjs-1250b26d.js";import"./tslib-8dbab242.js";import"./crypto-js-e64ac54c.js";import"./crypto-browserify-4fd8cccd.js";import"./randombytes-685e9383.js";import"./node-stdlib-browser-23a8bc7f.js";import"./buffer-6d367910.js";import"./base64-js-50a5cdf9.js";import"./ieee754-44f7831e.js";import"./process-2209b2b3.js";import"./safe-buffer-c463177b.js";import"./create-hash-92c04a28.js";import"./inherits-804453d8.js";import"./md5.js-8d474739.js";import"./hash-base-bb85fc42.js";import"./readable-stream-2241ee9e.js";import"./events-86ccc6d8.js";import"./util-06f7ff32.js";import"./is-arguments-86164331.js";import"./has-tostringtag-7c6352d6.js";import"./has-symbols-cd7870b9.js";import"./call-bind-9e7f09da.js";import"./get-intrinsic-f35014ba.js";import"./has-proto-8ede3a55.js";import"./function-bind-68631a08.js";import"./has-ab8e2922.js";import"./is-generator-function-06dfaf9d.js";import"./which-typed-array-cf6b6a29.js";import"./for-each-f57c5052.js";import"./is-callable-7492318c.js";import"./available-typed-arrays-61974ec7.js";import"./gopd-bab4d6bd.js";import"./is-typed-array-037eef20.js";import"./util-deprecate-c3aabb3c.js";import"./string_decoder-ef7b01fe.js";import"./ripemd160-58dcfa02.js";import"./sha.js-cea3da2e.js";import"./cipher-base-aee0e03d.js";import"./stream-browserify-7496a08f.js";import"./create-hmac-e8b5ea4a.js";import"./browserify-sign-a708a95f.js";import"./browserify-rsa-bfbdcbb6.js";import"./bn.js-1ae23332.js";import"./elliptic-75e883ee.js";import"./minimalistic-assert-4cc49674.js";import"./minimalistic-crypto-utils-6f869a51.js";import"./brorand-03f0f79d.js";import"./hash.js-4f5dfe73.js";import"./hmac-drbg-87799258.js";import"./parse-asn1-465c125b.js";import"./asn1.js-405e93e4.js";import"./safer-buffer-2ac6237e.js";import"./evp_bytestokey-e91543fa.js";import"./browserify-aes-ce20a0e6.js";import"./buffer-xor-87a7236a.js";import"./pbkdf2-e2ae8643.js";import"./browserify-cipher-c4c37ca3.js";import"./browserify-des-3f7e64d9.js";import"./des.js-d262604a.js";import"./diffie-hellman-c8260aab.js";import"./miller-rabin-de27bf02.js";import"./create-ecdh-ffe720e9.js";import"./public-encrypt-fc0568a2.js";import"./randomfill-2874e5f1.js";import"./mathjs-2a513dae.js";import"./@babel-484168fe.js";import"./typed-function-4896e4f1.js";import"./decimal.js-d133ee8e.js";import"./complex.js-cf2520e8.js";import"./fraction.js-39e7906a.js";import"./javascript-natural-sort-c4dd0c27.js";import"./escape-latex-c8a96e7a.js";import"./seedrandom-c8f991ad.js";import"./tiny-emitter-56d49cfd.js";import"./js-sha3-d7d4f583.js";import"./crypto-random-string-d158262e.js";import"./jose-92e5544c.js";import"./vue-loading-overlay-b89251b1.js";import"./jspdf-30014160.js";import"./fflate-8981c52c.js";import"./vue-debounce-3bbbf8c6.js";import"./mitt-f7ef348c.js";/* empty css                   */import"./maska-6f10db43.js";import"./@fortawesome-014b81f2.js";import"./vue3-blocks-tree-e53499e3.js";import"./@noble-f8eff84a.js";import"./utf8-c941a4a0.js";import"./bip39-936aefa9.js";import"./axios-b48d2c29.js";import"./flatbuffers-edc4f8d7.js";import"./ws-0a714537.js";import"./@intlify-16888cd3.js";import"./proximax-logo-ecfc3767.js";const je={props:{placeholder:String,errorMessage:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean},emits:["update:modelValue"],name:"SelectLinkType",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},watch:{showError:function(e){e?(this.borderColor="border-2 border-red-primary",this.textErr=!0):(this.borderColor="border-2 border-gray-300",this.textErr=!1)}}},De={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},Ue={class:"uppercase text-gray-500 text-txs text-left mb-2"},He={class:"flex items-center"},qe=["value","disabled","checked"],ze={for:"link",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},Re=["value","disabled","checked"],Ge={for:"unlink",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},Je={class:"h-3 mb-2"},Oe={key:0,class:"error error-text text-left"};function Qe(e,r,p,s,b,A){return a(),i("div",null,[t("div",De,[t("div",Ue,o(p.title),1),t("div",He,[t("input",{id:"link",type:"radio",name:"linkType",value:p.modelValue,disabled:p.disabled,class:"h-5 w-5",onChange:r[0]||(r[0]=c=>e.$emit("update:modelValue","link")),checked:p.modelValue=="link"},null,40,qe),t("label",ze,o(e.$t("general.link")),1),t("input",{id:"unlink",type:"radio",name:"linkType",value:p.modelValue,disabled:p.disabled,class:"h-5 w-5",onChange:r[1]||(r[1]=c=>e.$emit("update:modelValue","unlink")),checked:p.modelValue=="unlink"},null,40,Re),t("label",Ge,o(e.$t("general.unlink")),1)])]),t("div",Je,[b.textErr||p.showError?(a(),i("div",Oe,o(p.errorMessage),1)):y("v-if",!0)])])}const Xe=te(je,[["render",Qe],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/SelectLinkType.vue"]]),Ye=Se({emits:["select-account","update:modelValue"],name:"SelectInputNamespace",props:["modelValue","action","address","assetId"],setup(e){const r=n(!1);Ne().appContext.config.globalProperties.emitter;const s=n(""),b=c=>{s.value=c.value,r.value=!r.value},A=d(()=>w.listActiveNamespacesToLink(e.assetId,Me.Address.createFromRawAddress(e.address).plain(),e.action));return{selectNamespace:b,namespaces:A,toggleSelection:r,selectedNamespace:s}}}),Ze={class:"relative"},Ke={class:"flex"},et={class:"flex flex-col ml-2 text-left"},tt={class:"text-blue-primary font-semibold text-xxs mb-1 uppercase",style:{"line-height":"9px"}},st={key:0,class:"mt-1 text-tsm font-bold"},ot={key:1,class:"text-tsm font-bold"},lt={key:0,class:"text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"},at={key:1,class:"text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"},it={class:"relative"},rt={key:0,class:"absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl"},nt={key:0,class:"pl-2 pt-4 text-xxs text-gray-400 uppercase"},ct={key:1,class:"text-xxs pt-2 pl-2 pb-2"},dt=["onClick"],ut={key:0,class:"cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold uppercase"},mt={key:1,class:"text-gray-300 text-xxs mt-0.5 ml-auto uppercase"},pt={key:2,class:"text-gray-500 text-xxs mt-0.5 ml-auto uppercase"};function vt(e,r,p,s,b,A){return a(),i("div",Ze,[t("div",{onClick:r[1]||(r[1]=c=>e.toggleSelection=!e.toggleSelection),class:"border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md w-full h-14"},[t("div",Ke,[t("div",et,[t("div",tt,o(e.$t("general.namespace")),1),e.selectedNamespace!=""?(a(),i("div",st,o(e.selectedNamespace),1)):(a(),i("div",ot,o(e.$t("namespace.selectNamespace")),1))]),!e.toggleSelection&&e.selectedNamespace==""?(a(),i("div",lt,o(e.$t("general.select")),1)):y("v-if",!0),!e.toggleSelection&&e.selectedNamespace!=""?(a(),i("div",at,o(e.$t("general.change")),1)):y("v-if",!0),e.toggleSelection?(a(),i("img",{key:2,onClick:r[0]||(r[0]=c=>e.selectedNamespace=""),src:xe,class:"h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"})):y("v-if",!0)])]),t("div",it,[e.toggleSelection?(a(),i("div",rt,[e.namespaces.length>0?(a(),i("div",nt,o(e.$t("namespace.selectNamespace")),1)):(a(),i("div",ct,o(e.$t("general.listEmpty")),1)),(a(!0),i(me,null,pe(e.namespaces,(c,F)=>(a(),i("div",{key:F,class:ue(["px-2 py-3 flex items-center",[F!=e.namespaces.length-1?"border-b border-gray-200":"",c.disabled?"":"cursor-pointer"]]),onClick:H=>{e.selectNamespace(c),e.$emit("update:modelValue",e.selectedNamespace)}},[t("div",{class:ue(["text-xs truncate",c.disabled?"text-gray-300":"text-black font-semibold"])},o(c.label),3),c.label!=e.selectedNamespace&&!c.disabled?(a(),i("div",ut,o(e.$t("general.select")),1)):c.disabled?(a(),i("div",mt,o(e.$t("general.disabled")),1)):(a(),i("div",pt,o(e.$t("general.current")),1))],10,dt))),128))])):y("v-if",!0)])])}const gt=te(Ye,[["render",vt],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/SelectInputNamespace.vue"]]),bt={name:"ViewServicesAssetsLinkToNamespace",directives:{tooltip:Pe},components:{PasswordInput:_e,SelectLinkType:Xe,SelectInputNamespace:gt,TransactionFeeDisplay:$e},props:{assetId:String,address:String},setup(e){const{t:r}=Ve(),p=ke();Ee();const s=d(()=>g.nativeToken.label),b=n(""),A=n(""),c=n(!1),F=n(!1),H="^[^ ]{8,}$",J=n(!1),O=n(!1),T=n(""),V=d(()=>g.nativeToken.label),u=d(()=>L.currentNetworkProfileConfig?m.convertToExact(L.currentNetworkProfileConfig.lockedFundsPerAggregate,g.nativeToken.divisibility):0),Q=d(()=>L.currentNetworkProfileConfig?m.convertToCurrency(L.currentNetworkProfileConfig.lockedFundsPerAggregate,g.nativeToken.divisibility):0),se=d(()=>L.currentNetworkProfile?m.convertToExact(we.getLockFundFee(),g.nativeToken.divisibility):0),X=d(()=>u.value+se.value),ve=d(()=>!(b.value.match(H)&&j.value!="")),oe=n(""),v=n(m.createAddress(e.address).plain()),Y=n(""),q=n(0),ge=n(ee(v.value)),le=d(()=>Z.value?q.value<S.value:q.value<S.value+X.value),Z=d(()=>_.value.cosignerList.length==0&&ee(v.value)),P=n("0");let f=d(()=>M.currentLoggedInWallet?M.currentLoggedInWallet.accounts.find(l=>l.address==v.value)||M.currentLoggedInWallet.others.find(l=>l.address==v.value):null);f.value&&(oe.value=f.value.name,v.value=f.value.address,Y.value=m.toCurrencyFormat(f.value.balance,g.nativeToken.divisibility),q.value=f.value.balance);let ae=new Te("ThemeStyleConfig");ae.init();const be=n(Ie(e.address,40,ae.jdenticonConfig)),h=n(""),C=n(0),ie=n(0),re=n(!1),ne=n(!1),k=n("link"),j=n("");if(f.value){let l=f.value.assets.find(x=>x.idHex===e.assetId);l!=null&&(h.value=l.idHex,re.value=l.transferable,ne.value=l.supplyMutable,C.value=l.divisibility,ie.value=m.convertToCurrency(l.supply,l.divisibility))}const z=n("0.000000"),S=n(0),_=d(()=>{if(!f.value)return{hasCosigner:!1,cosignerList:[]};if(L.currentNetworkProfileConfig){let l=Be.getCosignerInWallet(f.value?f.value.publicKey:""),x=[];return l.cosignerList.forEach(N=>{x.push({publicKey:N,name:R(N).name,balance:R(N).balance,address:R(N).address})}),l.cosignerList=x,{hasCosigner:l.hasCosigner,cosignerList:l.cosignerList}}else return{hasCosigner:!1,cosignerList:[]}}),K=d(()=>_.value.cosignerList.length>0?_.value.cosignerList.length>1?T.value:R(_.value.cosignerList[0].publicKey).address:"");T.value=_.value.cosignerList.length>0?_.value.cosignerList[0].address:"",B(_,l=>{l.cosignerList.length>0&&(T.value=l.cosignerList.length>0?_.value.cosignerList[0].address:"")});try{z.value=m.convertToCurrency(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,P.value,C.value),g.nativeToken.divisibility),S.value=m.convertToExact(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,P.value,C.value),g.nativeToken.divisibility)}catch(l){console.log(l)}const fe=()=>{if(!Ce.verifyWalletPassword(M.currentLoggedInWallet.name,L.chainNetworkName,b.value)){A.value=r("general.walletPasswordInvalid",{name:M.currentLoggedInWallet.name});return}let x;if(k.value=="link")x=h.value;else{let N=M.currentLoggedInWallet.accounts.find(D=>D.address==v.value);N||(N=M.currentLoggedInWallet.others.find(D=>D.address==v.value)),x=N.namespaces.find(D=>D.name===j.value).linkedId}K.value?w.linkedNamespaceToAssetMultiSig(K.value,b.value,x,j.value,k.value,v.value):w.linkedNamespaceToAsset(v.value,b.value,x,j.value,k.value),p.push({name:"ViewAccountPendingTransactions",params:{address:v.value}})};B(k,l=>{z.value=m.convertToCurrency(w.getMosaicSupplyChangeTransactionFee(h.value,l,P.value,C.value),g.nativeToken.divisibility),S.value=m.convertToExact(w.getMosaicSupplyChangeTransactionFee(h.value,l,P.value,C.value),g.nativeToken.divisibility)}),B(P,l=>{h.value&&(z.value=m.convertToCurrency(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,l,C.value),g.nativeToken.divisibility),S.value=m.convertToExact(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,l,C.value),g.nativeToken.divisibility))});const ce=d(()=>ee(v.value)?parseFloat(X.value)+S.value:S.value),he=d(()=>m.amountFormatterSimple(ce.value,0)),E=l=>{c.value=l,disabledSupply.value=l,F.value=l};B(ce,l=>{Y.value<l?E(!0):E(!1)}),B(le,l=>{E(!!l)}),B(Z,l=>{E(!!l)});const ye=d(()=>{let l=de(T.value)?de(T.value).balance:0;return m.toCurrencyFormat(l)});return{currentNativeTokenName:s,selectedAccName:oe,selectedAccAdd:v,balance:Y,balanceNumber:q,showNoBalance:le,lockFundTxFee:se,lockFundCurrency:Q,lockFundTotalFee:X,totalFeeFormatted:he,err:A,walletPassword:b,disableCreate:ve,showPasswdError:J,supply:P,disabledPassword:c,currencyName:V,isMultiSigBool:ge,selectAsset:h,selectAction:k,linkNamespace:fe,transactionFee:z,transactionFeeExact:S,assetSupply:ie,assetDivisibility:C,assetTransferable:re,assetMutable:ne,selectNamespace:j,getMultiSigCosigner:_,cosignerBalanceInsufficient:O,cosignerAddress:T,cosigner:K,isNotCosigner:Z,disabledSelectAction:F,Helper:m,svgString:be,checkCosignBalance:ye}}},ft={class:"w-10/12 ml-auto mr-auto"},ht={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},yt={class:"xl:col-span-2 p-6 lg:p-12"},kt={class:"lg:flex lg:justify-between lg:items-center"},_t={class:"font-semibold mb-4 inline-block mt-1"},xt={class:"flex items-center"},wt=["innerHTML"],Tt={class:"ml-2"},Ct={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},St={class:"font-bold text-black text-sm"},Nt={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},At={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},Ft={class:"inline-block text-xs"},Lt={key:1,class:"rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center"},Mt={class:"rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"},$t={class:"inline-block text-xs"},It={key:2,class:"error error_box"},Vt={class:"text-right w-full"},Pt={key:0,class:"inline-block"},Et={class:"text-tsm text-left mt-3"},Bt={key:0,class:"font-bold"},Wt={key:0,class:"error"},jt={key:1,class:"font-bold"},Dt=["value"],Ut={key:2,class:"error"},Ht={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},qt=t("img",{src:We},null,-1),zt={class:"ml-1"},Rt={class:"uppercase text-blue-primary font-semibold text-xxs"},Gt={class:"text-black text-sm font-bold"},Jt={class:"border border-gray-200 p-4 rounded mt-5"},Ot={class:"lg:grid lg:grid-cols-2"},Qt={class:"my-3"},Xt={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},Yt={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},Zt={class:"text-black font-bold text-sm"},Kt={class:"my-3"},es={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},ts={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},ss={class:"text-black font-bold text-sm"},os={class:"my-3"},ls={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},as={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},is={class:"uppercase text-black font-bold text-sm"},rs={class:"my-3"},ns={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},cs={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},ds={class:"uppercase text-black font-bold text-sm"},us={class:"lg:grid lg:grid-cols-2 mt-5"},ms={class:"bg-navy-primary py-6 px-12 xl:col-span-1"},ps={class:"text-xs text-white mt-5 mb-1.5"},vs=["disabled"],gs={class:"text-center"};function bs(e,r,p,s,b,A){const c=W("font-awesome-icon"),F=W("SelectLinkType"),H=W("SelectInputNamespace"),J=W("TransactionFeeDisplay"),O=W("PasswordInput"),T=W("router-link"),V=Ae("tooltip");return a(),i("div",null,[t("div",ft,[t("div",ht,[t("div",yt,[t("div",kt,[t("div",_t,o(e.$t("general.linkToNamespace")),1),t("div",xt,[t("div",{innerHTML:s.svgString,class:"inline-block"},null,8,wt),t("div",Tt,[t("div",Ct,o(e.$t("asset.assetCreatedBy")),1),t("div",St,o(s.selectedAccName),1)])])]),s.showNoBalance?(a(),i("div",Nt,[t("div",At,[$(c,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),t("div",Ft,o(e.$t("general.insufficientBalance")),1)])):s.isNotCosigner?(a(),i("div",Lt,[t("div",Mt,[$(c,{icon:"exclamation",class:"text-yellow-500 h-3 w-3 absolute",style:{top:"5px",left:"7px"}})]),t("div",$t,o(e.$t("general.noCosigner")),1)])):y("v-if",!0),s.err!=""?(a(),i("div",It,o(s.err),1)):y("v-if",!0),t("div",Vt,[s.getMultiSigCosigner.cosignerList.length>0?(a(),i("div",Pt,[t("div",Et,[I(o(e.$t("general.initiateBy"))+": ",1),s.getMultiSigCosigner.cosignerList.length==1?(a(),i("span",Bt,[I(o(s.getMultiSigCosigner.cosignerList[0].name)+" ("+o(e.$t("general.balance"))+": "+o(s.Helper.amountFormatterSimple(s.getMultiSigCosigner.cosignerList[0].balance,0))+" "+o(s.currentNativeTokenName)+") ",1),s.getMultiSigCosigner.cosignerList[0].balance<s.lockFundTotalFee?(a(),i("span",Wt,"- "+o(e.$t("general.insufficientBalance")),1)):y("v-if",!0)])):(a(),i("span",jt,[U(t("select",{"onUpdate:modelValue":r[0]||(r[0]=u=>s.cosignerAddress=u)},[(a(!0),i(me,null,pe(s.getMultiSigCosigner.cosignerList,(u,Q)=>(a(),i("option",{value:u.address,key:Q},o(u.name)+" ("+o(e.$t("general.balance"))+": "+o(u.balance)+" "+o(s.currentNativeTokenName)+")",9,Dt))),128))],512),[[Fe,s.cosignerAddress]])])),s.cosignerBalanceInsufficient?(a(),i("div",Ut,"- "+o(e.$t("general.insufficientBalance")),1)):y("v-if",!0)])])):y("v-if",!0)]),t("div",Ht,[qt,t("div",zt,[t("div",Rt,o(e.$t("general.assetId")),1),t("div",Gt,o(s.selectAsset),1)])]),t("div",Jt,[t("div",Ot,[t("div",Qt,[t("div",Xt,[I(o(e.$t("asset.currentSupply")),1),U(t("img",Yt,null,512),[[V,{value:"<tiptext>"+e.$t("asset.supplyMsg2")+"<br>"+e.$t("asset.supplyMsg3")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",Zt,o(s.assetSupply),1)]),t("div",Kt,[t("div",es,[I(o(e.$t("general.divisibility")),1),U(t("img",ts,null,512),[[V,{value:"<tiptext>"+e.$t("asset.divisibilityMsg4")+"<br><br>"+e.$t("asset.divisibilityMsg2")+"<br>"+e.$t("asset.divisibilityMsg3")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",ss,o(s.assetDivisibility),1)]),t("div",os,[t("div",ls,[I(o(e.$t("general.transferable")),1),U(t("img",as,null,512),[[V,{value:"<tiptext>"+e.$t("asset.transferableMsg")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",is,o(s.assetTransferable?e.$t("general.yes"):e.$t("general.no")),1)]),t("div",rs,[t("div",ns,[I(o(e.$t("general.supplyMutable")),1),U(t("img",cs,null,512),[[V,{value:"<tiptext>"+e.$t("asset.supplyMutableMsg")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",ds,o(s.assetMutable?e.$t("general.yes"):e.$t("general.no")),1)])])]),t("div",us,[$(F,{title:e.$t("asset.modificationType"),class:"lg:mr-4",modelValue:s.selectAction,"onUpdate:modelValue":r[1]||(r[1]=u=>s.selectAction=u),disabled:s.disabledSelectAction},null,8,["title","modelValue","disabled"]),$(H,{action:s.selectAction,modelValue:s.selectNamespace,"onUpdate:modelValue":r[2]||(r[2]=u=>s.selectNamespace=u),address:s.selectedAccAdd,assetId:s.selectAsset},null,8,["action","modelValue","address","assetId"])])]),t("div",ms,[$(J,{"transaction-fee":s.transactionFee,"total-fee-formatted":s.totalFeeFormatted,"get-multi-sig-cosigner":s.getMultiSigCosigner,"check-cosign-balance":s.checkCosignBalance,"lock-fund-currency":s.lockFundCurrency,"lock-fund-tx-fee":String(s.lockFundTxFee),balance:s.balance,"selected-acc-add":s.selectedAccAdd},null,8,["transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),t("div",ps,o(e.$t("general.enterPasswordContinue")),1),$(O,{placeholder:e.$t("general.password"),errorMessage:e.$t("general.passwordRequired"),showError:s.showPasswdError,modelValue:s.walletPassword,"onUpdate:modelValue":r[3]||(r[3]=u=>s.walletPassword=u),disabled:s.disabledPassword},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),t("button",{type:"submit",class:"mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white",disabled:s.disableCreate,onClick:r[4]||(r[4]=(...u)=>s.linkNamespace&&s.linkNamespace(...u))},o(s.selectAction=="link"?e.$t("general.linkToNamespace"):e.$t("namespace.unlinkNamespace")),9,vs),t("div",gs,[$(T,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:Le(()=>[I(o(e.$t("general.cancel")),1)]),_:1})])])])])])}const yl=te(bt,[["render",bs],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/views/ViewServicesAssetsLinkToNamespace.vue"]]);export{yl as default};