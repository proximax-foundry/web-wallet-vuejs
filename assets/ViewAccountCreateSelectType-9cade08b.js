import{_ as a,f as i,e,t as o,l,b as n,r as c,o as m}from"./index-d2e8ccc1.js";import{_ as d,a as u}from"./icon-private-key-769b287f.js";const _={name:"ViewAccountCreateSelectType"},p={class:"border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg"},f={class:"text-lg text-center font-bold my-10"},w={class:"text-center text-xs font-semibold"},x={class:"flex gap-2 justify-center flex-col md:flex-row items-center"},v={class:"text-center text-xs font-semibold"},g={class:"text-center text-xs font-semibold"};function y(s,t,b,C,$,V){const r=c("router-link");return m(),i("div",null,[e("div",p,[e("div",f,o(s.$t("general.createNewAcc")),1),e("div",w,o(s.$t("general.selectCreationType")),1),t[2]||(t[2]=e("div",{class:"mt-3"},null,-1)),e("div",x,[l(r,{to:{name:"ViewAccountCreate"},class:"border p-6 w-8/12 md:w-4/12"},{default:n(()=>[t[0]||(t[0]=e("img",{src:d,class:"ml-auto mr-auto mt-4 mb-3 h-12 w-12"},null,-1)),e("div",v,o(s.$t("general.createNew")),1)]),_:1}),l(r,{to:{name:"ViewAccountCreatePrivateKey"},class:"border p-6 w-8/12 md:w-4/12"},{default:n(()=>[t[1]||(t[1]=e("img",{src:u,class:"ml-auto mr-auto mt-4 mb-3 h-12 w-12"},null,-1)),e("div",g,o(s.$t("general.fromPrivateKey")),1)]),_:1})]),t[3]||(t[3]=e("div",{class:"mt-10"},null,-1))])])}const N=a(_,[["render",y]]);export{N as default};