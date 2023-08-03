import{d as P,r as w,ab as S,ac as C,P as A,o as i,b as y,s as c,z as r,B as l,t as d,m as f,e as t,Q as T,C as h,f as v,ad as F,i as L,p as D,j as $,_ as I,c as H,E as b,a as R,ai as V,k as E,w as k}from"./index-42fb6041.js";import{A as N,_ as z}from"./AccountTabs.vue_vue_type_script_setup_true_lang-c323f8d6.js";import{s as g,a as B}from"./column.esm-e5421eee.js";import"./jdenticon-module-2412ea1e.js";import"./functions-6429d95a.js";import"./TextInput-2a10c657.js";import"./TextInputClean-8a67b611.js";import"./icon-key-5b3f7dda.js";const M=a=>(D("data-v-a2471b97"),a=a(),$(),a),W={class:"uppercase text-xxs font-bold mb-1"},K={class:"flex items-center"},O={class:"uppercase cursor-pointer font-bold text-txs"},j={class:"text-txs"},J=M(()=>t("div",{class:"uppercase text-xxs font-bold mb-1"}," Status ",-1)),Q={class:"flex items-center"},U={class:"text-txs"},q={class:"flex items-center"},G={class:"text-txs cursor-pointer"},X={class:"text-txs"},Y={directives:{tooltip:F}},Z=P({...Y,__name:"FailedTxnDT",props:{transactions:Array},setup(a){const n=w(!1),u=()=>{window.innerWidth<1024?n.value=!1:n.value=!0};u(),S(()=>{window.removeEventListener("resize",u)}),C(()=>{window.addEventListener("resize",u)});const p=L(),_=p==null?void 0:p.appContext.config.globalProperties.emitter,o=w(!1);return _.on("CLOSE_MODAL",s=>{o.value=s}),(s,m)=>{const x=A("tooltip");return i(),y("div",null,[c(h(B),{value:a.transactions,paginator:!0,rows:10,scrollDirection:"horizontal",alwaysShowPaginator:!1,responsiveLayout:"scroll",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:""},{empty:r(()=>[l(d(s.$t("general.noRecord")),1)]),loading:r(()=>[l(d(s.$t("dashboard.fetchingTx")),1)]),default:r(()=>[n.value?v("",!0):(i(),f(h(g),{key:0,style:{width:"200px"},headerClass:"invisible"},{body:r(({data:e})=>[t("div",null,[t("div",W,d(s.$t("dashboard.txHash")),1),t("div",K,[t("div",O,[T((i(),y("span",j,[l(d(e.txnHash.substring(0,20))+"...",1)])),[[x,e.txnHash,void 0,{right:!0}]])])])])]),_:1})),n.value?v("",!0):(i(),f(h(g),{key:1,style:{width:"200px"},headerClass:"invisible"},{body:r(({data:e})=>[t("div",null,[J,t("div",Q,[t("span",U,d(e.statusMsg),1)])])]),_:1})),n.value?(i(),f(h(g),{key:2,field:"hash",header:s.$t("dashboard.txHash"),headerStyle:"width:100px"},{body:r(({data:e})=>[t("div",q,[T((i(),y("span",G,[l(d(e.txnHash.substring(0,20))+"...",1)])),[[x,e.txnHash,void 0,{bottom:!0}]])])]),_:1},8,["header"])):v("",!0),n.value?(i(),f(h(g),{key:3,field:"status",header:"Status",headerStyle:"width:110px"},{body:r(({data:e})=>[t("span",X,d(e.statusMsg),1)]),_:1})):v("",!0)]),_:1},8,["value"])])}}});const ee=I(Z,[["__scopeId","data-v-a2471b97"]]),te={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},se={class:"flex my-2 gap-5 flex-none text-xs md:text-sm"},ae=t("div",{class:"border rounded-md text-white py-2 px-5",style:{background:"#DC143C"}},"Failed",-1),pe=P({__name:"ViewAccountFailedTransactions",props:{address:String},setup(a){const n=w([]),u=H(()=>{let o=[];return o=n.value,o}),p=async()=>{if(!b.chainAPI||!k.currentLoggedInWallet)return;const o=k.currentLoggedInWallet.accounts.find(e=>e.default===!0),s=o?o.publicKey:"";let x=(JSON.parse(sessionStorage.getItem("allFailedTransactions"))||[]).filter(e=>e.accPubKey.includes(s));n.value=x.flat()},_=async()=>{await p()};if(b.isReady)_();else{let o=R(b,s=>{s.isReady&&(_(),o())})}return V(()=>{setInterval(()=>{_()},1e3)}),(o,s)=>{const m=E("router-link");return i(),y("div",null,[t("div",te,[c(N,{address:a.address,class:"mb-6"},null,8,["address"]),c(z,{address:a.address,selected:"txn"},null,8,["address"]),t("div",se,[c(m,{to:{name:"ViewAccountConfirmedTransactions",params:{address:a.address}},class:"border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-4",style:{background:"#007CFF"}},{default:r(()=>[l("Confirmed")]),_:1},8,["to"]),c(m,{to:{name:"ViewAccountPendingTransactions",params:{address:a.address}},class:"border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-5",style:{background:"#f3a91d"}},{default:r(()=>[l("Pending")]),_:1},8,["to"]),ae]),c(ee,{transactions:u.value,class:"mt-3"},null,8,["transactions"])])])}}});export{pe as default};