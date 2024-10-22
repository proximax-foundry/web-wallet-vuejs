import{d as E,y as O,j as T,g,c as k,n as f,N as $,D as Z,r as F,o as b,f as y,e as l,t as h,O as U,P as W,l as m,F as D,W as S,w as v,_ as K,az as ee,aA as te,ay as L,bd as R,k as le,b as se,v as w,i as B,S as C,U as ae,aD as ne,A as oe,ad as re,be as ie}from"./index-d2e8ccc1.js";import{_ as A}from"./PasswordInput.vue_vue_type_script_setup_true_lang-3f480d29.js";const de={class:"border border-gray-200 px-2 py-1 h-12"},ue={class:"uppercase text-gray-400 font-light text-txs text-left mb-2"},ce={class:"border border-gray-200 px-2 py-1 h-12 mt-5"},pe={class:"uppercase text-gray-400 font-light text-txs text-left mb-2"},me=E({__name:"NodeComponent",setup(s){const a=O(),{t:e}=T(),c=g(!0),V=k(()=>{if(!f.currentNetworkProfile)return[];let i=[];return f.currentNetworkProfile.apiNodes.forEach(d=>{i.push({value:d,name:$.buildAPIEndpointURL(d)})}),i}),o=k(()=>$.buildAPIEndpointURL(f.selectedAPIEndpoint)),P=k(()=>f.currentNetworkProfileConfig?f.currentNetworkProfileConfig.chainHeight:0),p=g({name:"",value:""});Z(()=>f.selectedAPIEndpoint,i=>{i&&(p.value={name:$.buildAPIEndpointURL(i),value:$.buildAPIEndpointURL(i)})},{immediate:!0});const n=async i=>{i.value.value!=f.selectedAPIEndpoint&&(c.value=!0,$.updateChainNode(i.value),await S.refreshAllAccountDetails(v.currentLoggedInWallet,f.currentNetworkProfile),a.add({severity:"success",summary:e("nodes.nodes"),detail:e("node.nodeUpdated"),group:"br-custom",life:5e3}))};return(i,d)=>{const I=F("Dropdown");return b(),y(D,null,[l("div",de,[l("div",ue,h(i.$t("general.block")),1),U(l("input",{disabled:"true","onUpdate:modelValue":d[0]||(d[0]=x=>P.value=x),type:"text",class:"text_input"},null,512),[[W,P.value]])]),l("div",ce,[l("div",pe,h(i.$t("node.currentNode")),1),U(l("input",{disabled:"true","onUpdate:modelValue":d[1]||(d[1]=x=>o.value=x),type:"text",class:"text_input"},null,512),[[W,o.value]])]),m(I,{onChange:n,class:"w-full mt-5 text-left",modelValue:p.value,"onUpdate:modelValue":d[2]||(d[2]=x=>p.value=x),options:V.value,"option-label":"name",placeholder:i.$t("node.nodeList")},null,8,["modelValue","options","placeholder"])],64)}}});const ve=K(me,[["__scopeId","data-v-6c096eee"]]);var ge={root:{position:"relative"}},fe={root:function(a){var e=a.instance,c=a.props;return["p-inputswitch p-component",{"p-highlight":e.checked,"p-disabled":c.disabled,"p-invalid":c.invalid}]},input:"p-inputswitch-input",slider:"p-inputswitch-slider"},be=ee.extend({name:"inputswitch",classes:fe,inlineStyles:ge}),ye={name:"BaseInputSwitch",extends:te,props:{modelValue:{type:null,default:!1},trueValue:{type:null,default:!0},falseValue:{type:null,default:!1},invalid:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},tabindex:{type:Number,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:be,provide:function(){return{$parentInstance:this}}},j={name:"InputSwitch",extends:ye,inheritAttrs:!1,emits:["update:modelValue","change","focus","blur"],methods:{getPTOptions:function(a){var e=a==="root"?this.ptmi:this.ptm;return e(a,{context:{checked:this.checked,disabled:this.disabled}})},onChange:function(a){if(!this.disabled&&!this.readonly){var e=this.checked?this.falseValue:this.trueValue;this.$emit("update:modelValue",e),this.$emit("change",a)}},onFocus:function(a){this.$emit("focus",a)},onBlur:function(a){this.$emit("blur",a)}},computed:{checked:function(){return this.modelValue===this.trueValue}}},we=["data-p-highlight","data-p-disabled"],he=["id","checked","tabindex","disabled","readonly","aria-checked","aria-labelledby","aria-label","aria-invalid"];function xe(s,a,e,c,V,o){return b(),y("div",L({class:s.cx("root"),style:s.sx("root")},o.getPTOptions("root"),{"data-p-highlight":o.checked,"data-p-disabled":s.disabled}),[l("input",L({id:s.inputId,type:"checkbox",role:"switch",class:[s.cx("input"),s.inputClass],style:s.inputStyle,checked:o.checked,tabindex:s.tabindex,disabled:s.disabled,readonly:s.readonly,"aria-checked":o.checked,"aria-labelledby":s.ariaLabelledby,"aria-label":s.ariaLabel,"aria-invalid":s.invalid||void 0,onFocus:a[0]||(a[0]=function(){return o.onFocus&&o.onFocus.apply(o,arguments)}),onBlur:a[1]||(a[1]=function(){return o.onBlur&&o.onBlur.apply(o,arguments)}),onChange:a[2]||(a[2]=function(){return o.onChange&&o.onChange.apply(o,arguments)})},o.getPTOptions("input")),null,16,he),l("span",L({class:s.cx("slider")},o.getPTOptions("slider")),null,16)],16,we)}j.render=xe;const ke={name:"selectSoundSetting",components:{InputSwitch:j},setup(){const s=g(JSON.parse(sessionStorage.getItem("soundSetting")));return{checkedValue:k({get(){return sessionStorage.setItem("soundSetting",String(s.value)),s.value},set(e){s.value=e}})}}};function Pe(s,a,e,c,V,o){const P=F("InputSwitch");return b(),y("div",null,[a[1]||(a[1]=l("img",{src:R,class:"h-4 w-4 inline-block relative mr-2",style:{top:"-1px"}},null,-1)),m(P,{modelValue:c.checkedValue,"onUpdate:modelValue":a[0]||(a[0]=p=>c.checkedValue=p)},null,8,["modelValue"])])}const Se=K(ke,[["render",Pe]]),Ve={key:0},$e={key:0,class:"error error_box mb-3"},Ce=["disabled"],Ie={key:1},Ne={key:0,class:"error error_box mb-3"},Le=["disabled"],M="^[^ ]{8,}$",Ae=E({__name:"changeAccountPassword",setup(s){const{t:a}=T(),e=g(!1),c=g(!1),V=g(!1),o=le(),P=O();let p=g(""),n=g(""),i=g("");const d=g(""),I=k(()=>!n.value.match(M)),x=k(()=>n.value.match(M)===null||d.value!==n.value),H=k(()=>d.value!=n.value&&d.value!=""),q=()=>{n.value="",d.value=""},z=()=>{v.isLogin=!1,o.push({name:"Home"})},J=()=>{if(S.verifyWalletPassword(v.currentLoggedInWallet.name,f.chainNetworkName,n.value))c.value=!0,i.value=n.value,q(),p.value="";else{let r=v.currentLoggedInWallet.name;p.value=a("general.walletPasswordInvalid",{name:r})}},Y=()=>{P.add({severity:"success",summary:"Success",detail:"Your Password has changed",group:"br",life:3e3})},G=()=>{for(let r=0;r<v.currentLoggedInWallet.accounts.length;r++){let t=v.currentLoggedInWallet.accounts[r];const u=S.createPassword(i.value),Q=S.decryptPrivateKey(u,t.encrypted,t.iv);let X=S.createPassword(n.value);const N=S.createAccountSimpleFromPrivateKey(t.name,X,Q,oe.networkType);let _=new re(t.name,t.publicKey,N.publicAccount.address.plain(),"pass:bip32",N.encryptedPrivateKey.encryptedKey,N.encryptedPrivateKey.iv);v.currentLoggedInWallet.accounts[r].encrypted=_.encrypted,v.currentLoggedInWallet.accounts[r].iv=_.iv}v.wallets.saveMyWalletOnlytoLocalStorage(v.currentLoggedInWallet),Y(),z()};return(r,t)=>(b(),y(D,null,[m(w(ae),{visible:e.value,"onUpdate:visible":t[7]||(t[7]=u=>e.value=u),modal:"",draggable:!1,dismissableMask:!0,closable:!1,class:"w-96"},{default:se(()=>[c.value?(b(),y("div",Ie,[t[11]||(t[11]=l("h1",{class:"default-title my-3 sm:my-5 text-center"},"Change Password",-1)),w(p)!=""?(b(),y("div",Ne,h(w(p)),1)):B("",!0),t[12]||(t[12]=l("div",{class:"text-center mt-2 text-xs font-semibold"}," Enter New Password ",-1)),m(A,{class:"mt-3",placeholder:r.$t("wallet.enterPassword"),errorMessage:r.$t("wallet.passwordErrMsg"),showError:V.value,icon:"lock",modelValue:w(n),"onUpdate:modelValue":t[3]||(t[3]=u=>C(n)?n.value=u:n=u)},null,8,["placeholder","errorMessage","showError","modelValue"]),m(A,{class:"mt-3",placeholder:r.$t("wallet.confirmPassword"),errorMessage:r.$t("wallet.confirmPasswordErrMsg"),showError:H.value,icon:"lock",modelValue:d.value,"onUpdate:modelValue":t[4]||(t[4]=u=>d.value=u)},null,8,["placeholder","errorMessage","showError","modelValue"]),l("button",{onClick:t[5]||(t[5]=u=>{G(),e.value=!e.value,C(n)?n.value="":n="",c.value=!1}),class:"blue-btn font-semibold py-2 mt-3 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto",disabled:x.value},h(r.$t("general.confirm")),9,Le),l("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:t[6]||(t[6]=u=>{e.value=!e.value,C(n)?n.value="":n="",c.value=!1})},h(r.$t("general.cancel")),1)])):(b(),y("div",Ve,[t[9]||(t[9]=l("h1",{class:"default-title my-3 text-center sm:my-5"},"Change Password",-1)),w(p)!=""?(b(),y("div",$e,h(w(p)),1)):B("",!0),t[10]||(t[10]=l("div",{class:"text-center mt-2 text-xs font-semibold"}," Enter Current Password ",-1)),m(A,{class:"my-3",modelValue:w(n),"onUpdate:modelValue":t[0]||(t[0]=u=>C(n)?n.value=u:n=u),placeholder:r.$t("general.password"),errorMessage:r.$t("general.passwordRequired")},null,8,["modelValue","placeholder","errorMessage"]),l("div",{onClick:t[1]||(t[1]=u=>J()),class:"blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto",disabled:I.value},h(r.$t("general.confirm")),9,Ce),l("div",{class:"text-center cursor-pointer text-xs font-semibold text-blue-link mt-2",onClick:t[2]||(t[2]=u=>{e.value=!e.value,C(n)?n.value="":n=""})},h(r.$t("general.cancel")),1)]))]),_:1},8,["visible"]),l("a",{onClick:t[8]||(t[8]=u=>e.value=!e.value)},[t[13]||(t[13]=l("img",{src:R,class:"h-4 w-4 inline-block relative mr-2",style:{top:"-1px"}},null,-1)),m(w(ne),{label:"Change Password",class:"p-button-sm p-button-outlined p-button-secondary"})])],64))}}),Ee={class:"mx-auto w-9/12 mt-16"},_e={class:"ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},Ue={class:"border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white"},We={class:"flex mb-3 gap-2 items-center"},Be={class:"flex"},Me={class:"flex"},Fe=E({__name:"ViewSettings",setup(s){return(a,e)=>(b(),y("div",null,[l("div",Ee,[l("div",_e,[e[4]||(e[4]=l("div",{class:"flex justify-between text-sm mb-5"},[l("div",null,[l("span",{class:"text-gray-700"},"Settings")])],-1)),l("div",Ue,[l("div",We,[e[0]||(e[0]=l("div",{class:"text-left text-gray-700"},"Select Language:",-1)),m(ie)]),l("div",Be,[e[1]||(e[1]=l("div",{class:"text-left mb-3 text-gray-700"},"Sound Volume:",-1)),m(Se)]),l("div",Me,[e[2]||(e[2]=l("div",{class:"text-left mt-1 mb-3 text-gray-700"},"Change Password:",-1)),m(Ae)]),e[3]||(e[3]=l("div",{class:"text-left mb-3 text-gray-700"},"Nodes",-1)),m(ve)])])])]))}});export{Fe as default};