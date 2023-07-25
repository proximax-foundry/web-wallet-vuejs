import{_ as m,d as f,r as l,k as h,o as d,b as u,e as c,s as p,z as v,t as S,f as b,T as g,p as w,j as $}from"./index-f81de996.js";import{T as C}from"./multiselect-9024d715.js";const T=f({props:["placeholder","errorMessage","options","modelValue","showSelectTitleProp","selectDefault","disabled","noOptionsText"],emits:["update:modelValue","show-selection","clear-selection"],name:"SelectInputPlugin",setup(e){const t=l(!1),o=l(!1),n=l(0),a=l([]),r=l(300),i=l(!0);e.showSelectTitleProp&&(t.value=!0);const s=()=>{n.value=0,t.value=!1,o.value=!0};return{showSelectTitle:t,selectErr:o,selectModel:n,selected:a,clearSelection:s,makeSelection:()=>{t.value=!0,o.value=!1},closeSelection:()=>{a.value||s()},maxHeight:r,canDeselect:i}},components:{Multiselect:C},methods:{clear:function(){this.$refs.selectRef&&this.$refs.selectRef.clear()}},mounted(){this.selectDefault&&this.$refs.selectRef.select(this.selectDefault,this.options),this.emitter.on("CLEAR_SELECT",this.clear)},beforeUnmount(){this.emitter.off("CLEAR_SELECT",this.clear)},created(){}}),_=e=>(w("data-v-101b2217"),e=e(),$(),e),V={class:"select selectPlugin",style:{position:"relative"}},k={class:"h-5 text-left m-auto w-8/12 mb-1"},D={key:0,class:"text-xs text-blue-400"},I=_(()=>c("div",{class:"h-3 mb-2"},null,-1));function E(e,t,o,n,a,r){const i=h("Multiselect");return d(),u("div",null,[c("div",V,[c("div",k,[p(g,{"enter-active-class":"animate__animated animate__fadeInUp"},{default:v(()=>[e.showSelectTitle?(d(),u("span",D,S(e.placeholder),1)):b("v-if",!0)]),_:1})]),p(i,{class:"border w-8/12",placeholder:e.placeholder,options:e.options,mode:"single",canDeselect:e.canDeselect,onChange:e.makeSelection,modelValue:e.selected,"onUpdate:modelValue":t[0]||(t[0]=s=>e.selected=s),noOptionsText:e.noOptionsText,onClose:e.closeSelection,maxHeight:e.maxHeight,onDeselect:t[1]||(t[1]=s=>e.$emit("update:modelValue",e.selected)),onSelect:t[2]||(t[2]=s=>{e.makeSelection(),e.$emit("update:modelValue",e.selected),e.$emit("show-selection",e.selected)}),onClear:t[3]||(t[3]=s=>e.$emit("clear-selection")),ref:"selectRef",disabled:e.disabled},null,8,["placeholder","options","canDeselect","onChange","modelValue","noOptionsText","onClose","maxHeight","disabled"]),I])])}const H=m(T,[["render",E],["__scopeId","data-v-101b2217"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/components/SelectInputPlugin.vue"]]);export{H as S};