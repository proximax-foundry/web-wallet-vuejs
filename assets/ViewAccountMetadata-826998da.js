import{d as H,i as I,o as M,b,m as n,v as l,x as w,t as _,y as h,e as d,f as T,I as L,J as V,_ as $,r as v,c as C,w as K,B as f,a as D,z as u}from"./index-f0fab120.js";import{_ as E}from"./icon-plus-7207f329.js";import{a as R,A as W,_ as B}from"./AccountTabs.vue_vue_type_script_setup_true_lang-f659e8e4.js";import{s as P,a as F}from"./column.esm-49b94109.js";import{U as Q}from"./UTF8-f0c3fb0f.js";import"./jdenticon-module-f8a9db48.js";import"./functions-f2e6f536.js";import"./TextInput-806b984f.js";import"./TextInputClean-5d304c85.js";import"./icon-key-5b3f7dda.js";const N=r=>(L("data-v-cc8d5c31"),r=r(),V(),r),z={class:"flex"},O={key:0,class:"ml-3 text-gray-400 font-semibold"},Z={key:0,class:"flex"},J=N(()=>d("div",{class:"ml-3 text-gray-400 font-semibold"},"utf-8",-1)),j={class:"text-xs"},q=N(()=>d("img",{src:R,title:"Update Metadata",class:"inline-block w-3 h-3 text-black cursor-pointer ml-1"},null,-1)),G=H({__name:"AccountMetadataDatatable",props:{accMetadata:Array,publicKey:String},setup(r){return(p,c)=>{const m=I("router-link");return M(),b("div",null,[n(h(F),{value:r.accMetadata,paginator:!0,rows:10,dataKey:"id",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown",rowsPerPageOptions:[10,20,30,40,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",responsiveLayout:"scroll"},{empty:l(()=>[w(_(p.$t("general.noRecord")),1)]),loading:l(()=>[w(_(p.$t("dashboard.fetchingTx")),1)]),default:l(()=>[n(h(P),{field:"scopedMetadataKey",header:"Scoped Metadata Key"},{body:l(({data:a})=>[d("div",z,[d("div",null,_(a.scopedMetadataKeyHex),1),a.scopedMetadataKeyUtf8?(M(),b("div",O,"hex")):T("",!0)]),a.scopedMetadataKeyUtf8?(M(),b("div",Z,[d("div",null,_(a.scopedMetadataKeyUtf8),1),J])):T("",!0)]),_:1}),n(h(P),{field:"currentValue",header:"Current Value"},{body:l(({data:a})=>[d("span",j,_(a.value),1)]),_:1}),n(h(P),{field:"action",header:"Action"},{body:l(({data:a})=>[n(m,{to:{name:"ViewUpdateAccountMetadata",params:{targetPublicKey:r.publicKey,scopedMetadataKey:a.scopedMetadataKeyUtf8?a.scopedMetadataKeyUtf8:a.scopedMetadataKeyHex}}},{default:l(()=>[q]),_:2},1032,["to"])]),_:1})]),_:1},8,["value"])])}}});const X=$(G,[["__scopeId","data-v-cc8d5c31"]]),Y={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},ee={class:"border-2 border-t-0"},te=d("button",{class:"mx-6 my-4 blue-btn py-3 px-3 flex items-center"},[d("img",{src:E,class:"inline-block w-4 h-4 mr-2"}),w("Create New Account Metadata")],-1),pe=H({__name:"ViewAccountMetadata",props:{address:String},setup(r){const p=r;v(0);const c=C(()=>{if(!K.currentLoggedInWallet)return null;let e=K.currentLoggedInWallet.accounts.find(t=>t.address==p.address)||K.currentLoggedInWallet.others.find(t=>t.address==p.address);return e||null});C(()=>c.value?c.value.getDirectParentMultisig().length>0:!1);const m=v([]);v([]),v([]);const a=e=>new Promise(t=>setTimeout(t,e)),S=async()=>{if(!c.value)return;let e=new u.MetadataQueryParams;e.metadataType=u.MetadataType.ACCOUNT,e.pageSize=100,e.pageNumber=1,e.targetKey=u.PublicAccount.createFromPublicKey(c.value.publicKey,f.networkType);let t=await f.chainAPI.metadataAPI.searchMetadatas(e);for(let s=0;s<t.metadataEntries.length;s++){let o=t.metadataEntries;m.value.push({scopedMetadataKeyUtf8:o[s].scopedMetadataKey.toHex()==g(o[s].scopedMetadataKey.toHex())?null:g(o[s].scopedMetadataKey.toHex()),scopedMetadataKeyHex:o[s].scopedMetadataKey.toHex(),value:o[s].value})}let x=t.pagination.totalPages;await a(250);for(let s=2;s<=x;s++){let o=new u.MetadataQueryParams;o.metadataType=u.MetadataType.ACCOUNT,o.pageSize=100,o.pageNumber=s,o.targetKey=c.value.publicKey;let k=await f.chainAPI.metadataAPI.searchMetadatas(o);for(let i=0;i<k.metadataEntries.length;i++){let y=k.metadataEntries;m.value.push({scopedMetadataKeyUtf8:y[i].scopedMetadataKey.toHex()==g(y[i].scopedMetadataKey.toHex())?null:g(y[i].scopedMetadataKey.toHex()),scopedMetadataKeyHex:y[i].scopedMetadataKey.toHex(),value:y[i].value}),await a(250)}}},A=e=>(e.endsWith("00")&&(e=e.substring(0,e.length-2),e=A(e)),e),g=e=>{e=A(e);let t=u.Convert.hexToUint8(e);return Q.isNotUTF8(t)||(e=u.Convert.decodeHexToUtf8(e)),e},U=async()=>{S()};if(f.isReady)U();else{let e=D(f,t=>{t.isReady&&(U(),e())})}return(e,t)=>{const x=I("router-link");return M(),b("div",null,[d("div",Y,[n(W,{address:r.address,class:"mb-6"},null,8,["address"]),n(B,{address:r.address,selected:"metadata"},null,8,["address"]),d("div",ee,[n(X,{publicKey:c.value?c.value.publicKey:"0".repeat(64),accMetadata:m.value},null,8,["publicKey","accMetadata"]),n(x,{to:{name:"ViewUpdateAccountMetadata",params:{targetPublicKey:c.value?c.value.publicKey:"0".repeat(64)}}},{default:l(()=>[te]),_:1},8,["to"])])])])}}});export{pe as default};