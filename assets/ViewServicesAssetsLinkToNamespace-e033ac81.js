import{_ as te,o,b as n,e as t,t as l,f as y,d as ke,r,g as _e,c as d,B as xe,h as we,F as ve,i as me,l as de,ac as Te,u as Ce,q as Se,D as Ne,E as p,n as A,H as v,P as Fe,ak as ee,w as M,I as Le,at as q,a as B,U as ue,k as W,R as Ae,s as $,A as I,S as U,af as Me,z as $e,W as Ie}from"./index-f81de996.js";import{P as Pe}from"./PasswordInput-0dd59ef4.js";import{A as w}from"./assetsUtils-164864f1.js";import{T as Ve}from"./TransactionFeeDisplay-b8f2fa3e.js";import{t as Ee}from"./jdenticon-module-7161194d.js";import{M as Be}from"./multisigUtils-558cd5cc.js";import{_ as We}from"./icon-asset-2a9ae6ea.js";import{_ as G}from"./icon-info-8b4f1351.js";import"./proximax-logo-ecfc3767.js";import"./icon-new-page-link-270844f6.js";const je={props:{placeholder:String,errorMessage:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean},emits:["update:modelValue"],name:"SelectLinkType",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},watch:{showError:function(e){e?(this.borderColor="border-2 border-red-primary",this.textErr=!0):(this.borderColor="border-2 border-gray-300",this.textErr=!1)}}},De={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},Ue={class:"uppercase text-gray-500 text-txs text-left mb-2"},He={class:"flex items-center"},Re=["value","disabled","checked"],ze={for:"link",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},qe=["value","disabled","checked"],Ge={for:"unlink",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},Je={class:"h-3 mb-2"},Oe={key:0,class:"error error-text text-left"};function Qe(e,i,m,s,b,F){return o(),n("div",null,[t("div",De,[t("div",Ue,l(m.title),1),t("div",He,[t("input",{id:"link",type:"radio",name:"linkType",value:m.modelValue,disabled:m.disabled,class:"h-5 w-5",onChange:i[0]||(i[0]=c=>e.$emit("update:modelValue","link")),checked:m.modelValue=="link"},null,40,Re),t("label",ze,l(e.$t("general.link")),1),t("input",{id:"unlink",type:"radio",name:"linkType",value:m.modelValue,disabled:m.disabled,class:"h-5 w-5",onChange:i[1]||(i[1]=c=>e.$emit("update:modelValue","unlink")),checked:m.modelValue=="unlink"},null,40,qe),t("label",Ge,l(e.$t("general.unlink")),1)])]),t("div",Je,[b.textErr||m.showError?(o(),n("div",Oe,l(m.errorMessage),1)):y("v-if",!0)])])}const Xe=te(je,[["render",Qe],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/SelectLinkType.vue"]]),Ye=ke({emits:["select-account","update:modelValue"],name:"SelectInputNamespace",props:["modelValue","action","address","assetId"],setup(e){const i=r(!1);_e().appContext.config.globalProperties.emitter;const s=r(""),b=c=>{s.value=c.value,i.value=!i.value},F=d(()=>w.listActiveNamespacesToLink(e.assetId,xe.Address.createFromRawAddress(e.address).plain(),e.action));return{selectNamespace:b,namespaces:F,toggleSelection:i,selectedNamespace:s}}}),Ze={class:"relative"},Ke={class:"flex"},et={class:"flex flex-col ml-2 text-left"},tt={class:"text-blue-primary font-semibold text-xxs mb-1 uppercase",style:{"line-height":"9px"}},st={key:0,class:"mt-1 text-tsm font-bold"},lt={key:1,class:"text-tsm font-bold"},at={key:0,class:"text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"},ot={key:1,class:"text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"},nt={class:"relative"},it={key:0,class:"absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl"},rt={key:0,class:"pl-2 pt-4 text-xxs text-gray-400 uppercase"},ct={key:1,class:"text-xxs pt-2 pl-2 pb-2"},dt=["onClick"],ut={key:0,class:"cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold uppercase"},vt={key:1,class:"text-gray-300 text-xxs mt-0.5 ml-auto uppercase"},mt={key:2,class:"text-gray-500 text-xxs mt-0.5 ml-auto uppercase"};function gt(e,i,m,s,b,F){return o(),n("div",Ze,[t("div",{onClick:i[1]||(i[1]=c=>e.toggleSelection=!e.toggleSelection),class:"border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md w-full h-14"},[t("div",Ke,[t("div",et,[t("div",tt,l(e.$t("general.namespace")),1),e.selectedNamespace!=""?(o(),n("div",st,l(e.selectedNamespace),1)):(o(),n("div",lt,l(e.$t("namespace.selectNamespace")),1))]),!e.toggleSelection&&e.selectedNamespace==""?(o(),n("div",at,l(e.$t("general.select")),1)):y("v-if",!0),!e.toggleSelection&&e.selectedNamespace!=""?(o(),n("div",ot,l(e.$t("general.change")),1)):y("v-if",!0),e.toggleSelection?(o(),n("img",{key:2,onClick:i[0]||(i[0]=c=>e.selectedNamespace=""),src:we,class:"h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"})):y("v-if",!0)])]),t("div",nt,[e.toggleSelection?(o(),n("div",it,[e.namespaces.length>0?(o(),n("div",rt,l(e.$t("namespace.selectNamespace")),1)):(o(),n("div",ct,l(e.$t("general.listEmpty")),1)),(o(!0),n(ve,null,me(e.namespaces,(c,L)=>(o(),n("div",{key:L,class:de(["px-2 py-3 flex items-center",[L!=e.namespaces.length-1?"border-b border-gray-200":"",c.disabled?"":"cursor-pointer"]]),onClick:H=>{e.selectNamespace(c),e.$emit("update:modelValue",e.selectedNamespace)}},[t("div",{class:de(["text-xs truncate",c.disabled?"text-gray-300":"text-black font-semibold"])},l(c.label),3),c.label!=e.selectedNamespace&&!c.disabled?(o(),n("div",ut,l(e.$t("general.select")),1)):c.disabled?(o(),n("div",vt,l(e.$t("general.disabled")),1)):(o(),n("div",mt,l(e.$t("general.current")),1))],10,dt))),128))])):y("v-if",!0)])])}const pt=te(Ye,[["render",gt],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/SelectInputNamespace.vue"]]),bt={name:"ViewServicesAssetsLinkToNamespace",directives:{tooltip:Te},components:{PasswordInput:Pe,SelectLinkType:Xe,SelectInputNamespace:pt,TransactionFeeDisplay:Ve},props:{assetId:String,address:String},setup(e){const{t:i}=Ce(),m=Se();Ne();const s=d(()=>p.nativeToken.label),b=r(""),F=r(""),c=r(!1),L=r(!1),H="^[^ ]{8,}$",J=r(!1),O=r(!1),T=r(""),P=d(()=>p.nativeToken.label),u=d(()=>A.currentNetworkProfileConfig?v.convertToExact(A.currentNetworkProfileConfig.lockedFundsPerAggregate,p.nativeToken.divisibility):0),Q=d(()=>A.currentNetworkProfileConfig?v.convertToCurrency(A.currentNetworkProfileConfig.lockedFundsPerAggregate,p.nativeToken.divisibility):0),se=d(()=>A.currentNetworkProfile?v.convertToExact(Fe.getLockFundFee(),p.nativeToken.divisibility):0),X=d(()=>u.value+se.value),ge=d(()=>!(b.value.match(H)&&j.value!="")),le=r(""),g=r(v.createAddress(e.address).plain()),Y=r(""),R=r(0),pe=r(ee(g.value)),ae=d(()=>Z.value?R.value<S.value:R.value<S.value+X.value),Z=d(()=>_.value.cosignerList.length==0&&ee(g.value)),V=r("0");let f=d(()=>M.currentLoggedInWallet?M.currentLoggedInWallet.accounts.find(a=>a.address==g.value)||M.currentLoggedInWallet.others.find(a=>a.address==g.value):null);f.value&&(le.value=f.value.name,g.value=f.value.address,Y.value=v.toCurrencyFormat(f.value.balance,p.nativeToken.divisibility),R.value=f.value.balance);let oe=new Le("ThemeStyleConfig");oe.init();const be=r(Ee(e.address,40,oe.jdenticonConfig)),h=r(""),C=r(0),ne=r(0),ie=r(!1),re=r(!1),k=r("link"),j=r("");if(f.value){let a=f.value.assets.find(x=>x.idHex===e.assetId);a!=null&&(h.value=a.idHex,ie.value=a.transferable,re.value=a.supplyMutable,C.value=a.divisibility,ne.value=v.convertToCurrency(a.supply,a.divisibility))}const z=r("0.000000"),S=r(0),_=d(()=>{if(!f.value)return{hasCosigner:!1,cosignerList:[]};if(A.currentNetworkProfileConfig){let a=Be.getCosignerInWallet(f.value?f.value.publicKey:""),x=[];return a.cosignerList.forEach(N=>{x.push({publicKey:N,name:q(N).name,balance:q(N).balance,address:q(N).address})}),a.cosignerList=x,{hasCosigner:a.hasCosigner,cosignerList:a.cosignerList}}else return{hasCosigner:!1,cosignerList:[]}}),K=d(()=>_.value.cosignerList.length>0?_.value.cosignerList.length>1?T.value:q(_.value.cosignerList[0].publicKey).address:"");T.value=_.value.cosignerList.length>0?_.value.cosignerList[0].address:"",B(_,a=>{a.cosignerList.length>0&&(T.value=a.cosignerList.length>0?_.value.cosignerList[0].address:"")});try{z.value=v.convertToCurrency(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,V.value,C.value),p.nativeToken.divisibility),S.value=v.convertToExact(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,V.value,C.value),p.nativeToken.divisibility)}catch(a){console.log(a)}const fe=()=>{if(!Ie.verifyWalletPassword(M.currentLoggedInWallet.name,A.chainNetworkName,b.value)){F.value=i("general.walletPasswordInvalid",{name:M.currentLoggedInWallet.name});return}let x;if(k.value=="link")x=h.value;else{let N=M.currentLoggedInWallet.accounts.find(D=>D.address==g.value);N||(N=M.currentLoggedInWallet.others.find(D=>D.address==g.value)),x=N.namespaces.find(D=>D.name===j.value).linkedId}K.value?w.linkedNamespaceToAssetMultiSig(K.value,b.value,x,j.value,k.value,g.value):w.linkedNamespaceToAsset(g.value,b.value,x,j.value,k.value),m.push({name:"ViewAccountPendingTransactions",params:{address:g.value}})};B(k,a=>{z.value=v.convertToCurrency(w.getMosaicSupplyChangeTransactionFee(h.value,a,V.value,C.value),p.nativeToken.divisibility),S.value=v.convertToExact(w.getMosaicSupplyChangeTransactionFee(h.value,a,V.value,C.value),p.nativeToken.divisibility)}),B(V,a=>{h.value&&(z.value=v.convertToCurrency(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,a,C.value),p.nativeToken.divisibility),S.value=v.convertToExact(w.getMosaicSupplyChangeTransactionFee(h.value,k.value,a,C.value),p.nativeToken.divisibility))});const ce=d(()=>ee(g.value)?parseFloat(X.value)+S.value:S.value),he=d(()=>v.amountFormatterSimple(ce.value,0)),E=a=>{c.value=a,disabledSupply.value=a,L.value=a};B(ce,a=>{Y.value<a?E(!0):E(!1)}),B(ae,a=>{E(!!a)}),B(Z,a=>{E(!!a)});const ye=d(()=>{let a=ue(T.value)?ue(T.value).balance:0;return v.toCurrencyFormat(a)});return{currentNativeTokenName:s,selectedAccName:le,selectedAccAdd:g,balance:Y,balanceNumber:R,showNoBalance:ae,lockFundTxFee:se,lockFundCurrency:Q,lockFundTotalFee:X,totalFeeFormatted:he,err:F,walletPassword:b,disableCreate:ge,showPasswdError:J,supply:V,disabledPassword:c,currencyName:P,isMultiSigBool:pe,selectAsset:h,selectAction:k,linkNamespace:fe,transactionFee:z,transactionFeeExact:S,assetSupply:ne,assetDivisibility:C,assetTransferable:ie,assetMutable:re,selectNamespace:j,getMultiSigCosigner:_,cosignerBalanceInsufficient:O,cosignerAddress:T,cosigner:K,isNotCosigner:Z,disabledSelectAction:L,Helper:v,svgString:be,checkCosignBalance:ye}}},ft={class:"w-10/12 ml-auto mr-auto"},ht={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},yt={class:"xl:col-span-2 p-6 lg:p-12"},kt={class:"lg:flex lg:justify-between lg:items-center"},_t={class:"font-semibold mb-4 inline-block mt-1"},xt={class:"flex items-center"},wt=["innerHTML"],Tt={class:"ml-2"},Ct={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},St={class:"font-bold text-black text-sm"},Nt={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},Ft={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},Lt={class:"inline-block text-xs"},At={key:1,class:"rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center"},Mt={class:"rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"},$t={class:"inline-block text-xs"},It={key:2,class:"error error_box"},Pt={class:"text-right w-full"},Vt={key:0,class:"inline-block"},Et={class:"text-tsm text-left mt-3"},Bt={key:0,class:"font-bold"},Wt={key:0,class:"error"},jt={key:1,class:"font-bold"},Dt=["value"],Ut={key:2,class:"error"},Ht={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},Rt=t("img",{src:We},null,-1),zt={class:"ml-1"},qt={class:"uppercase text-blue-primary font-semibold text-xxs"},Gt={class:"text-black text-sm font-bold"},Jt={class:"border border-gray-200 p-4 rounded mt-5"},Ot={class:"lg:grid lg:grid-cols-2"},Qt={class:"my-3"},Xt={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},Yt={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},Zt={class:"text-black font-bold text-sm"},Kt={class:"my-3"},es={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},ts={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},ss={class:"text-black font-bold text-sm"},ls={class:"my-3"},as={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},os={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},ns={class:"uppercase text-black font-bold text-sm"},is={class:"my-3"},rs={class:"text-xxs text-blue-primary uppercase mb-1 font-bold"},cs={src:G,class:"inline-block ml-2 relative",style:{top:"-1px"}},ds={class:"uppercase text-black font-bold text-sm"},us={class:"lg:grid lg:grid-cols-2 mt-5"},vs={class:"bg-navy-primary py-6 px-12 xl:col-span-1"},ms={class:"text-xs text-white mt-5 mb-1.5"},gs=["disabled"],ps={class:"text-center"};function bs(e,i,m,s,b,F){const c=W("font-awesome-icon"),L=W("SelectLinkType"),H=W("SelectInputNamespace"),J=W("TransactionFeeDisplay"),O=W("PasswordInput"),T=W("router-link"),P=Ae("tooltip");return o(),n("div",null,[t("div",ft,[t("div",ht,[t("div",yt,[t("div",kt,[t("div",_t,l(e.$t("general.linkToNamespace")),1),t("div",xt,[t("div",{innerHTML:s.svgString,class:"inline-block"},null,8,wt),t("div",Tt,[t("div",Ct,l(e.$t("asset.assetCreatedBy")),1),t("div",St,l(s.selectedAccName),1)])])]),s.showNoBalance?(o(),n("div",Nt,[t("div",Ft,[$(c,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),t("div",Lt,l(e.$t("general.insufficientBalance")),1)])):s.isNotCosigner?(o(),n("div",At,[t("div",Mt,[$(c,{icon:"exclamation",class:"text-yellow-500 h-3 w-3 absolute",style:{top:"5px",left:"7px"}})]),t("div",$t,l(e.$t("general.noCosigner")),1)])):y("v-if",!0),s.err!=""?(o(),n("div",It,l(s.err),1)):y("v-if",!0),t("div",Pt,[s.getMultiSigCosigner.cosignerList.length>0?(o(),n("div",Vt,[t("div",Et,[I(l(e.$t("general.initiateBy"))+": ",1),s.getMultiSigCosigner.cosignerList.length==1?(o(),n("span",Bt,[I(l(s.getMultiSigCosigner.cosignerList[0].name)+" ("+l(e.$t("general.balance"))+": "+l(s.Helper.amountFormatterSimple(s.getMultiSigCosigner.cosignerList[0].balance,0))+" "+l(s.currentNativeTokenName)+") ",1),s.getMultiSigCosigner.cosignerList[0].balance<s.lockFundTotalFee?(o(),n("span",Wt,"- "+l(e.$t("general.insufficientBalance")),1)):y("v-if",!0)])):(o(),n("span",jt,[U(t("select",{"onUpdate:modelValue":i[0]||(i[0]=u=>s.cosignerAddress=u)},[(o(!0),n(ve,null,me(s.getMultiSigCosigner.cosignerList,(u,Q)=>(o(),n("option",{value:u.address,key:Q},l(u.name)+" ("+l(e.$t("general.balance"))+": "+l(u.balance)+" "+l(s.currentNativeTokenName)+")",9,Dt))),128))],512),[[Me,s.cosignerAddress]])])),s.cosignerBalanceInsufficient?(o(),n("div",Ut,"- "+l(e.$t("general.insufficientBalance")),1)):y("v-if",!0)])])):y("v-if",!0)]),t("div",Ht,[Rt,t("div",zt,[t("div",qt,l(e.$t("general.assetId")),1),t("div",Gt,l(s.selectAsset),1)])]),t("div",Jt,[t("div",Ot,[t("div",Qt,[t("div",Xt,[I(l(e.$t("asset.currentSupply")),1),U(t("img",Yt,null,512),[[P,{value:"<tiptext>"+e.$t("asset.supplyMsg2")+"<br>"+e.$t("asset.supplyMsg3")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",Zt,l(s.assetSupply),1)]),t("div",Kt,[t("div",es,[I(l(e.$t("general.divisibility")),1),U(t("img",ts,null,512),[[P,{value:"<tiptext>"+e.$t("asset.divisibilityMsg4")+"<br><br>"+e.$t("asset.divisibilityMsg2")+"<br>"+e.$t("asset.divisibilityMsg3")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",ss,l(s.assetDivisibility),1)]),t("div",ls,[t("div",as,[I(l(e.$t("general.transferable")),1),U(t("img",os,null,512),[[P,{value:"<tiptext>"+e.$t("asset.transferableMsg")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",ns,l(s.assetTransferable?e.$t("general.yes"):e.$t("general.no")),1)]),t("div",is,[t("div",rs,[I(l(e.$t("general.supplyMutable")),1),U(t("img",cs,null,512),[[P,{value:"<tiptext>"+e.$t("asset.supplyMutableMsg")+"</tiptext>",escape:!0},void 0,{bottom:!0}]])]),t("div",ds,l(s.assetMutable?e.$t("general.yes"):e.$t("general.no")),1)])])]),t("div",us,[$(L,{title:e.$t("asset.modificationType"),class:"lg:mr-4",modelValue:s.selectAction,"onUpdate:modelValue":i[1]||(i[1]=u=>s.selectAction=u),disabled:s.disabledSelectAction},null,8,["title","modelValue","disabled"]),$(H,{action:s.selectAction,modelValue:s.selectNamespace,"onUpdate:modelValue":i[2]||(i[2]=u=>s.selectNamespace=u),address:s.selectedAccAdd,assetId:s.selectAsset},null,8,["action","modelValue","address","assetId"])])]),t("div",vs,[$(J,{"transaction-fee":s.transactionFee,"total-fee-formatted":s.totalFeeFormatted,"get-multi-sig-cosigner":s.getMultiSigCosigner,"check-cosign-balance":s.checkCosignBalance,"lock-fund-currency":s.lockFundCurrency,"lock-fund-tx-fee":String(s.lockFundTxFee),balance:s.balance,"selected-acc-add":s.selectedAccAdd},null,8,["transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),t("div",ms,l(e.$t("general.enterPasswordContinue")),1),$(O,{placeholder:e.$t("general.password"),errorMessage:e.$t("general.passwordRequired"),showError:s.showPasswdError,modelValue:s.walletPassword,"onUpdate:modelValue":i[3]||(i[3]=u=>s.walletPassword=u),disabled:s.disabledPassword},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),t("button",{type:"submit",class:"mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white",disabled:s.disableCreate,onClick:i[4]||(i[4]=(...u)=>s.linkNamespace&&s.linkNamespace(...u))},l(s.selectAction=="link"?e.$t("general.linkToNamespace"):e.$t("namespace.unlinkNamespace")),9,gs),t("div",ps,[$(T,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:$e(()=>[I(l(e.$t("general.cancel")),1)]),_:1})])])])])])}const Ns=te(bt,[["render",bs],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/views/ViewServicesAssetsLinkToNamespace.vue"]]);export{Ns as default};