import{T as Re,w as c,H as L,A as f,n as k,f as Q,q as P,W as ae,_ as Oe}from"./index-913a8781.js";import"./vue-86063517.js";import{P as Qe}from"./PasswordInput-5c999bbb.js";import{u as je}from"./vue-i18n-728f748b.js";import{M as oe}from"./multisigUtils-17e6fac7.js";import{M as qe}from"./MetadataInput-666f07d0.js";import{T as Ze}from"./TransactionFeeDisplay-dcd42b38.js";import{d as s}from"./tsjs-xpx-chain-sdk-84426b6a.js";import{t as Xe}from"./jdenticon-e4458e79.js";import{U as ze}from"./utf-8-cb75ef47.js";import{u as Ge}from"./vue-router-21fffbbf.js";import{r as g,c as v,w as S,B as D,C as Je,z as n,A as a,a as V,g as p,e as M,l as pe,p as j,bq as Ye,F as ge,k as ve,bp as fe,m as $e,o as i}from"./@vue-a9ecc9f1.js";import{_ as et}from"./icon-asset-2a9ae6ea.js";import"./rxjs-1250b26d.js";import"./@js-joda-d98eb16f.js";import"./tslib-8dbab242.js";import"./crypto-js-e64ac54c.js";import"./crypto-browserify-4fd8cccd.js";import"./randombytes-685e9383.js";import"./node-stdlib-browser-23a8bc7f.js";import"./buffer-6d367910.js";import"./base64-js-50a5cdf9.js";import"./ieee754-44f7831e.js";import"./process-2209b2b3.js";import"./safe-buffer-c463177b.js";import"./create-hash-92c04a28.js";import"./inherits-804453d8.js";import"./md5.js-8d474739.js";import"./hash-base-bb85fc42.js";import"./readable-stream-2241ee9e.js";import"./events-86ccc6d8.js";import"./util-06f7ff32.js";import"./is-arguments-86164331.js";import"./has-tostringtag-7c6352d6.js";import"./has-symbols-cd7870b9.js";import"./call-bind-9e7f09da.js";import"./get-intrinsic-f35014ba.js";import"./has-proto-8ede3a55.js";import"./function-bind-68631a08.js";import"./has-ab8e2922.js";import"./is-generator-function-06dfaf9d.js";import"./which-typed-array-cf6b6a29.js";import"./for-each-f57c5052.js";import"./is-callable-7492318c.js";import"./available-typed-arrays-61974ec7.js";import"./gopd-bab4d6bd.js";import"./is-typed-array-037eef20.js";import"./util-deprecate-c3aabb3c.js";import"./string_decoder-ef7b01fe.js";import"./ripemd160-58dcfa02.js";import"./sha.js-cea3da2e.js";import"./cipher-base-aee0e03d.js";import"./stream-browserify-7496a08f.js";import"./create-hmac-e8b5ea4a.js";import"./browserify-sign-a708a95f.js";import"./browserify-rsa-bfbdcbb6.js";import"./bn.js-1ae23332.js";import"./elliptic-75e883ee.js";import"./minimalistic-assert-4cc49674.js";import"./minimalistic-crypto-utils-6f869a51.js";import"./brorand-03f0f79d.js";import"./hash.js-4f5dfe73.js";import"./hmac-drbg-87799258.js";import"./parse-asn1-465c125b.js";import"./asn1.js-405e93e4.js";import"./safer-buffer-2ac6237e.js";import"./evp_bytestokey-e91543fa.js";import"./browserify-aes-ce20a0e6.js";import"./buffer-xor-87a7236a.js";import"./pbkdf2-e2ae8643.js";import"./browserify-cipher-c4c37ca3.js";import"./browserify-des-3f7e64d9.js";import"./des.js-d262604a.js";import"./diffie-hellman-c8260aab.js";import"./miller-rabin-de27bf02.js";import"./create-ecdh-ffe720e9.js";import"./public-encrypt-fc0568a2.js";import"./randomfill-2874e5f1.js";import"./mathjs-2a513dae.js";import"./@babel-484168fe.js";import"./typed-function-4896e4f1.js";import"./decimal.js-d133ee8e.js";import"./complex.js-cf2520e8.js";import"./fraction.js-39e7906a.js";import"./javascript-natural-sort-c4dd0c27.js";import"./escape-latex-c8a96e7a.js";import"./seedrandom-c8f991ad.js";import"./tiny-emitter-56d49cfd.js";import"./js-sha3-d7d4f583.js";import"./crypto-random-string-d158262e.js";import"./jose-92e5544c.js";import"./primevue-e09f7e84.js";import"./vue-loading-overlay-b89251b1.js";import"./jspdf-30014160.js";import"./fflate-8981c52c.js";import"./vue-debounce-3bbbf8c6.js";import"./mitt-f7ef348c.js";/* empty css                   */import"./maska-6f10db43.js";import"./@fortawesome-014b81f2.js";import"./vue3-blocks-tree-e53499e3.js";import"./@noble-f8eff84a.js";import"./utf8-c941a4a0.js";import"./bip39-936aefa9.js";import"./axios-b48d2c29.js";import"./flatbuffers-edc4f8d7.js";import"./ws-0a714537.js";import"./@intlify-16888cd3.js";import"./icon-info-8b4f1351.js";import"./proximax-logo-ecfc3767.js";const tt={name:"ViewUpdateAssetMetadata",props:{targetId:String,scopedMetadataKey:String},components:{MetadataInput:qe,PasswordInput:Qe,TransactionFeeDisplay:Ze},setup(d){const u=Ge();let E=g(!1),t=g(!0),I=g(1),y=g(null),w=null,x=g(!1),T=g(""),m=g(""),b=g(null),h,r,_,R;const K=g(""),H=g(""),le=new Re("ThemeStyleConfig");le.init();const ye=v(()=>Xe(b.value?b.value.address:"",40,le.jdenticonConfig)),be=v(()=>b.value?c.currentLoggedInWallet.convertAddressToName(b.value.address,!0):""),re=g([]),O=c.currentLoggedInWallet?c.currentLoggedInWallet.selectDefaultAccount():null,q=g(O?O.address:""),he=g(L.toCurrencyFormat(O?O.balance:0,f.nativeToken.divisibility)),se=e=>(e.endsWith("00")&&(e=e.substring(0,e.length-2),e=se(e)),e),Z=e=>{e=se(e);let l=s.Convert.hexToUint8(e);return ze.isNotUTF8(l)||(e=s.Convert.decodeHexToUtf8(e)),e},xe=()=>{let e=new s.MetadataQueryParams;e.metadataType=s.MetadataType.MOSAIC,e.targetId=w,f.chainAPI.metadataAPI.searchMetadatas(e).then(l=>{l.metadataEntries.forEach(o=>{re.value.push({value:o.scopedMetadataKey.toHex()==Z(o.scopedMetadataKey.toHex())?o.scopedMetadataKey.toHex():Z(o.scopedMetadataKey.toHex()),type:o.scopedMetadataKey.toHex()==Z(o.scopedMetadataKey.toHex())?2:1})})})},_e=async()=>{if(d.targetId&&d.targetId.length===16&&s.Convert.isHexString(d.targetId)){let e=new s.MosaicId(d.targetId);w=e,h.targetMosaicId(w);let l=await f.chainAPI.assetAPI.getMosaic(e);if(y.value=l.owner,h.targetPublicKey(y.value),!c.currentLoggedInWallet)return;b.value=c.currentLoggedInWallet.accounts.find(o=>o.publicKey===l.owner.publicKey)||c.currentLoggedInWallet.others.find(o=>o.publicKey===l.owner.publicKey),b.value&&(x.value=!!b.value.getDirectParentMultisig().length)}},Me=v(()=>c.currentLoggedInWallet&&y.value?c.currentLoggedInWallet.others.find(e=>e.publicKey===y.value.publicKey):null);S(Me,async e=>{e&&(b.value=c.currentLoggedInWallet.accounts.find(l=>l.publicKey===y.value.publicKey)||c.currentLoggedInWallet.others.find(l=>l.publicKey===y.value.publicKey),b.value&&(x.value=!!b.value.getDirectParentMultisig().length))},{deep:!0});const we=()=>{if(d.scopedMetadataKey)if(t.value=!1,m.value=d.scopedMetadataKey,d.scopedMetadataKey.length===16&&s.Convert.isHexString(d.scopedMetadataKey))I.value=2,T.value=d.scopedMetadataKey,h.scopedMetadataKey(s.UInt64.fromHex(T.value));else{I.value=1;let e=s.Convert.utf8ToHex(d.scopedMetadataKey);const l=e.length/2;e.length&&l<=8&&(e.length/2<8&&(e=e+"00".repeat(8-l)),T.value=e,h.scopedMetadataKey(s.UInt64.fromHex(T.value)))}},Te=()=>{h=f.buildTxn.assetMetadataBuilder(),r=f.buildTxn.aggregateBondedBuilder()},Ke=async()=>{if(w&&T.value){let e=new s.MetadataQueryParams;e.targetId=w,e.metadataType=s.MetadataType.MOSAIC,e.scopedMetadataKey=s.UInt64.fromHex(T.value);let l=await f.chainAPI.metadataAPI.searchMetadatas(e);l.metadataEntries.length&&(K.value=l.metadataEntries[0].value)}h.oldValue(K.value)},ke=()=>{h.value(H.value)},X=()=>{_=h.calculateDifferences().build()},z=()=>{_&&(R=r.innerTransactions([_.toAggregateV1(y.value)]).build())},G=()=>{R&&(F.value=R.maxFee.compact()/Math.pow(10,f.nativeToken.divisibility))},ne=async()=>{Te(),await _e(),we(),await Ke(),ke(),X(),z(),G(),xe()};if(f.isReady)ne();else{let e=S(f,l=>{l.isReady&&(ne(),e())})}const Ie=v(()=>f.nativeToken.label),{t:Ae}=je(),U=g(""),ie=g(""),de=c.currentLoggedInWallet?c.currentLoggedInWallet.name:"",J=v(()=>k.currentNetworkProfileConfig?L.convertToExact(k.currentNetworkProfileConfig.lockedFundsPerAggregate,f.nativeToken.divisibility):0),Ce=v(()=>k.currentNetworkProfileConfig?L.convertToCurrency(k.currentNetworkProfileConfig.lockedFundsPerAggregate,f.nativeToken.divisibility):0),Y=v(()=>k.currentNetworkProfile?L.convertToExact(Q.getLockFundFee(),f.nativeToken.divisibility):0),Pe="^[^ ]{8,}$",Se=g(!1),$=v(()=>I.value==1?s.Convert.utf8ToHex(m.value).length/2>8:m.value.length>16?!0:m.value.length%2===1),ce=v(()=>Fe.value<ee.value),Ve=v(()=>$.value==!0||m.value==""||H.value==""||!U.value.match(Pe)||ce.value==!0),W=v(()=>{if(!c.currentLoggedInWallet)return[];let e=c.currentLoggedInWallet.accounts.map(o=>({name:o.name,balance:o.balance,address:o.address,publicKey:o.publicKey,isMultisig:!!o.getDirectParentMultisig().length})),l=c.currentLoggedInWallet.others.filter(o=>o.type==="MULTISIG").map(o=>({name:o.name,balance:o.balance,address:o.address,publicKey:o.publicKey,isMultisig:!0}));return e.concat(l)}),F=g(0);S(I,e=>{ue(),e==2&&(s.Convert.isHexString(m.value)||(m.value=""))});const ue=async()=>{if($.value||m.value.length==0)return;let e="";if(I.value==1){let N=s.Convert.utf8ToHex(m.value);e=N+"00".repeat((16-N.length)/2)}else e="00".repeat((16-m.value.length)/2)+m.value;let l=new s.MetadataQueryParams;l.targetId=w,l.metadataType=s.MetadataType.MOSAIC,l.scopedMetadataKey=s.UInt64.fromHex(e);let o=await f.chainAPI.metadataAPI.searchMetadatas(l);o.metadataEntries.length?K.value=o.metadataEntries[0].value:K.value=""},He=()=>{if(!c.currentLoggedInWallet)return;if(!ae.verifyWalletPassword(c.currentLoggedInWallet.name,k.chainNetworkName,U.value)){ie.value=Ae("general.walletPasswordInvalid",{name:de});return}let e="";if(I.value==1){let C=s.Convert.utf8ToHex(m.value);e=C+"00".repeat((16-C.length)/2)}else e="00".repeat((16-m.value.length)/2)+m.value;let l=h.targetPublicKey(y.value).targetMosaicId(w).scopedMetadataKey(s.UInt64.fromHex(e)).value(H.value).oldValue(K.value).calculateDifferences().build(),o=x.value?r.innerTransactions([l.toAggregateV1(y.value)]).build():f.buildTxn.aggregateCompleteBuilder().innerTransactions([l.toAggregateV1(y.value)]).build(),N=x.value?c.currentLoggedInWallet.accounts.find(C=>C.publicKey==A.value):c.currentLoggedInWallet.accounts.find(C=>C.publicKey==y.value.publicKey),Ne=ae.createPassword(U.value),De=ae.decryptPrivateKey(Ne,N.encrypted,N.iv),me=s.Account.createFromPrivateKey(De,f.networkType,1),te=me.preV2Sign(o,k.currentNetworkProfile.generationHash);if(x.value){let C=Q.lockFundTx(te),Ee=me.preV2Sign(C,k.currentNetworkProfile.generationHash);Q.announceLF_AND_addAutoAnnounceABT(Ee,te)}else Q.announceTransaction(te);m.value="",K.value="",H.value="",U.value="",u.push({name:"ViewAccountPendingTransactions",params:{address:y.value.address.plain()}})},ee=v(()=>{let e=f.nativeToken.divisibility;return x.value?e==0?Math.trunc(J.value+Y.value+F.value):Math.round((J.value+Y.value+F.value)*Math.pow(10,e))/Math.pow(10,e):F.value}),B=v(()=>!c.currentLoggedInWallet||!y.value?[]:oe.getCosignerInWallet(y.value.publicKey).cosignerList.length?W.value?oe.getCosignerInWallet(y.value.publicKey).cosignerList.map(e=>{let l=W.value.find(o=>o.publicKey==e);return{name:l.name,publicKey:e,balance:l.balance}}):[]:[]),A=g("");B.value.length>0&&(A.value=B.value[0].publicKey),S(()=>B,e=>{e.value.length&&(A.value=B.value[0].publicKey)},{deep:!0});const Fe=v(()=>c.currentLoggedInWallet?x.value?A.value?P(A.value).balance:0:b.value?b.value.balance:0:0),Le=v(()=>F.value.toString()),Ue=v(()=>L.amountFormatterSimple(ee.value,0)),We=v(()=>{if(k.currentNetworkProfileConfig){let e=oe.getCosignerInWallet(W.value.find(o=>o.address==q.value)?W.value.find(o=>o.address==q.value).publicKey:""),l=[];return e.cosignerList.forEach(o=>{l.push({publicKey:o,name:P(o).name,balance:P(o).balance,address:P(o).address})}),e.cosignerList=l,e}else return{hasCosigner:!1,cosignerList:[]}}),Be=v(()=>{let e=P(A.value)?P(A.value).balance:0;return L.toCurrencyFormat(e,3)});return S(K,e=>{h.oldValue(e),X(),z(),G()}),S(H,e=>{h.value(e),X(),z(),G()}),S(m,e=>{e==""&&(K.value="")}),{findAcc:P,totalFee:ee,err:ie,walletPassword:U,showPasswdError:Se,accounts:W,updateMetadata:He,targetAccIsMultisig:x,lockFundCurrency:Ce,lockFund:J,aggregateFee:F,lockFundTxFee:Y,walletName:de,currentNativeTokenName:Ie,oldValue:K,newValue:H,cosigners:B,scopedMetadataKeyType:I,svgString:ye,accountName:be,disableAddBtn:Ve,showBalanceErr:ce,showScopedKeyErr:$,inputScopedMetadataKey:m,checkOldValue:ue,selectedCosigner:A,existingScopedMetadataKeys:re,showKeys:E,scopedMetadataKeySelectable:t,scopedMetadataKeyHex:T,transactionFee:Le,totalFeeFormatted:Ue,selectedAccAdd:q,accBalance:he,getMultiSigCosigner:We,checkCosignBalance:Be}}},at={class:"w-10/12 ml-auto mr-auto"},ot={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},lt={class:"xl:col-span-2 p-12"},rt=a("div",{class:"font-semibold mb-4"},"Update Asset Metadata",-1),st={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},nt={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},it={class:"inline-block text-xs"},dt={key:1,class:"error error_box mb-5"},ct={class:"flex items-center"},ut=["innerHTML"],mt={class:"ml-2"},pt={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},gt={class:"font-bold text-black text-sm"},vt={key:2,class:"text-left mt-2 mb-5 ml-4"},ft={key:0},yt={class:"text-tsm"},bt={key:0,class:"font-bold"},ht={key:1,class:"font-bold"},xt=["value"],_t={key:1,class:"error"},Mt={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},wt=a("img",{src:et},null,-1),Tt={class:"ml-1"},Kt=a("div",{class:"uppercase text-blue-primary font-semibold text-xxs"},"ASSET ID",-1),kt={class:"text-black text-sm font-bold"},It={key:3,class:"mt-2"},At=["onClick"],Ct={key:0,class:"text-xs py-2 bg-gray-100 pl-2 w-full"},Pt={key:1,class:"text-xs py-2 pl-2 w-full"},St={key:2,class:"ml-auto pr-2 text-xxs py-2 font-semibold uppercase text-blue-primary bg-gray-100"},Vt={key:3,class:"ml-auto mr-2 text-xxs py-2 font-semibold uppercase text-blue-primary"},Ht={key:4},Ft={class:"flex gap-3"},Lt={class:"flex gap-2"},Ut=a("label",{for:"regular"},"UTF-8",-1),Wt={class:"flex gap-2"},Bt=a("label",{for:"hexa"},"Hexadecimal",-1),Nt={key:5,class:"my-3"},Dt={class:"border border-blue-primary p-4 bg-blue-100 rounded mt-5"},Et={class:"flex flex-col gap-0.5"},Rt=a("div",{class:"uppercase text-xxs font-semibold text-blue-primary"},"Selected Scoped Metadata Key",-1),Ot={class:"flex"},Qt={class:"font-semibold"},jt={class:"ml-3 text-gray-400 font-semibold"},qt={class:"flex"},Zt={key:0,class:"font-semibold"},Xt={key:1,class:"ml-3 text-gray-400 font-semibold"},zt={class:"border border-blue-primary p-4 bg-blue-100 rounded mt-5"},Gt=a("div",{class:"uppercase text-xxs text-blue-primary font-semibold"},"CURRENT VALUE",-1),Jt={class:"font-semibold"},Yt={class:"bg-navy-primary py-6 px-12 xl:col-span-1"},$t={class:"text-xs text-white my-5"},ea=["disabled"],ta={class:"text-center"};function aa(d,u,E,t,I,y){const w=D("font-awesome-icon"),x=D("MetadataInput"),T=D("TransactionFeeDisplay"),m=D("PasswordInput"),b=D("router-link"),h=Je("debounce");return i(),n("div",null,[a("div",at,[a("div",ot,[a("div",lt,[rt,t.showBalanceErr?(i(),n("div",st,[a("div",nt,[V(w,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),a("div",it,p(d.$t("general.insufficientBalance")),1)])):M("v-if",!0),t.err!=""?(i(),n("div",dt,p(t.err),1)):M("v-if",!0),a("div",ct,[a("div",{innerHTML:t.svgString,class:"inline-block"},null,8,ut),a("div",mt,[a("div",pt,p(d.$t("asset.assetCreatedBy")),1),a("div",gt,p(t.accountName),1)])]),t.targetAccIsMultisig?(i(),n("div",vt,[t.cosigners.length>0?(i(),n("div",ft,[a("div",yt,[pe(p(d.$t("general.initiateBy"))+": ",1),t.cosigners.length==1?(i(),n("span",bt,p(t.cosigners[0].name),1)):(i(),n("span",ht,[j(a("select",{class:"","onUpdate:modelValue":u[0]||(u[0]=r=>t.selectedCosigner=r)},[(i(!0),n(ge,null,ve(t.cosigners,(r,_)=>(i(),n("option",{value:t.findAcc(r.publicKey).publicKey,key:_},p(r.name),9,xt))),128))],512),[[Ye,t.selectedCosigner]])]))])])):(i(),n("div",_t,p(d.$t("general.noCosigner")),1))])):M("v-if",!0),a("div",Mt,[wt,a("div",Tt,[Kt,a("div",kt,p(E.targetId),1)])]),t.existingScopedMetadataKeys.length&&t.scopedMetadataKeySelectable?(i(),n("div",It,[a("div",{onClick:u[1]||(u[1]=r=>t.showKeys=!t.showKeys),class:"text-blue-primary text-xs cursor-pointer mb-1.5"},"Select Existing Scoped Metadata Key"),(i(!0),n(ge,null,ve(t.existingScopedMetadataKeys,(r,_)=>(i(),n("div",{key:_},[t.showKeys?(i(),n("div",{key:0,class:"flex justify-center cursor-pointer",onClick:R=>(t.scopedMetadataKeyType=r.type,t.inputScopedMetadataKey=r.value,t.checkOldValue(),t.showKeys=!1)},[_%2==0?(i(),n("div",Ct,p(r.value),1)):M("v-if",!0),_%2==1?(i(),n("div",Pt,p(r.value),1)):M("v-if",!0),_%2==0?(i(),n("div",St,p(d.$t("general.select")),1)):M("v-if",!0),_%2==1?(i(),n("div",Vt,p(d.$t("general.select")),1)):M("v-if",!0)],8,At)):M("v-if",!0)]))),128))])):M("v-if",!0),t.scopedMetadataKeySelectable?(i(),n("div",Ht,[j(V(x,{hex:t.scopedMetadataKeyType==2,class:"mt-5",modelValue:t.inputScopedMetadataKey,"onUpdate:modelValue":u[2]||(u[2]=r=>t.inputScopedMetadataKey=r),placeholder:"Scoped Metadata Key",toolTip:`${t.scopedMetadataKeyType==1?"Accepts up to 8 bytes":"Accepts up to 16 hexadecimals"}`,showError:t.showScopedKeyErr,errorMessage:`${t.scopedMetadataKeyType==1?"Exceeded 8 bytes":t.inputScopedMetadataKey.length>16?"Exceeded 16 hexadecimals":"Input needs to be even number"}`},null,8,["hex","modelValue","toolTip","showError","errorMessage"]),[[h,t.checkOldValue,"1000"]]),a("div",Ft,[a("div",Lt,[j(a("input",{type:"radio",id:"regular",value:"1","onUpdate:modelValue":u[3]||(u[3]=r=>t.scopedMetadataKeyType=r)},null,512),[[fe,t.scopedMetadataKeyType]]),Ut]),a("div",Wt,[j(a("input",{type:"radio",id:"hexa",value:"2","onUpdate:modelValue":u[4]||(u[4]=r=>t.scopedMetadataKeyType=r)},null,512),[[fe,t.scopedMetadataKeyType]]),Bt])]),V(x,{class:"mt-2",modelValue:t.oldValue,"onUpdate:modelValue":u[5]||(u[5]=r=>t.oldValue=r),disabled:!0,placeholder:"Current Value"},null,8,["modelValue"])])):(i(),n("div",Nt,[a("div",Dt,[a("div",Et,[Rt,a("div",Ot,[a("div",Qt,p(E.scopedMetadataKey),1),a("div",jt,p(t.scopedMetadataKeyType==1?"UTF-8":"HEX"),1)]),a("div",qt,[t.scopedMetadataKeyType==1?(i(),n("div",Zt,p(t.scopedMetadataKeyHex),1)):M("v-if",!0),t.scopedMetadataKeyType==1?(i(),n("div",Xt,"HEX")):M("v-if",!0)])])]),a("div",zt,[Gt,a("div",Jt,p(t.oldValue),1)])])),V(x,{class:"mt-2",modelValue:t.newValue,"onUpdate:modelValue":u[6]||(u[6]=r=>t.newValue=r),placeholder:"New Value"},null,8,["modelValue"])]),a("div",Yt,[V(T,{"transaction-fee":t.transactionFee,"total-fee-formatted":t.totalFeeFormatted,"get-multi-sig-cosigner":t.getMultiSigCosigner,"check-cosign-balance":t.checkCosignBalance,"lock-fund-currency":String(t.lockFundCurrency),"lock-fund-tx-fee":String(t.lockFundTxFee),balance:t.accBalance,"selected-acc-add":t.selectedAccAdd},null,8,["transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),a("div",$t,p(d.$t("general.enterPasswordContinue")),1),V(m,{placeholder:d.$t("general.enterPassword"),errorMessage:d.$t("general.passwordRequired"),modelValue:t.walletPassword,"onUpdate:modelValue":u[7]||(u[7]=r=>t.walletPassword=r),icon:"lock",class:"mt-5 mb-3"},null,8,["placeholder","errorMessage","modelValue"]),a("button",{type:"submit",class:"w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",onClick:u[8]||(u[8]=r=>t.updateMetadata()),disabled:t.disableAddBtn}," Update Asset Metadata ",8,ea),a("div",ta,[V(b,{to:{name:"ViewServicesAssets"},class:"content-center text-xs text-white border-b-2 border-white"},{default:$e(()=>[pe(p(d.$t("general.cancel")),1)]),_:1})])])])])])}const sl=Oe(tt,[["render",aa],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/metadataTxn/views/ViewUpdateAssetMetadata.vue"]]);export{sl as default};