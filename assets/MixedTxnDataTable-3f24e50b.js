import{B as l,d as le,r as m,u as j,g as z,H as N,c as b,w as U,E as W,a as ce,R as Y,o as s,b as a,S as T,e as n,t as i,f as d,s as V,F as de,ac as B,W as F,n as k,_ as X,D as pe,a9 as ue,aa as ye,k as K,z as _,A as g,m as v}from"./index-f81de996.js";import{a as _e,s as he}from"./column.esm-a96344fe.js";import{P as ve}from"./PasswordInput-0dd59ef4.js";import{c as me}from"./functions-ee8fa276.js";import{_ as $,a as q,b as ge}from"./icon-message-e27d55b6.js";import{_ as Te}from"./icon-proximax-logo-gray-c2486ce1.js";class Ot{static getTransferTypes(){return[l.TransactionType.TRANSFER]}static getAliasTypes(){return[l.TransactionType.ADDRESS_ALIAS,l.TransactionType.MOSAIC_ALIAS]}static getMetadataTypes(){return[l.TransactionType.ACCOUNT_METADATA_V2,l.TransactionType.MOSAIC_METADATA_V2,l.TransactionType.NAMESPACE_METADATA_V2]}static getAccountTypes(){return[l.TransactionType.MODIFY_MULTISIG_ACCOUNT]}static getSecretTypes(){return[l.TransactionType.SECRET_LOCK,l.TransactionType.SECRET_PROOF]}static getNamespaceTypes(){return[l.TransactionType.REGISTER_NAMESPACE]}static getAssetTypes(){return[l.TransactionType.MODIFY_MOSAIC_LEVY,l.TransactionType.REMOVE_MOSAIC_LEVY,l.TransactionType.MOSAIC_DEFINITION,l.TransactionType.MOSAIC_SUPPLY_CHANGE]}static getRestrictionTypes(){return[l.TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS,l.TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,l.TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION]}static getLockTypes(){return[l.TransactionType.HASH_LOCK]}static getLinkTypes(){return[l.TransactionType.LINK_ACCOUNT]}static getExchangeTypes(){return[l.TransactionType.EXCHANGE_OFFER,l.TransactionType.ADD_EXCHANGE_OFFER,l.TransactionType.REMOVE_EXCHANGE_OFFER]}static getChainTypes(){return[l.TransactionType.CHAIN_CONFIGURE,l.TransactionType.CHAIN_UPGRADE]}static getAggregateTypes(){return[l.TransactionType.AGGREGATE_BONDED_V1,l.TransactionType.AGGREGATE_COMPLETE_V1]}}var fe=(r=>(r.TRANSFER="Transfer",r.ACCOUNT="Account",r.AGGREGATE="Aggregate",r.ALIAS="Alias",r.ASSET="Asset",r.NAMESPACE="Namespace",r.METADATA="Metadata",r.EXCHANGE="Exchange",r.LOCK="Lock",r.LINK="Link",r.RESTRICTION="Restriction",r.SECRET="Secret",r.CHAIN="Chain",r))(fe||{});const be="/web-wallet-vuejs/assets/encrypted-icon-message-0ed64fdf.svg",xe={key:0,class:"popup-outer fixed flex z-50"},Ae={class:"modal-popup-box"},ke={key:0,class:"error error_box mb-3"},we=n("div",{class:"text-center mt-2 text-xs font-semibold"},"Decrypt Message",-1),Ee=["disabled"],Se={key:1,class:"popup-outer fixed flex z-50"},Ce={class:"modal-popup-box"},Ie=n("div",null,"Decrypted Message: ",-1),Ne={name:"DecryptMessageModal",directives:{tooltip:B}},Me=le({...Ne,props:{messageTypeTitle:String,message:String||null,recipientAddress:String||null,initiator:String||null},setup(r){const M=r,h=m(!1),{t}=j(),w=m(!0);z().appContext.config.globalProperties.emitter;const f=m(""),p=m(""),x=m(""),C=m("");let y=N.createEncryptedMessageFromEncoded(M.message);const e=()=>{if(!M.recipientAddress)return;let u=N.createAddress(M.recipientAddress);W.chainAPI.accountAPI.getAccountInfo(u).then(c=>{C.value=c.publicKey})},I="^[^ ]{8,}$",A=b(()=>!p.value.match(I));m(!1);const O=()=>{p.value="",x.value="",w.value=!0,f.value="",h.value=!1},R=b(()=>{if(!U.currentLoggedInWallet)return null;let u=U.currentLoggedInWallet.accounts.find(c=>c.publicKey==C.value);return u||null}),G=()=>{if(!R.value)return;if(!F.verifyWalletPassword(U.currentLoggedInWallet.name,k.chainNetworkName,p.value)){f.value=t("general.walletPasswordInvalid",{name:U.currentLoggedInWallet.name});return}f.value="";let c=F.decryptPrivateKey(N.createPasswordInstance(p.value),R.value.encrypted,R.value.iv),P=N.createPublicAccount(M.initiator,W.networkType);l.EncryptedMessage.decrypt(y,c,P).payload===""?f.value="Error when trying to decrypt":(w.value=!1,x.value=l.EncryptedMessage.decrypt(y,c,P).payload)},D=()=>{e()};if(W.isReady)D();else{let u=ce(W,c=>{c.isReady&&(D(),u())})}return(u,c)=>{const P=Y("tooltip");return s(),a(de,null,[T(n("img",{src:be,class:"cursor-pointer w-6 h-6",onClick:c[0]||(c[0]=E=>h.value=!0)},null,512),[[P,{value:"<tiptitle>"+r.messageTypeTitle+"</tiptitle><tiptext>"+r.message+"</tiptext>",escape:!0},void 0,{left:!0}]]),h.value&&w.value?(s(),a("div",xe,[n("div",Ae,[n("div",null,[f.value!=""?(s(),a("div",ke,i(f.value),1)):d("v-if",!0),we,V(ve,{class:"my-3",modelValue:p.value,"onUpdate:modelValue":c[1]||(c[1]=E=>p.value=E),placeholder:u.$t("general.password"),errorMessage:u.$t("general.passwordRequired")},null,8,["modelValue","placeholder","errorMessage"]),n("div",{onClick:c[2]||(c[2]=E=>G()),class:"blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto",disabled:A.value},i(u.$t("general.confirm")),9,Ee),n("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:c[3]||(c[3]=E=>O())},i(u.$t("general.cancel")),1)])])])):h.value&&w.value==!1?(s(),a("div",Se,[n("div",Ce,[Ie,n("div",null,i(x.value),1),n("div",{onClick:c[4]||(c[4]=E=>O()),class:"blue-btn font-semibold py-2 mt-3 cursor-pointer text-center ml-auto mr-auto w-7/12"},i(u.$t("general.close")),1)])])):d("v-if",!0),h.value?(s(),a("div",{key:2,onClick:O,class:"fixed inset-0 bg-opacity-60 z-20"})):d("v-if",!0)],64)}}}),Re=X(Me,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/dashboard/components/DecryptMessageModal.vue"]]),De={components:{DataTable:_e,Column:he,DecryptMessageModal:Re},name:"MixedTxnDataTable",props:{transactions:Array,selectedGroupType:String,currentAddress:String},emits:["openMessage","openDecryptMsg"],directives:{tooltip:B},setup(r,M){const h=m(!1),t=pe(),{t:w}=j(),L=()=>{window.innerWidth<1024?h.value=!1:h.value=!0};L(),ue(()=>{window.removeEventListener("resize",L)}),ye(()=>{window.addEventListener("resize",L)});const p=z().appContext.config.globalProperties.emitter,x=m("border border-gray-400"),C=m(!1),y=m(""),e=N.getTransactionGroupType(),I=b(()=>{var o;return(o=k.currentNetworkProfile)==null?void 0:o.network.currency.name}),A=b(()=>k.currentNetworkProfile.chainExplorer.url),O=b(()=>k.currentNetworkProfile.chainExplorer.blockRoute),R=b(()=>k.currentNetworkProfile.chainExplorer.publicKeyRoute),G=b(()=>k.currentNetworkProfile.chainExplorer.addressRoute),D=b(()=>k.currentNetworkProfile.chainExplorer.hashRoute),u=b(()=>k.currentNetworkProfile.chainExplorer.namespaceInfoRoute),c=b(()=>k.currentNetworkProfile.chainExplorer.assetInfoRoute),P=m("TransferTransactionModal"),E=()=>{x.value="border border-white-100 drop-shadow"},J=()=>{x.value="border border-gray-400"};p.on("CLOSE_MODAL",o=>{C.value=o});const Q=o=>A.value+R.value+"/"+o,Z=o=>A.value+u.value+"/"+o,ee=o=>A.value+c.value+"/"+o,te=o=>A.value+G.value+"/"+o,se=o=>A.value+D.value+"/"+o,re=o=>{window.open(A.value+D.value+"/"+o,"_blank")},ne=o=>{let S=[];if(o.length>0){for(const H of o){let ie=ae(H);S.push(ie)}return S.join("<br>")}},oe=o=>N.convertDisplayDateTimeFormat24(o),ae=o=>{let S;return[].push(o.id),o.currentAlias&&o.currentAlias.length?S=o.amount+" "+o.currentAlias[0].name:S=o.amount+" - "+o.id,S};return{borderColor:x,filterText:y,clickInputText:E,blurInputText:J,showTransactionModel:C,dynamicModelComponentDisplay:P,blockExplorerURL:O,addressExplorerURL:G,assetExplorerURL:c,namespaceExplorerURL:u,hashExplorerURL:D,publicKeyExplorerURL:R,explorerBaseURL:A,getPublicKeyExplorerUrl:Q,getNamespaceExplorerUrl:Z,getAssetExplorerUrl:ee,getAddressExplorerUrl:te,getHashExplorerUrl:se,gotoHashExplorer:re,displaySDAs:ne,checkOtherAsset:o=>!!(o&&o.length>0),nativeTokenName:I,convertLocalTime:oe,transactionGroupType:e,wideScreen:h,Helper:N,walletState:U,copy:o=>{let S=o,H=w("dashboard.txHash");me(S),t.add({severity:"info",detail:H+" "+w("general.copied"),group:"br-custom",life:3e3})}}}};const Pe={class:"uppercase text-xxs font-bold mb-1"},Le={class:"flex items-center"},Oe=["onClick"],Ue={class:"text-txs"},Ge={class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},He={class:"flex items-center"},We={class:"uppercase font-bold text-txs mr-2"},Ke={key:0,src:$,class:"inline-block w-5"},Ve={key:1,src:q,class:"inline-block w-5"},Fe={key:0,class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},je={class:"uppercase font-bold text-txs"},ze={key:0},Ye={key:1,class:"truncate inline-block text-txs"},Be={key:2,class:"truncate inline-block text-txs"},Xe={key:0},$e={class:"uppercase text-xxs text-gray-300 font-bold mb-1"},qe={class:"uppercase font-bold text-txs"},Je={class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},Qe={class:"uppercase font-bold text-txs"},Ze={key:0},et={key:1,class:"truncate inline-block text-txs"},tt=["href"],st={class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},rt={class:"text-txs uppercase font-bold"},nt={key:0},ot={key:0,src:$,class:"inline-block"},at={key:1,src:q,class:"inline-block"},it={class:"flex items-center"},lt=["onClick"],ct={class:"text-txs"},dt={class:"text-txs"},pt={key:0},ut={key:1,class:"truncate inline-block text-txs"},yt=["href"],_t={key:0},ht={key:1,class:"truncate inline-block text-txs"},vt={key:2,class:"truncate inline-block text-txs"},mt={class:"text-txs"},gt={key:0},Tt={class:"text-txs"},ft={key:0},bt={class:"flex items-center"},xt={key:0,src:Te,class:"inline-block"},At={key:1,class:"flex"},kt={class:"flex justify-center"},wt={key:0,src:ge,class:"inline-block"},Et={key:2,class:"w-full text-center"};function St(r,M,h,t,w,L){const f=K("font-awesome-icon"),p=K("Column"),x=K("DecryptMessageModal"),C=K("DataTable"),y=Y("tooltip");return s(),a("div",null,[V(C,{value:h.transactions,paginator:!0,rows:10,scrollDirection:"horizontal",alwaysShowPaginator:!1,responsiveLayout:"scroll",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:""},{empty:_(()=>[g(i(r.$t("general.noRecord")),1)]),loading:_(()=>[g(i(r.$t("dashboard.fetchingTx")),1)]),default:_(()=>[t.wideScreen?d("v-if",!0):(s(),v(p,{key:0,style:{width:"200px"},headerClass:"invisible"},{body:_(({data:e})=>[n("div",null,[n("div",Pe,i(r.$t("dashboard.txHash")),1),n("div",Le,[n("div",{onClick:I=>t.gotoHashExplorer(e.hash),class:"uppercase cursor-pointer font-bold text-txs text-blue-primary"},[T((s(),a("span",Ue,[g(i(e.hash.substring(0,20))+"...",1)])),[[y,e.hash,void 0,{right:!0}]])],8,Oe),V(f,{icon:"copy",title:r.$t("general.copy"),onClick:I=>t.copy(e.hash),class:"ml-0.5 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title","onClick"])])]),n("div",null,[n("div",Ge,i(r.$t("dashboard.type")),1),n("div",He,[n("div",We,i(e.type),1),n("div",null,[e.in_out===!0?(s(),a("img",Ke)):e.in_out===!1?(s(),a("img",Ve)):d("v-if",!0)])])]),n("div",null,[e.recipient!=""&&e.recipient!=null?(s(),a("div",Fe,i(r.$t("general.recipient")),1)):d("v-if",!0),n("div",je,[e.recipient===""||e.recipient===null?(s(),a("span",ze)):e.recipientNamespaceName?T((s(),a("span",Ye,[g(i(e.recipientNamespaceName),1)])),[[y,t.Helper.createAddress(e.recipient).pretty(),void 0,{right:!0}]]):T((s(),a("span",Be,[g(i(t.walletState.currentLoggedInWallet?t.walletState.currentLoggedInWallet.convertAddressToNamePretty(e.recipient).substring(0,20):""),1)])),[[y,t.Helper.createAddress(e.recipient).pretty(),void 0,{right:!0}]])])])]),_:1})),t.wideScreen?d("v-if",!0):(s(),v(p,{key:1,style:{width:"200px"},headerClass:"invisible"},{body:_(({data:e})=>[h.selectedGroupType===t.transactionGroupType.CONFIRMED?(s(),a("div",Xe,[n("div",$e,i(r.$t("dashboard.timestamp")),1),n("div",qe,i(t.convertLocalTime(e.timestamp)),1)])):d("v-if",!0),n("div",null,[n("div",Je,i(r.$t("general.sender")),1),n("div",Qe,[e.sender===""||e.sender===null?(s(),a("span",Ze)):T((s(),a("span",et,[n("a",{href:t.getPublicKeyExplorerUrl(e.sender),target:"_blank"},i(t.walletState.currentLoggedInWallet?t.walletState.currentLoggedInWallet.convertAddressToNamePretty(e.sender).substring(0,20):""),9,tt)])),[[y,t.Helper.createAddress(e.sender).pretty(),void 0,{right:!0}]])])]),n("div",null,[n("div",st,i(r.$t("dashboard.txAmount")),1),n("div",rt,[g(i(e.amountTransfer?e.amountTransfer:"-")+" ",1),e.amountTransfer?(s(),a("b",nt,i(t.nativeTokenName),1)):d("v-if",!0)])])]),_:1})),t.wideScreen?(s(),v(p,{key:2,header:r.$t("dashboard.inOut"),headerStyle:"width:40px"},{body:_(({data:e})=>[n("div",null,[e.in_out===!0?(s(),a("img",ot)):e.in_out===!1?(s(),a("img",at)):d("v-if",!0)])]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:3,field:"hash",header:r.$t("dashboard.txHash"),headerStyle:"width:100px"},{body:_(({data:e})=>[n("div",it,[T((s(),a("span",{onClick:I=>t.gotoHashExplorer(e.hash),class:"text-txs text-blue-primary cursor-pointer"},[g(i(e.hash.substring(0,20))+"...",1)],8,lt)),[[y,e.hash,void 0,{bottom:!0}]]),V(f,{icon:"copy",title:r.$t("general.copy"),onClick:I=>t.copy(e.hash),class:"ml-0.5 w-5 h-5 text-blue-link cursor-pointer"},null,8,["title","onClick"])])]),_:1},8,["header"])):d("v-if",!0),h.selectedGroupType===t.transactionGroupType.CONFIRMED&&t.wideScreen?(s(),v(p,{key:4,field:"timestamp",header:r.$t("dashboard.timestamp"),headerStyle:"width:110px"},{body:_(({data:e})=>[n("span",ct,i(t.convertLocalTime(e.timestamp)),1)]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:5,field:"type",header:r.$t("dashboard.type"),headerStyle:"width:110px"},{body:_(({data:e})=>[n("span",dt,i(e.type),1)]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:6,field:"signer",header:r.$t("general.sender"),headerStyle:"width:110px"},{body:_(({data:e})=>[e.sender===""||e.sender===null?(s(),a("span",pt)):T((s(),a("span",ut,[n("a",{href:t.getPublicKeyExplorerUrl(e.sender),target:"_blank"},i(t.walletState.currentLoggedInWallet?t.walletState.currentLoggedInWallet.convertAddressToNamePretty(e.sender).substring(0,20):""),9,yt)])),[[y,t.Helper.createAddress(e.sender).pretty(),void 0,{bottom:!0}]])]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:7,field:"recipient",header:r.$t("general.recipient"),headerStyle:"width:110px"},{body:_(({data:e})=>[e.recipient===""||e.recipient===null?(s(),a("span",_t)):e.recipientNamespaceName?T((s(),a("span",ht,[g(i(e.recipientNamespaceName),1)])),[[y,t.Helper.createAddress(e.recipient).pretty(),void 0,{bottom:!0}]]):T((s(),a("span",vt,[g(i(t.walletState.currentLoggedInWallet?t.walletState.currentLoggedInWallet.convertAddressToNamePretty(e.recipient).substring(0,20):""),1)])),[[y,t.Helper.createAddress(e.recipient).pretty(),void 0,{bottom:!0}]])]),_:1},8,["header"])):d("v-if",!0),h.selectedGroupType===t.transactionGroupType.CONFIRMED&&t.wideScreen?(s(),v(p,{key:8,header:r.$t("dashboard.txFee"),headerStyle:"width:90px"},{body:_(({data:e})=>[n("div",mt,[g(i(e.fee)+" ",1),e.fee?(s(),a("b",gt,i(t.nativeTokenName),1)):d("v-if",!0)])]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:9,header:r.$t("general.amount"),headerStyle:"width:90px"},{body:_(({data:e})=>[n("div",Tt,[g(i(e.amountTransfer?e.amountTransfer:"-")+" ",1),e.amountTransfer?(s(),a("b",ft,i(t.nativeTokenName),1)):d("v-if",!0)])]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:10,header:r.$t("general.sda"),headerStyle:"width:40px"},{body:_(({data:e})=>[n("div",bt,[t.checkOtherAsset(e.sda)?T((s(),a("img",xt,null,512)),[[y,{value:"<tiptitle>"+r.$t("general.sdaFull")+"</tiptitle><tiptext>"+t.displaySDAs(e.sda)+"</tiptext>",escape:!0},void 0,{left:!0}]]):(s(),a("span",At,"-"))])]),_:1},8,["header"])):d("v-if",!0),t.wideScreen?(s(),v(p,{key:11,header:r.$t("general.message"),headerStyle:"width:40px"},{body:_(({data:e})=>[n("div",kt,[e.message&&e.messageType!==1?T((s(),a("img",wt,null,512)),[[y,"<tiptitle>"+e.messageTypeTitle+"</tiptitle><tiptext>"+e.message+"</tiptext>",void 0,{left:!0}]]):e.message&&e.messageType!==0?(s(),v(x,{key:1,messageTypeTitle:e.messageTypeTitle,message:e.message,recipientAddress:e.recipient,initiator:e.initiator},null,8,["messageTypeTitle","message","recipientAddress","initiator"])):(s(),a("div",Et,"-"))])]),_:1},8,["header"])):d("v-if",!0)]),_:1},8,["value"])])}const Ut=X(De,[["render",St],["__scopeId","data-v-3611ca65"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/dashboard/components/TransactionDataTable/MixedTxnDataTable.vue"]]);export{Re as D,Ut as M,fe as T,Ot as a};