import{g as m,I as Ue,c as v,w as u,H as P,A as y,x as r,D as C,j as Ee,n as H,B as Be,au as A,k as We,_ as De,a as Re,b as ee,r as E,Q as Qe,o as d,e as n,f as c,l as L,t as f,i as T,s as de,O as R,ak as je,F as ce,K as ue,av as ge}from"./index-d2e8ccc1.js";import{_ as Oe}from"./TransactionFeeDisplay.vue_vue_type_script_setup_true_lang-dcb72102.js";import{T as Ze}from"./TransactionLayout-28e8b83b.js";import{M as te}from"./multisigUtils-915e0086.js";import{t as ze}from"./jdenticon-module-59aa2fb9.js";import{M as Xe}from"./MetadataInput-0a8b5efb.js";import{U as Ge}from"./UTF8-35cb612a.js";import{T as Q}from"./transactionState-4479ac99.js";import{_ as qe}from"./icon-namespace-e5424a8b.js";import"./TransactionFeeLayout.vue_vue_type_script_setup_true_lang-8a5d8a3f.js";import"./proximax-logo-ecfc3767.js";import"./icon-info-8b4f1351.js";const Je={name:"ViewUpdateNamespaceMetadata",props:{targetId:String,scopedMetadataKey:String},components:{MetadataInput:Xe,TransactionFeeDisplay:Oe,TransactionLayout:Ze},setup(i){const s=We();let j=m(!1),t=m(!0),k=m(1),b=m(null),h=m(null),_=m(!1),K=m(""),g=m(""),p=m(null),x,o,M,B;const I=m(""),S=m(""),ae=new Ue("ThemeStyleConfig");ae.init();const ve=v(()=>ze(p.value?p.value.address:"",40,ae.jdenticonConfig)),me=v(()=>p.value?u.currentLoggedInWallet.convertAddressToName(p.value.address,!0):""),le=m([]),W=u.currentLoggedInWallet?u.currentLoggedInWallet.selectDefaultAccount():null,O=m(W?W.address:""),fe=m(P.toCurrencyFormat(W?W.balance:0,y.nativeToken.divisibility)),ne=e=>(e.endsWith("00")&&(e=e.substring(0,e.length-2),e=ne(e)),e),Z=e=>{e=ne(e);let a=r.Convert.hexToUint8(e);return Ge.isNotUTF8(a)||(e=r.Convert.decodeHexToUtf8(e)),e},ye=()=>{let e=new r.MetadataQueryParams;e.metadataType=r.MetadataType.NAMESPACE,e.targetId=h.value,y.chainAPI.metadataAPI.searchMetadatas(e).then(a=>{a.metadataEntries.forEach(l=>{le.value.push({value:l.scopedMetadataKey.toHex()==Z(l.scopedMetadataKey.toHex())?l.scopedMetadataKey.toHex():Z(l.scopedMetadataKey.toHex()),type:l.scopedMetadataKey.toHex()==Z(l.scopedMetadataKey.toHex())?2:1})})})},pe=async()=>{if(i.targetId.length===16&&r.Convert.isHexString(i.targetId)){let a=r.UInt64.fromHex(i.targetId),l=new r.NamespaceId([a.lower,a.higher]);h.value=l,x.targetNamespaceId(h.value)}else try{let a=new r.NamespaceId(i.targetId);h.value=a,x.targetNamespaceId(h.value)}catch{return}let e=await y.chainAPI.namespaceAPI.getNamespace(h.value);b.value=e.owner,x.targetPublicKey(b.value),u.currentLoggedInWallet&&(p.value=u.currentLoggedInWallet.accounts.find(a=>a.publicKey===e.owner.publicKey)||u.currentLoggedInWallet.others.find(a=>a.publicKey===e.owner.publicKey),p.value&&(_.value=!!p.value.getDirectParentMultisig().length))},be=v(()=>p.value?i.targetId.length==16&&r.Convert.isHexString(i.targetId)?p.value.namespaces.find(a=>a.idHex==i.targetId).name:i.targetId:""),xe=v(()=>u.currentLoggedInWallet&&b.value?u.currentLoggedInWallet.others.find(e=>e.publicKey===b.value.publicKey):null);C(xe,async e=>{e&&(p.value=u.currentLoggedInWallet.accounts.find(a=>a.publicKey===b.value.publicKey)||u.currentLoggedInWallet.others.find(a=>a.publicKey===b.value.publicKey),p.value&&(_.value=!!p.value.getDirectParentMultisig().length))},{deep:!0});const he=()=>{if(i.scopedMetadataKey)if(t.value=!1,g.value=i.scopedMetadataKey,i.scopedMetadataKey.length===16&&r.Convert.isHexString(i.scopedMetadataKey))k.value=2,K.value=i.scopedMetadataKey,x.scopedMetadataKey(r.UInt64.fromHex(K.value));else{k.value=1;let e=r.Convert.utf8ToHex(i.scopedMetadataKey);const a=e.length/2;e.length&&a<=8&&(e.length/2<8&&(e=e+"00".repeat(8-a)),K.value=e,x.scopedMetadataKey(r.UInt64.fromHex(K.value)))}},Me=async()=>{x=y.buildTxn.namespaceMetadataBuilder();const e=await y.chainAPI.nodeAPI.getNodeTime();o=y.buildTxn.aggregateBondedBuilder(new r.UInt64(e.sendTimeStamp))},Te=async()=>{if(h.value&&K.value){let e=new r.MetadataQueryParams;e.targetId=h.value,e.metadataType=r.MetadataType.NAMESPACE,e.scopedMetadataKey=r.UInt64.fromHex(K.value);let a=await y.chainAPI.metadataAPI.searchMetadatas(e);a.metadataEntries.length&&(I.value=a.metadataEntries[0].value)}x.oldValue(I.value)},_e=()=>{x.value(S.value)},z=()=>{M=x.calculateDifferences().build()},X=()=>{M&&(B=o.innerTransactions([M.toAggregateV1(b.value)]).build())},G=()=>{B&&(V.value=B.maxFee.compact()/Math.pow(10,y.nativeToken.divisibility))},se=async()=>{await Me(),await pe(),he(),await Te(),_e(),z(),X(),G(),ye()};if(y.isReady)se();else{let e=C(y,a=>{a.isReady&&(se(),e())})}const Ke=v(()=>y.nativeToken.label);Ee();const Ie=m(""),ke=u.currentLoggedInWallet?u.currentLoggedInWallet.name:"",q=v(()=>H.currentNetworkProfileConfig?P.convertToExact(H.currentNetworkProfileConfig.lockedFundsPerAggregate,y.nativeToken.divisibility):0),we=v(()=>H.currentNetworkProfileConfig?P.convertToCurrency(H.currentNetworkProfileConfig.lockedFundsPerAggregate,y.nativeToken.divisibility):0),J=v(()=>H.currentNetworkProfile?P.convertToExact(Be.getLockFundFee(),y.nativeToken.divisibility):0),Ce=m(!1),Y=v(()=>k.value==1?r.Convert.utf8ToHex(g.value).length/2>8:g.value.length>16?!0:g.value.length%2===1),re=v(()=>Ve.value<$.value),Ae=v(()=>Y.value==!0||g.value==""||S.value==""||re.value==!0),F=v(()=>{if(!u.currentLoggedInWallet)return[];let e=u.currentLoggedInWallet.accounts.map(l=>({name:l.name,balance:l.balance,address:l.address,publicKey:l.publicKey,isMultisig:!!l.getDirectParentMultisig().length})),a=u.currentLoggedInWallet.others.filter(l=>l.type==="MULTISIG").map(l=>({name:l.name,balance:l.balance,address:l.address,publicKey:l.publicKey,isMultisig:!0}));return e.concat(a)}),V=m(0);C(k,e=>{oe(),e==2&&(r.Convert.isHexString(g.value)||(g.value=""))});const oe=async()=>{if(Y.value||g.value.length==0)return;let e="";if(k.value==1){let D=r.Convert.utf8ToHex(g.value);e=D+"00".repeat((16-D.length)/2)}else e="00".repeat((16-g.value.length)/2)+g.value;let a=new r.MetadataQueryParams;a.targetId=h.value,a.metadataType=r.MetadataType.NAMESPACE,a.scopedMetadataKey=r.UInt64.fromHex(e);let l=await y.chainAPI.metadataAPI.searchMetadatas(a);l.metadataEntries.length?I.value=l.metadataEntries[0].value:I.value=""},Se=async()=>{if(!u.currentLoggedInWallet)return;let e="",a;if(k.value==1){let N=r.Convert.utf8ToHex(g.value);e=N+"00".repeat((16-N.length)/2)}else e="00".repeat((16-g.value.length)/2)+g.value;let l=x.targetPublicKey(b.value).targetNamespaceId(h.value).scopedMetadataKey(r.UInt64.fromHex(e)).value(S.value).oldValue(I.value).calculateDifferences().build(),D=y.buildTxn.aggregateCompleteBuilder().innerTransactions([l.toAggregateV1(b.value)]).build().serialize(),ie=u.currentLoggedInWallet.accounts.find(N=>N.publicKey==b.value.publicKey).address;if(_.value){let N=u.currentLoggedInWallet.accounts.find(Fe=>Fe.publicKey==w.value).address;a=l.toAggregateV1(b.value).serialize(),Q.selectedAddress=N,Q.selectedMultisigAddress=ie}else a=D,Q.selectedAddress=ie;g.value="",I.value="",S.value="",Q.unsignedTransactionPayload=a,s.push({name:"ViewConfirmTransaction"})},$=v(()=>{let e=y.nativeToken.divisibility;return _.value?e==0?Math.trunc(q.value+J.value+V.value):Math.round((q.value+J.value+V.value)*Math.pow(10,e))/Math.pow(10,e):V.value}),U=v(()=>!u.currentLoggedInWallet||!b.value?[]:te.getCosignerInWallet(b.value.publicKey).cosignerList.length?F.value?te.getCosignerInWallet(b.value.publicKey).cosignerList.map(e=>{let a=F.value.find(l=>l.publicKey==e);return{name:a.name,publicKey:e,balance:a.balance}}):[]:[]),w=m("");U.value.length>0&&(w.value=U.value[0].publicKey),C(()=>U,e=>{e.value.length&&(w.value=U.value[0].publicKey)},{deep:!0});const Ve=v(()=>u.currentLoggedInWallet?_.value?w.value?A(w.value).balance:0:p.value?p.value.balance:0:0),Ne=v(()=>V.value.toString()),Pe=v(()=>P.amountFormatterSimple($.value,0)),He=v(()=>{if(H.currentNetworkProfileConfig){let e=te.getCosignerInWallet(F.value.find(l=>l.address==O.value)?F.value.find(l=>l.address==O.value).publicKey:""),a=[];return e.cosignerList.forEach(l=>{a.push({publicKey:l,name:A(l).name,balance:A(l).balance,address:A(l).address})}),e.cosignerList=a,e}else return{hasCosigner:!1,cosignerList:[]}}),Le=v(()=>{let e=A(w.value)?A(w.value).balance:0;return P.toCurrencyFormat(e,3)});return C(I,e=>{x.oldValue(e),z(),X(),G()}),C(S,e=>{x.value(e),z(),X(),G()}),C(g,e=>{e==""&&(I.value="")}),{findAcc:A,totalFee:$,err:Ie,showPasswdError:Ce,accounts:F,updateMetadata:Se,targetAccIsMultisig:_,lockFundCurrency:we,lockFund:q,aggregateFee:V,lockFundTxFee:J,walletName:ke,currentNativeTokenName:Ke,oldValue:I,newValue:S,cosigners:U,scopedMetadataKeyType:k,svgString:ve,accountName:me,disableAddBtn:Ae,showBalanceErr:re,showScopedKeyErr:Y,inputScopedMetadataKey:g,checkOldValue:oe,selectedCosigner:w,namespaceName:be,existingScopedMetadataKeys:le,showKeys:j,scopedMetadataKeySelectable:t,scopedMetadataKeyHex:K,transactionFee:Ne,totalFeeFormatted:Pe,selectedAccAdd:O,accBalance:fe,getMultiSigCosigner:He,checkCosignBalance:Le}}},Ye={key:0,class:"rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},$e={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},et={class:"inline-block text-xs"},tt={key:1,class:"error error_box mb-5"},at={class:"flex items-center"},lt=["innerHTML"],nt={class:"ml-2"},st={class:"text-blue-primary text-xxs font-bold uppercase mb-1"},rt={class:"font-bold text-black text-sm"},ot={key:2,class:"text-left mt-2 mb-5 ml-4"},it={key:0},dt={class:"text-tsm"},ct={key:0,class:"font-bold"},ut={key:1,class:"font-bold"},gt=["value"],vt={key:1,class:"error"},mt={class:"border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5"},ft={class:"ml-1"},yt={class:"text-black text-sm font-bold"},pt={key:3,class:"mt-2"},bt=["onClick"],xt={key:0,class:"text-xs py-2 bg-gray-100 pl-2 w-full"},ht={key:1,class:"text-xs py-2 pl-2 w-full"},Mt={key:2,class:"ml-auto pr-2 text-xxs py-2 font-semibold uppercase text-blue-primary bg-gray-100"},Tt={key:3,class:"ml-auto mr-2 text-xxs py-2 font-semibold uppercase text-blue-primary"},_t={key:4},Kt={class:"flex gap-3"},It={class:"flex gap-2"},kt={class:"flex gap-2"},wt={key:5,class:"my-3"},Ct={class:"border border-blue-primary p-4 bg-blue-100 rounded mt-5"},At={class:"flex flex-col gap-0.5"},St={class:"flex"},Vt={class:"font-semibold"},Nt={class:"ml-3 text-gray-400 font-semibold"},Pt={class:"flex"},Ht={key:0,class:"font-semibold"},Lt={key:1,class:"ml-3 text-gray-400 font-semibold"},Ft={class:"border border-blue-primary p-4 bg-blue-100 rounded mt-5"},Ut={class:"font-semibold"},Et=["disabled"],Bt={class:"text-center"};function Wt(i,s,j,t,k,b){const h=E("font-awesome-icon"),_=E("MetadataInput"),K=E("TransactionFeeDisplay"),g=E("router-link"),p=E("TransactionLayout"),x=Qe("debounce");return d(),Re(p,{class:"mt-8"},{white:ee(()=>[s[14]||(s[14]=n("div",{class:"font-semibold mb-4"},"Update Namespace Metadata",-1)),t.showBalanceErr?(d(),c("div",Ye,[n("div",$e,[L(h,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),n("div",et,f(i.$t("general.insufficientBalance")),1)])):T("",!0),t.err!=""?(d(),c("div",tt,f(t.err),1)):T("",!0),n("div",at,[n("div",{innerHTML:t.svgString,class:"inline-block"},null,8,lt),n("div",nt,[n("div",st,f(i.$t("namespace.namespaceCreatedBy")),1),n("div",rt,f(t.accountName),1)])]),t.targetAccIsMultisig?(d(),c("div",ot,[t.cosigners.length>0?(d(),c("div",it,[n("div",dt,[de(f(i.$t("general.initiateBy"))+": ",1),t.cosigners.length==1?(d(),c("span",ct,f(t.cosigners[0].name),1)):(d(),c("span",ut,[R(n("select",{class:"","onUpdate:modelValue":s[0]||(s[0]=o=>t.selectedCosigner=o)},[(d(!0),c(ce,null,ue(t.cosigners,(o,M)=>(d(),c("option",{value:t.findAcc(o.publicKey).publicKey,key:M},f(o.name),9,gt))),128))],512),[[je,t.selectedCosigner]])]))])])):(d(),c("div",vt,f(i.$t("general.noCosigner")),1))])):T("",!0),n("div",mt,[s[9]||(s[9]=n("img",{src:qe},null,-1)),n("div",ft,[s[8]||(s[8]=n("div",{class:"uppercase text-blue-primary font-semibold text-xxs"}," NAMESPACE ",-1)),n("div",yt,f(t.namespaceName),1)])]),t.existingScopedMetadataKeys.length&&t.scopedMetadataKeySelectable?(d(),c("div",pt,[n("div",{onClick:s[1]||(s[1]=o=>t.showKeys=!t.showKeys),class:"text-blue-primary text-xs cursor-pointer mb-1.5"}," Select Existing Scoped Metadata Key "),(d(!0),c(ce,null,ue(t.existingScopedMetadataKeys,(o,M)=>(d(),c("div",{key:M},[t.showKeys?(d(),c("div",{key:0,class:"flex justify-center cursor-pointer",onClick:B=>(t.scopedMetadataKeyType=o.type,t.inputScopedMetadataKey=o.value,t.checkOldValue(),t.showKeys=!1)},[M%2==0?(d(),c("div",xt,f(o.value),1)):T("",!0),M%2==1?(d(),c("div",ht,f(o.value),1)):T("",!0),M%2==0?(d(),c("div",Mt,f(i.$t("general.select")),1)):T("",!0),M%2==1?(d(),c("div",Tt,f(i.$t("general.select")),1)):T("",!0)],8,bt)):T("",!0)]))),128))])):T("",!0),t.scopedMetadataKeySelectable?(d(),c("div",_t,[R(L(_,{hex:t.scopedMetadataKeyType==2,class:"mt-5",modelValue:t.inputScopedMetadataKey,"onUpdate:modelValue":s[2]||(s[2]=o=>t.inputScopedMetadataKey=o),placeholder:"Scoped Metadata Key",toolTip:`${t.scopedMetadataKeyType==1?"Accepts up to 8 bytes":"Accepts 16 hexadecimals"}`,showError:t.showScopedKeyErr,errorMessage:`${t.scopedMetadataKeyType==1?"Exceeded 8 bytes":t.inputScopedMetadataKey.length>16?"Exceeded 16 hexadecimals":"Input needs to be even number"}`},null,8,["hex","modelValue","toolTip","showError","errorMessage"]),[[x,t.checkOldValue,"1000"]]),n("div",Kt,[n("div",It,[R(n("input",{type:"radio",id:"regular",value:"1","onUpdate:modelValue":s[3]||(s[3]=o=>t.scopedMetadataKeyType=o)},null,512),[[ge,t.scopedMetadataKeyType]]),s[10]||(s[10]=n("label",{for:"regular"},"UTF-8",-1))]),n("div",kt,[R(n("input",{type:"radio",id:"hexa",value:"2","onUpdate:modelValue":s[4]||(s[4]=o=>t.scopedMetadataKeyType=o)},null,512),[[ge,t.scopedMetadataKeyType]]),s[11]||(s[11]=n("label",{for:"hexa"},"Hexadecimal",-1))])]),L(_,{class:"mt-2",modelValue:t.oldValue,"onUpdate:modelValue":s[5]||(s[5]=o=>t.oldValue=o),disabled:!0,placeholder:"Current Value"},null,8,["modelValue"])])):(d(),c("div",wt,[n("div",Ct,[n("div",At,[s[12]||(s[12]=n("div",{class:"uppercase text-xxs font-semibold text-blue-primary"}," Selected Scoped Metadata Key ",-1)),n("div",St,[n("div",Vt,f(j.scopedMetadataKey),1),n("div",Nt,f(t.scopedMetadataKeyType==1?"UTF-8":"HEX"),1)]),n("div",Pt,[t.scopedMetadataKeyType==1?(d(),c("div",Ht,f(t.scopedMetadataKeyHex),1)):T("",!0),t.scopedMetadataKeyType==1?(d(),c("div",Lt," HEX ")):T("",!0)])])]),n("div",Ft,[s[13]||(s[13]=n("div",{class:"uppercase text-xxs text-blue-primary font-semibold"}," CURRENT VALUE ",-1)),n("div",Ut,f(t.oldValue),1)])])),L(_,{class:"mt-2",modelValue:t.newValue,"onUpdate:modelValue":s[6]||(s[6]=o=>t.newValue=o),placeholder:"New Value"},null,8,["modelValue"])]),navy:ee(()=>[L(K,{"transaction-fee":String(t.transactionFee),"total-fee-formatted":t.totalFeeFormatted,"get-multi-sig-cosigner":t.getMultiSigCosigner,"check-cosign-balance":t.checkCosignBalance,"lock-fund-currency":String(t.lockFundCurrency),"lock-fund-tx-fee":String(t.lockFundTxFee),balance:t.accBalance,"selected-acc-add":t.selectedAccAdd},null,8,["transaction-fee","total-fee-formatted","get-multi-sig-cosigner","check-cosign-balance","lock-fund-currency","lock-fund-tx-fee","balance","selected-acc-add"]),n("button",{type:"submit",class:"w-full blue-btn px-3 py-3 mt-3 disabled:opacity-50 disabled:cursor-auto",onClick:s[7]||(s[7]=o=>t.updateMetadata()),disabled:t.disableAddBtn}," Update Namespace Metadata ",8,Et),n("div",Bt,[L(g,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white border-b-2 border-white"},{default:ee(()=>[de(f(i.$t("general.cancel")),1)]),_:1})])]),_:1})}const $t=De(Je,[["render",Wt]]);export{$t as default};