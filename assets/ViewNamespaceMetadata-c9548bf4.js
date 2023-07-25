import{d as E,r as w,E as m,a as H,k as V,o as b,b as g,e as t,s as r,z as c,t as i,A as P,C as x,f as S,p as R,j as L,B as n,_ as B}from"./index-f81de996.js";import{_ as D}from"./chevron_left-0423cb29.js";import{A as F,a as Q,_ as $}from"./AccountTabs-9e5c8eeb.js";import{_ as j}from"./icon-plus-7207f329.js";import{s as M,a as z}from"./column.esm-a96344fe.js";import{U as Z}from"./UTF8-3b29fdc9.js";import"./jdenticon-module-7161194d.js";import"./functions-ee8fa276.js";import"./TextInput-3c8a9d79.js";import"./TextInputClean-1671b736.js";import"./icon-key-5b3f7dda.js";const p=o=>(R("data-v-332024b1"),o=o(),L(),o),W={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},O={class:"border-2 border-t-0"},q={class:"flex cursor-pointer items-center pt-3 px-3"},G=p(()=>t("img",{src:D},null,-1)),J={class:"text-blue-primary text-xs"},X={class:"border border-blue-primary p-4 bg-blue-100 flex flex-col rounded mt-5 mx-6 mb-5"},Y=p(()=>t("div",{class:"uppercase text-blue-primary font-semibold text-xxs"},"NAMESPACE ID",-1)),ee={class:"text-black text-sm font-bold"},ae=p(()=>t("div",{class:"uppercase text-blue-primary font-semibold text-xxs mt-3"},"Name",-1)),te={class:"text-black text-sm font-bold"},se={class:"flex"},oe={key:0,class:"ml-3 text-gray-400 font-semibold"},de={key:0,class:"flex"},re=p(()=>t("div",{class:"ml-3 text-gray-400 font-semibold"},"utf-8",-1)),ce={class:"text-xs"},ne=p(()=>t("img",{src:$,title:"Update Metadata",class:"inline-block w-3 h-3 text-black cursor-pointer ml-1"},null,-1)),ie=p(()=>t("button",{class:"mx-6 my-4 blue-btn py-3 px-3 flex items-center"},[t("img",{src:j,class:"inline-block w-4 h-4 mr-2"}),P("Create New Namespace Metadata")],-1)),le=E({__name:"ViewNamespaceMetadata",props:{namespaceId:String,address:String},setup(o){const _=o,I=w("-"),U=async()=>{let e=await m.chainAPI.namespaceAPI.getNamespace(new n.NamespaceId(_.namespaceId));I.value=e.id.toHex()},h=w([]),v=w(""),T=async()=>{let e=await m.chainAPI.accountAPI.getAccountInfo(n.Address.createFromRawAddress(_.address));v.value=e.publicKey},N=e=>new Promise(d=>setTimeout(d,e)),A=e=>(e.endsWith("00")&&(e=e.substring(0,e.length-2),e=A(e)),e),f=e=>{e=A(e);let d=n.Convert.hexToUint8(e);return Z.isNotUTF8(d)||(e=n.Convert.decodeHexToUtf8(e)),e},C=async()=>{let e=new n.MetadataQueryParams;e.metadataType=n.MetadataType.NAMESPACE,e.pageSize=100,e.pageNumber=1,e.targetId=new n.NamespaceId(_.namespaceId),e.targetKey=v.value;let d=await m.chainAPI.metadataAPI.searchMetadatas(e);for(let a=0;a<d.metadataEntries.length;a++){let s=d.metadataEntries;h.value.push({scopedMetadataKeyUtf8:s[a].scopedMetadataKey.toHex()==f(s[a].scopedMetadataKey.toHex())?null:f(s[a].scopedMetadataKey.toHex()),scopedMetadataKeyHex:s[a].scopedMetadataKey.toHex(),value:s[a].value})}let u=d.pagination.totalPages;await N(250);for(let a=2;a<=u;a++){let s=new n.MetadataQueryParams;s.metadataType=n.MetadataType.NAMESPACE,s.pageSize=100,s.pageNumber=a,s.targetId=_.namespaceId,s.targetKey=v.value;let k=await m.chainAPI.metadataAPI.searchMetadatas(s);for(let l=0;l<k.metadataEntries.length;l++){let y=k.metadataEntries;h.value.push({scopedMetadataKeyUtf8:y[l].scopedMetadataKey.toHex()==f(y[l].scopedMetadataKey.toHex())?null:f(y[l].scopedMetadataKey.toHex()),scopedMetadataKeyHex:y[l].scopedMetadataKey.toHex(),value:y[l].value}),await N(250)}}},K=async()=>{await T(),await U(),C()};if(m.isReady)K();else{let e=H(m,d=>{d.isReady&&(K(),e())})}return(e,d)=>{const u=V("router-link");return b(),g("div",null,[t("div",W,[r(F,{address:o.address,class:"mb-6"},null,8,["address"]),r(Q,{address:o.address,selected:"namespaces"},null,8,["address"]),t("div",O,[r(u,{to:{name:"ViewAccountNamespaces",params:{address:o.address}}},{default:c(()=>[t("div",q,[G,t("div",J,i(e.$t("general.back")),1)])]),_:1},8,["to"]),t("div",X,[t("div",null,[Y,t("div",ee,i(I.value),1)]),t("div",null,[ae,t("div",te,i(o.namespaceId),1)])]),r(x(z),{value:h.value,paginator:!0,rows:10,dataKey:"id",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown",rowsPerPageOptions:[10,20,30,40,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",responsiveLayout:"scroll"},{empty:c(()=>[P(i(e.$t("general.noRecord")),1)]),loading:c(()=>[P(i(e.$t("dashboard.fetchingTx")),1)]),default:c(()=>[r(x(M),{field:"scopedMetadataKey",header:"Scoped Metadata Key",style:{"`wideScreen?'min-width":"200px'?'width: 200px'  `"}},{body:c(({data:a})=>[t("div",se,[t("div",null,i(a.scopedMetadataKeyHex),1),a.scopedMetadataKeyUtf8?(b(),g("div",oe,"hex")):S("v-if",!0)]),a.scopedMetadataKeyUtf8?(b(),g("div",de,[t("div",null,i(a.scopedMetadataKeyUtf8),1),re])):S("v-if",!0)]),_:1}),r(x(M),{field:"currentValue",header:"Current Value",style:{"`wideScreen?'min-width":"180px'?'width: 180px'`"}},{body:c(({data:a})=>[t("span",ce,i(a.value),1)]),_:1}),r(x(M),{field:"action",header:"Action",style:{"`wideScreen?'min-width":"180px'?'width: 180px'`"}},{body:c(({data:a})=>[r(u,{to:{name:"ViewUpdateNamespaceMetadata",params:{targetId:o.namespaceId,scopedMetadataKey:a.scopedMetadataKeyUtf8?a.scopedMetadataKeyUtf8:a.scopedMetadataKeyHex}}},{default:c(()=>[ne]),_:2},1032,["to"])]),_:1})]),_:1},8,["value"]),r(u,{to:{name:"ViewUpdateNamespaceMetadata",params:{targetId:o.namespaceId}}},{default:c(()=>[ie]),_:1},8,["to"])])])])}}});const ge=B(le,[["__scopeId","data-v-332024b1"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/metadataTxn/views/ViewNamespaceMetadata.vue"]]);export{ge as default};