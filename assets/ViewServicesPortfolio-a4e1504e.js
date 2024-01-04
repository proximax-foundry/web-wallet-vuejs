import{d as R,r as v,a6 as M,a7 as V,o as r,b as l,m as g,v as f,k,e as t,t as u,y as m,H as P,f as p,n as h,I as W,J as B,_ as w,c as y,O as C,R as F,F as z,g as H,U as O,w as x,i as L}from"./index-f0fab120.js";import{_ as $}from"./proximax-logo-ecfc3767.js";import{_ as D}from"./xarcade-logo-c4d3fd5c.js";import{_ as E}from"./metx-logo-27f23eae.js";import{_ as I}from"./icon-proximax-logo-gray-c2486ce1.js";import{s as b,a as U}from"./column.esm-49b94109.js";import{_ as N}from"./icon-arrow-down-83b4f5a8.js";const A=c=>(W("data-v-556109dc"),c=c(),B(),c),X=A(()=>t("div",{class:"uppercase text-xxs font-bold mb-1"},"Asset ID",-1)),Q={class:"uppercase cursor-pointer font-bold text-txs"},j=["href"],q={class:"uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7"},G=A(()=>t("div",{class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},"Alias",-1)),J={class:"flex items-center pr-7"},K={key:0,src:$,class:"inline-block h-7 w-7 mr-2 border-2 rounded-3xl"},Y={key:1,src:D,class:"inline-block h-7 w-7 mr-2 border-2 rounded-3xl"},Z={key:2,src:E,class:"inline-block h-7 w-7 mr-2 border-2 rounded-3xl"},ee={key:3},te={key:4,src:I,class:"inline-block h-6 w-6 mr-2"},oe={key:5,class:"inline-block text-xs ml-2 mt-1 cursor-pointer text-blue-primary"},se=["href"],re={key:6,class:"inline-block text-xs ml-2 cursor-pointer text-blue-primary mt-1"},ne=["href"],le=A(()=>t("div",{class:"uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"},"Balance",-1)),ce={class:"uppercase font-bold text-xs truncate"},ie=["href"],ae={class:"uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7"},de={class:"flex items-center pr-7"},ue={key:0,src:$,class:"inline-block h-7 w-7 mr-2 border-2 rounded-3xl"},_e={key:1,src:D,class:"inline-block h-7 w-7 mr-2 border-2 rounded-3xl"},me={key:2,src:E,class:"inline-block h-7 w-7 mr-2 border-2 rounded-3xl"},pe={key:3},he={key:4,src:I,class:"inline-block h-6 w-6 mr-2"},fe={key:5,class:"inline-block text-xs ml-2 mt-1 cursor-pointer text-blue-primary"},xe=["href"],ve={key:6,class:"inline-block text-xs ml-2 cursor-pointer text-blue-primary mt-1"},ke=["href"],be={class:"uppercase font-semibold text-xs"},ge=R({__name:"PortfolioAssetDataTable",props:{assets:Array},setup(c){const n=v(!1),_=()=>{window.innerWidth<1024?n.value=!1:n.value=!0};_(),M(()=>{window.removeEventListener("resize",_)}),V(()=>{window.addEventListener("resize",_)});const s=o=>o=="prx.xpx"?{name:"XPX",registered:!0}:o=="prx.metx"?{name:"METX",registered:!0}:o=="xarcade.xar"?{name:"XAR",registered:!0}:{name:o,registered:!1},a=o=>h.currentNetworkProfile?h.currentNetworkProfile.chainExplorer.url+"/"+h.currentNetworkProfile.chainExplorer.assetInfoRoute+"/"+o:"",d=o=>h.currentNetworkProfile?h.currentNetworkProfile.chainExplorer.url+"/"+h.currentNetworkProfile.chainExplorer.namespaceInfoRoute+"/"+o:"";return(o,i)=>(r(),l("div",null,[g(m(U),{value:c.assets,paginator:!0,rows:10,dataKey:"id",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown",rowsPerPageOptions:[10,20,30,40,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",responsiveLayout:"scroll"},{default:f(()=>[n.value?p("",!0):(r(),k(m(b),{key:0,style:{width:"200px"},headerClass:"hidden"},{body:f(({data:e})=>[t("div",null,[X,t("div",Q,[t("a",{href:a(e.id),target:"_blank"},[t("div",q,u(e.id),1)],8,j)])]),t("div",null,[G,t("div",J,[e.name=="prx.xpx"?(r(),l("img",K)):e.name=="xarcade.xar"?(r(),l("img",Y)):e.name=="prx.metx"?(r(),l("img",Z)):e.name?(r(),l("img",te)):(r(),l("div",ee,"-")),s(e.name).registered?(r(),l("div",oe,[t("a",{href:d(e.name),target:"_blank"},u(s(e.name).name),9,se)])):(r(),l("div",re,[t("a",{href:d(e.name),target:"_blank"},u(e.name),9,ne)]))])]),t("div",null,[le,t("div",ce,u(m(P).toCurrencyFormat(e.balance,e.divisibility)),1)])]),_:1})),n.value?(r(),k(m(b),{key:1,field:"assetId",header:o.$t("general.assetId")},{body:f(({data:e})=>[t("a",{href:a(e.id),target:"_blank"},[t("div",ae,u(e.id),1)],8,ie)]),_:1},8,["header"])):p("",!0),n.value?(r(),k(m(b),{key:2,field:"alias",header:"Alias"},{body:f(({data:e})=>[t("div",de,[e.name=="prx.xpx"?(r(),l("img",ue)):e.name=="xarcade.xar"?(r(),l("img",_e)):e.name=="prx.metx"?(r(),l("img",me)):e.name?(r(),l("img",he)):(r(),l("div",pe,"-")),s(e.name).registered?(r(),l("div",fe,[t("a",{href:d(e.name),target:"_blank"},u(s(e.name).name),9,xe)])):(r(),l("div",ve,[t("a",{href:d(e.name),target:"_blank"},u(e.name),9,ke)]))])]),_:1})):p("",!0),n.value?(r(),k(m(b),{key:3,field:"amount",header:o.$t("general.amount")},{body:f(({data:e})=>[t("span",be,u(m(P).toCurrencyFormat(e.balance,e.divisibility)),1)]),_:1},8,["header"])):p("",!0)]),_:1},8,["value"])]))}});const ye=w(ge,[["__scopeId","data-v-556109dc"]]),we={name:"MultiDropdownPortfolioAccountComponent",props:["account"],setup(c){const n=v([]),_=v(!1),s=v(""),a=y(()=>{const i=s.value.toLowerCase();return s.value==""?c.account:c.account.filter(e=>e.name.toLowerCase().includes(i))});return{show:_,filterQuery:s,filteredAccount:a,clearAll:()=>{n.value=[]},selectAll:()=>{n.value=c.account},selectedAccount:n}},watch:{selectedAccount(c){this.$emit("checked",c)}}},Ae={class:"flex flex-col"},Pe=t("div",null,"Account",-1),Ce={key:0,src:N,class:"w-3 ml-2 h-3",style:{"margin-top":"0.12em"}},Le={key:1,src:N,class:"w-3 ml-2 h-3",style:{"margin-top":"0.12em",transform:"rotate(180deg)"}},$e={key:0,class:"relative z-50"},De={class:"absolute w-60 border bg-white"},Ee=["placeholder"],Ie={class:"flex justify-between p-2 text-xs"},Ne={class:"max-h-40 overflow-auto px-2 filter drop-shadow-xl"},Se=["id","value"],Te={for:"index",class:"pl-1"};function Re(c,n,_,s,a,d){return r(),l("div",Ae,[t("div",{class:"border p-2 cursor-pointer w-40 bg-white text-xs flex justify-between",onClick:n[0]||(n[0]=o=>s.show=!s.show)},[Pe,s.show?(r(),l("img",Le)):(r(),l("img",Ce))]),s.show?(r(),l("div",$e,[t("div",De,[C(t("input",{"onUpdate:modelValue":n[1]||(n[1]=o=>s.filterQuery=o),type:"text",class:"pl-2 pt-2 text-xs outline-none text-black",placeholder:c.$t("general.search")},null,8,Ee),[[F,s.filterQuery]]),t("div",Ie,[s.selectedAccount.length==0?(r(),l("div",{key:0,onClick:n[2]||(n[2]=(...o)=>s.selectAll&&s.selectAll(...o))},"Select all")):p("",!0),s.selectedAccount.length>0?(r(),l("div",{key:1,onClick:n[3]||(n[3]=(...o)=>s.clearAll&&s.clearAll(...o))},"Clear all")):p("",!0),t("div",null,u(s.selectedAccount.length)+" SELECTED",1)]),t("ul",Ne,[(r(!0),l(z,null,H(s.filteredAccount,(o,i)=>(r(),l("li",{key:i},[C(t("input",{type:"checkbox",id:i,value:o,"onUpdate:modelValue":n[4]||(n[4]=e=>s.selectedAccount=e)},null,8,Se),[[O,s.selectedAccount]]),t("label",Te,u(o.name),1)]))),128))])])])):p("",!0)])}const Me=w(we,[["render",Re]]),Ve={name:"ViewServicesPortfolio",components:{PortfolioAssetDataTable:ye,MultiDropdownPortfolioAccountComponent:Me},setup(){const c=v([]),n=y(()=>x.currentLoggedInWallet?x.currentLoggedInWallet.others?x.currentLoggedInWallet.accounts.concat(x.currentLoggedInWallet.others).filter(d=>d.type!=="DELEGATE"):x.currentLoggedInWallet.accounts:null),_=a=>{c.value=a};return{mosaics:y(()=>{if(c.value.length){var a=[],d=[];for(let o=0;o<c.value.length;o++)c.value[o].assets.forEach((i,e)=>{a.push({i:e,id:i.idHex,name:i.namespaceNames.length>0?i.namespaceNames[0]:"",balance:i.amount})});return d=a.reduce((o,i)=>{let e=o.find(T=>T.id===i.id),S={...i};return e?e.balance+=i.balance:o.push(S),o},[]),d}else return null}),onCheck:_,accounts:n,selectedAccount:c}}},We={class:"mt-10 flex-grow px-5"},Be={class:"w-11/12 ml-auto mr-auto"},Fe={class:"flex"},ze={class:"py-3 px-6 lg:flex items-center"},He=t("div",{class:"text-xl mr-2 mb-2"},"Portfolio",-1),Oe={class:"mt-2 py-3"},Ue={class:"w-11/12 ml-auto mr-auto border-2"},Xe=t("div",{class:"mb-36"},null,-1);function Qe(c,n,_,s,a,d){const o=L("MultiDropdownPortfolioAccountComponent"),i=L("PortfolioAssetDataTable");return r(),l("div",We,[t("div",Be,[t("div",Fe,[t("div",ze,[He,g(o,{account:s.accounts,onChecked:s.onCheck},null,8,["account","onChecked"])])])]),t("div",Oe,[t("div",Ue,[g(i,{assets:s.mosaics},null,8,["assets"])])]),Xe])}const et=w(Ve,[["render",Qe]]);export{et as default};