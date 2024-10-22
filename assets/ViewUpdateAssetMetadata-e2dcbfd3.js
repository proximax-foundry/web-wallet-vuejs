import{g as f,I as Ue,c as v,w as c,H as L,A as m,D as A,j as Be,n as F,B as We,x as r,au as C,k as De,_ as Ee,a as Ne,b as ee,r as D,Q as Re,o as i,e as s,f as d,l as H,t as y,i as M,s as de,O,ak as Oe,F as ce,K as ue,av as ge}from"./index-d2e8ccc1.js";import{T as Qe}from"./TransactionLayout-28e8b83b.js";import{M as te}from"./multisigUtils-915e0086.js";import{M as je}from"./MetadataInput-0a8b5efb.js";import{_ as Ze}from"./TransactionFeeDisplay.vue_vue_type_script_setup_true_lang-dcb72102.js";import{t as ze}from"./jdenticon-module-59aa2fb9.js";import{U as Xe}from"./UTF8-35cb612a.js";import{T as Q}from"./transactionState-4479ac99.js";import{_ as Ge}from"./icon-asset-2a9ae6ea.js";import"./icon-info-8b4f1351.js";import"./TransactionFeeLayout.vue_vue_type_script_setup_true_lang-8a5d8a3f.js";import"./proximax-logo-ecfc3767.js";const qe={name:"ViewUpdateAssetMetadata",props:{targetId:String,scopedMetadataKey:String,address:String},components:{MetadataInput:je,TransactionFeeDisplay:Ze,TransactionLayout:Qe},setup(g){const n=De();let U=f(!1),t=f(!0),I=f(1),p=f(null),_=null,T=f(!1),K=f(""),u=f(""),b=f(null),x,o,h,E;const k=f(""),S=f(""),ae=new Ue("ThemeStyleConfig");ae.init();const ve=v(()=>ze(b.value?b.value.address:"",40,ae.jdenticonConfig)),ye=v(()=>b.value?c.currentLoggedInWallet.convertAddressToName(b.value.address,!0):""),le=f([]),N=c.currentLoggedInWallet?c.currentLoggedInWallet.selectDefaultAccount():null,j=f(N?N.address:""),fe=f(L.toCurrencyFormat(N?N.balance:0,m.nativeToken.divisibility)),se=e=>(e.endsWith("00")&&(e=e.substring(0,e.length-2),e=se(e)),e),Z=e=>{e=se(e);let l=r.Convert.hexToUint8(e);return Xe.isNotUTF8(l)||(e=r.Convert.decodeHexToUtf8(e)),e},me=()=>{let e=new r.MetadataQueryParams;e.metadataType=r.MetadataType.MOSAIC,e.targetId=_,m.chainAPI.metadataAPI.searchMetadatas(e).then(l=>{l.metadataEntries.forEach(a=>{le.value.push({value:a.scopedMetadataKey.toHex()==Z(a.scopedMetadataKey.toHex())?a.scopedMetadataKey.toHex():Z(a.scopedMetadataKey.toHex()),type:a.scopedMetadataKey.toHex()==Z(a.scopedMetadataKey.toHex())?2:1})})})},pe=async()=>{if(g.targetId&&g.targetId.length===16&&r.Convert.isHexString(g.targetId)){let e=new r.MosaicId(g.targetId);_=e,x.targetMosaicId(_);let l=await m.chainAPI.assetAPI.getMosaic(e);if(p.value=l.owner,x.targetPublicKey(p.value),!c.currentLoggedInWallet)return;b.value=c.currentLoggedInWallet.accounts.find(a=>a.publicKey===l.owner.publicKey)||c.currentLoggedInWallet.others.find(a=>a.publicKey===l.owner.publicKey),b.value&&(T.value=!!b.value.getDirectParentMultisig().length)}},be=v(()=>c.currentLoggedInWallet&&p.value?c.currentLoggedInWallet.others.find(e=>e.publicKey===p.value.publicKey):null);A(be,async e=>{e&&(b.value=c.currentLoggedInWallet.accounts.find(l=>l.publicKey===p.value.publicKey)||c.currentLoggedInWallet.others.find(l=>l.publicKey===p.value.publicKey),b.value&&(T.value=!!b.value.getDirectParentMultisig().length))},{deep:!0});const xe=()=>{if(g.scopedMetadataKey)if(t.value=!1,u.value=g.scopedMetadataKey,g.scopedMetadataKey.length===16&&r.Convert.isHexString(g.scopedMetadataKey))I.value=2,K.value=g.scopedMetadataKey,x.scopedMetadataKey(r.UInt64.fromHex(K.value));else{I.value=1;let e=r.Convert.utf8ToHex(g.scopedMetadataKey);const l=e.length/2;e.length&&l<=8&&(e.length/2<8&&(e=e+"00".repeat(8-l)),K.value=e,x.scopedMetadataKey(r.UInt64.fromHex(K.value)))}},he=async()=>{x=m.buildTxn.assetMetadataBuilder();const e=await m.chainAPI.nodeAPI.getNodeTime();o=m.buildTxn.aggregateBondedBuilder(new r.UInt64(e.sendTimeStamp))},Me=async()=>{if(_&&K.value){let e=new r.MetadataQueryParams;e.targetId=_,e.metadataType=r.MetadataType.MOSAIC,e.scopedMetadataKey=r.UInt64.fromHex(K.value);let l=await m.chainAPI.metadataAPI.searchMetadatas(e);l.metadataEntries.length&&(k.value=l.metadataEntries[0].value)}x.oldValue(k.value)},Te=()=>{x.value(S.value)},z=()=>{h=x.calculateDifferences().build()},X=()=>{h&&(E=o.innerTransactions([h.toAggregateV1(p.value)]).build())},G=()=>{E&&(V.value=E.maxFee.compact()/Math.pow(10,m.nativeToken.divisibility))},ne=async()=>{await he(),await pe(),xe(),await Me(),Te(),z(),X(),G(),me()};if(m.isReady)ne();else{let e=A(m,l=>{l.isReady&&(ne(),e())})}const _e=v(()=>m.nativeToken.label);Be();const Ke=f(""),ke=c.currentLoggedInWallet?c.currentLoggedInWallet.name:"",q=v(()=>F.currentNetworkProfileConfig?L.convertToExact(F.currentNetworkProfileConfig.lockedFundsPerAggregate,m.nativeToken.divisibility):0),Ie=v(()=>F.currentNetworkProfileConfig?L.convertToCurrency(F.currentNetworkProfileConfig.lockedFundsPerAggregate,m.nativeToken.divisibility):0),J=v(()=>F.currentNetworkProfile?L.convertToExact(We.getLockFundFee(),m.nativeToken.divisibility):0),we=f(!1),Y=v(()=>I.value==1?r.Convert.utf8ToHex(u.value).length/2>8:u.value.length>16?!0:u.value.length%2===1),oe=v(()=>Se.value<$.value),Ae=v(()=>Y.value==!0||u.value==""||S.value==""||oe.value==!0),B=v(()=>{if(!c.currentLoggedInWallet)return[];let e=c.currentLoggedInWallet.accounts.map(a=>({name:a.name,balance:a.balance,address:a.address,publicKey:a.publicKey,isMultisig:!!a.getDirectParentMultisig().length})),l=c.currentLoggedInWallet.others.filter(a=>a.type==="MULTISIG").map(a=>({name:a.name,balance:a.balance,address:a.address,publicKey:a.publicKey,isMultisig:!0}));return e.concat(l)}),V=f(0);A(I,e=>{re(),e==2&&(r.Convert.isHexString(u.value)||(u.value=""))});const re=async()=>{if(Y.value||u.value.length==0)return;let e="";if(I.value==1){let R=r.Convert.utf8ToHex(u.value);e=R+"00".repeat((16-R.length)/2)}else e="00".repeat((16-u.value.length)/2)+u.value;let l=new r.MetadataQueryParams;l.targetId=_,l.metadataType=r.MetadataType.MOSAIC,l.scopedMetadataKey=r.UInt64.fromHex(e);let a=await m.chainAPI.metadataAPI.searchMetadatas(l);a.metadataEntries.length?k.value=a.metadataEntries[0].value:k.value=""},Ce=async()=>{if(!c.currentLoggedInWallet)return;let e="",l;if(I.value==1){let P=r.Convert.utf8ToHex(u.value);e=P+"00".repeat((16-P.length)/2)}else e="00".repeat((16-u.value.length)/2)+u.value;let a=x.targetPublicKey(p.value).targetMosaicId(_).scopedMetadataKey(r.UInt64.fromHex(e)).value(S.value).oldValue(k.value).calculateDifferences().build(),R=m.buildTxn.aggregateCompleteBuilder().innerTransactions([a.toAggregateV1(p.value)]).build().serialize(),ie=c.currentLoggedInWallet.accounts.find(P=>P.publicKey==p.value.publicKey).address;if(T.value){let P=c.currentLoggedInWallet.accounts.find(He=>He.publicKey==w.value).address;l=a.toAggregateV1(p.value).serialize(),Q.selectedAddress=P,Q.selectedMultisigAddress=ie}else l=R,Q.selectedAddress=ie;u.value="",k.value="",S.value="",Q.unsignedTransactionPayload=l,n.push({name:"ViewConfirmTransaction"})},$=v(()=>{let e=m.nativeToken.divisibility;return T.value?e==0?Math.trunc(q.value+J.value+V.value):Math.round((q.value+J.value+V.value)*Math.pow(10,e))/Math.pow(10,e):V.value}),W=v(()=>!c.currentLoggedInWallet||!p.value?[]:te.getCosignerInWallet(p.value.publicKey).cosignerList.length?B.value?te.getCosignerInWallet(p.value.publicKey).cosignerList.map(e=>{let l=B.value.find(a=>a.publicKey==e);return{name:l.name,publicKey:e,balance:l.balance}}):[]:[]),w=f("");W.value.length>0&&(w.value=W.value[0].publicKey),A(()=>W,e=>{e.value.length&&(w.value=W.value[0].publicKey)},{deep:!0});const Se=v(()=>c.currentLoggedInWallet?T.value?w.value?C(w.value).balance:0:b.value?b.value.balance:0:0),Ve=v(()=>V.value.toString()),Pe=v(()=>L.amountFormatterSimple($.value,0)),Le=v(()=>{if(F.currentNetworkProfileConfig){let e=te.getCosignerInWallet(B.value.find(a=>a.address==j.value)?B.value.find(a=>a.address==j.value).publicKey:""),l=[];return e.cosignerList.forEach(a=>{l.push({publicKey:a,name:C(a).name,balance:C(a).balance,address:C(a).address})}),e.cosignerList=l,e}else return{hasCosigner:!1,cosignerList:[]}}),Fe=v(()=>{let e=C(w.value)?C(w.value).balance:0;return L.toCurrencyFormat(e,3)});return A(k,e=>{x.oldValue(e),z(),X(),G()}),A(S,e=>{x.value(e),z(),X(),G()}),A(u,e=>{e==""&&(k.value="")}),{findAcc:C,totalFee:$,err:Ke,showPasswdError:we,accounts:B,updateMetadata:Ce,targetAccIsMultisig:T,lockFundCurrency:Ie,lockFund:q,aggregateFee:V,lockFundTxFee:J,walletName:ke,currentNativeTokenName:_e,oldValue:k,newValue:S,cosigners:W,scopedMetadataKeyType:I,svgString:ve,accountName:ye,disableAddBtn:Ae,showBalanceErr:oe,showScopedKeyErr:Y,inputScopedMetadataKey:u,checkOldValue:re,selectedCosigner:w,existingScopedMetadataKeys:le,showKeys:U,scopedMetadataKeySelectable:t,scopedMetadataKeyHex:K,transactionFee:Ve,totalFeeFormatted:Pe,selectedAccAdd:j,accBalance:fe,getMultiSigCosigner:Le,checkCosignBalance:Fe}}},Je={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},Ye={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},$e={class:"inline-block text-xs"},et={key:1,class:"error error_box mb-5"},tt={class:"flex items-center"},at=["innerHTML"],lt={class:"ml-2"},st={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},nt={class:"font-bold text-black text-sm"},ot={key:2,class:"text-left mt-2 mb-5 ml-4"},rt={key:0},it={class:"text-tsm"},dt={key:0,class:"font-bold"},ct={key:1,class:"font-bold"},ut=["value"],gt={key:1,class:"error"},vt={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},yt={class:"ml-1"},ft={class:"text-black text-sm font-bold"},mt={key:3,class:"mt-2"},pt=["onClick"],bt={key:0,class:"text-xs py-2 bg-gray-100 pl-2 w-full"},xt={key:1,class:"text-xs py-2 pl-2 w-full"},ht={key:2,class:"ml-auto pr-2 text-xxs py-2 font-semibold uppercase text-blue-primary bg-gray-100"},Mt={key:3,class:"ml-auto mr-2 text-xxs py-2 font-semibold uppercase text-blue-primary"},Tt={key:4},_t={class:"flex gap-3"},Kt={class:"flex gap-2"},kt={class:"flex gap-2"},It={key:5,class:"my-3"},wt={class:"border border-blue-primary p-4 bg-blue-100 rounded mt-5"},At={class:"flex flex-col gap-0.5"},Ct={class:"flex"},St={class:"font-semibold"},Vt={class:"ml-3 text-gray-400 font-semibold"},Pt={class:"flex"},Lt={key:0,class:"font-semibold"},Ft={key:1,class:"ml-3 text-gray-400 font-semibold"},Ht={class:"border border-blue-primary p-4 bg-blue-100 rounded mt-5"},Ut={class:"font-semibold"},Bt=["disabled"],Wt={class:"text-center"};function Dt(g,n,U,t,I,p){const _=D("font-awesome-icon"),T=D("MetadataInput"),K=D("TransactionFeeDisplay"),u=D("router-link"),b=D("TransactionLayout"),x=Re("debounce");return i(),Ne(b,{class:"mt-8"},{white:ee(()=>[n[14]||(n[14]=s("div",{class:"font-semibold mb-4"},"Update Asset Metadata",-1)),t.showBalanceErr?(i(),d("div",Je,[s("div",Ye,[H(_,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),s("div",$e,y(g.$t("general.insufficientBalance")),1)])):M("",!0),t.err!=""?(i(),d("div",et,y(t.err),1)):M("",!0),s("div",tt,[s("div",{innerHTML:t.svgString,class:"inline-block"},null,8,at),s("div",lt,[s("div",st,y(g.$t("asset.assetCreatedBy")),1),s("div",nt,y(t.accountName),1)])]),t.targetAccIsMultisig?(i(),d("div",ot,[t.cosigners.length>0?(i(),d("div",rt,[s("div",it,[de(y(g.$t("general.initiateBy"))+": ",1),t.cosigners.length==1?(i(),d("span",dt,y(t.cosigners[0].name),1)):(i(),d("span",ct,[O(s("select",{class:"","onUpdate:modelValue":n[0]||(n[0]=o=>t.selectedCosigner=o)},[(i(!0),d(ce,null,ue(t.cosigners,(o,h)=>(i(),d("option",{value:t.findAcc(o.publicKey).publicKey,key:h},y(o.name),9,ut))),128))],512),[[Oe,t.selectedCosigner]])]))])])):(i(),d("div",gt,y(g.$t("general.noCosigner")),1))])):M("",!0),s("div",vt,[n[9]||(n[9]=s("img",{src:Ge},null,-1)),s("div",yt,[n[8]||(n[8]=s("div",{class:"uppercase text-blue-primary font-semibold text-xxs"}," ASSET ID ",-1)),s("div",ft,y(U.targetId),1)])]),t.existingScopedMetadataKeys.length&&t.scopedMetadataKeySelectable?(i(),d("div",mt,[s("div",{onClick:n[1]||(n[1]=o=>t.showKeys=!t.showKeys),class:"text-blue-primary text-xs cursor-pointer mb-1.5"}," Select Existing Scoped Metadata Key "),(i(!0),d(ce,null,ue(t.existingScopedMetadataKeys,(o,h)=>(i(),d("div",{key:h},[t.showKeys?(i(),d("div",{key:0,class:"flex justify-center cursor-pointer",onClick:E=>(t.scopedMetadataKeyType=o.type,t.inputScopedMetadataKey=o.value,t.checkOldValue(),t.showKeys=!1)},[h%2==0?(i(),d("div",bt,y(o.value),1)):M("",!0),h%2==1?(i(),d("div",xt,y(o.value),1)):M("",!0),h%2==0?(i(),d("div",ht,y(g.$t("general.select")),1)):M("",!0),h%2==1?(i(),d("div",Mt,y(g.$t("general.select")),1)):M("",!0)],8,pt)):M("",!0)]))),128))])):M("",!0),t.scopedMetadataKeySelectable?(i(),d("div",Tt,[O(H(T,{hex:t.scopedMetadataKeyType==2,class:"mt-5",modelValue:t.inputScopedMetadataKey,"onUpdate:modelValue":n[2]||(n[2]=o=>t.inputScopedMetadataKey=o),placeholder:"Scoped Metadata Key",toolTip:`${t.scopedMetadataKeyType==1?"Accepts up to 8 bytes":"Accepts up to 16 hexadecimals"}`,showError:t.showScopedKeyErr,errorMessage:`${t.scopedMetadataKeyType==1?"Exceeded 8 bytes":t.inputScopedMetadataKey.length>16?"Exceeded 16 hexadecimals":"Input needs to be even number"}`},null,8,["hex","modelValue","toolTip","showError","errorMessage"]),[[x,t.checkOldValue,"1000"]]),s("div",_t,[s("div",Kt,[O(s("input",{type:"radio",id:"regular",value:"1","onUpdate:modelValue":n[3]||(n[3]=o=>t.scopedMetadataKeyType=o)},null,512),[[ge,t.scopedMetadataKeyType]]),n[10]||(n[10]=s("label",{for:"regular"},"UTF-8",-1))]),s("div",kt,[O(s("input",{type:"radio",id:"hexa",value:"2","onUpdate:modelValue":n[4]||(n[4]=o=>t.scopedMetadataKeyType=o)},null,512),[[ge,t.scopedMetadataKeyType]]),n[11]||(n[11]=s("label",{for:"hexa"},"Hexadecimal",-1))])]),H(T,{class:"mt-2",modelValue:t.oldValue,"onUpdate:modelValue":n[5]||(n[5]=o=>t.oldValue=o),disabled:!0,placeholder:"Current Value"},null,8,["modelValue"])])):(i(),d("div",It,[s("div",wt,[s("div",At,[n[12]||(n[12]=s("div",{class:"uppercase text-xxs font-semibold text-blue-primary"}," Selected Scoped Metadata Key ",-1)),s("div",Ct,[s("div",St,y(U.scopedMetadataKey),1),s("div",Vt,y(t.scopedMetadataKeyType==1?"UTF-8":"HEX"),1)]),s("div",Pt,[t.scopedMetadataKeyType==1?(i(),d("div",Lt,y(t.scopedMetadataKeyHex),1)):M("",!0),t.scopedMetadataKeyType==1?(i(),d("div",Ft," HEX ")):M("",!0)])])]),s("div",Ht,[n[13]||(n[13]=s("div",{class:"uppercase text-xxs text-blue-primary font-semibold"}," CURRENT VALUE ",-1)),s("div",Ut,y(t.oldValue),1)])])),H(T,{class:"mt-2",modelValue:t.newValue,"onUpdate:modelValue":n[6]||(n[6]=o=>t.newValue=o),placeholder:"New Value"},null,8,["modelValue"])]),navy:ee(()=>[H(K,{"transaction-fee":t.transactionFee,"total-fee-formatted":t.totalFeeFormatted,"get-multi-sig-cosigner":t.getMultiSigCosigner,"check-cosign-balance":t.checkCosignBalance,"lock-fund-currency":String(t.lockFundCurrency),"lock-fund-tx-fee":String(t.lockFundTxFee),balance:t.accBalance,"selected-acc-add":t.selectedAccAdd},null,8,["transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),s("button",{type:"submit",class:"w-full blue-btn px-3 py-3 mt-3 disabled:opacity-50 disabled:cursor-auto",onClick:n[7]||(n[7]=o=>t.updateMetadata()),disabled:t.disableAddBtn}," Update Asset Metadata ",8,Bt),s("div",Wt,[H(u,{to:{name:"ViewAccountAssets",params:{address:U.address}},class:"content-center text-xs text-white border-b-2 border-white"},{default:ee(()=>[de(y(g.$t("general.cancel")),1)]),_:1},8,["to"])])]),_:1})}const Yt=Ee(qe,[["render",Dt]]);export{Yt as default};