import{d as N,u as T,A as K,r as m,c as O,w as o,i as R,o as y,b as _,e as n,m as p,v as w,x as g,t as r,f as L,y as F,h as M,aW as P}from"./index-f0fab120.js";import{_ as H}from"./icon-download-26660e63.js";import{s as U}from"./multiselect.esm-d705063e.js";import{A as B}from"./addressBookUtils-0d3294bf.js";const D={class:"w-9/12 ml-auto mr-auto mt-5"},j={class:"flex text-xs font-semibold border-b-2 menu_title_div"},q={class:"w-18 text-center border-b-2 pb-3 border-yellow-500"},z={class:"mt-10"},G={class:"text-md my-5 font-semibold"},J={class:"flex cursor-pointer"},Q={class:"border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold"},X={class:"text-tsm"},Y={key:0,class:"bg-blue-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2"},Z={key:1,class:"bg-yellow-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2"},ee={class:"mt-4"},te=n("img",{src:H,class:"inline-block mr-4 relative top-1"},null,-1),le=N({__name:"ViewServicesAddressBookImportAccount",setup(se){const{t:x}=T(),W=K(),A=M().appContext.config.globalProperties.emitter,f=m([]),i=m(0),u=m(0),b=m([]),k=e=>{const s=o.currentLoggedInWallet.contacts.find(t=>t.address==e.address);return s?s.name:e.name},$=O(()=>{if(!o.currentLoggedInWallet)return[];let e=o.currentLoggedInWallet.accounts.map(t=>({name:k(t),address:t.address,publicKey:t.publicKey,group:"Account"})),s=o.currentLoggedInWallet.others.map(t=>({name:k(t),address:t.address,publicKey:t.publicKey,group:"OtherAccount"}));return e.concat(s)}),I=()=>{o.currentLoggedInWallet&&(f.value=[],o.currentLoggedInWallet.contacts!=null&&o.currentLoggedInWallet.contacts.length>0&&(o.currentLoggedInWallet.contacts.forEach(e=>{f.value.push(e)}),f.value.sort((e,s)=>e.name>s.name?1:e.name<s.name?-1:0)))};I(),A.on("REFRESH_CONTACT_LIST",e=>{e&&setTimeout(()=>{I()},1e3)});const S=()=>{if(!o.currentLoggedInWallet)return;const e=o.currentLoggedInWallet;let s=[],t=[];b.value.forEach(a=>{let l=a.name,c=a.address,v=a.group,h=a.publicKey;const V=e.contacts!=null?e.contacts.findIndex(d=>d.address==c):-1,E=e.contacts!=null?e.contacts.findIndex(d=>d.name.toLowerCase()==l.toLowerCase()):-1,C=o.currentLoggedInWallet.accounts.find(d=>d.default==!0);V>=0?s.push({label:l,address:c,group:v,publicKey:h}):E>=0?B.verifyNetworkAddress(C.address,c).isPassed&&t.push({label:l+" - 2",address:c,group:v,publicKey:h}):B.verifyNetworkAddress(C.address,c).isPassed&&t.push({label:l,address:c,group:v,publicKey:h})}),s.length>0&&(u.value=s.length),t.length>0&&(t.forEach(a=>{let l=new P(a.label,a.address,a.group,a.publicKey);o.currentLoggedInWallet.addAddressBook(l)}),o.wallets.saveMyWalletOnlytoLocalStorage(o.currentLoggedInWallet),i.value=t.length,A.emit("REFRESH_CONTACT_LIST",!0),W.add({severity:"info",summary:x("general.addressBook"),detail:x("addressBook.newContactImported",i.value),group:"br-custom",life:5e3}))};return(e,s)=>{const t=R("router-link");return y(),_("div",null,[n("div",D,[n("div",j,[p(t,{to:{name:"ViewServicesAddressBook"},class:"w-18 text-center border-b pb-3"},{default:w(()=>[g(r(e.$t("general.list")),1)]),_:1}),n("div",q,r(e.$t("general.import")),1),p(t,{to:{name:"ViewServicesAddressBookExport"},class:"w-18 text-center border-b pb-3"},{default:w(()=>[g(r(e.$t("general.export")),1)]),_:1})]),n("div",z,[n("div",G,r(e.$t("addressBook.importContacts")),1),n("div",J,[p(t,{to:{name:"ViewServicesAddressBookImport"},class:"border-2 border-blue-primary p-1 mb-3 w-20 text-blue-primary text-xs text-center font-semibold"},{default:w(()=>[g(r(e.$t("wallet.importFile")),1)]),_:1}),n("div",Q,r(e.$t("general.account")),1)]),n("div",X,r(e.$t("addressBook.addAccountContact")),1),i.value>0?(y(),_("div",Y,r(i.value)+" "+r(e.$t("general.contact",i.value))+" "+r(e.$t("addressBook.addressBookMessage1")),1)):L("",!0),u.value>0?(y(),_("div",Z,r(u.value)+" "+r(e.$t("general.contact",u.value))+" "+r(e.$t("addressBook.addressBookMessage2")),1)):L("",!0),n("div",ee,[p(F(U),{modelValue:b.value,"onUpdate:modelValue":s[0]||(s[0]=a=>b.value=a),options:$.value,filter:"",optionLabel:"name",placeholder:"Accounts",class:"w-60 inline-block mr-2"},null,8,["modelValue","options"])]),n("div",{onClick:s[1]||(s[1]=a=>S()),class:"w-36 cursor-pointer mt-5 py-2 px-5 rounded-md bg-blue-primary text-white text-tsm drop-shadow-lg filter hover:bg-blue-600 transition-all duration-500"},[te,g(r(e.$t("general.import")),1)])])])])}}});export{le as default};