import{d as _,r as P,k as M,o as v,m as S,_ as H,B as t,E as l,ap as N,ao as C,n as w,aq as y,g as B,I as F,c as U,b as K,e as k,t as I,s as E}from"./index-f81de996.js";import{t as D}from"./jdenticon-module-7161194d.js";const L=_({__name:"SelectMultisigInput",props:{account:{type:Array,required:!0},selectedMultisig:{type:Object,required:!0}},emits:["select"],setup(T,{emit:u}){const n=P({}),m=i=>{u("select",i)},s=i=>{n.value[i.key]=!0},g=()=>{n.value={}};return(i,x)=>{const o=M("Tree");return v(),S(o,{value:T.account,selectionMode:"single","onUpdate:selectionKeys":T.selectedMultisig,expandedKeys:n.value,filter:!0,filterMode:"strict",onNodeSelect:m,onNodeExpand:s,onNodeCollapse:g},null,8,["value","onUpdate:selectionKeys","expandedKeys"])}}}),Q=H(L,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/components/SelectMultisigInput.vue"]]);let j=[{namespace:"prx.xpx",name:"XPX"},{namespace:"prx.metx",name:"METX"},{namespace:"xarcade.xar",name:"XAR"}];class Y{static createAccount(u){return t.Account.createFromPrivateKey(u,l.networkType,1)}static async scanAsset(u){let n=t.PublicAccount.createFromPublicKey(u,l.networkType);try{let m=await l.chainAPI.accountAPI.getAccountInfo(n.address),s=m.mosaics.map(o=>o.id),g=await l.chainAPI.assetAPI.getMosaics(s),i=await l.chainAPI.assetAPI.getMosaicsNames(s);return m.mosaics.map(o=>{let d=o.id.toHex(),c=g.find(h=>h.mosaicId.toHex()===d).divisibility,e=i.find(h=>h.mosaicId.toHex()===d).names,p=e.length?e[0].name:"",a=j.find(h=>h.namespace===p),r={id:d,amount:c?o.amount.compact()/Math.pow(10,c):o.amount.compact(),divisibility:c,namespaceName:p};return r.label=a?a.name:r.namespaceName?r.namespaceName:r.id.toUpperCase(),r})}catch{return[]}}static createDistributeAggregateTransactions(u,n,m,s){let g=t.PublicAccount.createFromPublicKey(u,l.networkType),i=[],x=Math.ceil(n.length/m),o=[],d=Math.pow(10,s.divisibility),c=s.namespaceName?new t.NamespaceId(s.namespaceName):new t.MosaicId(s.id);for(let e=0;e<n.length;++e){let p=N(C(n[e].amount),d),a=Number(p.toString()),r;n[e].publicKeyOrAddress.length===64?r=t.PublicAccount.createFromPublicKey(n[e].publicKeyOrAddress,l.networkType).address:r=t.Address.createFromRawAddress(n[e].publicKeyOrAddress);let h=new t.Mosaic(c,t.UInt64.fromUint(a)),f;n[e].message?f=t.PlainMessage.create(n[e].message):f=t.EmptyMessage;let A=l.buildTxn.transfer(r,f,[h]);o.push(A)}for(let e=0;e<x;++e){let p=e*m,a=(e+1)*m,r=o.slice(p,a),h=[];for(let A=0;A<r.length;++A)h.push(r[A].toAggregateV1(g));let f=l.buildTxn.aggregateBonded(h);i.push(f)}return i}static getLockFundTransactionFee(){const u=w.currentNetworkProfileConfig.lockedFundsPerAggregate??0;let n=new t.TransactionHash("0".repeat(64),t.TransactionType.AGGREGATE_BONDED_V1);return l.buildTxn.hashLock(new t.Mosaic(new t.NamespaceId("prx.xpx"),t.UInt64.fromUint(u)),t.UInt64.fromUint(y.getABTMaxSafeDuration()),n).maxFee.compact()}static async signAllAbtAndAnnounce(u,n){const m=w.currentNetworkProfileConfig.lockedFundsPerAggregate;let s=[],g=[],i=[],x=[];for(let c=0;c<u.length;++c){let e=n.preV2Sign(u[c],w.currentNetworkProfile.generationHash);s.push(e);let p=l.buildTxn.hashLock(new t.Mosaic(new t.NamespaceId(l.nativeToken.fullNamespace.trim()),t.UInt64.fromUint(m)),t.UInt64.fromUint(y.getABTMaxSafeDuration()),e),a=n.preV2Sign(p,w.currentNetworkProfile.generationHash);g.push(a),i.push({txnHash:e.hash,block:null}),i.push({txnHash:a.hash,block:null}),x.push({txnHash:e.hash,hashLockHash:a.hash})}let o=!1;for(let c=0;c<g.length;++c)await l.chainAPI.transactionAPI.announce(g[c]);console.log("All LockHash Txn announced, pending ABT announcement...");let d=[];for(;!o;){await new Promise(a=>setTimeout(a,15e3)),console.log("Checking LockHash Txn confirmation...");let e=await l.chainAPI.chainAPI.getBlockchainHeight(),p=s.filter(a=>!d.includes(a.hash));for(let a=0;a<p.length;++a){let r=x.find(f=>f.txnHash===p[a].hash).hashLockHash,h=await l.chainAPI.transactionAPI.getTransactionStatus(r);if(h.group===t.TransactionGroupType.CONFIRMED){let f=h.height.compact(),A=i.find(b=>b.txnHash===r);A.block=f,e>=A.block+1&&(await l.chainAPI.transactionAPI.announceAggregateBonded(p[a]),d.push(p[a].hash))}}d.length===s.length&&(o=!0)}return d}}const O={class:"w-full h-16 mt-0 border border-gray-200 px-2 py-2 rounded-md"},R={class:"flex"},V=["innerHTML"],q={class:"flex flex-col ml-2 text-left"},G={class:"text-blue-primary font-semibold text-xxs uppercase",style:{"line-height":"9px"}},X={class:"mt-2 text-base font-bold"},$={class:"ml-auto mt-auto mb-auto mr-6"},W=_({__name:"MultisigInput",props:{selectDefaultAddress:{type:String,required:!0},selectDefaultName:{type:String,required:!0}},setup(T){const u=T,m=B().appContext.config.globalProperties.emitter;let s=new F("ThemeStyleConfig");s.init();let g=P(s.jdenticonConfig);const i=U(()=>D(u.selectDefaultAddress,25,g.value)),x=()=>{m.emit("CLOSE_MULTISIG")};return(o,d)=>{const c=M("font-awesome-icon");return v(),K("div",O,[k("div",R,[k("div",{innerHTML:i.value},null,8,V),k("div",q,[k("div",G,I(o.$t("transfer.transferFrom"))+" "+I(o.$t("general.multisig")),1),k("div",X,I(T.selectDefaultName),1)]),k("div",$,[E(c,{icon:"times",class:"delete-icon-style",onClick:d[0]||(d[0]=e=>x())})])])])}}}),Z=H(W,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/components/MultisigInput.vue"]]);export{Z as M,Q as S,Y as a};