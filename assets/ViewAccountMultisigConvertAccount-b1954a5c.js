import{_ as De,u as Me,l as Ee,r as u,w as P,H as V,B as g,c as _,n as q,S as ie,a as L,z as I,i as x,o as N,b as D,e as a,m as k,t as h,f as z,F as Ue,g as Ke,v as ce,ar as Ve,O as ue,R as de,x as Le,h as Be,W as ve,I as We,J as Oe}from"./index-f0fab120.js";import{_ as je}from"./PasswordInput.vue_vue_type_script_setup_true_lang-50f7a698.js";import{T as Re}from"./TextInput-806b984f.js";import{_ as He}from"./TransactionFeeDisplay.vue_vue_type_script_setup_true_lang-2b2b53a9.js";import{T as qe}from"./TextInputClean-5d304c85.js";import{M as J}from"./multisigUtils-0873cd27.js";import{_ as ze}from"./SelectAccountAndContact.vue_vue_type_script_setup_true_lang-c1c48abe.js";import{A as Je,_ as Ze}from"./AccountTabs.vue_vue_type_script_setup_true_lang-f659e8e4.js";import{T as le}from"./transactionState-563383b5.js";import{_ as Ge}from"./icon-delete-red-ce8ded12.js";import"./proximax-logo-ecfc3767.js";import"./jdenticon-module-f8a9db48.js";import"./functions-f2e6f536.js";import"./icon-key-5b3f7dda.js";const Qe={name:"ViewConvertAccountMultisig",components:{PasswordInput:je,TextInput:Re,TextInputClean:qe,SelectAccountAndContact:ze,AccountComponent:Je,AccountTabs:Ze,TransactionFeeDisplay:He},props:{address:String},setup(n){const{t:l}=Me(),U=Ee();Be().appContext.config.globalProperties.emitter;const d=u(""),B=u(""),M=u(!1),S=u(""),Z=u(!1),W="^[^ ]{8,}$",f=u(1),b=u(1),m=u(0),p=u(0),G="^[0-9A-Fa-f]{64}$",i=u([]),s=u([]),r=u([]),y=u([]),w=u([]),Q=u([]),K=u(!1),me=u(!1),O=P.currentLoggedInWallet?P.currentLoggedInWallet.selectDefaultAccount():null,pe=u(O?O.address:""),ge=u(V.toCurrencyFormat(O?O.balance:0,g.nativeToken.divisibility)),X=_(()=>V.convertToCurrency(q.currentNetworkProfileConfig.lockedFundsPerAggregate,g.nativeToken.divisibility)),Y=_(()=>q.currentNetworkProfile?V.convertToExact(ie.getLockFundFee(),g.nativeToken.divisibility):0),j=u(0),v=_(()=>P.currentLoggedInWallet?P.currentLoggedInWallet.accounts.find(e=>e.address===n.address):null);let $=_(()=>{if(v.value)return J.checkIsMultiSig(v.value.address)}),R=()=>{v.value&&(j.value=J.getAggregateFee(v.value.publicKey,i.value,f.value,b.value))};R();const E=_(()=>{let e=g.nativeToken.divisibility;return e==0?Math.trunc(parseFloat(j.value)+parseFloat(X.value)+Y.value):Math.round((parseFloat(j.value)+parseFloat(X.value)+Y.value)*Math.pow(10,e))/Math.pow(10,e)}),fe=_(()=>g.nativeToken.label),be=_(()=>g.nativeToken.divisibility);_(()=>P.currentLoggedInWallet?V.toCurrencyFormat(v.value.balance,be.value):"0");const se=_(()=>{if(!v.value)return!1;const e=P.currentLoggedInWallet;let o=e.accounts.map(A=>({name:A.name,publicKey:A.publicKey})),c=e.contacts;var C=[],T=0;return C.push({key:"0",label:l("general.ownerAcc"),selectable:!1,children:[]}),o.forEach(A=>{C[0].children.push({key:"0-"+T.toString(),label:A.name,data:A.publicKey}),T++}),T=0,C.push({key:"1",label:l("general.contact"),selectable:!1,children:[]}),c!=null&&c.forEach(A=>{C[1].children.push({key:"1-"+T.toString(),label:A.name,data:A.address}),T++}),C});function ye(e,o){ne(o),r.value[o]=e.label,e.key[0]=="1"?_e(e.data,o):i.value[o]=e.data,i.value[o]=e.data,Q.value[o]=!1,s.value[o][e.key]=!0,e.selectable=!1}function _e(e,o){try{J.verifyContactPublicKey(e).then(c=>{c.status==!0?i.value[o]=c.publicKey:d.value=l("multisig.noPublicKey")})}catch{d.value=l("multisig.noPublicKey")}}const ne=e=>{if(Object.keys(s.value[e]).length!==0){let o=Object.keys(s.value[e])[0].split("-");se.value[o[0]].children[o[1]].selectable=!0,s.value[e]={}}},he=_(()=>$.value||K.value||!S.value.match(W)||i.value.length==0||d.value||w.value.every(e=>e==!1)==!1||b.value==0||f.value==0||v.value.balance<E.value),we=_(()=>{if(!v.value)return!1;var e=!1;if(v.value.balance>=E.value&&!K.value){for(var o=0;o<i.value.length;o++)if(w.value[o]!=""){e=!0;break}else if(i.value[o].length<40){e=!0;break}}else e=!0;return e}),re=()=>{i.value=[],y.value=[],w.value=[],S.value="",f.value=1,m.value=0,b.value=1,p.value=0},Ae=async()=>{const e=P.currentLoggedInWallet;if(!ve.verifyWalletPassword(e.name,q.chainNetworkName,S.value))B.value=l("general.walletPasswordInvalid",{name:P.currentLoggedInWallet.name});else{let c={};const C=[],T=e.accounts.find(F=>F.name===v.value.name);if(!T)throw new Error("Account not found");const A=ve.decryptPrivateKey(new I.Password(S.value),T.encrypted,T.iv),Ie=I.Account.createFromPrivateKey(A,g.networkType,1);if(!g.chainAPI)throw new Error("Service unavailable");let H=null;for(const F of i.value){if(F.length==64)H=I.PublicAccount.createFromPublicKey(F,g.networkType);else if(F.length==40||F.length==46){const Ne=I.Address.createFromRawAddress(F);try{const ae=await g.chainAPI.accountAPI.getAccountInfo(Ne);H=I.PublicAccount.createFromPublicKey(ae.publicKey,g.networkType)}catch(ae){console.log(ae)}}H&&C.push(new I.MultisigCosignatoryModification(I.MultisigCosignatoryModificationType.Add,H))}if(!g.buildTxn)throw new Error("Service unavailable");const Fe=g.buildTxn.modifyMultisigAccountBuilder().minApprovalDelta(f.value).minRemovalDelta(b.value).modifications(C).build();c=ie.signTxnWithPassword(v.value.address,Ie.address.plain(),S.value,Fe),B.value="",re(),le.lockHashPayload=c.hashLockTxnPayload,le.transactionPayload=c.txnPayload,le.selectedAddress=n.address,U.push({name:"ViewConfirmTransaction"})}};L(()=>[...i.value],e=>{let o=!1;if(i.value.length>0)for(var c=0;c<i.value.length;c++)i.value[c].length==64?i.value[c]==v.value.publicKey&&o==!1?(o=!0,w.value[c]=!0,d.value=l("multisig.selectedAccErr")):!i.value[c].match(G)&&i.value[c].length==64?w.value[c]=!0:(w.value[c]=!1,Array.from(new Set(e)).length!=e.length?d.value=l("multisig.duplicatedCosigner"):o==!1&&(d.value="")):w.value[c]=!0;else d.value=""},{deep:!0}),L(()=>[...w.value],e=>{e.every(o=>o==!1)&&R()},{deep:!0});const xe=()=>{i.value.push(""),s.value.push({}),w.value.push(!1),m.value+=1,p.value+=1},ke=e=>{m.value>0&&(m.value-=1),p.value>0&&(p.value-=1),b.value>p.value&&(b.value=p.value),f.value>m.value&&(f.value=m.value),ne(e),i.value.splice(e,1),s.value.splice(e,1),r.value.splice(e,1),Q.value.splice(e,1),y.value.splice(e,1),w.value.splice(e,1)},Ce=e=>{f.value*10*~~(m.value/10)+e.charCode-48>m.value&&e.preventDefault()};let ee=l("multisig.deletionExceedMax"),te=l("multisig.approvalExceedMax");L(f,e=>{R(),m.value==0&&e>1||e>m.value&&e!=1&&m.value!=0?d.value=te:m.value>0&&e<=0?d.value=l("multisig.approvalAtLeastOne"):b.value>p.value&&b.value!=1&&p.value!=0?d.value=ee:d.value=""});const Te=e=>{b.value*10*~~(p.value/10)+e.charCode-48>p.value&&e.preventDefault()};L(b,e=>{R(),p.value==0&&e>1||e>p.value&&e!=1&&p.value!=0?d.value=ee:p.value>0&&e<=0?d.value=l("multisig.deletionAtLeastOne"):f.value>m.value&&f.value!=1&&m.value!=0?d.value=te:d.value=""});const Se=_(()=>K.value||$.value);v.value&&J.onPartial(I.PublicAccount.createFromPublicKey(v.value.publicKey,g.networkType)).then(e=>K.value=e),v.value&&v.value.balance<E.value&&(M.value=!0),L(v,e=>{e&&(e.balance<E.value?M.value=!0:M.value=!1)});const Pe=_(()=>V.amountFormatterSimple(E.value,0));return{networkState:q,toggleContact:Q,contact:se,space:me,currentNativeTokenName:fe,contactName:r,err:d,disableSend:he,numApproveTransaction:f,numDeleteUser:b,maxNumApproveTransaction:m,maxNumDeleteUser:p,fundStatus:M,acc:v,passwd:S,showPasswdError:Z,showAddressError:w,addCoSig:xe,coSign:i,addCoSigButton:we,selectedNode:s,deleteCoSigAddressInput:ke,onNodeSelect:ye,selectedAddresses:y,clear:re,convertAccount:Ae,disabledPassword:Se,onPartial:K,isMultisig:$,passwdPattern:W,validateApproval:Ce,validateDelete:Te,lockFundCurrency:X,lockFundTxFee:Y,aggregateFee:j,totalFee:E,totalFeeFormatted:Pe,selectedAccAdd:pe,accBalance:ge,passwordErr:B}}},oe=n=>(We("data-v-9eed6371"),n=n(),Oe(),n),Xe={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},Ye={class:"border-2 border-t-0 lg:grid lg:grid-cols-3"},$e={class:"lg:col-span-2 py-6 pr-6"},et={class:"text-xs font-semibold pl-6"},tt={class:"pl-6"},at={key:0,class:"error error_box mb-5"},lt={key:1,class:"error error_box mb-5"},ot=oe(()=>a("div",{class:"mt-4"},null,-1)),st={class:"flex flex-col gap-2"},nt={class:"flex"},rt=["onClick"],it={key:0,class:"mt-16"},ct=["onClick"],ut={class:"text-xxs text-blue-primary font-semibold uppercase"},dt={key:0},vt=["disabled"],mt=oe(()=>a("div",{class:"ml-6 my-7 gray-line"},null,-1)),pt={class:"pl-6 text-xs font-semibold mb-3"},gt={class:"flex gap-2 pl-6"},ft={class:"border w-6/12"},bt={class:"border-b-2 text-xxs text-center py-1 uppercase"},yt={class:"flex justify-around"},_t=["disabled"],ht=["max"],wt=["disabled"],At={class:"text-xxs border-t-2 text-center py-1 uppercase"},xt={class:"border w-6/12"},kt={class:"border-b-2 text-xxs text-center py-1 uppercase"},Ct={class:"flex justify-around"},Tt=["disabled"],St=["max"],Pt=["disabled"],It={class:"text-xxs border-t-2 text-center py-1 uppercase"},Ft={class:"bg-navy-primary p-6 lg:col-span-1"},Nt=oe(()=>a("div",{class:"mt-5"},null,-1)),Dt={class:"font-semibold text-xs text-white mb-1.5"},Mt={class:"mt-3"},Et=["disabled"],Ut={class:"text-center"};function Kt(n,l,U,t,d,B){const M=x("AccountComponent"),S=x("AccountTabs"),Z=x("TextInput"),W=x("TextInputClean"),f=x("font-awesome-icon"),b=x("SelectAccountAndContact"),m=x("Sidebar"),p=x("TransactionFeeDisplay"),G=x("PasswordInput"),i=x("router-link");return N(),D("div",null,[a("div",Xe,[k(M,{address:U.address,class:"mb-6"},null,8,["address"]),k(S,{address:U.address,selected:"multisig"},null,8,["address"]),a("div",Ye,[a("div",$e,[a("div",et,h(n.$t("multisig.manageCosignatories")),1),a("div",tt,[t.err!=""?(N(),D("div",at,h(t.err),1)):z("",!0),t.passwordErr!=""?(N(),D("div",lt,h(t.passwordErr),1)):z("",!0)]),ot,a("div",st,[(N(!0),D(Ue,null,Ke(t.coSign,(s,r)=>(N(),D("div",{key:r},[a("div",nt,[a("img",{src:Ge,onClick:y=>t.deleteCoSigAddressInput(r),class:"w-4 h-4 text-gray-500 cursor-pointer mt-3 mx-1"},null,8,rt),k(Z,{class:"w-5/12 mr-2",placeholder:n.$t("multisig.cosignatory")+`${r+1}`,modelValue:t.contactName[r],"onUpdate:modelValue":y=>t.contactName[r]=y,disabled:!0},null,8,["placeholder","modelValue","onUpdate:modelValue"]),k(W,{class:"w-7/12 mr-2",placeholder:n.$t("general.publicKey"),errorMessage:n.$t("general.invalidInput"),showError:t.showAddressError[r],modelValue:t.coSign[r],"onUpdate:modelValue":y=>t.coSign[r]=y},null,8,["placeholder","errorMessage","showError","modelValue","onUpdate:modelValue"]),t.showAddressError[r]==!0?(N(),D("div",it)):z("",!0),a("div",{onClick:y=>t.toggleContact[r]=!t.toggleContact[r],class:"border cursor-pointer flex flex-col justify-center p-2",style:{height:"2.66rem"}},[k(f,{icon:"id-card-alt",class:"text-blue-primary ml-auto mr-auto"}),a("div",ut,h(n.$t("general.select")),1)],8,ct)]),t.toggleContact[r]?(N(),D("div",dt,[k(m,{visible:t.toggleContact[r],"onUpdate:visible":y=>t.toggleContact[r]=y,baseZIndex:1e4,position:"full"},{default:ce(()=>[k(b,Ve(r,{contacts:t.contact,index:r,selectedNode:t.selectedNode[r],onNodeSelect:y=>t.onNodeSelect(y,r)}),null,16,["contacts","index","selectedNode","onNodeSelect"])]),_:2},1032,["visible","onUpdate:visible"])])):z("",!0)]))),128))]),a("button",{class:"pl-6 font-semibold text-xs mt-1 text-blue-primary outline-none focus:outline-none disabled:opacity-50 disabled:cursor-auto",onClick:l[0]||(l[0]=(...s)=>t.addCoSig&&t.addCoSig(...s)),disabled:t.addCoSigButton},"+"+h(n.$t("multisig.addNewCosignatory")),9,vt),mt,a("div",pt,h(n.$t("general.scheme")),1),a("div",gt,[a("div",ft,[a("div",bt,h(n.$t("multisig.transactionsApproval")),1),a("div",yt,[a("button",{class:"text-blue-primary disabled:opacity-50",onClick:l[1]||(l[1]=s=>t.numApproveTransaction--),disabled:t.numApproveTransaction<=0},"-",8,_t),ue(a("input",{type:"number",class:"w-4 outline-none text-xs font-bold",min:0,onKeypress:l[2]||(l[2]=(...s)=>t.validateApproval&&t.validateApproval(...s)),max:t.maxNumApproveTransaction,"onUpdate:modelValue":l[3]||(l[3]=s=>t.numApproveTransaction=s)},null,40,ht),[[de,t.numApproveTransaction]]),a("button",{class:"text-blue-primary disabled:opacity-50",disabled:t.numApproveTransaction>=t.maxNumApproveTransaction,onClick:l[4]||(l[4]=s=>t.numApproveTransaction++)},"+",8,wt)]),a("div",At,h(n.$t("multisig.ofCosignatories",{value:t.maxNumApproveTransaction})),1)]),a("div",xt,[a("div",kt,h(n.$t("multisig.accountDeletionApproval")),1),a("div",Ct,[a("button",{class:"text-blue-primary disabled:opacity-50",onClick:l[5]||(l[5]=s=>t.numDeleteUser--),disabled:t.numDeleteUser<=0},"-",8,Tt),ue(a("input",{type:"number",class:"w-4 outline-none text-xs font-bold",min:0,onKeypress:l[6]||(l[6]=(...s)=>t.validateDelete&&t.validateDelete(...s)),max:t.maxNumDeleteUser,"onUpdate:modelValue":l[7]||(l[7]=s=>t.numDeleteUser=s)},null,40,St),[[de,t.numDeleteUser]]),a("button",{class:"text-blue-primary disabled:opacity-50",disabled:t.numDeleteUser>=t.maxNumDeleteUser,onClick:l[8]||(l[8]=s=>t.numDeleteUser++)},"+",8,Pt)]),a("div",It,h(n.$t("multisig.ofCosignatories",{value:t.maxNumDeleteUser})),1)])])]),a("div",Ft,[k(p,{"fund-status":t.fundStatus,"is-multisig-already":t.isMultisig,"on-partial":t.onPartial,"transaction-fee":String(t.aggregateFee),"total-fee-formatted":t.totalFeeFormatted,"lock-fund-currency-convert":t.lockFundCurrency,"lock-fund-tx-fee-convert":String(t.lockFundTxFee),balance:t.accBalance,"selected-acc-add":t.selectedAccAdd},null,8,["fund-status","is-multisig-already","on-partial","transaction-fee","total-fee-formatted","lock-fund-currency-convert","lock-fund-tx-fee-convert","balance","selected-acc-add"]),Nt,a("div",Dt,h(n.$t("general.enterPasswordContinue")),1),k(G,{placeholder:n.$t("general.enterPassword"),errorMessage:n.$t("general.passwordRequired"),showError:t.showPasswdError,modelValue:t.passwd,"onUpdate:modelValue":l[9]||(l[9]=s=>t.passwd=s),disabled:t.disabledPassword},null,8,["placeholder","errorMessage","showError","modelValue","disabled"]),a("div",Mt,[a("button",{type:"submit",class:"w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",onClick:l[10]||(l[10]=s=>t.convertAccount()),disabled:t.disableSend},h(n.$t("multisig.updateCosignatories")),9,Et)]),a("div",Ut,[k(i,{to:{name:"ViewMultisigHome",params:{address:U.address}},class:"content-center text-xs text-white underline"},{default:ce(()=>[Le(h(n.$t("general.cancel")),1)]),_:1},8,["to"])])])])])])}const Yt=De(Qe,[["render",Kt],["__scopeId","data-v-9eed6371"]]);export{Yt as default};