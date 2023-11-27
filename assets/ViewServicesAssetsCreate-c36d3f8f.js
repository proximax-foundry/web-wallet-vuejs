import{_ as G,ad as ne,P as ie,o as p,b as f,e as t,l as Z,t as d,Q as ue,f as S,B as de,d as Ce,q as Ie,r as a,u as Ae,c as m,W as R,w as K,E as o,H as P,n as C,V as O,a as se,k as oe,s as b,z as Ee,i as $e,A as U}from"./index-d7b5897b.js";import{_ as Pe,a as Ve,b as Ne,c as Se}from"./TxnSummary.vue_vue_type_script_setup_true_lang-d250c58d.js";import{_ as Me}from"./PasswordInput.vue_vue_type_script_setup_true_lang-b4f305c2.js";import{S as Fe}from"./SupplyInputClean-8189f004.js";import{_ as ce}from"./icon-info-8b4f1351.js";import{A as j}from"./assetsUtils-59a1040d.js";import{T as Q}from"./transactionState-85bdb7df.js";import"./jdenticon-module-3cec977b.js";import"./proximax-logo-ecfc3767.js";const De="/web-wallet-vuejs/assets/icon-done-a0410eac.svg",Ue="/web-wallet-vuejs/assets/icon-undone-5c4de078.svg",Be={directives:{tooltip:ne},props:{title:String,disabled:Boolean,modelValue:Boolean,toolTip:String},emits:["update:modelValue"],name:"CheckInput",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},methods:{clickInputText:function(){!this.showError&&!this.disabled&&(this.borderColor="border-2 border-blue-primary")},getIcon(){return require(`@/${this.icon}`)},blurInputText:function(){this.disabled||(this.modelValue==""?(this.borderColor="border-2 border-red-primary",this.textErr=!0):(this.borderColor="border-2 border-gray-300",this.textErr=!1))},focusInputText:function(){this.borderColor="border-2 border-blue-primary",this.textErr=!1}},mounted(){this.emitter.on("CLEAR_TEXT",u=>{this.inputText=u,this.textErr=!1,this.borderColor="border border-gray-300"})}},Le={class:"border border-gray-200 px-2 py-1 h-14 flex items-center justify-between rounded-md"},We={key:0,src:ce,class:"inline-block ml-2 relative",style:{top:"-1px"}},Re={key:0,src:De,class:"inline-block"},Ke={key:1,src:Ue,class:"inline-block"};function je(u,c,s,V,M,i){const F=ie("tooltip");return p(),f("div",{class:Z(`${s.disabled?"opacity-50":"cursor-pointer"}`)},[t("div",Le,[t("div",null,[t("div",{class:Z(["inline-block font-bold text-tsm",`${s.disabled?"text-gray-500":"text-black"}`])},d(s.title),3),s.toolTip?ue((p(),f("img",We,null,512)),[[F,{value:"<tiptext>"+s.toolTip+"</tiptext>",escape:!1},void 0,{bottom:!0}]]):S("",!0)]),s.modelValue?(p(),f("img",Re)):(p(),f("img",Ke))])],2)}const re=G(Be,[["render",je]]);const He={directives:{tooltip:ne},props:{placeholder:String,errorMessage:String,icon:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean,max:Number,toolTip:String},emits:["update:modelValue"],name:"NumberInputClean",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},methods:{clickInputText:function(){this.pswdErr||(this.borderColor="border-2 border-blue-primary")},validateKey:function(u){if(u.charCode<48||u.charCode>54)u.preventDefault();else return u.key},validate:function(u){this.$emit("update:modelValue",u.data)}},mounted(){this.emitter.on("CLEAR_TEXT",u=>{this.inputText=u,this.textErr=!1,this.borderColor="border border-gray-300"})}},qe={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},Xe={class:"uppercase text-gray-500 text-txs text-left mb-2"},ze={key:0,src:ce,class:"inline-block ml-1 relative cursor-pointer",style:{top:"-1px"}},Oe=["disabled","value","max","placeholder"],Qe={class:"h-3 mb-2"},Ze={key:0,class:"error error-text text-left"};function Ge(u,c,s,V,M,i){const F=ie("tooltip");return p(),f("div",{class:Z(s.disabled?"opacity-50":"")},[t("div",qe,[t("div",Xe,[de(d(s.placeholder)+" ",1),s.toolTip?ue((p(),f("img",ze,null,512)),[[F,{value:"<tiptext>"+s.toolTip+"</tiptext>",escape:!0},void 0,{bottom:!0}]]):S("",!0)]),t("input",{disabled:s.disabled,value:s.modelValue,onInput:c[0]||(c[0]=(...g)=>i.validate&&i.validate(...g)),onKeypress:c[1]||(c[1]=(...g)=>i.validateKey&&i.validateKey(...g)),type:"number",maxlength:"1",min:"0",max:s.max,placeholder:s.placeholder,class:"number_input",onClick:c[2]||(c[2]=g=>i.clickInputText()),onFocus:c[3]||(c[3]=g=>g.target.select())},null,40,Oe)]),t("div",Qe,[M.textErr||s.showError?(p(),f("div",Ze,d(s.errorMessage),1)):S("",!0)])],2)}const Je=G(He,[["render",Ge]]),Ye={class:"w-10/12 ml-auto mr-auto"},et={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},tt={class:"xl:col-span-2 p-12"},lt={class:"font-semibold mb-4"},at={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},st={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},ot={class:"inline-block text-xs"},rt={key:1,class:"error error_box"},nt={class:"mt-4"},it={class:"flex gap-1 mt-3"},ut={key:0,class:"mt-3"},dt={class:"lg:grid lg:grid-cols-2 mt-5"},ct={class:"lg:mr-2"},vt={class:"lg:ml-2"},mt={class:"lg:grid lg:grid-cols-2"},bt={class:"mb-5 lg:mb-0 lg:mr-2"},pt={class:"mb-5 lg:mb-0 lg:ml-2"},ft={class:"bg-navy-primary py-6 px-6 xl:col-span-1"},gt={class:"text-xs text-white my-5"},ht=["disabled"],yt={class:"text-center"},_t={class:"sm:grid sm:grid-cols-2 mt-10 lg:mt-16"},xt={class:"mb-8"},wt={href:"https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/",target:"_new",class:"sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start"},Tt={class:"text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2"},kt={class:"mb-8"},Ct={href:"https://t.me/proximaxhelpdesk",target:"_new",class:"sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex"},It={class:"text-gray-400 text-tsm my-3"},At="^[^ ]{8,}$",Et=Ce({__name:"ViewServicesAssetsCreate",setup(u){const c=Ie(),V=$e().appContext.config.globalProperties.emitter,M=a(!1),i=a(""),{t:F}=Ae(),g=a(""),v=a("0"),ve=a(!1),y=a(!1),_=a(!1),me=m(()=>x.value||ee.value),B=m(()=>ee.value),J=a(!1),H=a(!1),be=a("month"),pe=a("1"),fe=a(!1),ge=a(!1),Y=a(!1),w=a("0"),ee=a(!1),I=a(),A=a();try{I.value=R.createPublicAccount(K.currentLoggedInWallet?K.currentLoggedInWallet.selectDefaultAccount().publicKey:"",o.networkType)}catch(e){console.log(e)}const he=a("0"),E=a(0);try{he.value=P.amountFormatterSimple(j.createAssetTransactionFee(I.value,Number(w.value),_.value,y.value,Number(v.value)),o.nativeToken.divisibility),E.value=P.convertToExact(j.createAssetTransactionFee(I.value,Number(w.value),_.value,y.value,Number(v.value)),o.nativeToken.divisibility)}catch(e){console.log(e)}const L=m(()=>C.currentNetworkProfileConfig?P.convertToExact(C.currentNetworkProfileConfig.mosaicRentalFee,o.nativeToken.divisibility):0),ye=m(()=>C.currentNetworkProfileConfig?P.convertToCurrency(C.currentNetworkProfileConfig.mosaicRentalFee,o.nativeToken.divisibility):"0"),te=m(()=>C.currentNetworkProfileConfig?P.convertToExact(C.currentNetworkProfileConfig.lockedFundsPerAggregate,o.nativeToken.divisibility):0),le=m(()=>C.currentNetworkProfile?P.convertToExact(O.getLockFundFee(),o.nativeToken.divisibility):0),ae=m(()=>te.value+le.value),_e=m(()=>!(i.value.match(At)&&v.value!=null&&Number(w.value)>0&&!M.value&&!fe.value&&!x.value)),r=a(null),N=a(null),T=a(null),k=a(0),W=a(0),q=async e=>{if(o.chainAPI&&e)try{const l=await o.chainAPI.accountAPI.getAccountInfo(U.Address.createFromRawAddress(e)),h=l.mosaics.findIndex($=>$.id.toHex()==o.nativeToken.assetId);return h!=-1?l.mosaics[h].amount.compact()/Math.pow(10,o.nativeToken.divisibility):0}catch{return 0}},x=m(()=>{if(T.value)return r.value?W.value<L.value?!0:k.value<E.value+ae.value:k.value<L.value+E.value});k.value<L.value+E.value?(J.value=!0,H.value=!0,Y.value=!0):(J.value=!1,H.value=!1,Y.value=!1);const D=()=>{i.value="",v.value="0",w.value="0",pe.value="1",be.value="month",H.value=!1,y.value=!1,_.value=!1};se(T,async(e,l)=>{e==null?(k.value=0,D(),N.value=null,r.value=null,A.value=null):e!=l&&(D(),N.value=null,r.value=null,A.value=null,k.value=await q(e))}),se(r,async(e,l)=>{e==null?(W.value=0,D(),N.value=null,r.value=null,A.value=null,k.value=await q(T.value)):e!=l&&(D(),W.value=await q(e))});const xe=m(()=>r?ae.value+E.value:L.value+E.value),we=m(()=>P.amountFormatterSimple(xe.value,0)),Te=e=>{M.value=e},ke=()=>{if(!R.verifyWalletPassword(K.currentLoggedInWallet.name,C.chainNetworkName,i.value)){g.value=F("general.walletPasswordInvalid",{name:K.currentLoggedInWallet.name});return}let l;if(r.value){const h=o.buildTxn.mosaicDefinition(A.value,_.value,y.value,Number(v.value)),$=h.toAggregateV1(A.value);let n=U.MosaicSupplyType.Increase;const X=o.buildTxn.buildMosaicSupplyChange(h.mosaicId,n,U.UInt64.fromUint(j.addZeros(Number(v.value),Number(w.value)))).toAggregateV1(A.value),z=[$,X];l=O.signTxnWithPassword(T.value,r.value,i.value,null,z)}else{const h=o.buildTxn.mosaicDefinition(I.value,_.value,y.value,Number(v.value)),$=h.toAggregateV1(I.value);let n=U.MosaicSupplyType.Increase;const X=o.buildTxn.buildMosaicSupplyChange(h.mosaicId,n,U.UInt64.fromUint(j.addZeros(Number(v.value),Number(w.value)))).toAggregateV1(I.value);let z=o.buildTxn.aggregateComplete([$,X]);l=O.signTxnWithPassword(T.value,r.value,i.value,z)}D(),Q.lockHashPayload=l.hashLockTxnPayload,Q.transactionPayload=l.txnPayload,Q.selectedAddress=T.value,c.push({name:"ViewConfirmTransaction"})};return V.on("select-account",e=>{T.value=e}),V.on("select-account-public-key",e=>{I.value=R.createPublicAccount(e,o.networkType)}),V.on("select-multisig-account",e=>{N.value=e.label,r.value=e.value,A.value=R.createPublicAccount(e.publicKey,o.networkType)}),V.on("CLOSE_MULTISIG",()=>{N.value=null,r.value=null}),(e,l)=>{const h=oe("font-awesome-icon"),$=oe("router-link");return p(),f("div",null,[t("div",Ye,[t("div",et,[t("div",tt,[t("div",lt,d(e.$t("asset.createAssets")),1),x.value?(p(),f("div",at,[t("div",st,[b(h,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),t("div",ot,d(e.$t("general.insufficientBalance")),1)])):S("",!0),g.value!=""?(p(),f("div",rt,d(g.value),1)):S("",!0),t("div",nt,[t("div",it,[b(Pe,{type:"asset"}),b(Ve,{"selected-address":T.value},null,8,["selected-address"])]),r.value?(p(),f("div",ut,[b(Ne,{"select-default-address":r.value,"select-default-name":N.value,type:"asset"},null,8,["select-default-address","select-default-name"])])):S("",!0),t("div",dt,[t("div",ct,[b(Fe,{disabled:x.value||B.value,modelValue:w.value,"onUpdate:modelValue":l[0]||(l[0]=n=>w.value=n),balance:Number.MAX_VALUE,placeholder:e.$t("general.supply"),type:"text",onShowError:Te,decimal:Number(v.value),toolTip:e.$t("asset.supplyMsg1")+" <br><br>"+e.$t("asset.supplyMsg2")+"<br>"+e.$t("asset.supplyMsg3")},null,8,["disabled","modelValue","balance","placeholder","decimal","toolTip"])]),t("div",vt,[b(Je,{disabled:x.value||B.value,modelValue:v.value,"onUpdate:modelValue":l[1]||(l[1]=n=>v.value=n),max:6,placeholder:e.$t("general.divisibility"),showError:ve.value,toolTip:e.$t("asset.divisibilityMsg1")+" <br><br>"+e.$t("asset.divisibilityMsg2")+"<br>"+e.$t("asset.divisibilityMsg3")},null,8,["disabled","modelValue","placeholder","showError","toolTip"])])]),t("div",mt,[t("div",bt,[b(re,{disabled:x.value||B.value,modelValue:y.value,"onUpdate:modelValue":l[2]||(l[2]=n=>y.value=n),title:e.$t("general.transferable"),toolTip:e.$t("asset.transferableMsg"),onClick:l[3]||(l[3]=n=>x.value?"":y.value=!y.value)},null,8,["disabled","modelValue","title","toolTip"])]),t("div",pt,[b(re,{disabled:x.value||B.value,modelValue:_.value,"onUpdate:modelValue":l[4]||(l[4]=n=>_.value=n),title:e.$t("general.supplyMutable"),toolTip:e.$t("asset.supplyMutableMsg"),onClick:l[5]||(l[5]=n=>x.value?"":_.value=!_.value)},null,8,["disabled","modelValue","title","toolTip"])])])])]),t("div",ft,[b(Se,{"signer-native-token-balance":k.value,"asset-rental-fee-currency":ye.value,"native-token-balance":r.value?W.value:k.value,"lock-fund":te.value,"lock-fund-tx-fee":le.value,"selected-multisig-address":r.value,"txn-fee":E.value,"total-fee":Number(we.value)},null,8,["signer-native-token-balance","asset-rental-fee-currency","native-token-balance","lock-fund","lock-fund-tx-fee","selected-multisig-address","txn-fee","total-fee"]),t("div",gt,d(e.$t("general.enterPasswordContinue")),1),b(Me,{placeholder:e.$t("general.password"),errorMessage:e.$t("general.passwordRequired"),showError:ge.value,modelValue:i.value,"onUpdate:modelValue":l[6]||(l[6]=n=>i.value=n),disabled:me.value},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),t("button",{type:"submit",class:"mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white",disabled:_e.value,onClick:ke},d(e.$t("asset.createAssets")),9,ht),t("div",yt,[b($,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:Ee(()=>[de(d(e.$t("general.cancel")),1)]),_:1})])])]),t("div",_t,[t("div",xt,[t("a",wt,d(e.$t("general.assetQues")),1),t("div",Tt,d(e.$t("asset.assetAns")),1)]),t("div",kt,[t("a",Ct,d(e.$t("general.feedback")),1),t("div",It,d(e.$t("general.feedbackDescription")),1)])])])])}}});const Bt=G(Et,[["__scopeId","data-v-b7b62ea4"]]);export{Bt as default};