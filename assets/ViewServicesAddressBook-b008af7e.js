import{_ as A,g as D,r as p,k as b,o as v,b as w,e,t as r,s as m,z as f,f as M,T as K,w as g,p as O,j as N,u as z,ad as G,I as W,c as P,H as L,l as F,S as U,a2 as H,A as T,m as E}from"./index-f81de996.js";import{S as q}from"./SelectInputPluginClean-88aa12a6.js";import{a as J,s as Q}from"./column.esm-a96344fe.js";import{t as B}from"./jdenticon-module-7161194d.js";import{_ as X}from"./icon-more-options-3f3cfda9.js";import"./multiselect-9024d715.js";const Y={name:"ConfirmDeleteContactModal",props:["data"],setup(o){const i=D().appContext.config.globalProperties.emitter,t=p(!1),c=p(!1);return{err:t,deleteContact:k=>{const h=g.currentLoggedInWallet.contacts.findIndex(C=>C.address==o.data.address);g.currentLoggedInWallet.removeAddressBook(h),g.wallets.saveMyWalletOnlytoLocalStorage(g.currentLoggedInWallet),c.value=!c.value,i.emit("REFRESH_CONTACT_LIST",!0),i.emit("CLOSE_CONTACTMENU_PANEL")},toggleModal:c,openRemoveModal:()=>{c.value=!c.value},closeRemoveModal:()=>{c.value=!c.value,setTimeout(()=>{i.emit("CLOSE_CONTACTMENU_PANEL")},500)},emitter:i}}},Z=o=>(O("data-v-82fd122e"),o=o(),N(),o),ee={key:0,class:"popup-outer fixed flex z-50"},te={class:"modal-popup-box"},oe={class:"delete-position"},se={class:"w-104 font-normal"},ne={key:0,class:"error error_box"},le={class:"mb-5"},ae={class:"text-sm text-gray-700"},re={class:"flex justify-between rounded-xl mb-4 text-gray-600"},ie={class:"w-full text-left"},de={class:"text-xs mt-3"},ce={class:"inline-block w-20 font-bold"},ue={class:"inline-block"},me={class:"text-xs mt-3"},ve={class:"inline-block w-20 font-bold"},_e={class:"inline-block mt-2"},pe={class:"text-xs mt-3"},be=Z(()=>e("div",{class:"inline-block w-20 font-bold"},"Group:",-1)),fe={class:"inline-block"},ge={class:"w-full"},he={class:"text-center mt-5"};function we(o,s,i,t,c,x){const _=b("font-awesome-icon");return v(),w("div",null,[e("div",{class:"block hover:bg-gray-100 transition duration-200 p-2 z-20 cursor-pointer text-red-600",onClick:s[0]||(s[0]=u=>t.openRemoveModal())},r(o.$t("general.remove")),1),m(K,{"enter-active-class":"animate__animated animate__fadeInDown","leave-active-class":"animate__animated animate__fadeOutUp"},{default:f(()=>[t.toggleModal?(v(),w("div",ee,[e("div",te,[e("div",oe,[m(_,{icon:"times",class:"delete-icon-style",onClick:s[1]||(s[1]=u=>t.toggleModal=!t.toggleModal)})]),e("div",se,[t.err!=""?(v(),w("div",ne,r(t.err),1)):M("v-if",!0),e("div",le,[e("span",ae,r(o.$t("addressBook.removeContactFromAB")),1)]),e("div",re,[e("div",ie,[e("div",de,[e("div",ce,r(o.$t("general.name"))+":",1),e("div",ue,r(i.data.name),1)]),e("div",me,[e("div",ve,r(o.$t("general.address"))+":",1),e("div",_e,r(i.data.address),1)]),e("div",pe,[be,e("div",fe,r(i.data.group),1)])])]),e("fieldset",ge,[e("div",he,[e("div",{class:"inline-block font-bold text-blue-primary mr-5 cursor-pointer",onClick:s[2]||(s[2]=(...u)=>t.closeRemoveModal&&t.closeRemoveModal(...u))},r(o.$t("general.cancel")),1),e("button",{type:"submit",class:"bg-red-primary text-white text-xs py-2 px-4 rounded-md",onClick:s[3]||(s[3]=u=>{t.deleteContact(i.data)})},r(o.$t("addressBook.removeContact")),1)])])])])])):M("v-if",!0)]),_:1}),t.toggleModal?(v(),w("div",{key:0,onClick:s[4]||(s[4]=(...u)=>t.closeRemoveModal&&t.closeRemoveModal(...u)),class:"fixed inset-0 bg-opacity-60 bg-gray-100 z-20"})):M("v-if",!0)])}const xe=A(Y,[["render",we],["__scopeId","data-v-82fd122e"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/addressbook/components/ConfirmDeleteContactModal.vue"]]),Ce={components:{SelectInputPluginClean:q,DataTable:J,Column:Q,ConfirmDeleteContactModal:xe},name:"ContactDataTable",setup(){const{t:o}=z(),i=D().appContext.config.globalProperties.emitter,t=p([]),c=p(""),x=p("border border-gray-200"),_=p({global:{value:null,matchMode:G.CONTAINS}}),u=()=>{x.value="border border-white-100 drop-shadow-md"},k=()=>{x.value="border border-gray-200"},h=p([]);let C=new W("ThemeStyleConfig");C.init();const S=P(()=>{if(!g.currentLoggedInWallet)return[];let n=[];return g.currentLoggedInWallet.contacts!=null&&g.currentLoggedInWallet.contacts.length>0&&(c.value==""?g.currentLoggedInWallet.contacts.forEach((l,d)=>{let $={i:d,name:l.name,address:L.createAddress(l.address).pretty(),group:l.group,publicKey:l.publicKey?l.publicKey:null,svgString:B(l.address,45,C.jdenticonConfig)};n.push($),t.value[d]=!1,h.value.push(l.group)}):g.currentLoggedInWallet.contacts.filter(l=>l.group==c.value).forEach((l,d)=>{let $={i:d,name:l.name,address:L.createAddress(l.address).pretty(),group:l.group,publicKey:l.publicKey?l.publicKey:null,svgString:B(l.address,45,C.jdenticonConfig)};n.push($),t.value[d]=!1,h.value.push(l.group)}),n.sort((l,d)=>l.name>d.name?1:l.name<d.name?-1:0)),n}),a=p();function y(n,l,d){return d.indexOf(n)===l}const V=P(()=>{var n=h.value.filter(y);n=n.filter(d=>d!="-none-"),n.sort();let l=[];return l.push({value:"",label:o("general.showAll")}),n.forEach(d=>{l.push({value:d,label:d})}),l}),j=n=>{I.value=n,t.value[n]=!t.value[n]},I=p("");return i.on("PAGE_CLICK",()=>{for(var n=0;n<t.value.length;)n!=I.value&&(t.value[n]=!1),n++}),i.on("CLOSE_CONTACTMENU_PANEL",()=>{for(var n=0;n<t.value.length;)t.value[n]=!1,n++}),{formattedContacts:S,selectContactGroups:c,contactGroups:V,dt:a,borderColor:x,filters:_,clickInputText:u,blurInputText:k,Helper:L,showMenu:j,isMenuShow:t,hoverOverMenu:n=>{I.value=n},hoverOutMenu:()=>{I.value="e"}}}},ke="/web-wallet-vuejs/assets/icon-search_black-8090b4ec.svg",ye="/web-wallet-vuejs/assets/open-book-84b57588.svg";const R=o=>(O("data-v-0b482a93"),o=o(),N(),o),Me={class:"font-semibold mr-10 mb-4"},Te={class:"xl:flex xl:justify-between pb-3 xl:pb-0"},Ie={class:"md:flex md:items-center md:justify-items-start"},Se=["placeholder"],$e=R(()=>e("img",{src:ke,class:"inline-block"},null,-1)),Le={class:"mt-5 lg:mt-5 xl:mt-0"},Ae={class:"mt-2 py-3 gray-line"},De={class:"flex items-center"},Pe=["innerHTML"],Ee={class:"inline-block"},Be={class:"text-blue-primary text-tsm"},Oe={key:0,class:"inline-block ml-5 rounded-md text-blue-primary bg-blue-200 px-2 py-1 text-xxs font-bold"},Ne={class:"mt-1 text-xs md:text-tsm"},Re={class:"mt-1 text-xs md:text-tsm flex items-center bg-green-100 w-24"},Ve=["onMouseover"],je=["onClick"],Ke={key:0,class:"mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2",role:"menu","aria-orientation":"vertical","aria-labelledby":"options-menu"},ze={role:"none",class:"my-2"},Ge=R(()=>e("div",{class:"text-center my-5"},[e("img",{src:ye,class:"inline-block h-20 w-20"})],-1)),We={class:"text-center text-blue-primary mb-2",style:{"font-size":"15px"}},Fe={class:"text-center text-gray-400",style:{"font-size":"12px"}};function Ue(o,s,i,t,c,x){const _=b("SelectInputPluginClean"),u=b("router-link"),k=b("font-awesome-icon"),h=b("Column"),C=b("ConfirmDeleteContactModal"),S=b("DataTable");return v(),w("div",null,[e("div",Me,r(o.$t("general.addressBook")),1),e("div",Te,[e("div",Ie,[m(_,{modelValue:t.selectContactGroups,"onUpdate:modelValue":s[0]||(s[0]=a=>t.selectContactGroups=a),options:t.contactGroups,selectDefault:"",class:"w-full md:w-60 mr-4"},null,8,["modelValue","options"]),e("div",{class:F(["w-full md:w-60 px-3 py-1 flex justify-between mb-3 mt-3 md:mt-0 md:mb-0",t.borderColor])},[U(e("input",{"onUpdate:modelValue":s[1]||(s[1]=a=>t.filters.global.value=a),type:"text",class:"w-28 outline-none text-xs float-left",placeholder:o.$t("general.search"),onClick:s[2]||(s[2]=a=>t.clickInputText()),onBlur:s[3]||(s[3]=a=>t.blurInputText())},null,40,Se),[[H,t.filters.global.value]]),$e],2)]),e("div",Le,[m(u,{to:{name:"ViewServicesAddressBookAddContact"},class:"default-btn transition-all duration-300",style:{padding:"auto 3px"}},{default:f(()=>[T("+ "+r(o.$t("general.new")),1)]),_:1})])]),e("div",Ae,[m(S,{value:t.formattedContacts,ref:"dt",filters:t.filters,"onUpdate:filters":s[5]||(s[5]=a=>t.filters=a),paginator:!0,rows:10,responsiveLayout:"scroll",scrollDirection:"horizontal",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"",globalFilterFields:["name","address"]},{empty:f(()=>[Ge,e("div",We,r(o.$t("general.ntgToShow")),1),e("div",Fe,r(o.$t("addressBook.addressBookTitle")),1)]),default:f(()=>[m(h,{field:"name",headerStyle:"width:95%",headerClass:"hidden"},{body:f(({data:a})=>[e("div",De,[e("div",{innerHTML:a.svgString,class:"mr-2 inline-block"},null,8,Pe),e("div",Ee,[e("div",Be,[T(r(a.name)+" ",1),a.group!="-none-"?(v(),w("span",Oe,r(a.group),1)):M("v-if",!0)]),e("div",Ne,r(a.address),1),e("div",Re,[e("div",null,r(o.$t("general.publicKey")),1),a.publicKey?(v(),E(k,{key:0,icon:"check",class:"w-3 h-3 ml-3 inline-block text-blue-primary"})):(v(),E(k,{key:1,icon:"times",class:"w-3 h-3 ml-3 inline-block text-blue-primary"}))])])])]),_:1}),m(h,{style:{width:"50px"},headerClass:"hidden"},{body:f(({data:a})=>[e("div",{class:"text-txs text-center",onMouseover:y=>t.hoverOverMenu(a.i),onMouseout:s[4]||(s[4]=(...y)=>t.hoverOutMenu&&t.hoverOutMenu(...y))},[e("img",{src:X,class:"w-4 h-4 cursor-pointer inline-block",onClick:y=>t.showMenu(a.i)},null,8,je),t.isMenuShow[a.i]?(v(),w("div",Ke,[e("div",ze,[m(u,{to:{name:"ViewServicesAddressBookEditContact",params:{contactAddress:a.address,contactPublicKey:a.publicKey?"true":"false"}},class:"block hover:bg-gray-100 transition duration-200 p-2 z-20"},{default:f(()=>[T(r(o.$t("general.edit")),1)]),_:2},1032,["to"]),m(C,{data:a,class:"block"},null,8,["data"])])])):M("v-if",!0)],40,Ve)]),_:1})]),_:1},8,["value","filters"])])])}const He=A(Ce,[["render",Ue],["__scopeId","data-v-0b482a93"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/addressbook/components/ContactDataTable.vue"]]),qe={name:"ViewServicesAddressBook",components:{ContactDataTable:He},setup(){D().appContext.config.globalProperties.emitter.on("REFRESH_CONTACT_LIST",i=>{i&&setTimeout(()=>{refreshList()},1e3)})}},Je={class:"w-9/12 ml-auto mr-auto mt-5"},Qe={class:"flex text-xs font-semibold border-b-2 menu_title_div"},Xe={class:"w-18 text-center border-b-2 pb-3 border-yellow-500"};function Ye(o,s,i,t,c,x){const _=b("router-link"),u=b("ContactDataTable");return v(),w("div",null,[e("div",Je,[e("div",Qe,[e("div",Xe,r(o.$t("general.list")),1),m(_,{to:{name:"ViewServicesAddressBookImport"},class:"w-18 text-center border-b pb-3"},{default:f(()=>[T(r(o.$t("general.import")),1)]),_:1}),m(_,{to:{name:"ViewServicesAddressBookExport"},class:"w-18 text-center border-b pb-3"},{default:f(()=>[T(r(o.$t("general.export")),1)]),_:1})]),m(u,{class:"mt-10"})])])}const rt=A(qe,[["render",Ye],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/services/submodule/addressbook/views/ViewServicesAddressBook.vue"]]);export{rt as default};