import{_ as c,a5 as v,M as x,o as l,b as s,e as i,x as _,t as n,O as p,f as d,j as f}from"./index-f0fab120.js";import{_ as g}from"./icon-info-8b4f1351.js";const y={directives:{tooltip:v},props:{placeholder:String,errorMessage:String,icon:String,showError:Boolean,modelValue:String,title:String,disabled:Boolean,max:Number,toolTip:String},emits:["update:modelValue","set-default-duration"],name:"DurationInputClean",data(){return{inputText:"",borderColor:"border border-gray-300",textErr:!1}},methods:{verifyMinimum:function(t){t.target.value==0&&this.$emit("set-default-duration","1")},validateKey:function(t){if(this.modelValue.length<=2)if(t.charCode<48||t.charCode>59)t.preventDefault();else return t.key;else t.preventDefault()}}},b={class:"border border-gray-200 px-2 py-1 h-14 rounded-md"},h={class:"uppercase text-gray-500 text-txs text-left mb-2"},D={key:0,src:g,class:"inline-block ml-1 relative cursor-pointer",style:{top:"-1px"}},C=["disabled","value","max","maxlength","placeholder"],V={class:"h-3 mb-2"},S={key:0,class:"error error-text text-left"};function k(t,r,e,B,u,o){const m=x("tooltip");return l(),s("div",{class:f(e.disabled?"opacity-50":"")},[i("div",b,[i("div",h,[_(n(e.placeholder)+" ",1),e.toolTip?p((l(),s("img",D,null,512)),[[m,{value:"<tiptext>"+e.toolTip+"</tiptext>",escape:!0},void 0,{bottom:!0}]]):d("",!0)]),i("input",{disabled:e.disabled,onInput:r[0]||(r[0]=a=>t.$emit("update:modelValue",a.target.value)),value:e.modelValue,onBlur:r[1]||(r[1]=(...a)=>o.verifyMinimum&&o.verifyMinimum(...a)),onKeypress:r[2]||(r[2]=(...a)=>o.validateKey&&o.validateKey(...a)),type:"text",min:"1",max:e.max,maxlength:e.max,placeholder:e.placeholder,class:"number_input",onFocus:r[3]||(r[3]=a=>a.target.select())},null,40,C)]),i("div",V,[u.textErr||e.showError?(l(),s("div",S,n(e.errorMessage),1)):d("",!0)])],2)}const E=c(y,[["render",k]]);export{E as D};