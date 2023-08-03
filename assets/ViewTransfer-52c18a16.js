import{d as j,I as _e,c as E,w as K,r as $,k as z,o as m,b as p,f as I,s as C,z as R,e,t as d,C as L,i as de,O as ke,a as O,m as ce,A as u,E as v,P as we,Q as ee,l as Ae,_ as Be,B as $e,F as te,R as He,S as Ee,U as Ke,W as re,n as le,V as X,h as ue,u as qe,H as W,D as Ue,q as Re,X as je}from"./index-42fb6041.js";import{t as oe}from"./jdenticon-module-2412ea1e.js";import{_ as We}from"./SelectAccountAndContact.vue_vue_type_script_setup_true_lang-a1160fc0.js";import{_ as me}from"./proximax-logo-ecfc3767.js";import{_ as De}from"./PasswordInput.vue_vue_type_script_setup_true_lang-039a64c1.js";import{_ as Oe}from"./icon-red-x-a5511f99.js";import{_ as ze}from"./icon-green-tick-1b766454.js";const Xe={key:0,class:"text-blue-primary font-semibold uppercase text-xxs mt-3"},Ze={key:0,class:"account-item-value account-item"},Qe={class:"flex"},Ge=["innerHTML"],Je={class:"flex flex-col ml-2 text-left"},Ye=e("div",{class:"text-blue-primary font-semibold text-xxs uppercase",style:{"line-height":"9px"}}," Selected Account to create / initiate transfer",-1),et={class:"mt-1 text-tsm font-bold"},tt={class:"account-item"},lt={class:"flex"},st=["innerHTML"],at={class:"text-xs ml-2 font-semibold"},nt=j({__name:"SelectInputAccount",emits:["select-account","update:modelValue"],setup(i){const f=de().appContext.config.globalProperties.emitter;let g=new _e("ThemeStyleConfig");g.init();let l=g.jdenticonConfig;const o=E(()=>K.currentLoggedInWallet?[...K.currentLoggedInWallet.accounts.filter(_=>_.multisigInfo.length==0||_.multisigInfo.find(b=>b.level==0).cosignaturies.length==0)].map(_=>({value:_.address,label:K.currentLoggedInWallet.convertAddressToName(_.address,!0)})):[]),n=$(null),h=$(null),M=(w,_)=>{if(w==null&&_==null){n.value=null,f.emit("select-account",null);return}f.emit("select-account",_),n.value.label=w,n.value.value=_,h.value=oe(_,25,l)};return(w,_)=>{const b=z("Dropdown");return m(),p("div",null,[n.value?I("",!0):(m(),p("div",Xe,"Select Account to create / initiate transfer")),C(b,{showClear:!0,modelValue:n.value,"onUpdate:modelValue":_[0]||(_[0]=r=>n.value=r),style:{width:"100%"},options:o.value,filter:!0,filterFields:["label","value"],emptyFilterMessage:" ",onChange:_[1]||(_[1]=r=>{var x,c,a,k;M((x=r.value)==null?void 0:x.label,(c=r.value)==null?void 0:c.value),w.$emit("update:modelValue",(a=r.value)==null?void 0:a.value),w.$emit("select-account",(k=r.value)==null?void 0:k.value)})},{value:R(r=>[r.value?(m(),p("div",Ze,[e("div",Qe,[e("div",{innerHTML:h.value},null,8,Ge),e("div",Je,[Ye,e("div",et,d(r.value.label),1)])])])):I("",!0)]),option:R(r=>[e("div",tt,[e("div",lt,[e("div",{innerHTML:L(oe)(r.option.value,20,L(l))},null,8,st),e("div",at,d(r.option.label),1)])])]),_:1},8,["modelValue","options"])])}}}),ot={key:1,class:"text-xxs font-semibold uppercase mt-3 text-blue-primary"},it={key:0,class:"account-item-value account-item"},rt={class:"flex"},ct=["innerHTML"],ut={class:"flex flex-col ml-2 text-left"},dt=e("div",{class:"text-blue-primary font-semibold text-xxs uppercase",style:{"line-height":"9px"}}," Selected Multisig Account",-1),mt={class:"mt-1 text-tsm font-bold"},vt={class:"account-item"},pt={class:"flex items-center"},gt=["innerHTML"],ft={class:"text-xs ml-2 font-semibold"},bt=j({__name:"SelectInputMultisigAccount",props:{selectedAddress:{type:String,required:!1}},emits:["select-multisig-account","update:modelValue"],setup(i){const y=i,f=$(!1),{selectedAddress:g}=ke(y),l=$([]),n=de().appContext.config.globalProperties.emitter;let h=new _e("ThemeStyleConfig");h.init();let M=h.jdenticonConfig;const w=$(null);O(g,r=>{if(b(null,null),r==null){b(null,null),l.value=[];return}const x=K.currentLoggedInWallet.accounts.find(a=>a.address==r),c=x.multisigInfo.find(a=>a.level==0);l.value=c?[...x.multisigInfo].filter(a=>a.level<0).map(a=>{const F=[...K.currentLoggedInWallet.accounts,...K.currentLoggedInWallet.others].find(T=>T.publicKey==a.publicKey);return{label:F?K.currentLoggedInWallet.convertAddressToName(F.address):u.PublicAccount.createFromPublicKey(a.publicKey,v.networkType).address.plain(),value:u.PublicAccount.createFromPublicKey(a.publicKey,v.networkType).address.plain()}}):[]}),O(w,r=>{r==null&&(f.value=!1)});const _=$(null),b=(r,x)=>{if(r==null&&x==null){w.value=null,n.emit("select-multisig-account",null);return}n.emit("select-multisig-account",x),w.value.label=r,w.value.value=x,_.value=oe(x,25,M)};return(r,x)=>{const c=z("Dropdown");return m(),p("div",null,[l.value.length&&!f.value?(m(),p("button",{key:0,class:"blue-btn py-2 px-3 mt-3",onClick:x[0]||(x[0]=a=>f.value=!0)},"Select Multisig Account")):I("",!0),l.value.length&&f.value&&!w.value?(m(),p("div",ot,"Select Multisig Account")):I("",!0),f.value&&l.value.length?(m(),ce(c,{key:2,showClear:!0,modelValue:w.value,"onUpdate:modelValue":x[1]||(x[1]=a=>w.value=a),style:{width:"100%"},options:l.value,filter:!0,filterFields:["label","value"],emptyFilterMessage:" ",onChange:x[2]||(x[2]=a=>{var k,F,T,V;b((k=a.value)==null?void 0:k.label,(F=a.value)==null?void 0:F.value),r.$emit("update:modelValue",(T=a.value)==null?void 0:T.value),r.$emit("select-multisig-account",(V=a.value)==null?void 0:V.value)})},{value:R(a=>[a.value?(m(),p("div",it,[e("div",rt,[e("div",{innerHTML:_.value},null,8,ct),e("div",ut,[dt,e("div",mt,d(a.value.label),1)])])])):I("",!0)]),option:R(a=>[e("div",vt,[e("div",pt,[e("div",{innerHTML:L(oe)(a.option.value,20,L(M))},null,8,gt),e("div",ft,d(a.option.label),1)])])]),_:1},8,["modelValue","options"])):I("",!0)])}}}),ht={key:0},yt={class:"flex justify-between"},xt={class:"flex flex-col ml-2 text-left"},_t=e("div",{class:"text-blue-primary font-semibold text-xxs uppercase",style:{"line-height":"9px"}}," Selected Asset",-1),kt={class:"mt-1 text-tsm font-bold"},wt={class:"mt-1 text-tsm font-bold"},At={class:"account-item"},$t={class:"flex justify-between"},Tt={class:"mt-1 text-tsm font-bold"},It={class:"mt-1 text-tsm font-bold"},Mt=j({__name:"SelectInputAsset",props:{index:{type:Number,required:!0},assetOptions:{type:Object,required:!0},selectedAssets:{type:Object,required:!1}},emits:["select-asset","update:modelValue"],setup(i){const y=i,f=[{namespace:"prx.xpx",name:"XPX"},{namespace:"prx.metx",name:"METX"},{namespace:"xarcade.xar",name:"XAR"}],g=b=>{const r=f.find(x=>x.namespace==b);return r?r.name:b},{assetOptions:l,selectedAssets:o,index:n}=ke(y),h=$(!1),M=E(()=>{const b=new Set(o.value.map(r=>r.id));return l.value.filter(r=>!b.has(r.id))}),w=async b=>{if(h.value)return;h.value=!0;const{first:r,last:x}=b,c=[];for(let N=r;N<x;N++)l.value[N].hasUpdated||c.push(new u.MosaicId(l.value[N].id));if(!c.length){h.value=!1;return}const a=await v.chainAPI.assetAPI.getMosaicsNames(c),k=await v.chainAPI.assetAPI.getMosaics(c);let F=0,T=0;const V=new Map;a.forEach((N,B)=>{V.set(N.mosaicId.toHex(),B)}),k.sort((N,B)=>{const A=V.get(N.mosaicId.toHex()),q=V.get(B.mosaicId.toHex());return A-q});for(let N=r;N<x;N++){if(!a[F])continue;const B=l.value.find(A=>A.id==a[F].mosaicId.toHex());B&&(B.namespace=a[F].names.length?a[F].names[0].name:"",B.balance=B.balance/Math.pow(10,k[T].divisibility),B.divisibility=k[T].divisibility,B.hasUpdated=!0,F++,T++)}h.value=!1},_=b=>{if(b==null){o.value.splice(n.value,1);return}o.value[n.value].balance=b.balance,o.value[n.value].id=b.id,o.value[n.value].namespace=b.namespace,o.value[n.value].divisibility=b.divisibility,o.value[n.value].amount="0"};return(b,r)=>{const x=z("Dropdown");return m(),p("div",null,[C(x,{showClear:!0,modelValue:L(o)[L(n)],"onUpdate:modelValue":r[0]||(r[0]=c=>L(o)[L(n)]=c),style:{width:"100%"},options:M.value,filter:!0,filterFields:["id","namespace"],emptyFilterMessage:" ",placeholder:"Select Asset",virtualScrollerOptions:{lazy:!0,onLazyLoad:w,showLoader:!0,loading:h.value,delay:0,itemSize:38},onChange:r[1]||(r[1]=c=>{var a;_(c.value),b.$emit("update:modelValue",(a=c.value)==null?void 0:a.value)})},{value:R(c=>[c.value.id?(m(),p("div",ht,[e("div",yt,[e("div",xt,[_t,e("div",kt,d(g(c.value.namespace==""?c.value.id:c.value.namespace)),1)]),e("div",wt,"Balance: "+d(c.value.balance),1)])])):I("",!0)]),option:R(c=>[e("div",At,[e("div",$t,[e("div",Tt,d(g(c.option.namespace==""?c.option.id:c.option.namespace)),1),e("div",It,"Balance: "+d(c.option.balance),1)])])]),_:1},8,["modelValue","options","virtualScrollerOptions"])])}}}),Ft={class:"border border-gray-200 px-2 py-1 rounded-md"},Pt={class:"flex justify-between"},Vt={class:"flex flex-col"},St={class:"uppercase font-light text-gray-500 text-txs text-left mb-2"},Nt={class:"flex w-full"},Lt={key:0,src:me,class:"h-5 w-5 mt-0.5"},Ct=["value","data-maska","placeholder"],Bt=["disabled"],Ht=j({__name:"TransferInputClean",props:{modelValue:{type:String,required:!0},decimal:{type:Number,required:!0},placeholder:{type:String,required:!0},toolTip:{type:String,required:!1},disabled:{type:Boolean,required:!1},showError:{type:Boolean,required:!1},logo:{type:Boolean,required:!1},balance:{type:Number,required:!1}},emits:["update:modelValue","show-error","clickedMaxAvailable"],setup(i){const y=i,f=()=>{let l="0";return y.decimal>0&&(l=l+"."+"9".repeat(y.decimal)),l},g={preProcess:l=>l.replace(/,/g,""),postProcess:l=>{if(!l)return"";let o=0;return y.decimal>0&&(o=1+y.decimal-(l.includes(".")?l.length-l.indexOf("."):0)),Intl.NumberFormat("en-US",{minimumFractionDigits:y.decimal}).format(parseFloat(l)).slice(0,o?-o:void 0)}};return(l,o)=>{const n=we("maska");return m(),p("div",{class:Ae(i.disabled?"opacity-50":"")},[e("div",Ft,[e("div",Pt,[e("div",Vt,[e("div",St,d(i.placeholder),1),e("div",Nt,[i.logo?(m(),p("img",Lt)):I("",!0),ee(e("input",{value:i.modelValue,class:"supply_input","data-maska":f(),"data-maska-tokens":"0:\\d:multiple|9:\\d:optional",placeholder:i.placeholder,onInput:o[0]||(o[0]=h=>l.$emit("update:modelValue",parseFloat(h.target.value.replace(/,/g,"")).toString()))},null,40,Ct),[[n,void 0,g]])])]),i.logo?(m(),p("button",{key:0,disabled:i.disabled==!0,class:"w-24 cursor-pointer focus:outline-none text-blue-primary text-xs font-bold",onClick:o[1]||(o[1]=h=>l.$emit("clickedMaxAvailable",!0))},d(l.$t("swap.maxAmount")),9,Bt)):I("",!0)])])],2)}}});const be=Be(Ht,[["__scopeId","data-v-ac217733"]]),Et={class:"rounded-md bg-white flex border mt-3"},Kt=["value","placeholder"],qt=e("div",{class:"w-1 flex-none"},null,-1),Ut={class:"text-gray-800"},Rt=j({__name:"TextAreaInput",props:{modelValue:{type:String,required:!1},currentBytes:{type:Number,required:!0},limit:{type:Number,required:!0},placeholder:{type:String,required:!0}},emits:["update:modelValue"],setup(i){return(y,f)=>(m(),p(te,null,[e("div",Et,[e("textarea",{value:i.modelValue,onInput:f[0]||(f[0]=g=>y.$emit("update:modelValue",g.target.value)),rows:"2",class:"w-full text-gray-500 px-2 py-1 outline-none bg-white text-xs",placeholder:i.placeholder.toUpperCase()},null,40,Kt),qt]),e("div",{class:Ae(["float-right mt-1 text-tsm",i.currentBytes>i.limit?"text-red-500":"text-gray-800"])},[$e(d(i.currentBytes)+" ",1),e("span",Ut,"/"+d(i.limit),1)],2)],64))}}),jt={class:"border border-gray-200 px-2 py-2 rounded-md w-full"},Wt={class:"flex gap-2"},Dt={class:"flex flex-col w-full"},Ot={class:"uppercase text-gray-500 font-light text-xxs text-left"},zt={key:0,class:"flex flex-col ml-auto justify-center mt-1"},Xt=e("img",{src:Oe,class:"h-5 w-5 mr-auto ml-auto"},null,-1),Zt={class:"text-xxs text-red-400 font-bold uppercase"},Qt={key:1,class:"flex flex-col ml-auto justify-center mt-1"},Gt=e("img",{src:ze,class:"h-5 w-5 mr-auto ml-auto"},null,-1),Jt={class:"text-xxs text-green-400 font-bold uppercase"},he=j({__name:"FieldValidationInput",props:He({placeholder:{},showError:{}},{modelValue:{}}),emits:["update:modelValue"],setup(i){const y=Ee(i,"modelValue");return(f,g)=>(m(),p("div",jt,[e("div",Wt,[e("div",Dt,[e("div",Ot,d(f.placeholder),1),ee(e("input",{type:"text","onUpdate:modelValue":g[0]||(g[0]=l=>y.value=l),class:"w-full font-semibold text-tsm outline-none mt-1"},null,512),[[Ke,y.value]])]),f.showError&&y.value.length!=0?(m(),p("div",zt,[Xt,e("div",Zt,d(f.$t("general.invalid")),1)])):f.showError?I("",!0):(m(),p("div",Qt,[Gt,e("div",Jt,d(f.$t("general.valid")),1)]))])]))}});const Te="0".repeat(64),ye=u.PublicAccount.createFromPublicKey(Te,v.networkType).address.plain(),xe=(i,y)=>{let f=[];return parseInt(i)>0&&f.push(new u.Mosaic(new u.MosaicId(v.nativeToken.assetId),u.UInt64.fromUint(Number(i)))),y.length>0&&y.forEach(g=>{parseInt(g.amount)>0&&f.push(new u.Mosaic(new u.MosaicId(g.id),u.UInt64.fromUint(Number(g.amount))))}),f},ae=class ae{};ae.createTransaction=async(y,f,g,l,o,n,h,M,w)=>{if(!re.verifyWalletPassword(K.currentLoggedInWallet.name,le.chainNetworkName,o))return!1;const b=le.currentNetworkProfile.generationHash;let r=v.networkType,x=parseFloat(f)*Math.pow(10,v.nativeToken.divisibility),c=[];x>0&&c.push(new u.Mosaic(new u.MosaicId(v.nativeToken.assetId),u.UInt64.fromUint(Number(x)))),l.length>0&&l.forEach(A=>{A.amount>0&&c.push(new u.Mosaic(new u.MosaicId(A.id),u.UInt64.fromUint(Number(A.amount*Math.pow(10,A.divisibility)))))});let a=v.buildTxn,k,F;if(!h)k=K.currentLoggedInWallet.accounts.find(A=>A.address===n);else{k=K.currentLoggedInWallet.accounts.find(q=>q.address===n);const A=await v.chainAPI.accountAPI.getAccountInfo(u.Address.createFromRawAddress(h));F=u.PublicAccount.createFromPublicKey(A.publicKey,r)}let T=re.decryptPrivateKey(new u.Password(o),k.encrypted,k.iv),V;if(M&&g.length>0)try{const A=await v.chainAPI.accountAPI.getAccountInfo(u.Address.createFromRawAddress(y));V=u.EncryptedMessage.create(g,A.publicAccount,T)}catch{V=u.EncryptedMessage.create(g,u.PublicAccount.createFromPublicKey(w,v.networkType),T)}else V=u.PlainMessage.create(g);let N=a.transferBuilder().recipient(u.Address.createFromRawAddress(y)).mosaics(c).message(V).build();const B=u.Account.createFromPrivateKey(T,r,1);if(h){let A=K.currentLoggedInWallet.accounts.find(ie=>ie.address==n),q=re.decryptPrivateKey(new u.Password(o),A.encrypted,A.iv),Z=u.Account.createFromPrivateKey(q,r,1);const Q=[N.toAggregateV1(F)],G=a.aggregateBonded(Q),J=Z.preV2Sign(G,b),Y=X.lockFundTx(J),U=Z.preV2Sign(Y,b);X.announceLF_AND_addAutoAnnounceABT(U,J)}else{const A=B.preV2Sign(N,b);X.announceTransaction(A)}return!0},ae.calculateAggregateFee=(y,f,g,l)=>{let o=v.buildTxn,n=xe(f,g),M=[o.transferBuilder().recipient(u.Address.createFromRawAddress(ye)).mosaics(n).message(l&&y.length>0?u.EncryptedMessage.create(y,u.PublicAccount.createFromPublicKey("0".repeat(64),v.networkType),"0".repeat(64)):u.PlainMessage.create(y)).build().toAggregateV1(u.PublicAccount.createFromPublicKey(Te,v.networkType))];return o.aggregateBondedBuilder().innerTransactions(M).build().maxFee.compact()/Math.pow(10,v.nativeToken.divisibility)},ae.calculateFee=(y,f,g,l)=>{let o=v.buildTxn,n=xe(f,g);return o.transferBuilder().recipient(u.Address.createFromRawAddress(ye)).mosaics(n).message(l&&y.length>0?u.EncryptedMessage.create(y,u.PublicAccount.createFromPublicKey("0".repeat(64),v.networkType),"0".repeat(64)):u.PlainMessage.create(y)).build().maxFee.compact()/Math.pow(10,v.nativeToken.divisibility)};let se=ae;const Yt={key:0},el={class:"font-bold text-xs text-blue-primary uppercase"},tl={class:"lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1"},ll={class:"font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"},sl=["innerHTML"],al={class:"flex"},nl={class:"ml-1 text-blue-400 font-bold"},ol=e("img",{src:me,class:"ml-1 h-5 w-5 mt-0.5"},null,-1),il={class:"lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2"},rl={class:"font-semibold lg:col-span-2 col-span-3"},cl={key:0,class:"lg:col-span-2 col-span-3 ml-auto"},ul=["innerHTML"],dl={class:"ml-1 text-blue-400"},ml={key:0,class:"lg:col-span-4 col-span-6 ml-auto"},vl={key:1,class:"lg:col-span-4 col-span-6 ml-auto"},pl=["index"],gl=e("div",{class:"border-b-2 border-gray-600 my-2"},null,-1),fl={class:"font-bold text-xs text-blue-primary uppercase"},bl={class:"lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1"},hl={class:"font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"},yl=["innerHTML"],xl={class:"flex"},_l={class:"ml-1 text-blue-400 font-bold"},kl=e("img",{src:me,class:"ml-1 h-5 w-5 mt-0.5"},null,-1),wl=e("div",{class:"border-b-2 border-gray-600 mt-2"},null,-1),Al={key:1,class:"lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2"},$l={class:"font-semibold lg:col-span-2 col-span-3"},Tl={key:0,class:"lg:col-span-2 col-span-3 ml-auto"},Il=["innerHTML"],Ml={class:"ml-1 text-blue-400"},Fl={key:0,class:"lg:col-span-4 col-span-6 ml-auto"},Pl={key:1,class:"lg:col-span-4 col-span-6 ml-auto"},Vl=["index"],Sl={class:"lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2"},Nl={class:"font-semibold lg:col-span-2 col-span-3"},Ll=["innerHTML"],Cl={class:"ml-1 text-blue-400"},Bl={key:3,class:"lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs"},Hl={class:"font-semibold lg:col-span-2 col-span-3"},El=["innerHTML"],Kl={class:"ml-1 text-blue-400"},ql={key:4,class:"lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2"},Ul={class:"font-semibold lg:col-span-2 col-span-3"},Rl=["innerHTML"],jl={class:"ml-1 text-blue-400"},Wl=e("div",{class:"border-b-2 border-gray-600 mt-2"},null,-1),Dl={class:"lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2"},Ol=e("div",{class:"font-semibold lg:col-span-2 col-span-3 uppercase"},"Total",-1),zl=["innerHTML"],Xl={class:"ml-1 text-blue-400"},Zl=j({__name:"TransferTxnSummary",props:{selectedMultisigAddress:{type:String||null},nativeTokenBalance:{type:Number,required:!0},selectedAssets:{type:Array,required:!0},lockFund:{type:Number,required:!0},txnFee:{type:Number,required:!0},lockFundTxFee:{type:Number,required:!0},totalFee:{type:Number,required:!0},nativeAmount:{type:String,required:!0},signerNativeTokenBalance:{type:Number,required:!0}},setup(i){const y=[{namespace:"prx.xpx",name:"XPX"},{namespace:"prx.metx",name:"METX"},{namespace:"xarcade.xar",name:"XAR"}],f=l=>{const o=y.find(n=>n.namespace==l);return o?o.name:l.length==16?l.substring(0,4)+"..."+l.substring(l.length-4,l.length+1):l},g=l=>{let o=l.toString().split(".");return o[1]!=null?'<span class="font-semibold text-sm">'+o[0]+'</span>.<span class="font-semibold text-xs">'+o[1]+"</span>":'<span class="font-semibold text-sm">'+o[0]+"</span>"};return(l,o)=>(m(),p(te,null,[i.selectedMultisigAddress?(m(),p("div",Yt,[e("div",el,d(l.$t("general.multisigAcc")),1),e("div",tl,[e("div",ll,d(l.$t("general.currentBalance")),1),e("span",{class:"ml-auto lg:col-span-2 col-span-3",innerHTML:g(i.nativeTokenBalance??0)},null,8,sl),e("div",al,[e("div",nl,d(L(v).nativeToken.label),1),ol])]),e("div",il,[e("div",rl,d(l.$t("transfer.transferAmount")),1),isNaN(parseFloat(i.nativeAmount))?(m(),p("div",cl,"0")):(m(),p("div",{key:1,class:"lg:col-span-2 col-span-3 ml-auto",innerHTML:g(i.nativeAmount??0)},null,8,ul)),e("div",dl,d(L(v).nativeToken.label),1)]),(m(!0),p(te,null,ue(i.selectedAssets,(n,h)=>(m(),p("div",{class:"lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs",key:h},[isNaN(parseFloat(n.amount))&&n.id!=null?(m(),p("div",ml,"0")):(m(),p("div",vl,d(n.amount),1)),n.id!=null?(m(),p("div",{key:2,class:"ml-1 text-blue-400",index:h},d(f(n.namespace==""?n.id:n.namespace)),9,pl)):I("",!0)]))),128)),gl])):I("",!0),e("div",fl,d(l.$t("general.signerAcc")),1),e("div",bl,[e("div",hl,d(l.$t("general.currentBalance")),1),e("span",{class:"ml-auto lg:col-span-2 col-span-3",innerHTML:g(i.selectedMultisigAddress?i.signerNativeTokenBalance:i.nativeTokenBalance??0)},null,8,yl),e("div",xl,[e("div",_l,d(L(v).nativeToken.label),1),kl])]),wl,i.selectedMultisigAddress?I("",!0):(m(),p("div",Al,[e("div",$l,d(l.$t("transfer.transferAmount")),1),isNaN(parseFloat(i.nativeAmount))?(m(),p("div",Tl,"0")):(m(),p("div",{key:1,class:"lg:col-span-2 col-span-3 ml-auto",innerHTML:g(i.nativeAmount??0)},null,8,Il)),e("div",Ml,d(L(v).nativeToken.label),1)])),i.selectedMultisigAddress?I("",!0):(m(!0),p(te,{key:2},ue(i.selectedAssets,(n,h)=>(m(),p("div",{class:"lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs",key:h},[isNaN(parseFloat(n.amount))&&n.id!=null?(m(),p("div",Fl,"0")):(m(),p("div",Pl,d(n.amount),1)),n.id!=null?(m(),p("div",{key:2,class:"ml-1 text-blue-400",index:h},d(f(n.namespace==""?n.id:n.namespace)),9,Vl)):I("",!0)]))),128)),e("div",Sl,[e("div",Nl,d(i.selectedMultisigAddress!=null?l.$t("general.aggregateFee"):l.$t("general.transactionFee")),1),e("div",{class:"lg:col-span-2 col-span-3 ml-auto",innerHTML:g(i.txnFee)},null,8,Ll),e("div",Cl,d(L(v).nativeToken.label),1)]),i.selectedMultisigAddress!=null?(m(),p("div",Bl,[e("div",Hl,d(l.$t("general.lockFund")),1),e("div",{class:"lg:col-span-2 col-span-3 ml-auto",innerHTML:g(i.lockFund??0)},null,8,El),e("div",Kl,d(L(v).nativeToken.label),1)])):I("",!0),i.selectedMultisigAddress!=null?(m(),p("div",ql,[e("div",Ul,d(l.$t("general.lockFundTxFee")),1),e("div",{class:"lg:col-span-2 col-span-3 ml-auto",innerHTML:g(i.lockFundTxFee??0)},null,8,Rl),e("div",jl,d(L(v).nativeToken.label),1)])):I("",!0),Wl,e("div",Dl,[Ol,e("div",{class:"lg:col-span-2 col-span-3 ml-auto",innerHTML:g(i.totalFee)},null,8,zl),e("div",Xl,d(L(v).nativeToken.label),1)])],64))}}),Ql={class:"w-10/12 ml-auto mr-auto mt-5"},Gl={class:"border filter shadow-lg xl:grid xl:grid-cols-3 mt-8"},Jl={class:"xl:col-span-2 p-12"},Yl={key:0,class:"mb-3 rounded-md bg-red-200 w-full p-2 flex items-center justify-center"},es={class:"rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"},ts={class:"inline-block text-xs"},ls={class:"text-sm font-semibold"},ss=e("div",{class:"text-blue-primary font-semibold uppercase mt-3 text-xxs"},"Transfer to",-1),as={class:"flex mt-1 gap-1 items-center"},ns={class:"text-xxs text-blue-primary font-semibold uppercase ml-auto mr-auto"},os={class:"text-xxs text-blue-primary font-semibold uppercase ml-auto mr-auto"},is={key:2,class:"h-3"},rs={key:3,class:"mb-5"},cs={for:"encryptedMsg",class:"cursor-pointer font-bold ml-4 mr-5 text-tsm"},us={class:"bg-navy-primary py-6 px-6 xl:col-span-1"},ds={class:"font-semibold text-xs text-white mb-1.5"},ms=["disabled"],vs={class:"text-center"},ps="^[0-9A-Za-z]{40}$",gs="^[0-9A-Za-z-]{46}$",fs="^[^ ]{8,}$",As=j({__name:"ViewTransfer",setup(i){const y=de(),{t:f}=qe(),g=y.appContext.config.globalProperties.emitter,l=$(null),o=$(null),n=$(!1),h=$(""),M=$(!1),w=$(!1),_=$(""),b=$(!0),r=$(!0),x=$([]),c=$([]),a=$("0"),k=$(0),F=$(""),T=$(""),V=$(0),N=E(()=>!(_.value.match(fs)&&!b.value&&!A.value&&q.value<Z.value&&B.value)),B=E(()=>!(w.value&&M.value&&q.value>0&&r.value));O(c,t=>{for(let s=0;s<t.length;s++)isNaN(parseFloat(t[s].amount))&&(t[s].amount="0")},{deep:!0}),O(a,t=>{isNaN(parseFloat(t))&&(a.value="0")});const A=E(()=>o.value?l.value?parseFloat(a.value)>k.value||!c.value.every(t=>parseFloat(t.amount)<=t.balance)?!0:Y.value>V.value:Y.value>k.value||!c.value.every(t=>parseFloat(t.amount)<=t.balance):!1),q=E(()=>T.value.length==0?0:M.value?X.getFakeEncryptedMessageSize(T.value):X.getPlainMessageSize(T.value)),Z=E(()=>{var t;return((t=le)==null?void 0:t.currentNetworkProfileConfig.maxMessageSize)-1}),Q=E(()=>{var t;return W.convertToExact((t=le)==null?void 0:t.currentNetworkProfileConfig.lockedFundsPerAggregate,v.nativeToken.divisibility)}),G=E(()=>le.currentNetworkProfile?W.convertToExact(X.getLockFundFee(),v.nativeToken.divisibility):0),J=E(()=>{if(!o.value)return 0;let t=v.nativeToken.divisibility;return l.value?W.convertNumberMinimumFormat(k.value,t):W.convertNumberMinimumFormat(k.value-U.value,t)}),Y=E(()=>{let t=v.nativeToken.divisibility;return l.value?t==0?Math.trunc(U.value+G.value+Q.value):Math.round((U.value+G.value+Q.value)*Math.pow(10,t))/Math.pow(10,t):t==0?Math.trunc(parseFloat(a.value.replace(/,/g,""))+U.value):Math.round((parseFloat(a.value.replace(/,/g,""))+U.value)*Math.pow(10,t))/Math.pow(10,t)}),U=E(()=>{const t=c.value.map(s=>({id:s.id,amount:s.amount}));return t.push({id:v.nativeToken.assetId,amount:a.value}),l.value?se.calculateAggregateFee(T.value,a.value,t,M.value):o.value?se.calculateFee(T.value,a.value,t,M.value):0}),ie=()=>{a.value=J.value.toString(),a.value=J.value.toString()},Ie=Ue(),Me=Re(),Fe=async()=>{if(!await se.createTransaction(h.value,a.value,T.value,c.value.map(s=>({id:s.id,amount:parseFloat(s.amount),divisibility:s.divisibility})),_.value,o.value,l.value,M.value,F.value)){Ie.add({severity:"error",summary:"Error",detail:"Password is incorrect",group:"br-custom",life:1e3});return}Me.push({name:"ViewAccountPendingTransactions",params:{address:o.value}})},Pe=async()=>{if(v.chainAPI)try{const t=await v.chainAPI.accountAPI.getAccountInfo(u.Address.createFromRawAddress(o.value)),s=t.mosaics.findIndex(P=>P.id.toHex()==v.nativeToken.assetId);s!=-1?(V.value=t.mosaics[s].amount.compact()/Math.pow(10,v.nativeToken.divisibility),t.mosaics.splice(s,1)):V.value=0}catch{V.value=0}},ve=async t=>{if(v.chainAPI&&t){x.value=[];try{const s=await v.chainAPI.accountAPI.getAccountInfo(u.Address.createFromRawAddress(t)),P=s.mosaics.findIndex(H=>H.id.toHex()==v.nativeToken.assetId);P!=-1?(k.value=s.mosaics[P].amount.compact()/Math.pow(10,v.nativeToken.divisibility),s.mosaics.splice(P,1)):k.value=0;for(let H=0;H<s.mosaics.length;H++){const ne=s.mosaics[H];x.value.push({id:ne.id.toHex(),balance:ne.amount.compact(),divisibility:0,namespace:"",hasUpdated:!1})}}catch{x.value=[],k.value=0}}};O([o,l],async([t,s])=>{x.value=[],c.value=[],t==null&&(k.value=0),t!=null&&s==null?(V.value=0,await ve(t)):t!=null&&s!=null&&(await Pe(),await ve(s))}),g.on("select-account",t=>{o.value=t}),g.on("select-multisig-account",t=>{l.value=t});const Ve=t=>{n.value=!1,h.value=t.data},Se=E(()=>{const t=K.currentLoggedInWallet;if(!t)return[];const s=[...t.accounts,...t.others];return t.contacts.length?[{key:"0",label:f("general.ownerAcc"),selectable:!1,children:s.map((P,H)=>({key:"0-"+H.toString(),label:P.name,data:u.Address.createFromRawAddress(P.address).pretty(),selectable:!0}))},{key:"1",label:f("general.contact"),selectable:!1,children:t.contacts.map((P,H)=>({key:"1-"+H.toString(),label:P.name,data:u.Address.createFromRawAddress(P.address).pretty(),selectable:!0}))}]:[{key:"0",label:f("general.ownerAcc"),selectable:!1,children:s.map((P,H)=>({key:"0-"+H.toString(),label:P.name,data:u.Address.createFromRawAddress(P.address).pretty(),selectable:!0}))}]});O([h,b],t=>{if(t[0].match(gs)||t[0].match(ps)){if(!t[1]){Ne();return}pe()}else b.value=!0});const Ne=()=>{v.chainAPI.accountAPI.getAccountInfo(u.Address.createFromRawAddress(h.value)).then(t=>{w.value=t.publicKey=="0".repeat(64)}).catch(t=>w.value=!0)},Le=()=>{try{u.PublicAccount.createFromPublicKey(F.value,v.networkType).address.plain()==u.Address.createFromRawAddress(h.value).plain()&&(r.value=!1)}catch{r.value=!0}},pe=()=>{if(K.currentLoggedInWallet)try{let t=W.createAddress(h.value);W.checkAddressNetwork(t,v.networkType)?b.value=!1:b.value=!0}catch{try{let s=W.createNamespaceId(h.value);v.chainAPI.namespaceAPI.getLinkedAddress(s).then(P=>{h.value=P.plain(),b.value=!1}).catch(P=>{b.value=!0})}catch{b.value=!0}}};return(t,s)=>{const P=z("Sidebar"),H=z("font-awesome-icon"),ne=z("router-link"),ge=we("debounce");return m(),p("div",null,[C(P,{visible:n.value,"onUpdate:visible":s[0]||(s[0]=S=>n.value=S),baseZIndex:1e4,position:"full"},{default:R(()=>[C(We,{contacts:Se.value,onNodeSelect:Ve},null,8,["contacts"])]),_:1},8,["visible"]),e("div",Ql,[e("div",Gl,[e("div",Jl,[A.value?(m(),p("div",Yl,[e("div",es,[C(H,{icon:"times",class:"text-red-500 h-3 w-3 absolute",style:{top:"3px",left:"4px"}})]),e("div",ts,d(t.$t("general.insufficientBalance")),1)])):I("",!0),e("div",ls,d(t.$t("transfer.newTransfer")),1),C(nt),C(bt,{class:"md:mt-3","selected-address":o.value},null,8,["selected-address"]),ss,e("div",as,[ee(C(he,{placeholder:t.$t("transfer.transferPlaceholder"),modelValue:h.value,"onUpdate:modelValue":s[1]||(s[1]=S=>h.value=S),showError:b.value},null,8,["placeholder","modelValue","showError"]),[[ge,pe,"1000"]]),e("div",{onClick:s[2]||(s[2]=S=>n.value=!n.value),class:"border rounded-md cursor-pointer flex flex-col justify-center p-1.5"},[C(H,{icon:"id-card-alt",class:"text-blue-primary ml-auto mr-auto"}),e("div",ns,d(t.$t("general.select")),1),e("div",os,d(t.$t("general.contact")),1)])]),(m(!0),p(te,null,ue(c.value,(S,D)=>{var fe;return m(),p("div",{key:D},[C(Mt,{class:"mt-3","asset-options":x.value,index:D,"selected-assets":c.value},null,8,["asset-options","index","selected-assets"]),((fe=c.value[D].id)==null?void 0:fe.length)==16?(m(),ce(be,{key:0,class:"mt-3",modelValue:c.value[D].amount,"onUpdate:modelValue":Ce=>c.value[D].amount=Ce,placeholder:t.$t("transfer.assetAmount"),type:"text",decimal:c.value[D].divisibility},null,8,["modelValue","onUpdate:modelValue","placeholder","decimal"])):I("",!0)])}),128)),c.value.length!=x.value.length?(m(),p("button",{key:1,class:"my-2 font-semibold text-xs text-blue-primary outline-none focus:outline-none disabled:opacity-50",onClick:s[3]||(s[3]=S=>c.value.push({id:null,balance:0,amount:"0",namespace:"",divisibility:0}))}," + "+d(t.$t("transfer.addAssets")),1)):(m(),p("div",is)),C(be,{modelValue:a.value,"onUpdate:modelValue":s[4]||(s[4]=S=>a.value=S),balance:k.value,placeholder:t.$t("transfer.transferAmount"),logo:!0,type:"text",onClickedMaxAvailable:s[5]||(s[5]=S=>ie()),decimal:6},null,8,["modelValue","balance","placeholder"]),C(Rt,{modelValue:T.value,"onUpdate:modelValue":s[6]||(s[6]=S=>T.value=S),limit:Z.value,placeholder:t.$t("general.message"),"current-bytes":q.value},null,8,["modelValue","limit","placeholder","current-bytes"]),b.value?I("",!0):(m(),p("div",rs,[ee(e("input",{id:"encryptedMsg",type:"checkbox","onUpdate:modelValue":s[7]||(s[7]=S=>M.value=S)},null,512),[[je,M.value]]),e("label",cs,d(t.$t("transfer.enableEncryption")),1)])),!b.value&&w.value&&M.value&&q.value>0?ee((m(),ce(he,{key:4,placeholder:"Recipient Public Key",modelValue:F.value,"onUpdate:modelValue":s[8]||(s[8]=S=>F.value=S),showError:r.value},null,8,["modelValue","showError"])),[[ge,Le,"1000"]]):I("",!0)]),e("div",us,[C(Zl,{"signer-native-token-balance":V.value,"native-amount":a.value,"native-token-balance":k.value,"lock-fund":Q.value,"lock-fund-tx-fee":G.value,"selected-multisig-address":l.value,"txn-fee":U.value,"total-fee":Y.value,"selected-assets":c.value},null,8,["signer-native-token-balance","native-amount","native-token-balance","lock-fund","lock-fund-tx-fee","selected-multisig-address","txn-fee","total-fee","selected-assets"]),e("div",ds,d(t.$t("general.enterPasswordContinue")),1),C(De,{placeholder:t.$t("general.enterPassword"),errorMessage:t.$t("general.passwordRequired"),modelValue:_.value,"onUpdate:modelValue":s[9]||(s[9]=S=>_.value=S),icon:"lock",class:"mt-5 mb-3"},null,8,["placeholder","errorMessage","modelValue"]),e("button",{type:"submit",class:"w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto",disabled:N.value,onClick:s[10]||(s[10]=S=>Fe())},d(t.$t("general.transfer")),9,ms),e("div",vs,[C(ne,{to:{name:"ViewDashboard"},class:"content-center text-xs text-white underline"},{default:R(()=>[$e(d(t.$t("general.cancel")),1)]),_:1})])])])])])}}});export{As as default};