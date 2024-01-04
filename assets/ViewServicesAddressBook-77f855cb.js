import{d as S,r as _,l as V,i as g,o as m,b as y,e,m as d,v as u,k as $,x as h,f as C,t as s,y as f,$ as K,a$ as P,F as T,w as b,u as D,a8 as M,D as I,c as A,H as j,O as E,R as F}from"./index-f0fab120.js";import{_ as N}from"./icon-search_black-a392bb0f.js";import{s as L,a as W}from"./column.esm-49b94109.js";import{t as z}from"./jdenticon-module-f8a9db48.js";import{_ as R}from"./icon-more-options-3f3cfda9.js";const G="/web-wallet-vuejs/assets/open-book-84b57588.svg",H={class:"card flex justify-content-center"},U={class:"flex flex-col"},O={class:"w-104 font-normal"},q={class:"mb-5"},J={class:"text-sm text-gray-700"},Q={class:"flex justify-between rounded-xl mb-4 text-gray-600"},X={class:"w-full text-left"},Y={class:"text-xs mt-3"},Z={class:"inline-block w-20 font-bold"},ee={class:"inline-block"},te={class:"text-xs mt-3"},se={class:"inline-block w-20 font-bold"},oe={class:"inline-block mt-2"},le={class:"text-xs mt-3"},ne=e("div",{class:"inline-block w-20 font-bold"},"Group:",-1),ae={class:"inline-block"},re={class:"w-full"},ie={class:"text-center mt-5"},de=S({__name:"ContactAction",props:{name:{},group:{},address:{},publicKey:{}},setup(v){const i=_(!1),p=V(),c=_(),x=_([{label:"Edit",command:()=>{p.push({name:"ViewServicesAddressBookEditContact",params:{contactAddress:v.address,contactPublicKey:v.publicKey?"true":"false"}})}},{label:"Delete",command:()=>{}}]),k=l=>{c.value.toggle(l)},w=()=>{b.currentLoggedInWallet.contacts=b.currentLoggedInWallet.contacts.filter(l=>l.name!=v.name),b.wallets.saveMyWalletOnlytoLocalStorage(b.currentLoggedInWallet),i.value=!1};return(l,o)=>{const r=g("router-link");return m(),y(T,null,[e("div",H,[e("img",{src:R,class:"w-4 h-4 cursor-pointer inline-block",onClick:k}),d(f(K),{ref_key:"menu",ref:c,model:x.value,popup:!0},{item:u(({item:t})=>[e("div",U,[t.label=="Edit"?(m(),$(r,{key:0,class:"hover:bg-gray-100 bg-white transition duration-200 p-2 z-20",to:{name:"ViewServicesAddressBookEditContact",params:{contactAddress:l.address,contactPublicKey:l.publicKey?"true":"false"}}},{default:u(()=>[h(" Edit ")]),_:1},8,["to"])):C("",!0),t.label=="Delete"?(m(),y("div",{key:1,class:"block hover:bg-gray-100 transition duration-200 p-2 z-20 cursor-pointer text-red-600",onClick:o[0]||(o[0]=a=>i.value=!0)},s(l.$t("general.remove")),1)):C("",!0)])]),_:1},8,["model"])]),d(f(P),{visible:i.value,"onUpdate:visible":o[3]||(o[3]=t=>i.value=t),modal:"",draggable:!1,dismissableMask:!0,closable:!1,class:"w-96"},{default:u(()=>[e("div",O,[e("div",q,[e("span",J,s(l.$t("addressBook.removeContactFromAB")),1)]),e("div",Q,[e("div",X,[e("div",Y,[e("div",Z,s(l.$t("general.name"))+": ",1),e("div",ee,s(l.name),1)]),e("div",te,[e("div",se,s(l.$t("general.address"))+": ",1),e("div",oe,s(l.address),1)]),e("div",le,[ne,e("div",ae,s(l.group),1)])])]),e("fieldset",re,[e("div",ie,[e("div",{class:"inline-block font-bold text-blue-primary mr-5 cursor-pointer",onClick:o[1]||(o[1]=t=>i.value=!1)},s(l.$t("general.cancel")),1),e("button",{type:"submit",class:"bg-red-primary text-white text-xs py-2 px-4 rounded-md",onClick:o[2]||(o[2]=t=>w())},s(l.$t("addressBook.removeContact")),1)])])])]),_:1},8,["visible"])],64)}}}),ce={class:"font-semibold mr-10 mb-4"},ue={class:"xl:flex xl:justify-between pb-3 xl:pb-0"},me={class:"md:flex md:items-center md:justify-items-start"},pe={class:"w-full md:w-60 px-3 py-1 flex justify-between mb-3 mt-3 md:mt-0 md:mb-0 border border-gray-200"},be=["placeholder"],_e=e("img",{src:N,class:"inline-block"},null,-1),ve={class:"mt-5 lg:mt-5 xl:mt-0"},ge={class:"mt-2 py-3 gray-line"},fe={class:"flex items-center"},ye=["innerHTML"],he={class:"inline-block"},xe={class:"text-blue-primary text-tsm"},ke={key:0,class:"inline-block ml-5 rounded-md text-blue-primary bg-blue-200 px-2 py-1 text-xxs font-bold"},we={class:"mt-1 text-xs md:text-tsm"},$e={class:"mt-1 text-xs md:text-tsm flex items-center bg-green-100 w-24"},Ce=e("div",{class:"text-center my-5"},[e("img",{src:G,class:"inline-block h-20 w-20"})],-1),Se={class:"text-center text-blue-primary mb-2",style:{"font-size":"15px"}},Be={class:"text-center text-gray-400",style:{"font-size":"12px"}},Ae=S({__name:"ContactDataTable",setup(v){const{t:i}=D(),p=_({value:"",label:i("general.showAll")}),c=_({global:{value:null,matchMode:M.CONTAINS}});let x=new I("ThemeStyleConfig");x.init();const k=A(()=>{var r;const o=(r=b.currentLoggedInWallet)==null?void 0:r.contacts.map(t=>({name:t.name,address:j.createAddress(t.address).pretty(),group:t.group,publicKey:t.publicKey?t.publicKey:null,svgString:z(t.address,45,x.jdenticonConfig)}));return p.value.value==""?o.sort((t,a)=>t.name>a.name?1:t.name<a.name?-1:0):o.filter(t=>t.group==p.value.value).sort((t,a)=>t.name>a.name?1:t.name<a.name?-1:0)}),w=_(),l=A(()=>{var t;const r=[...new Set((t=b.currentLoggedInWallet)==null?void 0:t.contacts.map(a=>a.group))].filter(a=>a!="-none-");return[{value:"",label:i("general.showAll")}].concat(r.map(a=>({label:a,value:a})))});return(o,r)=>{const t=g("Dropdown"),a=g("router-link"),B=g("font-awesome-icon");return m(),y("div",null,[e("div",ce,s(o.$t("general.addressBook")),1),e("div",ue,[e("div",me,[d(t,{modelValue:p.value,"onUpdate:modelValue":r[0]||(r[0]=n=>p.value=n),options:l.value,"option-label":"label",placeholder:"Select a City",class:"w-full md:w-60 mr-4 text-xs"},null,8,["modelValue","options"]),e("div",pe,[E(e("input",{"onUpdate:modelValue":r[1]||(r[1]=n=>c.value.global.value=n),type:"text",class:"w-28 outline-none text-xs float-left",placeholder:o.$t("general.search")},null,8,be),[[F,c.value.global.value]]),_e])]),e("div",ve,[d(a,{to:{name:"ViewServicesAddressBookAddContact"},class:"default-btn transition-all duration-300",style:{padding:"auto 3px"}},{default:u(()=>[h("+ "+s(o.$t("general.new")),1)]),_:1})])]),e("div",ge,[d(f(W),{value:k.value,ref_key:"dt",ref:w,filters:c.value,"onUpdate:filters":r[2]||(r[2]=n=>c.value=n),paginator:!0,rows:10,responsiveLayout:"scroll",scrollDirection:"horizontal",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",globalFilterFields:["name","address"]},{empty:u(()=>[Ce,e("div",Se,s(o.$t("general.ntgToShow")),1),e("div",Be,s(o.$t("addressBook.addressBookTitle")),1)]),default:u(()=>[d(f(L),{field:"name",headerStyle:"width:95%",headerClass:"hidden"},{body:u(({data:n})=>[e("div",fe,[e("div",{innerHTML:n.svgString,class:"mr-2 inline-block"},null,8,ye),e("div",he,[e("div",xe,[h(s(n.name)+" ",1),n.group!="-none-"?(m(),y("span",ke,s(n.group),1)):C("",!0)]),e("div",we,s(n.address),1),e("div",$e,[e("div",null,s(o.$t("general.publicKey")),1),n.publicKey?(m(),$(B,{key:0,icon:"check",class:"w-3 h-3 ml-3 inline-block text-blue-primary"})):(m(),$(B,{key:1,icon:"times",class:"w-3 h-3 ml-3 inline-block text-blue-primary"}))])])])]),_:1}),d(f(L),{style:{width:"50px"},headerClass:"hidden"},{body:u(({data:n})=>[d(de,{address:n.address,publicKey:n.publicKey,group:n.group,name:n.name},null,8,["address","publicKey","group","name"])]),_:1})]),_:1},8,["value","filters"])])])}}}),Le={class:"w-9/12 ml-auto mr-auto mt-5"},Ve={class:"flex text-xs font-semibold border-b-2 menu_title_div"},Ke={class:"w-18 text-center border-b-2 pb-3 border-yellow-500"},je=S({__name:"ViewServicesAddressBook",setup(v){return(i,p)=>{const c=g("router-link");return m(),y("div",null,[e("div",Le,[e("div",Ve,[e("div",Ke,s(i.$t("general.list")),1),d(c,{to:{name:"ViewServicesAddressBookImport"},class:"w-18 text-center border-b pb-3"},{default:u(()=>[h(s(i.$t("general.import")),1)]),_:1}),d(c,{to:{name:"ViewServicesAddressBookExport"},class:"w-18 text-center border-b pb-3"},{default:u(()=>[h(s(i.$t("general.export")),1)]),_:1})]),d(Ae,{class:"mt-10"})])])}}});export{je as default};