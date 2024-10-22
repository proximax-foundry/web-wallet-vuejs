import{d as U,g as h,j as K,c as C,w as n,o,f as u,e as c,t as m,i as f,l as _,F as q,E as H,x as L,b3 as z,A as D,_ as G,y as J,I as Q,H as X,r as F,O as Y,P as Z,$ as ee,b as M,s as V,h as T,a as R}from"./index-d2e8ccc1.js";import{t as te}from"./jdenticon-module-59aa2fb9.js";import{c as ae}from"./functions-35769730.js";import{T as se}from"./TextInput-729dd071.js";import{T as j}from"./TextInputClean-7f026065.js";import{_ as ne,a as le}from"./icon-key-5b3f7dda.js";const re="/web-wallet-vuejs/assets/edit-icon-026aae3d.svg",oe={key:0,class:"popup-outer-lang fixed flex z-50"},de={class:"modal-popup-box"},ce={key:0},ie={key:0,class:"error error_box mb-3"},ue={class:"flex justify-center mt-3"},me=["disabled"],ge={key:1},fe={key:0,class:"error error_box mb-3"},ve={class:"flex justify-center"},pe=["disabled"],be={key:2},ye={key:0,class:"error error_box mb-3"},xe={class:"flex justify-center"},we=["disabled"],he=U({__name:"ChangeNameModal",props:{isOther:Boolean,address:String},emits:["change-name"],setup(s){const r=s,a=H().appContext.config.globalProperties.emitter,p=h(r.address),{t:i}=K(),x=C(()=>w.value.trim()==""),N=C(()=>v.value.trim()==""),b=h(!1),v=h(""),w=h(""),d=h(""),k=()=>{if(w.value.trim()){const l=n.currentLoggedInWallet.accounts.find(t=>t.name==w.value.trim()),e=n.currentLoggedInWallet.others.find(t=>t.name==w.value.trim());if(!l&&!e){const t=n.currentLoggedInWallet.accounts.findIndex(g=>g.address===r.address);if(t==-1){const g=n.currentLoggedInWallet.others.findIndex(A=>A.address===r.address);n.currentLoggedInWallet.others[g].name=w.value,a.emit("change-name",w.value)}else n.currentLoggedInWallet.accounts[t].name=w.value,a.emit("change-name",w.value);n.wallets.saveMyWalletOnlytoLocalStorage(n.currentLoggedInWallet),d.value="",w.value="",b.value=!1}else l||e?d.value=i("account.nameTaken"):d.value=i("account.failChangeName")}else d.value=i("account.nameEmpty")},S=h(!1);r.isOther&&n.currentLoggedInWallet.contacts.find(e=>e.address==r.address)&&(S.value=!0);const E=()=>{if(v.value==" "){d.value=i("general.nameRequired");return}const l=L.Address.createFromRawAddress(r.address);let e=new z(v.value.trim(),l.plain(),"-none-");const t=n.currentLoggedInWallet,g=t.accounts.findIndex($=>$.name.toLowerCase()==v.value.toLowerCase().trim()),A=t.contacts!=null?t.contacts.findIndex($=>L.Address.createFromRawAddress($.address).plain()==l.plain()):-1,B=t.contacts!=null?t.contacts.findIndex($=>$.name.toLowerCase()==v.value.toLowerCase().trim()):-1;A>=0?d.value=i("addressBook.addressExist"):B>=0||g>=0?d.value=i("addressBook.nameExist"):(n.currentLoggedInWallet.addAddressBook(e),n.wallets.saveMyWalletOnlytoLocalStorage(n.currentLoggedInWallet),d.value="",v.value="",b.value=!1)},W=h("");(async l=>{try{let e=await D.chainAPI.accountAPI.getAccountInfo(L.Address.createFromRawAddress(l));e.publicKey=="0000000000000000000000000000000000000000000000000000000000000000"?W.value=null:W.value=e.publicKey}catch{W.value=null}})(r.address);const P=()=>{const l=n.currentLoggedInWallet;if(!l)return;const e=n.currentLoggedInWallet.contacts.find(I=>I.address==r.address),t=n.currentLoggedInWallet.contacts.findIndex(I=>I.address==r.address);let g=l.contacts.filter(I=>I.name.toLowerCase()!=e.name.toLowerCase().trim()),A=g.find(I=>I.name.toLowerCase()==v.value.toLowerCase().trim()),B=l.accounts.find(I=>I.name.toLowerCase()==v.value.toLowerCase().trim()),$=g.find(I=>L.Address.createFromRawAddress(I.address).plain()==L.Address.createFromRawAddress(r.address).plain());A!=null||B!=null?d.value=i("addressBook.nameExist"):$!=null?d.value=i("addressBook.addressExist"):(n.currentLoggedInWallet.updateAddressBook(t,{name:v.value.trim(),address:L.Address.createFromRawAddress(r.address).plain(),group:"-none-",publicKey:W.value}),n.wallets.saveMyWalletOnlytoLocalStorage(n.currentLoggedInWallet),d.value="",v.value="",b.value=!1)};return(l,e)=>(o(),u(q,null,[c("img",{src:re,class:"w-4 h-4 text-black cursor-pointer mt-1 ml-1",onClick:e[0]||(e[0]=t=>b.value=!b.value)}),b.value?(o(),u("div",oe,[c("div",de,[s.isOther?s.isOther&&!S.value?(o(),u("div",ge,[d.value!=""?(o(),u("div",fe,m(d.value),1)):f("",!0),e[12]||(e[12]=c("div",{class:"text-center mt-2 text-xs font-semibold"},"Add to Address Book",-1)),_(j,{placeholder:l.$t("general.name"),errorMessage:l.$t("general.nameRequired"),modelValue:v.value,"onUpdate:modelValue":e[3]||(e[3]=t=>v.value=t),icon:"id-card-alt",class:"w-full md:w-96 inline-block mt-3 mr-2"},null,8,["placeholder","errorMessage","modelValue"]),_(j,{placeholder:l.$t("general.address"),modelValue:p.value,"onUpdate:modelValue":e[4]||(e[4]=t=>p.value=t),disabled:!0,icon:"wallet",class:"w-full md:w-96 inline-block mr-2"},null,8,["placeholder","modelValue"]),c("div",ve,[c("button",{onClick:e[5]||(e[5]=t=>E()),class:"blue-btn font-semibold py-2 cursor-pointer text-center w-7/12 disabled:opacity-50 disabled:cursor-auto",disabled:N.value},m(l.$t("general.add")),9,pe)])])):(o(),u("div",be,[d.value!=""?(o(),u("div",ye,m(d.value),1)):f("",!0),e[13]||(e[13]=c("div",{class:"text-center mt-2 text-xs font-semibold"},"Edit Address Book",-1)),_(j,{placeholder:l.$t("general.name"),errorMessage:l.$t("general.nameRequired"),modelValue:v.value,"onUpdate:modelValue":e[6]||(e[6]=t=>v.value=t),icon:"id-card-alt",class:"w-full md:w-96 inline-block mt-3 mr-2"},null,8,["placeholder","errorMessage","modelValue"]),_(j,{placeholder:l.$t("general.address"),modelValue:p.value,"onUpdate:modelValue":e[7]||(e[7]=t=>p.value=t),disabled:!0,icon:"wallet",class:"w-full md:w-96 inline-block mr-2"},null,8,["placeholder","modelValue"]),c("div",xe,[c("button",{onClick:e[8]||(e[8]=t=>P()),class:"blue-btn font-semibold py-2 cursor-pointer text-center w-7/12 disabled:opacity-50 disabled:cursor-auto",disabled:N.value},m(l.$t("general.add")),9,we)])])):(o(),u("div",ce,[d.value!=""?(o(),u("div",ie,m(d.value),1)):f("",!0),e[11]||(e[11]=c("div",{class:"text-center mt-2 text-xs font-semibold"},"Change Name",-1)),_(se,{class:"mt-3",placeholder:l.$t("account.namePlaceholder"),errorMessage:l.$t("account.enterAccountName"),modelValue:w.value,"onUpdate:modelValue":e[1]||(e[1]=t=>w.value=t),icon:"wallet"},null,8,["placeholder","errorMessage","modelValue"]),c("div",ue,[c("button",{onClick:e[2]||(e[2]=t=>k()),class:"blue-btn font-semibold py-2 cursor-pointer text-center w-7/12 disabled:opacity-50 disabled:cursor-auto",disabled:x.value},m(l.$t("general.confirm")),9,me)])])),c("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:e[9]||(e[9]=t=>{b.value=!b.value,d.value=""})},m(l.$t("general.cancel")),1)])])):f("",!0),b.value?(o(),u("div",{key:1,onClick:e[10]||(e[10]=t=>{b.value=!b.value,d.value=""}),class:"fixed inset-0 bg-opacity-60 bg-gray-100 z-20"})):f("",!0)],64))}}),Ie={name:"AccountComponent",props:{address:String},components:{changeNameModal:he},setup(s){const{t:r}=K(),y=J(),a=C(()=>{if(!n.currentLoggedInWallet)return null;let e=n.currentLoggedInWallet.accounts.find(t=>t.address==s.address)||n.currentLoggedInWallet.others.find(t=>t.address==s.address);return e||null}),p=C(()=>n.currentLoggedInWallet?n.currentLoggedInWallet.others.find(e=>e.address==s.address):null);let i=h(""),x=new Q("ThemeStyleConfig");const N=C(()=>{if(s.address)try{return X.createAddress(s.address).pretty()}catch{}return""});x.init();const v=H().appContext.config.globalProperties.emitter,w=C(()=>a.value?!!a.value.default:!1),d=C(()=>a.value?!!a.value.getDirectParentMultisig().length:!1),k=h(""),S=C(()=>a.value?a.value.name:"");k.value=a.value?a.value.name:"";const E=C(()=>n.currentLoggedInWallet?n.currentLoggedInWallet.convertAddressToName(s.address,!0):""),W=h(te(s.address,75,x.jdenticonConfig)),O=h(!0),P=()=>{if(k.value.trim()){const e=n.currentLoggedInWallet.accounts.find(g=>g.name==k.value.trim()),t=n.currentLoggedInWallet.others.find(g=>g.name==k.value.trim());if(!e&&!t){const g=n.currentLoggedInWallet.accounts.findIndex(A=>A.address===s.address);if(g==-1){const A=n.currentLoggedInWallet.others.findIndex(B=>B.address===s.address);n.currentLoggedInWallet.others[A].name=k.value}else n.currentLoggedInWallet.accounts[g].name=k.value;n.wallets.saveMyWalletOnlytoLocalStorage(n.currentLoggedInWallet),O.value=!0,E.value=k.value,i.value="",i.value=""}else e||t?i.value=r("account.nameTaken"):i.value=r("account.failChangeName")}else i.value=r("account.nameEmpty")},l=e=>{let t=document.getElementById(e).getAttribute("copyValue"),g=document.getElementById(e).getAttribute("copySubject");ae(t),y.add({severity:"info",detail:g+" "+r("general.copied"),group:"br-custom",life:3e3})};return v.on("change-name",e=>{S.value=e}),{accountName:k,accountNameDisplay:E,showName:O,svgString:W,isDefault:w,isMultiSig:d,prettyAddress:N,changeName:P,copy:l,err:i,other_acc:p,accountNameChange:S}}},ke={class:"border-2 py-3 px-6"},Ae={class:"flex"},Ce=["innerHTML"],Le={class:"flex flex-col justify-center ml-4"},_e={key:0,class:"text-red-500 text-xs"},$e={class:"flex"},Ne={key:0,class:"font-semibold text-md"},We={key:1,class:"font-semibold text-xs mt-1.5"},Me={class:"flex gap-2"},Ve=["copyValue","title","copySubject"],Te={class:"flex gap-2"},Se=["title"],Be={class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"},Ee=["title"],Re={key:0,src:le,class:"h-4 w-4 mr-1"},je={key:1,class:"font-semibold text-white text-xxs pt-px cursor-default uppercase"};function Oe(s,r,y,a,p,i){const x=F("changeNameModal"),N=F("font-awesome-icon");return o(),u("div",ke,[c("div",Ae,[c("div",{innerHTML:a.svgString},null,8,Ce),c("div",Le,[a.err!=""?(o(),u("div",_e,m(a.err),1)):f("",!0),c("div",$e,[a.showName?(o(),u("div",Ne,m(a.accountNameDisplay),1)):f("",!0),a.accountNameChange!==a.accountNameDisplay?(o(),u("div",We,"("+m(a.accountNameChange)+")",1)):f("",!0),a.showName?f("",!0):Y((o(),u("input",{key:2,class:"outline-none ml-4 font-semibold text-md","onUpdate:modelValue":r[0]||(r[0]=b=>a.accountName=b)},null,512)),[[Z,a.accountName]]),_(x,{address:y.address,isOther:a.other_acc!=null},null,8,["address","isOther"])]),c("div",Me,[c("div",{id:"address",copyValue:a.prettyAddress,title:a.prettyAddress,copySubject:s.$t("general.address"),class:"truncate md:text-clip w-44 md:w-full text-xs font-semibold mt-1"},m(a.prettyAddress),9,Ve),_(N,{icon:"copy",title:s.$t("general.copy"),onClick:r[1]||(r[1]=b=>a.copy("address")),class:"w-5 h-5 text-blue-link cursor-pointer"},null,8,["title"])]),c("div",Te,[a.isDefault?(o(),u("div",{key:0,class:"px-1 py-0.5 flex mt-0.5 bg-blue-primary rounded-sm",title:s.$t("general.defaultTitle")},[r[2]||(r[2]=c("img",{src:ne,class:"h-4 w-4"},null,-1)),c("p",Be,m(s.$t("general.default")),1)],8,Se)):f("",!0),a.isMultiSig?(o(),u("div",{key:1,class:"px-1 py-0.5 flex mt-0.5 bg-orange-primary rounded-sm",title:s.$t("general.multisigTitle")},[a.isMultiSig?(o(),u("img",Re)):f("",!0),a.isMultiSig?(o(),u("p",je,m(s.$t("general.multisig")),1)):f("",!0)],8,Ee)):f("",!0)])])])])}const Ge=G(Ie,[["render",Oe]]),Pe={class:"flex text-xs flex-wrap font-semibold border-b-2 menu_title_div"},De={name:"AccountTabs"},Je=U({...De,props:{address:String,selected:String},setup(s){const r=s,y=h(!1);ee(()=>{a()});const a=async()=>{if(!D.isReady){setTimeout(a,1e3);return}try{switch((await D.chainAPI.accountAPI.getAccountInfo(L.Address.createFromRawAddress(r.address))).accountType){case L.AccountType.Remote:y.value=!1;break;case L.AccountType.Remote_Unlinked:y.value=!1;break;default:y.value=!0;break}}catch{console.log("Error retrieving account type"),y.value=!1}};return(p,i)=>{const x=F("router-link");return o(),u("div",Pe,[_(x,{class:T([`${s.selected=="details"?"border-b-2  text-blue-primary border-blue-primary":""}`,"w-32 text-center py-3 word-break"]),to:{name:"ViewAccountDetails",params:{address:s.address}}},{default:M(()=>[V(m(p.$t("account.accountDetails")),1)]),_:1},8,["class","to"]),y.value?(o(),R(x,{key:0,class:T([`${s.selected=="assets"?"border-b-2  text-blue-primary border-blue-primary":""}`,"w-18 py-3 text-center word-break"]),to:{name:"ViewAccountAssets",params:{address:s.address}}},{default:M(()=>[V(m(p.$t("general.asset",2)),1)]),_:1},8,["class","to"])):f("",!0),y.value?(o(),R(x,{key:1,class:T([`${s.selected=="namespaces"?"border-b-2  text-blue-primary border-blue-primary":""}`,"w-24 py-3 text-center word-break"]),to:{name:"ViewAccountNamespaces",params:{address:s.address}}},{default:M(()=>[V(m(p.$t("general.namespace",2)),1)]),_:1},8,["class","to"])):f("",!0),y.value?(o(),R(x,{key:2,class:T([`${s.selected=="metadata"?"border-b-2  text-blue-primary border-blue-primary":""}`,"w-18 text-center py-3 word-break"]),to:{name:"ViewAccountMetadata",params:{address:s.address}}},{default:M(()=>i[0]||(i[0]=[V("Metadata")])),_:1},8,["class","to"])):f("",!0),y.value?(o(),R(x,{key:3,class:T([`${s.selected=="multisig"?"border-b-2  text-blue-primary border-blue-primary":""}`,"w-18 py-3 text-center word-break"]),to:{name:"ViewMultisigHome",params:{address:s.address}}},{default:M(()=>[V(m(p.$t("general.multisig")),1)]),_:1},8,["class","to"])):f("",!0),_(x,{class:T([`${s.selected=="txn"?"border-b-2  text-blue-primary border-blue-primary":""}`,"w-18 py-3 text-center word-break"]),to:{name:"ViewAccountConfirmedTransactions",params:{address:s.address}}},{default:M(()=>[V(m(p.$t("general.transaction",2)),1)]),_:1},8,["class","to"])])}}});export{Ge as A,Je as _,re as a};