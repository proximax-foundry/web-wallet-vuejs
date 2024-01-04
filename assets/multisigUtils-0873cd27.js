import{W as b,w as v,n as w,z as t,B as o,S as E}from"./index-f0fab120.js";const F=class C{static verifyContactPublicKey(n){const r="0000000000000000000000000000000000000000000000000000000000000000";return new Promise(c=>{b.getAccInfo(n).then(a=>{a.publicKey==r?(console.warn("The receiver's public key is not valid for sending encrypted messages"),c({status:!1,publicKey:a.publicKey})):c({status:!0,publicKey:a.publicKey})},a=>{console.warn("Err: "+a),c({status:!1,publicKey:""})})})}static async convertAccount(n,r,c,i,a){const d=v.currentLoggedInWallet;if(!d)throw new Error("Service unavailable");const l=b.verifyWalletPassword(d.name,w.chainNetworkName,a);if(!l)return l;const u=[],e=d.accounts.find(p=>p.name===i);if(!e)throw new Error("Account not found");const f=b.decryptPrivateKey(new t.Password(a),e.encrypted,e.iv),s=t.Account.createFromPrivateKey(f,o.networkType,1);if(!o.chainAPI)throw new Error("Service unavailable");let y=null;for(const p of n){if(p.length==64)y=t.PublicAccount.createFromPublicKey(p,o.networkType);else if(p.length==40||p.length==46){const k=t.Address.createFromRawAddress(p);try{const M=await o.chainAPI.accountAPI.getAccountInfo(k);y=t.PublicAccount.createFromPublicKey(M.publicKey,o.networkType)}catch(M){console.log(M)}}y&&u.push(new t.MultisigCosignatoryModification(t.MultisigCosignatoryModificationType.Add,y))}if(!o.buildTxn)throw new Error("Service unavailable");const m=o.buildTxn,T=m.modifyMultisigAccountBuilder().minApprovalDelta(r).minRemovalDelta(c).modifications(u).build(),I=m.aggregateBondedBuilder().innerTransactions([T.toAggregateV1(s.publicAccount)]).build();if(!w.currentNetworkProfile)throw new Error("Service unavailable");const g=s.preV2Sign(I,w.currentNetworkProfile.generationHash),P=E.lockFundTx(g),K=s.preV2Sign(P,w.currentNetworkProfile.generationHash);return E.announceLF_AND_addAutoAnnounceABT(K,g),l}static getAggregateBondedTransactions(n){return b.getAggregateBondedTransactions(n)}static async onPartial(n){const r=await C.getAggregateBondedTransactions(n);if(r.length){for(const c of r)for(let i=0;i<c.innerTransactions.length;i++)if(c.innerTransactions[i].signer.publicKey===n.publicKey)return!0}return!1}static getMultisigAccountGraphInfo(n){return b.getMultisigAccGraphInfo(t.Address.createFromRawAddress(n))}static checkIsMultiSig(n){const r=v.currentLoggedInWallet;if(!r)throw new Error("Service unavailable");const c=r.accounts.find(i=>i.address===n)||r.others.find(i=>i.address===n);if(!c)throw new Error("Account not found");return c.getDirectParentMultisig().length>0}static checkHasMultiSig(n){const r=v.currentLoggedInWallet;if(!r)throw new Error("Service unavailable");const c=r.accounts.find(i=>i.address===n)||r.others.find(i=>i.address===n);if(!c)throw new Error("Account not found");return c.multisigInfo.filter(i=>i.level==-1).length>0}static getCosignerInWallet(n){if(!v.currentLoggedInWallet)throw new Error("Service unavailable");if(!w.currentNetworkProfileConfig)throw new Error("Service unavailable");const r=v.currentLoggedInWallet.accounts.map(e=>({publicKey:e.publicKey,isMultisig:!!e.getDirectParentMultisig().length,multisigInfo:e.multisigInfo})),c=v.currentLoggedInWallet.others.filter(e=>e.type==="MULTISIG").map(e=>({publicKey:e.publicKey,isMultisig:!0,multisigInfo:e.multisigInfo})),i=r.concat(c),a=i.find(e=>e.publicKey==n);if(!a)throw new Error("Account not found");const d=[];i.forEach(e=>{!e.isMultisig&&e.multisigInfo.filter(f=>f.level==-1).length>0&&d.push(e)});const l=w.currentNetworkProfileConfig.maxMultisigDepth;if(!l)throw new Error("Service unavailable");const u=[];for(let e=1;e<=l;e++)a.multisigInfo.filter(s=>s.level==e).forEach(s=>{d.forEach(y=>{y.publicKey==s.publicKey&&u.push(s.publicKey)})});return{hasCosigner:u.length>0,cosignerList:u}}static async modifyMultisigAccount(n,r,c,i,a,d,l){const u=v.currentLoggedInWallet;if(!u)throw new Error("Service unavailable");if(!o.chainAPI)throw new Error("Service unavailable");if(!b.verifyWalletPassword(u.name,w.chainNetworkName,l))return!1;const e=[],f=[];for(const[h,A]of r.entries()){if(A.length==64)f[h]=t.PublicAccount.createFromPublicKey(A,o.networkType);else if(A.length==40||A.length==46){const L=t.Address.createFromRawAddress(A);try{const B=await o.chainAPI.accountAPI.getAccountInfo(L);f[h]=t.PublicAccount.createFromPublicKey(B.publicKey,o.networkType)}catch(B){console.log(B)}}e.push(new t.MultisigCosignatoryModification(t.MultisigCosignatoryModificationType.Add,f[h]))}c.forEach((h,A)=>{f[r.length+A]=t.PublicAccount.createFromPublicKey(h,o.networkType),e.push(new t.MultisigCosignatoryModification(t.MultisigCosignatoryModificationType.Remove,f[r.length+A]))});const s=d.multisigInfo.find(h=>h.level===0);if(!s)throw new Error("Account not found");const y=i-s.minApproval,m=a-s.minRemoval;if(!o.buildTxn)throw new Error("Service unavailable");const T=o.buildTxn,I=T.modifyMultisigAccountBuilder().minApprovalDelta(y).minRemovalDelta(m).modifications(e).build(),g=t.PublicAccount.createFromPublicKey(d.publicKey,o.networkType),P=T.aggregateBondedBuilder().innerTransactions([I.toAggregateV1(g)]).build(),K=u.accounts.find(h=>h.publicKey==n);if(!K)throw new Error("Account not found");if(!w.currentNetworkProfile)throw new Error("Service unavailable");const p=b.decryptPrivateKey(new t.Password(l),K.encrypted,K.iv),k=t.Account.createFromPrivateKey(p,o.networkType,1),M=k.preV2Sign(P,w.currentNetworkProfile.generationHash),N=E.lockFundTx(M),x=k.preV2Sign(N,w.currentNetworkProfile.generationHash);return E.announceLF_AND_addAutoAnnounceABT(x,M),!0}};F.getAggregateFee=(S,n,r,c,i)=>{const a=v.currentLoggedInWallet;if(!o.chainAPI||!a)throw new Error("Service unavailable");const d=a.accounts.find(g=>g.publicKey==S)||a.others.find(g=>g.publicKey==S);if(!d)throw new Error("Account not found");const l=[];for(const g of n)l.push(new t.MultisigCosignatoryModification(t.MultisigCosignatoryModificationType.Add,t.PublicAccount.createFromPublicKey("0".repeat(64),o.networkType)));const u=[];if(i&&i.forEach((g,P)=>{u[n.length+P]=t.PublicAccount.createFromPublicKey(g,o.networkType),l.push(new t.MultisigCosignatoryModification(t.MultisigCosignatoryModificationType.Remove,u[n.length+P]))}),!o.buildTxn)throw new Error("Service unavailable");const e=o.buildTxn,f=t.PublicAccount.createFromPublicKey(S,o.networkType),s=d.multisigInfo.find(g=>g.level===0);if(!s)throw new Error("Account not found");const y=r-s.minApproval,m=c-s.minRemoval,T=e.modifyMultisigAccountBuilder().minApprovalDelta(y).minRemovalDelta(m).modifications(l).build();return e.aggregateBondedBuilder().innerTransactions([T.toAggregateV1(f)]).build().maxFee.compact()/Math.pow(10,o.nativeToken.divisibility)};let W=F;export{W as M};