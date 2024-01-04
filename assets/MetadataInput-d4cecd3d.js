import{_ as c,a5 as p,M as x,b as a,e as i,x as _,t as n,O as b,f as s,j as v,o as l}from"./index-f0fab120.js";import{_ as y}from"./icon-info-8b4f1351.js";const g={directives:{tooltip:p},props:{placeholder:String,errorMessage:String,icon:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean,max:Number,toolTip:String,hex:Boolean},methods:{hexOnly:function(o){o=o||window.event;var e=o.which?o.which:o.keyCode;if(e>31&&(e<48||e>57)&&(e<65||e>70)&&(e<97||e>102))o.preventDefault();else return}},emits:["update:modelValue"],name:"MetaDataInput",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}}},h={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},f={class:"uppercase text-gray-500 text-txs text-left mb-2"},V={key:0,src:y,class:"inline-block ml-1 relative cursor-pointer",style:{top:"-1px"}},k=["disabled","value"],w=["disabled","value"],M={key:0,class:"h-3 mb-2"},S={class:"error error-text text-left"};function B(o,e,t,T,d,u){const m=x("tooltip");return l(),a("div",{class:v(t.disabled?"opacity-50":"")},[i("div",h,[i("div",f,[_(n(t.placeholder),1),t.toolTip?b((l(),a("img",V,null,512)),[[m,{value:"<tiptext>"+t.toolTip+"</tiptext>",escape:!0},void 0,{bottom:!0}]]):s("",!0)]),t.hex?s("",!0):(l(),a("input",{key:0,class:"number_input",disabled:t.disabled,onInput:e[0]||(e[0]=r=>o.$emit("update:modelValue",r.target.value)),value:t.modelValue,type:"text",onFocus:e[1]||(e[1]=r=>r.target.select())},null,40,k)),t.hex?(l(),a("input",{key:1,type:"text",class:"number_input",disabled:t.disabled,onInput:e[2]||(e[2]=r=>o.$emit("update:modelValue",r.target.value)),value:t.modelValue,onFocus:e[3]||(e[3]=r=>r.target.select()),onKeypress:e[4]||(e[4]=r=>u.hexOnly(o.event))},null,40,w)):s("",!0)]),d.textErr||t.showError?(l(),a("div",M,[i("div",S,n(t.errorMessage),1)])):s("",!0)],2)}const E=c(g,[["render",B]]);export{E as M};