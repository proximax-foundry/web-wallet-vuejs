import{d as C,g as b,ah as T,$ as S,Q as A,o as r,f as _,l as c,b as o,s as u,t as i,a as v,e as s,O as k,v as h,i as g,ag as L,E as F,c as $,A as w,D,a5 as H,r as R,w as P}from"./index-d2e8ccc1.js";import{A as V,_ as E}from"./AccountTabs.vue_vue_type_script_setup_true_lang-8844b832.js";import{s as y,a as N}from"./column.esm-15667edd.js";import"./jdenticon-module-59aa2fb9.js";import"./functions-35769730.js";import"./TextInput-729dd071.js";import"./TextInputClean-7f026065.js";import"./icon-key-5b3f7dda.js";const I={class:"uppercase text-xxs font-bold mb-1"},M={class:"flex items-center"},z={class:"uppercase cursor-pointer font-bold text-txs"},B={class:"text-txs"},O={class:"flex items-center"},W={class:"text-txs"},K={class:"flex items-center"},J={class:"text-txs cursor-pointer"},Q={class:"text-txs"},U={directives:{tooltip:L}},j=C({...U,__name:"FailedTxnDT",props:{transactions:Array},setup(l){const n=b(!1),p=()=>{window.innerWidth<1024?n.value=!1:n.value=!0};p(),T(()=>{window.removeEventListener("resize",p)}),S(()=>{window.addEventListener("resize",p)});const m=F(),x=m==null?void 0:m.appContext.config.globalProperties.emitter,a=b(!1);return x.on("CLOSE_MODAL",e=>{a.value=e}),(e,d)=>{const f=A("tooltip");return r(),_("div",null,[c(h(N),{value:l.transactions,paginator:!0,rows:10,scrollDirection:"horizontal",alwaysShowPaginator:!1,responsiveLayout:"scroll",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:""},{empty:o(()=>[u(i(e.$t("general.noRecord")),1)]),loading:o(()=>[u(i(e.$t("dashboard.fetchingTx")),1)]),default:o(()=>[n.value?g("",!0):(r(),v(h(y),{key:0,style:{width:"200px"},headerClass:"invisible"},{body:o(({data:t})=>[s("div",null,[s("div",I,i(e.$t("dashboard.txHash")),1),s("div",M,[s("div",z,[k((r(),_("span",B,[u(i(t.txnHash.substring(0,20))+"...",1)])),[[f,t.txnHash,void 0,{right:!0}]])])])])]),_:1})),n.value?g("",!0):(r(),v(h(y),{key:1,style:{width:"200px"},headerClass:"invisible"},{body:o(({data:t})=>[s("div",null,[d[0]||(d[0]=s("div",{class:"uppercase text-xxs font-bold mb-1"}," Status ",-1)),s("div",O,[s("span",W,i(t.statusMsg),1)])])]),_:1})),n.value?(r(),v(h(y),{key:2,field:"hash",header:e.$t("dashboard.txHash"),headerStyle:"width:100px"},{body:o(({data:t})=>[s("div",K,[k((r(),_("span",J,[u(i(t.txnHash.substring(0,20))+"...",1)])),[[f,t.txnHash,void 0,{bottom:!0}]])])]),_:1},8,["header"])):g("",!0),n.value?(r(),v(h(y),{key:3,field:"status",header:"Status",headerStyle:"width:110px"},{body:o(({data:t})=>[s("span",Q,i(t.statusMsg),1)]),_:1})):g("",!0)]),_:1},8,["value"])])}}}),q={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},G={class:"flex my-2 gap-5 flex-none text-xs md:text-sm"},oe=C({__name:"ViewAccountFailedTransactions",props:{address:String},setup(l){const n=b([]),p=$(()=>{let a=[];return a=n.value,a}),m=async()=>{if(!w.chainAPI||!P.currentLoggedInWallet)return;const a=P.currentLoggedInWallet.accounts.find(t=>t.default===!0),e=a?a.publicKey:"";let f=(JSON.parse(sessionStorage.getItem("allFailedTransactions"))||[]).filter(t=>t.accPubKey.includes(e));n.value=f.flat()},x=async()=>{await m()};if(w.isReady)x();else{let a=D(w,e=>{e.isReady&&(x(),a())})}return H(()=>{setInterval(()=>{x()},1e3)}),(a,e)=>{const d=R("router-link");return r(),_("div",null,[s("div",q,[c(V,{address:l.address,class:"mb-6"},null,8,["address"]),c(E,{address:l.address,selected:"txn"},null,8,["address"]),s("div",G,[c(d,{to:{name:"ViewAccountConfirmedTransactions",params:{address:l.address}},class:"border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-4",style:{background:"#007CFF"}},{default:o(()=>e[0]||(e[0]=[u("Confirmed")])),_:1},8,["to"]),c(d,{to:{name:"ViewAccountPendingTransactions",params:{address:l.address}},class:"border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-5",style:{background:"#f3a91d"}},{default:o(()=>e[1]||(e[1]=[u("Pending")])),_:1},8,["to"]),e[2]||(e[2]=s("div",{class:"border rounded-md text-white py-2 px-5",style:{background:"#DC143C"}},"Failed",-1))]),c(j,{transactions:p.value,class:"mt-3"},null,8,["transactions"])])])}}});export{oe as default};