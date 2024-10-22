import{d as P,j as I,g as w,k as R,o as h,f as k,e as c,l as r,v as o,aa as S,F as V,c as N,w as y,x as C,A as b,D as H,r as B,b as n,s as m,t as u,n as A}from"./index-d2e8ccc1.js";import{_ as E}from"./icon-green-tick-1b766454.js";import{_ as $}from"./icon-red-x-a5511f99.js";import{_ as D}from"./icon-plus-7207f329.js";import{s as l,a as F}from"./column.esm-15667edd.js";import{A as T,_ as W}from"./AccountTabs.vue_vue_type_script_setup_true_lang-8844b832.js";import{_ as M}from"./icon-more-options-3f3cfda9.js";import"./jdenticon-module-59aa2fb9.js";import"./functions-35769730.js";import"./TextInput-729dd071.js";import"./TextInputClean-7f026065.js";import"./icon-key-5b3f7dda.js";const j=P({__name:"NamespaceAction",props:{address:{},id:{},name:{}},setup(i){const{t:p}=I(),d=w(),f=R(),v=w([{label:p("general.extendDuration"),command:()=>{f.push({name:"ViewServicesNamespaceExtend",params:{address:i.address,namespaceId:i.id}})}},{label:"View Metadata",command:()=>{f.push({name:"ViewNamespaceMetadata",params:{namespaceId:i.name,address:i.address}})}}]),g=_=>{d.value.toggle(_)};return(_,x)=>(h(),k(V,null,[c("img",{src:M,class:"w-4 h-4 cursor-pointer ml-2 mt-0.5",onClick:g}),r(o(S),{ref_key:"menu",ref:d,model:v.value,popup:!0},null,8,["model"])],64))}}),K={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},O={class:"border-2 border-t-0 pb-3"},q=["href"],z={class:"min-w-min uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7"},G={class:"truncate"},J={key:0,src:E,class:"h-5 w-5 ml-1"},Q={key:1,src:$,class:"h-5 w-5 ml-1"},le=P({__name:"ViewAccountNamespaces",props:{address:String},setup(i){const p=i,d=N(()=>{if(!y.currentLoggedInWallet)return null;let e=y.currentLoggedInWallet.accounts.find(s=>s.address==p.address)||y.currentLoggedInWallet.others.find(s=>s.address==p.address);return e||null}),f=w([]),v=w([]),g=N(()=>{if(!d.value)return;let e=[];for(let s=0;s<d.value.namespaces.length;s++){let a=d.value.namespaces[s];a.endHeight||(a.endHeight=0),e.push({name:a.name,id:a.idHex,linkedAssetAddress:a.linkedId!=""?a.linkType==2?C.Address.createFromRawAddress(a.linkedId).pretty():a.linkedId:"-",expiringBlock:a.endHeight,isActive:_(a.name)?!0:Number(a.endHeight)>b.readBlockHeight})}return e}),_=e=>!!e.includes("prx"),x=async()=>{for(let e=0;e<g.value.length;e++)v.value.push(!1),f.value.push(!1)};if(b.isReady)x();else{let e=H(b,s=>{s.isReady&&(x(),e())})}const L=e=>A.currentNetworkProfile?A.currentNetworkProfile.chainExplorer.url+"/"+A.currentNetworkProfile.chainExplorer.namespaceInfoRoute+"/"+e:"";return(e,s)=>{const a=B("router-link");return h(),k("div",K,[r(T,{address:i.address,class:"mb-6"},null,8,["address"]),r(W,{address:i.address,selected:"namespaces"},null,8,["address"]),c("div",O,[r(o(F),{value:g.value,paginator:!0,rows:10,dataKey:"id",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown",rowsPerPageOptions:[10,20,30,40,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",responsiveLayout:"scroll"},{empty:n(()=>s[0]||(s[0]=[m(" No namespaces found. ")])),loading:n(()=>s[1]||(s[1]=[m(" Loading namespaces data. Please wait. ")])),default:n(()=>[r(o(l),{field:"id",header:"ID"},{body:n(({data:t})=>[c("a",{href:L(t.id),target:"_new",class:"col-span-2"},[c("div",z,u(t.id),1)],8,q)]),_:1}),r(o(l),{field:"name",header:"Name"},{body:n(({data:t})=>[m(u(t.name),1)]),_:1}),r(o(l),{field:"linked",header:"Linked Asset/Address"},{body:n(({data:t})=>[c("div",G,u(t.linkedAssetAddress),1)]),_:1}),r(o(l),{field:"expiry",header:"Expiry"},{body:n(({data:t})=>[m(u(t.expiringBlock),1)]),_:1}),r(o(l),{field:"active",header:"Active"},{body:n(({data:t})=>[t.isActive?(h(),k("img",J)):(h(),k("img",Q))]),_:1}),r(o(l),{field:"actions",header:"Actions"},{body:n(({data:t,index:U})=>[r(j,{address:i.address,id:t.id,name:t.name},null,8,["address","id","name"])]),_:1})]),_:1},8,["value"]),r(a,{to:{name:"ViewServicesNamespaceCreate"},class:"mt-2 bg-blue-primary py-3 mx-6 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-52"},{default:n(()=>[s[2]||(s[2]=c("img",{src:D,class:"inline-block mr-2"},null,-1)),m(u(e.$t("namespace.registerNewNamespace")),1)]),_:1})])])}}});export{le as default};