import{_ as ae,ac as be,R as fe,o as u,b as v,e as l,l as le,t as n,S as oe,f as D,A as se,q as Le,c as i,E as b,r as o,u as Ve,n as f,aW as Pe,aX as Me,W as te,w as g,H as h,P as Be,ak as X,at as q,a as H,U as Q,k as L,s as T,af as De,F as We,i as Ue,z as je}from"./index-f81de996.js";import{S as Ke}from"./SelectInputAccount-a08e2792.js";import{P as Re}from"./PasswordInput-0dd59ef4.js";import{S as Oe}from"./SupplyInputClean-c872f4a9.js";import{_ as he}from"./icon-info-8b4f1351.js";import{T as Xe}from"./TransactionFeeDisplay-b8f2fa3e.js";import{A as Y}from"./assetsUtils-164864f1.js";import{M as qe}from"./multisigUtils-558cd5cc.js";import"./jdenticon-module-7161194d.js";import"./proximax-logo-ecfc3767.js";import"./icon-new-page-link-270844f6.js";const He="/web-wallet-vuejs/assets/icon-done-a0410eac.svg",ze="/web-wallet-vuejs/assets/icon-undone-5c4de078.svg",Qe={directives:{tooltip:be},props:{title:String,disabled:Boolean,modelValue:Boolean,toolTip:String},emits:["update:modelValue"],name:"CheckInput",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},methods:{clickInputText:function(){!this.showError&&!this.disabled&&(this.borderColor="border-2 border-blue-primary")},getIcon(){return require(`@/${this.icon}`)},blurInputText:function(){this.disabled||(this.modelValue==""?(this.borderColor="border-2 border-red-primary",this.textErr=!0):(this.borderColor="border-2 border-gray-300",this.textErr=!1))},focusInputText:function(){this.borderColor="border-2 border-blue-primary",this.textErr=!1}},mounted(){this.emitter.on("CLEAR_TEXT",t=>{this.inputText=t,this.textErr=!1,this.borderColor="border border-gray-300"})}},Ye={class:"border border-gray-200 px-2 py-1 h-14 flex items-center justify-between rounded-md"},Ge={key:0,src:he,class:"inline-block ml-2 relative",style:{top:"-1px"}},Je={key:0,src:He,class:"inline-block"},Ze={key:1,src:ze,class:"inline-block"};function $e(t,s,c,e,C,A){const I=fe("tooltip");return u(),v("div",{class:le(`${c.disabled?"opacity-50":"cursor-pointer"}`)},[l("div",Ye,[l("div",null,[l("div",{class:le(["inline-block font-bold text-tsm",`${c.disabled?"text-gray-500":"text-black"}`])},n(c.title),3),c.toolTip?oe((u(),v("img",Ge,null,512)),[[I,{value:"<tiptext>"+c.toolTip+"</tiptext>",escape:!1},void 0,{bottom:!0}]]):D("v-if",!0)]),c.modelValue?(u(),v("img",Je)):(u(),v("img",Ze))])],2)}const et=ae(Qe,[["render",$e],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/components/CheckInput.vue"]]);const tt={directives:{tooltip:be},props:{placeholder:String,errorMessage:String,icon:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean,max:Number,toolTip:String},emits:["update:modelValue"],name:"NumberInputClean",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},methods:{clickInputText:function(){this.pswdErr||(this.borderColor="border-2 border-blue-primary")},validateKey:function(t){if(t.charCode<48||t.charCode>54)t.preventDefault();else return t.key},validate:function(t){this.$emit("update:modelValue",t.data)}},mounted(){this.emitter.on("CLEAR_TEXT",t=>{this.inputText=t,this.textErr=!1,this.borderColor="border border-gray-300"})}},lt={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},st={class:"uppercase text-gray-500 text-txs text-left mb-2"},at={key:0,src:he,class:"inline-block ml-1 relative cursor-pointer",style:{top:"-1px"}},ot=["disabled","value","max","placeholder"],rt={class:"h-3 mb-2"},nt={key:0,class:"error error-text text-left"};function it(t,s,c,e,C,A){const I=fe("tooltip");return u(),v("div",{class:le(c.disabled?"opacity-50":"")},[l("div",lt,[l("div",st,[se(n(c.placeholder)+" ",1),c.toolTip?oe((u(),v("img",at,null,512)),[[I,{value:"<tiptext>"+c.toolTip+"</tiptext>",escape:!0},void 0,{bottom:!0}]]):D("v-if",!0)]),l("input",{disabled:c.disabled,value:c.modelValue,onInput:s[0]||(s[0]=(...p)=>A.validate&&A.validate(...p)),onKeypress:s[1]||(s[1]=(...p)=>A.validateKey&&A.validateKey(...p)),type:"number",maxlength:"1",min:"0",max:c.max,placeholder:c.placeholder,class:"number_input",onClick:s[2]||(s[2]=p=>A.clickInputText()),onFocus:s[3]||(s[3]=p=>p.target.select())},null,40,ot)]),l("div",rt,[C.textErr||c.showError?(u(),v("div",nt,n(c.errorMessage),1)):D("v-if",!0)])],2)}const ct=ae(tt,[["render",it],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/NumberInputClean.vue"]]);const dt={name:"ViewServicesAssetsCreate",components:{CheckInput:et,PasswordInput:Re,SupplyInputClean:Oe,NumberInputClean:ct,SelectInputAccount:Ke,TransactionFeeDisplay:Xe},setup(){const t=Le(),s=i(()=>b.nativeToken.label),c=i(()=>b.nativeToken.divisibility),e=o(!1),C=o(""),{t:A}=Ve(),I=o(""),p=o(""),N=o("0"),G=o(!1),S=o(!1),E=o(!1),J=i(()=>B.value||M.value||_.value),Z=i(()=>_.value),r=o(!1),W=o(!1),re=o("month"),ne=o("1"),ie=o(!1),pe="^[^ ]{8,}$",ye=o(!1),$=o(!1),F=o(!1),y=o(""),V=o("0"),_=o(!1),_e=i(()=>b.nativeToken.label);i(()=>f.currentNetworkProfileConfig?Math.floor(Pe.configReturn(f.currentNetworkProfileConfig.maxNamespaceDuration,Me.DAY)):0);const U=o("");try{U.value=te.createPublicAccount(g.currentLoggedInWallet?g.currentLoggedInWallet.selectDefaultAccount().publicKey:"",b.networkType)}catch(a){console.log(a)}const ee=o(""),j=o(0);try{ee.value=h.amountFormatterSimple(Y.createAssetTransactionFee(U.value,V.value,E.value,S.value,N.value),b.nativeToken.divisibility),j.value=h.convertToExact(Y.createAssetTransactionFee(U.value,V.value,E.value,S.value,N.value),b.nativeToken.divisibility)}catch(a){console.log(a)}const R=i(()=>f.currentNetworkProfileConfig?h.convertToExact(f.currentNetworkProfileConfig.mosaicRentalFee,b.nativeToken.divisibility):0),we=i(()=>f.currentNetworkProfileConfig?h.convertToCurrency(f.currentNetworkProfileConfig.mosaicRentalFee,b.nativeToken.divisibility):0),ke=i(()=>f.currentNetworkProfileConfig?h.convertToExact(f.currentNetworkProfileConfig.lockedFundsPerAggregate,b.nativeToken.divisibility):0),Ce=i(()=>f.currentNetworkProfileConfig?h.convertToCurrency(f.currentNetworkProfileConfig.lockedFundsPerAggregate,b.nativeToken.divisibility):0),ce=i(()=>f.currentNetworkProfile?h.convertToExact(Be.getLockFundFee(),b.nativeToken.divisibility):0),K=i(()=>ke.value+ce.value),xe=i(()=>!(C.value.match(pe)&&N.value!=""&&V.value>0&&!e.value&&!ie.value&&!B.value&&!M.value)),w=g.currentLoggedInWallet?g.currentLoggedInWallet.selectDefaultAccount():null,de=o(w?w.name:""),x=o(w?w.address:""),ue=o(h.toCurrencyFormat(w?w.balance:0,b.nativeToken.divisibility)),P=o(w?w.balance:0),z=o(X(w?w.address:"")),O=i(()=>g.currentLoggedInWallet?g.currentLoggedInWallet.others?g.currentLoggedInWallet.accounts.concat(g.currentLoggedInWallet.others):g.currentLoggedInWallet.accounts:[]),k=i(()=>{if(f.currentNetworkProfileConfig){let a=qe.getCosignerInWallet(O.value.find(d=>d.address==x.value)?O.value.find(d=>d.address==x.value).publicKey:""),m=[];return a.cosignerList.forEach(d=>{m.push({publicKey:d,name:q(d).name,balance:q(d).balance,address:q(d).address})}),a.cosignerList=m,a}else return{hasCosigner:!1,cosignerList:[]}}),M=i(()=>k.value.cosignerList.length==0&&X(x.value)),B=i(()=>X(x.value)?M.value?P.value<R.value+j.value:P.value<R.value+j.value+K.value:P.value<R.value+j.value);P.value<R.value+ee.value?(M.value,r.value=!0,W.value=!0,$.value=!0):(r.value=!1,W.value=!1,$.value=!1);const Te=i(()=>O.value.length>1),Ae=a=>{let m=g.currentLoggedInWallet.accounts.find(d=>d.address==a);m||(m=g.currentLoggedInWallet.others.find(d=>d.address==a)),de.value=m.name,x.value=a,ue.value=h.toCurrencyFormat(m.balance,b.nativeToken.divisibility),P.value=m.balance,p.value=m.name,U.value=te.createPublicAccount(m.publicKey,b.networkType)},ve=()=>{C.value="",N.value="0",V.value="0",ne.value="1",re.value="month",W.value="",S.value=!1,E.value=!1},ge=i(()=>X(x.value)?parseFloat(K.value)+j.value:R.value+j.value),Ie=i(()=>h.amountFormatterSimple(ge.value,0));H(ge,a=>{P.value<a&&!M.value?B.value=!0:B.value=!1}),H(M,a=>{a?B.value=!0:B.value=!1});const Ne=a=>{e.value=a},Se=()=>{if(!te.verifyWalletPassword(g.currentLoggedInWallet.name,f.chainNetworkName,C.value)){I.value=A("general.walletPasswordInvalid",{name:g.currentLoggedInWallet.name});return}me.value?Y.createAssetMultiSig(me.value,C.value,U.value,V.value,E.value,S.value,N.value):Y.createAsset(x.value,C.value,U.value,V.value,E.value,S.value,N.value),ve(),t.push({name:"ViewAccountPendingTransactions",params:{address:x.value}})},me=i(()=>k.value.cosignerList.length>0?k.value.cosignerList.length>1?y.value:q(k.value.cosignerList[0].publicKey).address:"");y.value=k.value.cosignerList.length>0?k.value.cosignerList[0].address:"",H(k,a=>{a.cosignerList.length>0&&(y.value=a.cosignerList.length>0?k.value.cosignerList[0].address:"")});const Fe=i(()=>{let a=Q(y.value)?Q(y.value).balance:0;return h.toCurrencyFormat(a)});if(z.value){let a=k.value.cosignerList;a.length>0?(y.value=g.currentLoggedInWallet.accounts.find(m=>m.publicKey==a[0].publicKey).address,Q(y.value).balance<K.value?(_.value=!0,F.value=!0):(_.value=!1,F.value=!1)):_.value=!0}return H(x,(a,m)=>{if(z.value=X(a),z.value){let d=k.value.cosignerList;d.length>0?(y.value=g.currentLoggedInWallet.accounts.find(Ee=>Ee.publicKey==d[0].publicKey).address,Q(y.value).balance<K.value?(_.value=!0,F.value=!0):(_.value=!1,F.value=!1)):(_.value=!0,F.value=!0)}else _.value=!1,F.value=!1}),H(y,(a,m)=>{a!=m&&(O.value.find(d=>d.address==a).balance<K.value?(F.value=!0,_.value=!0):(F.value=!1,_.value=!1))}),{findAcc:q,accounts:O,moreThanOneAccount:Te,currentSelectedName:p,selectedAccName:de,selectedAccAdd:x,isTransferable:S,isMutable:E,balance:ue,balanceNumber:P,showNoBalance:B,showSupplyErr:e,showDivisibilityErr:G,err:I,walletPassword:C,disableCreate:xe,clearInput:ve,showPasswdError:ye,changeSelection:Ae,supply:V,divisibility:N,transactionFee:ee,disabledPassword:J,disabledClear:r,createAsset:Se,disabledDuration:W,durationOption:re,duration:ne,showDurationErr:ie,durationCheckDisabled:$,isMultiSigBool:z,rentalFeeCurrency:we,lockFundCurrency:Ce,currencyName:_e,lockFundTxFee:ce,lockFundTotalFee:K,totalFeeFormatted:Ie,getMultiSigCosigner:k,cosignerBalanceInsufficient:F,cosignerAddress:y,isNotCosigner:M,currentNativeTokenName:s,currentNativeTokenDivisibility:c,walletState:g,networkState:f,Helper:h,updateSupplyErr:Ne,defaultAcc:w,checkCosignBalance:Fe,disabledInput:Z}}},ut={class:"w-10/12 ml-auto mr-auto"},vt={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},gt={class:"xl:col-span-2 p-12"},mt={class:"font-semibold mb-4"},bt={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},ft={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},ht={class:"inline-block text-xs"},pt={key:1,class:"rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center"},yt={class:"rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"},_t={class:"inline-block text-xs"},wt={key:2,class:"error error_box"},kt={class:"mt-4"},Ct={key:0},xt={class:"text-tsm text-left mt-3"},Tt={key:0,class:"font-bold"},At={key:1,class:"font-bold"},It=["value"],Nt={key:2,class:"error"},St={class:"lg:grid lg:grid-cols-2 mt-5"},Ft={class:"lg:mr-2"},Et={class:"lg:ml-2"},Lt={class:"lg:grid lg:grid-cols-2"},Vt={class:"mb-5 lg:mb-0 lg:mr-2"},Pt={class:"mb-5 lg:mb-0 lg:ml-2"},Mt={class:"bg-navy-primary py-6 px-6 xl:col-span-1"},Bt={class:"text-xs text-white my-5"},Dt=["disabled"],Wt={class:"text-center"},Ut={class:"sm:grid sm:grid-cols-2 mt-10 lg:mt-16"},jt={class:"mb-8"},Kt={href:"https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/",target:"_new",class:"sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start"},Rt={class:"text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2"},Ot={class:"mb-8"},Xt={href:"https://t.me/proximaxhelpdesk",target:"_new",class:"sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex"},qt={class:"text-gray-400 text-tsm my-3"};function Ht(t,s,c,e,C,A){const I=L("font-awesome-icon"),p=L("SelectInputAccount"),N=L("SupplyInputClean"),G=L("NumberInputClean"),S=L("CheckInput"),E=L("TransactionFeeDisplay"),J=L("PasswordInput"),Z=L("router-link");return u(),v("div",null,[l("div",ut,[l("div",vt,[l("div",gt,[l("div",mt,n(t.$t("asset.createAssets")),1),e.showNoBalance?(u(),v("div",bt,[l("div",ft,[T(I,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),l("div",ht,n(t.$t("general.insufficientBalance")),1)])):e.isNotCosigner?(u(),v("div",pt,[l("div",yt,[T(I,{icon:"exclamation",class:"text-yellow-500 h-3 w-3 absolute",style:{top:"5px",left:"7px"}})]),l("div",_t,n(t.$t("general.noCosigner")),1)])):D("v-if",!0),e.err!=""?(u(),v("div",wt,n(e.err),1)):D("v-if",!0),l("div",kt,[T(p,{onSelectAccount:e.changeSelection,modelValue:e.selectedAccAdd,"onUpdate:modelValue":s[0]||(s[0]=r=>e.selectedAccAdd=r),selectDefault:e.defaultAcc?e.defaultAcc.address:""},null,8,["onSelectAccount","modelValue","selectDefault"]),e.getMultiSigCosigner.cosignerList.length>0?(u(),v("div",Ct,[l("div",xt,[se(n(t.$t("general.initiateBy"))+": ",1),e.getMultiSigCosigner.cosignerList.length==1?(u(),v("span",Tt,n(e.getMultiSigCosigner.cosignerList[0].name)+" ("+n(t.$t("general.balance"))+": "+n(e.Helper.amountFormatterSimple(e.getMultiSigCosigner.cosignerList[0].balance,0))+" "+n(e.currentNativeTokenName)+")",1)):(u(),v("span",At,[oe(l("select",{"onUpdate:modelValue":s[1]||(s[1]=r=>e.cosignerAddress=r)},[(u(!0),v(We,null,Ue(e.getMultiSigCosigner.cosignerList,(r,W)=>(u(),v("option",{value:r.address,key:W},n(r.name)+" ("+n(t.$t("general.balance"))+": "+n(r.balance)+" "+n(e.currentNativeTokenName)+")",9,It))),128))],512),[[De,e.cosignerAddress]])])),e.cosignerBalanceInsufficient?(u(),v("div",Nt,"- "+n(t.$t("general.insufficientBalance")),1)):D("v-if",!0)])])):D("v-if",!0),l("div",St,[l("div",Ft,[T(N,{disabled:e.showNoBalance||e.isNotCosigner||e.disabledInput,modelValue:e.supply,"onUpdate:modelValue":s[2]||(s[2]=r=>e.supply=r),balance:Number.MAX_VALUE,placeholder:t.$t("general.supply"),type:"text",onShowError:e.updateSupplyErr,decimal:Number(e.divisibility),toolTip:t.$t("asset.supplyMsg1")+" <br><br>"+t.$t("asset.supplyMsg2")+"<br>"+t.$t("asset.supplyMsg3")},null,8,["disabled","modelValue","balance","placeholder","onShowError","decimal","toolTip"])]),l("div",Et,[T(G,{disabled:e.showNoBalance||e.isNotCosigner||e.disabledInput,modelValue:e.divisibility,"onUpdate:modelValue":s[3]||(s[3]=r=>e.divisibility=r),max:6,placeholder:t.$t("general.divisibility"),showError:e.showDivisibilityErr,toolTip:t.$t("asset.divisibilityMsg1")+" <br><br>"+t.$t("asset.divisibilityMsg2")+"<br>"+t.$t("asset.divisibilityMsg3")},null,8,["disabled","modelValue","placeholder","showError","toolTip"])])]),l("div",Lt,[l("div",Vt,[T(S,{disabled:e.showNoBalance||e.isNotCosigner||e.disabledInput,modelValue:e.isTransferable,"onUpdate:modelValue":s[4]||(s[4]=r=>e.isTransferable=r),title:t.$t("general.transferable"),toolTip:t.$t("asset.transferableMsg"),onClick:s[5]||(s[5]=r=>e.showNoBalance?"":e.isTransferable=!e.isTransferable)},null,8,["disabled","modelValue","title","toolTip"])]),l("div",Pt,[T(S,{disabled:e.showNoBalance||e.isNotCosigner||e.disabledInput,modelValue:e.isMutable,"onUpdate:modelValue":s[6]||(s[6]=r=>e.isMutable=r),title:t.$t("general.supplyMutable"),toolTip:t.$t("asset.supplyMutableMsg"),onClick:s[7]||(s[7]=r=>e.showNoBalance?"":e.isMutable=!e.isMutable)},null,8,["disabled","modelValue","title","toolTip"])])])])]),l("div",Mt,[T(E,{"asset-rental-fee-currency":e.rentalFeeCurrency,"transaction-fee":String(e.transactionFee),"total-fee-formatted":e.totalFeeFormatted,"get-multi-sig-cosigner":e.getMultiSigCosigner,"check-cosign-balance":e.checkCosignBalance,"lock-fund-currency":e.lockFundCurrency,"lock-fund-tx-fee":String(e.lockFundTxFee),balance:e.balance,"selected-acc-add":e.selectedAccAdd},null,8,["asset-rental-fee-currency","transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),l("div",Bt,n(t.$t("general.enterPasswordContinue")),1),T(J,{placeholder:t.$t("general.password"),errorMessage:t.$t("general.passwordRequired"),showError:e.showPasswdError,modelValue:e.walletPassword,"onUpdate:modelValue":s[8]||(s[8]=r=>e.walletPassword=r),disabled:e.disabledPassword},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),l("button",{type:"submit",class:"mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white",disabled:e.disableCreate,onClick:s[9]||(s[9]=(...r)=>e.createAsset&&e.createAsset(...r))},n(t.$t("asset.createAssets")),9,Dt),l("div",Wt,[T(Z,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:je(()=>[se(n(t.$t("general.cancel")),1)]),_:1})])])]),l("div",Ut,[l("div",jt,[l("a",Kt,n(t.$t("general.assetQues")),1),l("div",Rt,n(t.$t("asset.assetAns")),1)]),l("div",Ot,[l("a",Xt,n(t.$t("general.feedback")),1),l("div",qt,n(t.$t("general.feedbackDescription")),1)])])])])}const al=ae(dt,[["render",Ht],["__scopeId","data-v-713c5e30"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/views/ViewServicesAssetsCreate.vue"]]);export{al as default};