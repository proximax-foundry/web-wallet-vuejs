import{_ as k,u as N,r as i,l as E,c as K,w as r,i as g,b as x,e as o,m as p,v as W,t as d,f as C,W as v,n as L,z as T,B as A,a2 as M,o as I,x as S}from"./index-f0fab120.js";import{T as $}from"./TextInput-806b984f.js";import{_ as B}from"./PasswordInput.vue_vue_type_script_setup_true_lang-50f7a698.js";import{_ as U}from"./chevron_left-0423cb29.js";const F={name:"ViewAccountCreatePrivateKey",components:{TextInput:$,PasswordInput:B},setup(){const{t}=N(),a=i(!1),l=i(""),e=i(""),c=i(""),f=i(!1),u="^(0x|0X)?[a-fA-F0-9].{63,65}$",m="^[^ ]{8,}$",w=E(),s=K(()=>!(c.value.match(m)&&e.value.length!=""&&l.value.match(u))),V=K(()=>!l.value.match(u)&&l.value!=""),h=r.currentLoggedInWallet?r.currentLoggedInWallet.name:"";return{showPkError:V,walletState:r,err:a,create:async()=>{if(!r.currentLoggedInWallet)return;if(r.currentLoggedInWallet.accounts.find(n=>n.name==e.value))a.value=t("account.nameTaken");else{var P=v.verifyWalletPassword(r.currentLoggedInWallet.name,L.chainNetworkName,c.value);if(P==-1)a.value=t("account.failCreate");else if(P==0)a.value=t("general.walletPasswordInvalid",{name:h});else{const n=T.Account.createFromPrivateKey(l.value,A.networkType,1);if(r.currentLoggedInWallet.accounts.find(y=>y.publicKey==n.publicKey))a.value=t("account.privateKeyExist");else{let y=v.createPassword(c.value);const _=v.createAccountSimpleFromPrivateKey(e.value,y,l.value,A.networkType);let b=new M(e.value,n.publicKey,n.address.plain(),"pass:bip32",_.encryptedPrivateKey.encryptedKey,_.encryptedPrivateKey.iv);r.currentLoggedInWallet.accounts.push(b),await v.reloadAddedAccount(b.name),r.wallets.saveMyWalletOnlytoLocalStorage(r.currentLoggedInWallet),w.push({name:"ViewAccountDetails",params:{address:n.address.address,accountCreated:!0}})}}}},accountName:e,walletPassword:c,privKey:l,showPasswdError:f,disableCreate:s,walletName:h}},methods:{clearInput:function(){this.accountName="",this.walletPassword="",this.privKey=""}}},D={class:"flex cursor-pointer"},R=o("img",{src:U},null,-1),j={class:"border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg"},q={class:"text-lg text-center font-bold mt-10"},z={class:"text-blue-primary text-xs text-center font-bold"},O={key:0,class:"error error_box mb-2 w-8/12 ml-auto mr-auto"},X={class:"w-8/12 ml-auto mr-auto mt-3"},G={class:"flex justify-center mt-3"},H=["disabled"],J=o("div",{class:"mt-10"},null,-1);function Q(t,a,l,e,c,f){const u=g("router-link"),m=g("PasswordInput"),w=g("TextInput");return I(),x("div",null,[o("div",D,[R,p(u,{to:{name:"ViewAccountCreateSelectType"},class:"text-blue-primary text-xs mt-0.5"},{default:W(()=>[S(d(t.$t("general.back")),1)]),_:1})]),o("div",j,[o("div",q,d(t.$t("general.createNewAcc")),1),o("div",z,d(t.$t("general.fromPrivateKey")),1),e.err!=""?(I(),x("div",O,d(e.err),1)):C("",!0),o("div",X,[p(m,{placeholder:t.$t("general.privateKey"),errorMessage:t.$t("general.invalidPrivateKey"),icon:"key",showError:e.showPkError,modelValue:e.privKey,"onUpdate:modelValue":a[0]||(a[0]=s=>e.privKey=s)},null,8,["placeholder","errorMessage","showError","modelValue"]),p(w,{class:"mt-3",placeholder:t.$t("account.namePlaceholder"),errorMessage:t.$t("account.enterAccountName"),modelValue:e.accountName,"onUpdate:modelValue":a[1]||(a[1]=s=>e.accountName=s),icon:"wallet"},null,8,["placeholder","errorMessage","modelValue"]),p(m,{class:"mt-3",placeholder:t.$t("general.enterPassword"),errorMessage:t.$t("general.passwordRequired"),showError:e.showPasswdError,icon:"lock",modelValue:e.walletPassword,"onUpdate:modelValue":a[2]||(a[2]=s=>e.walletPassword=s)},null,8,["placeholder","errorMessage","showError","modelValue"])]),o("div",G,[o("button",{type:"submit",class:"blue-btn py-2 px-8 disabled:opacity-50",onClick:a[3]||(a[3]=s=>e.create()),disabled:e.disableCreate},d(t.$t("general.create")),9,H)]),J])])}const se=k(F,[["render",Q]]);export{se as default};