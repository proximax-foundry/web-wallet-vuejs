import{_ as B,a7 as ee,ac as se,u as te,r as b,aa as oe,a9 as ne,g as H,aS as ae,B as V,c as D,w as v,E as T,H as j,n as z,k as S,o as r,b as d,s as k,z as m,e as t,t as n,A as _,m as w,F as $,i as E,f,p as re,j as le}from"./index-f81de996.js";import"./assetsUtils-164864f1.js";import{S as ie}from"./SelectInputPluginClean-88aa12a6.js";import{a as de,s as ce}from"./column.esm-a96344fe.js";import{_ as ue}from"./icon-more-options-3f3cfda9.js";import{_ as me}from"./icon-link-new-caba1c4b.js";import{_ as pe}from"./icon-plus-7207f329.js";import"./multiselect-9024d715.js";const he={components:{DataTable:de,Column:ce,SelectInputPluginClean:ie},name:"AssetDataTable",props:{assets:Array,account:ee,address:String},directives:{tooltip:se},setup(o){const{t:p}=te(),x=b(!1),e=()=>{window.innerWidth<"1024"?x.value=!1:x.value=!0};e(),oe(()=>{window.addEventListener("resize",e)}),ne(()=>{window.removeEventListener("resize",e)});const L=H().appContext.config.globalProperties.emitter,y=b([]),c=b([]),A=b(""),{address:O}=ae(o);o.address&&(A.value=V.Address.createFromRawAddress(O.value).plain());const s=D(()=>{let a=[];return a.push({value:"",label:p("general.showAll")}),v.currentLoggedInWallet.accounts.forEach(h=>{a.push({value:h.address,label:h.name})}),v.currentLoggedInWallet.others.forEach(h=>{a.push({value:h.address,label:h.name})}),a}),i=D(()=>{let a=[];if(g.value){let l=v.currentLoggedInWallet.accounts.find(u=>u.address==g.value)||v.currentLoggedInWallet.others.find(u=>u.address==g.value);if(!l)return[];l.assets.filter(u=>u.creator===l.publicKey).forEach(u=>{a.push({asset:u,account:l})})}else v.currentLoggedInWallet.accounts.forEach(l=>{l.assets.filter(u=>u.creator===l.publicKey).forEach(u=>{a.push({asset:u,account:l})})}),v.currentLoggedInWallet.others.forEach(l=>{l.assets.filter(u=>u.creator===l.publicKey).forEach(u=>{a.push({asset:u,account:l})})});let h=[];for(let l=0;l<a.length;++l){let u=[],C=a[l].asset.idHex;if(C!=T.nativeToken.assetId){let W=a[l].account.findNamespaceNameByAsset(C);for(let P=0;P<W.length;++P){let Z={name:W[P].name};u.push(Z)}let Y={i:l,idHex:C,owner:a[l].asset.creator,address:V.PublicAccount.createFromPublicKey(a[l].asset.creator,T.networkType).address.pretty(),amount:j.toCurrencyFormat(a[l].asset.amount,a[l].asset.divisibility),supply:j.toCurrencyFormat(a[l].asset.getExactSupply(),a[l].asset.divisibility),linkedNamespace:u,height:a[l].asset.height,explorerLink:T.isReady?z.currentNetworkProfile.chainExplorer.url+"/"+z.currentNetworkProfile.chainExplorer.assetInfoRoute+"/"+C:""};h.push(Y)}}return h}),g=b(""),R=b("border border-gray-400"),F=a=>{M.value=a,c.value[a]=!c.value[a]},K=a=>{I.value=a,y.value[a]=!y.value[a]};L.on("PAGE_CLICK",()=>{for(var a=0;a<c.value.length;)a!=M.value&&(c.value[a]=!1),a++;for(var h=0;h<y.value.length;)h!=I.value&&(y.value[h]=!1),h++});const I=b("empty"),M=b("empty"),U=a=>{I.value=a},G=()=>{I.value="empty"},Q=a=>{M.value=a},X=()=>{M.value="empty"},q=a=>{if(v.currentLoggedInWallet){let h=v.currentLoggedInWallet.accounts.find(l=>l.address==a)||v.currentLoggedInWallet.others.find(l=>l.address==a);return h?h.name:""}else return""},J=D(()=>v.currentLoggedInWallet?v.currentLoggedInWallet.name:"");return{borderColor:R,showMenu:K,showNsList:F,isMenuShow:y,isNsListShow:c,hoverOverMenu:U,hoverOutMenu:G,hoverOverNsList:Q,hoverOutNsList:X,listAccounts:s,filterAssets:g,walletState:v,generateAssetDatatable:i,selectedAddress:A,wideScreen:x,getNameByAddress:q,walletName:J}}},ve=o=>(re("data-v-d33f9b7f"),o=o(),le(),o),ge={class:"flex justify-between"},_e={class:"text-sm pt-1 text-gray-700 ml-2 lg:ml-7"},fe={class:"uppercase text-xxs text-gray-300 font-bold mb-1"},be={class:"uppercase font-bold text-txs"},ye={class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},we={class:"uppercase font-bold text-txs"},xe={key:0},ke={key:0},Ne={class:"mb-1 text-txs"},Le={key:1},Ae={class:"mb-1 text-txs"},Se=["onClick","onMouseover"],Ie={class:"font-bold"},Me=["onMouseover"],Ce={key:1},$e={class:"uppercase text-xxs text-gray-300 font-bold mb-1"},Ee={class:"uppercase font-bold text-txs"},Oe={class:"uppercase text-xxs text-gray-300 font-bold mt-2 mb-1"},Pe={class:"uppercase font-bold text-txs"},De={class:"uppercase text-xxs text-gray-300 font-bold mt-2 mb-1"},Te={class:"uppercase font-bold text-txs"},We={class:"uppercase font-bold text-txs"},Ve={key:0},je={key:0},ze={class:"mb-1 text-txs"},Be={key:1},He={class:"mb-1 text-txs"},Re=["onClick","onMouseover"],Fe={class:"font-bold"},Ke=["onMouseover"],Ue={key:1},Ge={class:"uppercase text-txs"},Qe={class:"uppercase font-bold text-txs"},Xe={class:"text-txs"},qe=["onMouseover"],Je=["onClick"],Ye={key:0,class:"mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2",role:"menu","aria-orientation":"vertical","aria-labelledby":"options-menu"},Ze={role:"none",class:"my-2"},es=["href"],ss=ve(()=>t("img",{src:me,class:"inline-block ml-2 relative -top-1"},null,-1));function ts(o,p,x,e,N,L){const y=S("SelectInputPluginClean"),c=S("Column"),A=S("router-link"),O=S("DataTable");return r(),d("div",null,[k(O,{value:e.generateAssetDatatable,paginator:!0,rows:20,responsiveLayout:"scroll",scrollDirection:"horizontal",alwaysShowPaginator:!1,paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",tableStyle:"",class:"w-full"},{header:m(()=>[t("div",ge,[t("span",_e,n(o.$t("general.asset",2))+" ("+n(e.getNameByAddress(e.filterAssets)==""?o.$t("asset.assetCreatedInWallet",{walletName:e.walletName}):o.$t("asset.assetCreatedByAcc",{accountName:e.getNameByAddress(e.filterAssets)}))+")",1),k(y,{modelValue:e.filterAssets,"onUpdate:modelValue":p[0]||(p[0]=s=>e.filterAssets=s),options:e.listAccounts,selectDefault:e.selectedAddress,class:"w-48 lg:w-60 inline-block"},null,8,["modelValue","options","selectDefault"])])]),empty:m(()=>[_(n(o.$t("general.noRecord")),1)]),loading:m(()=>[_(n(o.$t("dashboard.fetchingTx")),1)]),default:m(()=>[e.wideScreen?f("v-if",!0):(r(),w(c,{key:0,style:{width:"250px"}},{body:m(({data:s})=>[t("div",null,[t("div",fe,n(o.$t("general.assetId")),1),t("div",be,n(s.idHex),1)]),t("div",null,[t("div",ye,n(o.$t("general.namespace")),1),t("div",we,[s.linkedNamespace.length>0?(r(),d("div",xe,[s.linkedNamespace.length==1?(r(),d("div",ke,[(r(!0),d($,null,E(s.linkedNamespace,(i,g)=>(r(),d("div",{key:g},[t("div",Ne,n(i.name),1)]))),128))])):(r(),d("div",Le,[t("div",Ae,[_(n(s.linkedNamespace[0].name)+" ",1),t("div",{class:"inline-block border border-gray-300 p-1 rounded-sm ml-2 cursor-pointer",onClick:i=>e.showNsList(s.i),onMouseover:i=>e.hoverOverNsList(s.i),onMouseout:p[1]||(p[1]=(...i)=>e.hoverOutNsList&&e.hoverOutNsList(...i))},[_("+ "),t("span",Ie,n(s.linkedNamespace.length-1),1)],40,Se)]),e.isNsListShow[s.i]?(r(),d("div",{key:0,class:"border p-3 w-28 border-gray-100 shadow-sm absolute bg-white",onMouseover:i=>e.hoverOverNsList(s.i),onMouseout:p[2]||(p[2]=(...i)=>e.hoverOutNsList&&e.hoverOutNsList(...i))},[(r(!0),d($,null,E(s.linkedNamespace.slice(1),(i,g)=>(r(),d("div",{key:g},n(i.name),1))),128))],40,Me)):f("v-if",!0)]))])):(r(),d("div",Ce,n(o.$t("general.noLinkedNamespace")),1))])])]),_:1})),e.wideScreen?f("v-if",!0):(r(),w(c,{key:1,style:{width:"250px"}},{body:m(({data:s})=>[t("div",null,[t("div",$e,n(o.$t("general.supply")),1),t("div",Ee,n(s.supply),1),t("div",Oe,n(o.$t("general.amount")),1),t("div",Pe,n(s.amount),1),t("div",De,n(o.$t("general.block")),1),t("div",Te,n(s.height),1)])]),_:1})),e.wideScreen?(r(),w(c,{key:2,style:{width:"50px"}})):f("v-if",!0),e.wideScreen?(r(),w(c,{key:3,field:"assetId",header:o.$t("general.assetId"),style:{"`wideScreen?'min-width":"200px'?'width: 200px'`"}},{body:m(({data:s})=>[t("span",We,n(s.idHex),1)]),_:1},8,["header"])):f("v-if",!0),e.wideScreen?(r(),w(c,{key:4,field:"linkedNamespace",header:o.$t("general.namespace"),style:{"`wideScreen?'min-width":"180px'?'width: 180px'`"}},{body:m(({data:s})=>[s.linkedNamespace.length>0?(r(),d("div",Ve,[s.linkedNamespace.length==1?(r(),d("div",je,[(r(!0),d($,null,E(s.linkedNamespace,(i,g)=>(r(),d("div",{key:g},[t("div",ze,n(i.name),1)]))),128))])):(r(),d("div",Be,[t("div",He,[_(n(s.linkedNamespace[0].name)+" ",1),t("div",{class:"inline-block border border-gray-300 p-1 rounded-sm ml-2 cursor-pointer",onClick:i=>e.showNsList(s.i),onMouseover:i=>e.hoverOverNsList(s.i),onMouseout:p[3]||(p[3]=(...i)=>e.hoverOutNsList&&e.hoverOutNsList(...i))},[_("+ "),t("span",Fe,n(s.linkedNamespace.length-1),1)],40,Re)]),e.isNsListShow[s.i]?(r(),d("div",{key:0,class:"border p-3 w-28 border-gray-100 shadow-sm absolute bg-white",onMouseover:i=>e.hoverOverNsList(s.i),onMouseout:p[4]||(p[4]=(...i)=>e.hoverOutNsList&&e.hoverOutNsList(...i))},[(r(!0),d($,null,E(s.linkedNamespace.slice(1),(i,g)=>(r(),d("div",{key:g},n(i.name),1))),128))],40,Ke)):f("v-if",!0)]))])):(r(),d("div",Ue,n(o.$t("general.noLinkedNamespace")),1))]),_:1},8,["header"])):f("v-if",!0),e.wideScreen?(r(),w(c,{key:5,field:"supply",header:o.$t("general.supply"),style:{"`wideScreen?'min-width":"180px'?'width: 180px'`"}},{body:m(({data:s})=>[t("span",Ge,n(s.supply),1)]),_:1},8,["header"])):f("v-if",!0),e.wideScreen?(r(),w(c,{key:6,field:"amount",header:o.$t("general.amount"),style:{"`wideScreen?'min-width":"180px'?'width: 180px'`"}},{body:m(({data:s})=>[t("span",Qe,n(s.amount),1)]),_:1},8,["header"])):f("v-if",!0),e.wideScreen?(r(),w(c,{key:7,field:"height",header:o.$t("general.block"),style:{"`wideScreen?'min-width":"180px'?'width: 180px'`"}},{body:m(({data:s})=>[t("span",Xe,n(s.height),1)]),_:1},8,["header"])):f("v-if",!0),k(c,{style:{width:"50px"}},{body:m(({data:s})=>[t("div",{class:"text-txs text-center lg:mr-2",onMouseover:i=>e.hoverOverMenu(s.i),onMouseout:p[5]||(p[5]=(...i)=>e.hoverOutMenu&&e.hoverOutMenu(...i))},[t("img",{src:ue,class:"w-4 h-4 cursor-pointer inline-block",onClick:i=>e.showMenu(s.i)},null,8,Je),e.isMenuShow[s.i]?(r(),d("div",Ye,[t("div",Ze,[k(A,{to:{name:"ViewServicesAssetsModifySupplyChange",params:{assetId:s.idHex,address:s.address}},class:"block hover:bg-gray-100 transition duration-200 p-2 z-20"},{default:m(()=>[_(n(o.$t("general.modifySupply")),1)]),_:2},1032,["to"]),k(A,{to:{name:"ViewServicesAssetsLinkToNamespace",params:{assetId:s.idHex,address:s.address}},class:"block hover:bg-gray-100 transition duration-200 p-2 z-20"},{default:m(()=>[_(n(o.$t("general.linkToNamespace")),1)]),_:2},1032,["to"]),k(A,{to:{name:"ViewUpdateAssetMetadata",params:{targetId:s.idHex}},class:"block hover:bg-gray-100 transition duration-200 p-2 z-20"},{default:m(()=>[_("Update Metadata")]),_:2},1032,["to"]),t("a",{href:s.explorerLink,class:"block hover:bg-gray-100 transition duration-200 p-2 z-20",target:"_new"},[_(n(o.$t("general.viewInExplorer")),1),ss],8,es)])])):f("v-if",!0)],40,qe)]),_:1})]),_:1},8,["value"])])}const os=B(he,[["render",ts],["__scopeId","data-v-d33f9b7f"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/components/AssetDataTable.vue"]]),ns="/web-wallet-vuejs/assets/asset_default-634344fc.svg",as={name:"ViewServicesAssets",components:{AssetDataTable:os},props:{address:String},setup(){const o=b(0),x=H().appContext.config.globalProperties.emitter,e=b([]);return v.currentLoggedInWallet&&(v.currentLoggedInWallet.accounts.forEach(N=>{N.assets.forEach(L=>{e.value.push(L)})}),v.currentLoggedInWallet.others.forEach(N=>{N.assets.forEach(L=>{e.value.push(L)})})),x.on("TXN_CONFIRMED",N=>{setTimeout(()=>{++o.value},1e3)}),{assets:e,defaultIndex:o,walletState:v}}},rs={class:"ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},ls={key:0},is=t("img",{src:pe,class:"inline-block mr-2"},null,-1),ds={key:1,class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},cs={class:"flex justify-between text-sm mb-5"},us={class:"text-gray-700"},ms={class:"border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white"},ps=t("img",{src:ns,class:"inline-block h-18 w-18"},null,-1),hs={class:"text-gray-700 text-sm my-5"},vs={class:"text-gray-600 text-tsm my-5"},gs={class:"sm:grid sm:grid-cols-2 mt-10 lg:mt-16"},_s={class:"mb-8"},fs={href:"https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/",target:"_new",class:"sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start"},bs={class:"text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2"},ys={class:"mb-8"},ws={href:"https://t.me/proximaxhelpdesk",target:"_new",class:"sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex"},xs={class:"text-gray-400 text-tsm my-3"};function ks(o,p,x,e,N,L){const y=S("AssetDataTable"),c=S("router-link");return r(),d("div",null,[t("div",rs,[e.assets.length>0?(r(),d("div",ls,[(r(),w(y,{class:"mt-10 w-full",key:e.walletState,address:x.address},null,8,["address"])),k(c,{to:{name:"ViewServicesAssetsCreate"},class:"mt-10 lg:mt-0 bg-blue-primary px-5 py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-44"},{default:m(()=>[is,_(n(o.$t("asset.createNewAsset")),1)]),_:1})])):(r(),d("div",ds,[t("div",cs,[t("div",null,[t("span",us,n(o.$t("general.asset",2)),1)])]),t("div",ms,[ps,t("div",hs,n(o.$t("asset.noAsset")),1),t("div",vs,n(o.$t("asset.assetDescription")),1),k(c,{to:{name:"ViewServicesAssetsCreate"},class:"bg-blue-primary py-2 px-7 rounded-lg text-white font-bold mt-4 inline-block"},{default:m(()=>[_(n(o.$t("asset.createAssets",2)),1)]),_:1})]),t("div",gs,[t("div",_s,[t("a",fs,n(o.$t("general.assetQues")),1),t("div",bs,n(o.$t("asset.assetAns")),1)]),t("div",ys,[t("a",ws,n(o.$t("general.feedback")),1),t("div",xs,n(o.$t("general.feedbackDescription")),1)])])]))])])}const Es=B(as,[["render",ks],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/assets/views/ViewServicesAssets.vue"]]);export{Es as default};