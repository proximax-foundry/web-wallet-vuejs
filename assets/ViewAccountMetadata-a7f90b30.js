import"./vue-86063517.js";import{_ as D}from"./icon-plus-7207f329.js";import{_ as C,w as _,A as y}from"./index-71c561bd.js";import{d as n}from"./tsjs-xpx-chain-sdk-84426b6a.js";import{_ as E,A as L,a as $}from"./AccountTabs-3292ce5c.js";import{f as w,g as R}from"./primevue-35724b2c.js";import{d as H,B as V,o as b,z as h,a as l,m as c,l as U,g as f,bf as g,A as s,e as k,aW as W,aT as j,r as M,c as S,w as B}from"./@vue-a9ecc9f1.js";import{U as F}from"./utf-8-cb75ef47.js";import"./@js-joda-d98eb16f.js";import"./vue-router-21fffbbf.js";import"./rxjs-1250b26d.js";import"./tslib-8dbab242.js";import"./crypto-js-e64ac54c.js";import"./crypto-browserify-4fd8cccd.js";import"./randombytes-685e9383.js";import"./node-stdlib-browser-23a8bc7f.js";import"./buffer-6d367910.js";import"./base64-js-50a5cdf9.js";import"./ieee754-44f7831e.js";import"./process-2209b2b3.js";import"./safe-buffer-c463177b.js";import"./create-hash-92c04a28.js";import"./inherits-804453d8.js";import"./md5.js-8d474739.js";import"./hash-base-bb85fc42.js";import"./readable-stream-2241ee9e.js";import"./events-86ccc6d8.js";import"./util-06f7ff32.js";import"./is-arguments-86164331.js";import"./has-tostringtag-7c6352d6.js";import"./has-symbols-cd7870b9.js";import"./call-bind-9e7f09da.js";import"./get-intrinsic-f35014ba.js";import"./has-proto-8ede3a55.js";import"./function-bind-68631a08.js";import"./has-ab8e2922.js";import"./is-generator-function-06dfaf9d.js";import"./which-typed-array-cf6b6a29.js";import"./for-each-f57c5052.js";import"./is-callable-7492318c.js";import"./available-typed-arrays-61974ec7.js";import"./gopd-bab4d6bd.js";import"./is-typed-array-037eef20.js";import"./util-deprecate-c3aabb3c.js";import"./string_decoder-ef7b01fe.js";import"./ripemd160-58dcfa02.js";import"./sha.js-cea3da2e.js";import"./cipher-base-aee0e03d.js";import"./stream-browserify-7496a08f.js";import"./create-hmac-e8b5ea4a.js";import"./browserify-sign-a708a95f.js";import"./browserify-rsa-bfbdcbb6.js";import"./bn.js-1ae23332.js";import"./elliptic-75e883ee.js";import"./minimalistic-assert-4cc49674.js";import"./minimalistic-crypto-utils-6f869a51.js";import"./brorand-03f0f79d.js";import"./hash.js-4f5dfe73.js";import"./hmac-drbg-87799258.js";import"./parse-asn1-465c125b.js";import"./asn1.js-405e93e4.js";import"./safer-buffer-2ac6237e.js";import"./evp_bytestokey-e91543fa.js";import"./browserify-aes-ce20a0e6.js";import"./buffer-xor-87a7236a.js";import"./pbkdf2-e2ae8643.js";import"./browserify-cipher-c4c37ca3.js";import"./browserify-des-3f7e64d9.js";import"./des.js-d262604a.js";import"./diffie-hellman-c8260aab.js";import"./miller-rabin-de27bf02.js";import"./create-ecdh-ffe720e9.js";import"./public-encrypt-fc0568a2.js";import"./randomfill-2874e5f1.js";import"./mathjs-2a513dae.js";import"./@babel-484168fe.js";import"./typed-function-4896e4f1.js";import"./decimal.js-d133ee8e.js";import"./complex.js-cf2520e8.js";import"./fraction.js-39e7906a.js";import"./javascript-natural-sort-c4dd0c27.js";import"./escape-latex-c8a96e7a.js";import"./seedrandom-c8f991ad.js";import"./tiny-emitter-56d49cfd.js";import"./js-sha3-d7d4f583.js";import"./crypto-random-string-d158262e.js";import"./jose-92e5544c.js";import"./vue-i18n-728f748b.js";import"./@intlify-16888cd3.js";import"./vue-loading-overlay-b89251b1.js";import"./jspdf-30014160.js";import"./fflate-8981c52c.js";import"./vue-debounce-3bbbf8c6.js";import"./mitt-f7ef348c.js";/* empty css                   */import"./maska-6f10db43.js";import"./@fortawesome-014b81f2.js";import"./vue3-blocks-tree-e53499e3.js";import"./@noble-f8eff84a.js";import"./utf8-c941a4a0.js";import"./bip39-936aefa9.js";import"./axios-b48d2c29.js";import"./flatbuffers-edc4f8d7.js";import"./ws-0a714537.js";import"./jdenticon-e4458e79.js";import"./functions-3b5b4af7.js";import"./TextInput-50fcd4b9.js";import"./TextInputClean-e28e968a.js";import"./icon-key-5b3f7dda.js";const I=o=>(W("data-v-3dab97a9"),o=o(),j(),o),O={class:"flex"},Q={key:0,class:"ml-3 text-gray-400 font-semibold"},z={key:0,class:"flex"},Y=I(()=>s("div",{class:"ml-3 text-gray-400 font-semibold"},"utf-8",-1)),Z={class:"text-xs"},q=I(()=>s("img",{src:E,title:"Update Metadata",class:"inline-block w-3 h-3 text-black cursor-pointer ml-1"},null,-1)),G=H({__name:"AccountMetadataDatatable",props:{accMetadata:Array,publicKey:String},setup(o){return(p,r)=>{const v=V("router-link");return b(),h("div",null,[l(g(R),{value:o.accMetadata,paginator:!0,rows:10,dataKey:"id",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown",rowsPerPageOptions:[10,20,30,40,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",responsiveLayout:"scroll"},{empty:c(()=>[U(f(p.$t("general.noRecord")),1)]),loading:c(()=>[U(f(p.$t("dashboard.fetchingTx")),1)]),default:c(()=>[l(g(w),{field:"scopedMetadataKey",header:"Scoped Metadata Key"},{body:c(({data:a})=>[s("div",O,[s("div",null,f(a.scopedMetadataKeyHex),1),a.scopedMetadataKeyUtf8?(b(),h("div",Q,"hex")):k("v-if",!0)]),a.scopedMetadataKeyUtf8?(b(),h("div",z,[s("div",null,f(a.scopedMetadataKeyUtf8),1),Y])):k("v-if",!0)]),_:1}),l(g(w),{field:"currentValue",header:"Current Value"},{body:c(({data:a})=>[s("span",Z,f(a.value),1)]),_:1}),l(g(w),{field:"action",header:"Action"},{body:c(({data:a})=>[l(v,{to:{name:"ViewUpdateAccountMetadata",params:{targetPublicKey:o.publicKey,scopedMetadataKey:a.scopedMetadataKeyUtf8?a.scopedMetadataKeyUtf8:a.scopedMetadataKeyHex}}},{default:c(()=>[q]),_:2},1032,["to"])]),_:1})]),_:1},8,["value"])])}}});const J=C(G,[["__scopeId","data-v-3dab97a9"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/metadataTxn/components/AccountMetadataDatatable.vue"]]),X={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},tt={class:"border-2 border-t-0"},et=s("button",{class:"mx-6 my-4 blue-btn py-3 px-3 flex items-center"},[s("img",{src:D,class:"inline-block w-4 h-4 mr-2"}),U("Create New Account Metadata")],-1),at=H({__name:"ViewAccountMetadata",props:{address:String},setup(o){const p=o;M(0);const r=S(()=>{if(!_.currentLoggedInWallet)return null;let t=_.currentLoggedInWallet.accounts.find(e=>e.address==p.address)||_.currentLoggedInWallet.others.find(e=>e.address==p.address);return t||null});S(()=>r.value?r.value.getDirectParentMultisig().length>0:!1);const v=M([]);M([]),M([]);const a=t=>new Promise(e=>setTimeout(e,t)),N=async()=>{if(!r.value)return;let t=new n.MetadataQueryParams;t.metadataType=n.MetadataType.ACCOUNT,t.pageSize=100,t.pageNumber=1,t.targetKey=n.PublicAccount.createFromPublicKey(r.value.publicKey,y.networkType);let e=await y.chainAPI.metadataAPI.searchMetadatas(t);for(let i=0;i<e.metadataEntries.length;i++){let d=e.metadataEntries;v.value.push({scopedMetadataKeyUtf8:d[i].scopedMetadataKey.toHex()==x(d[i].scopedMetadataKey.toHex())?null:x(d[i].scopedMetadataKey.toHex()),scopedMetadataKeyHex:d[i].scopedMetadataKey.toHex(),value:d[i].value})}let K=e.pagination.totalPages;await a(250);for(let i=2;i<=K;i++){let d=new n.MetadataQueryParams;d.metadataType=n.MetadataType.ACCOUNT,d.pageSize=100,d.pageNumber=i,d.targetKey=r.value.publicKey;let T=await y.chainAPI.metadataAPI.searchMetadatas(d);for(let m=0;m<T.metadataEntries.length;m++){let u=T.metadataEntries;v.value.push({scopedMetadataKeyUtf8:u[m].scopedMetadataKey.toHex()==x(u[m].scopedMetadataKey.toHex())?null:x(u[m].scopedMetadataKey.toHex()),scopedMetadataKeyHex:u[m].scopedMetadataKey.toHex(),value:u[m].value}),await a(250)}}},A=t=>(t.endsWith("00")&&(t=t.substring(0,t.length-2),t=A(t)),t),x=t=>{t=A(t);let e=n.Convert.hexToUint8(t);return F.isNotUTF8(e)||(t=n.Convert.decodeHexToUtf8(t)),t},P=async()=>{N()};if(y.isReady)P();else{let t=B(y,e=>{e.isReady&&(P(),t())})}return(t,e)=>{const K=V("router-link");return b(),h("div",null,[s("div",X,[l(L,{address:o.address,class:"mb-6"},null,8,["address"]),l($,{address:o.address,selected:"metadata"},null,8,["address"]),s("div",tt,[l(J,{publicKey:r.value?r.value.publicKey:"0".repeat(64),accMetadata:v.value},null,8,["publicKey","accMetadata"]),k(` <select class=" my-4" v-model="filterSelection">
                    <option value=0>ACCOUNT</option>
                    <option value=1>NAMESPACE</option>
                    <option value=2>ASSET</option>
                </select>
                <div v-if="filterSelection==0">
                    <div v-if="!accountMetadata.length" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
                    <div class="text-txs text-gray-400 my-1 text-center" v-if="!accountMetadata.length">You do not have any existing metadatas on record.</div>
                    <div v-else>
                        <div class="grid grid-cols-2 text-gray-400 font-semibold text-xs uppercase mb-2">
                            <div>Scoped Metadata Key</div>
                            <div>Current Value</div>
                        </div>
                        <div v-for="(metadata,index) in accountMetadata" :key="index">
                            <div class="grid grid-cols-2 text-xs mb-2">
                                <div>
                                    <div class="flex">
                                        <div>{{metadata.scopedMetadataKeyHex}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold" v-if="metadata.scopedMetadataKeyUtf8">hex</div>
                                    </div>
                                    <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
                                        <div>{{metadata.scopedMetadataKeyUtf8}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                                    </div>
                                </div>
                                <div class="break-all">
                                    {{metadata.value}} 
                                    <router-link :to="{name: 'ViewUpdateAccountMetadata',params:{targetPublicKey:acc?acc.publicKey:'0'.repeat(64),scopedMetadataKey:metadata.scopedMetadataKeyUtf8?metadata.scopedMetadataKeyUtf8:metadata.scopedMetadataKeyHex}}">
                                        <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
                                    </router-link>
                                </div>
                            </div>
                            <div v-if="index != (accountMetadata.length - 1)" class='my-2 gray-line' ></div>
                        </div>
                    </div>
                </div>
                <div v-else-if="filterSelection==1">
                    <div v-if="!namespaceMetadata.length" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
                    <div class="text-txs text-gray-400 my-1 text-center" v-if="!namespaceMetadata.length">You do not have any existing metadatas on record.</div>
                    <div v-else>
                        <div class="grid grid-cols-3 text-gray-400 font-semibold text-xs uppercase mb-2">
                            <div>Scoped Metadata Key</div>
                            <div>Target ID</div>
                            <div>Current Value</div>
                        </div>
                        <div v-for="(metadata,index) in namespaceMetadata" :key="index">
                            <div class="grid grid-cols-3 text-xs mb-2">
                                <div>
                                    <div class="flex">
                                        <div>{{metadata.scopedMetadataKeyHex}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold" v-if="metadata.scopedMetadataKeyUtf8">hex</div>
                                    </div>
                                    <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
                                        <div>{{metadata.scopedMetadataKeyUtf8}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                                    </div>
                                </div>
                                <div>{{metadata.id}}</div>
                                <div class="break-all">
                                    {{metadata.value}}
                                    <router-link :to="{name: 'ViewUpdateNamespaceMetadata',params:{targetId:metadata.id,scopedMetadataKey:metadata.scopedMetadataKeyUtf8?metadata.scopedMetadataKeyUtf8:metadata.scopedMetadataKeyHex}}">
                                        <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
                                    </router-link>
                                </div>
                            </div>
                            <div v-if="index != (namespaceMetadata.length - 1)" class='my-2 gray-line' ></div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="!assetMetadata.length" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
                    <div class="text-txs text-gray-400 my-1 text-center" v-if="!assetMetadata.length">You do not have any existing metadatas on record.</div>
                    <div v-else>
                        <div class="grid grid-cols-3 text-gray-400 font-semibold text-xs uppercase mb-2">
                            <div>Scoped Metadata Key</div>
                            <div>Target ID</div>
                            <div>Current Value</div>
                        </div>
                        <div v-for="(metadata,index) in assetMetadata" :key="index">
                            <div class="grid grid-cols-3 text-xs mb-2">
                                <div>
                                    <div class="flex">
                                        <div>{{metadata.scopedMetadataKeyHex}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold" v-if="metadata.scopedMetadataKeyUtf8">hex</div>
                                    </div>
                                    <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
                                        <div>{{metadata.scopedMetadataKeyUtf8}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                                    </div>
                                </div>
                                <div>{{metadata.name}}</div>
                                <div class="break-all">
                                    {{metadata.value}}
                                    <router-link :to="{name: 'ViewUpdateAssetMetadata',params:{targetId:metadata.id,scopedMetadataKey:metadata.scopedMetadataKeyUtf8?metadata.scopedMetadataKeyUtf8:metadata.scopedMetadataKeyHex}}">
                                        <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
                                    </router-link>
                                </div>
                            </div>
                            <div v-if="index != (assetMetadata.length - 1)" class='my-2 gray-line' ></div>
                        </div>
                    </div>
                </div> `),l(K,{to:{name:"ViewUpdateAccountMetadata",params:{targetPublicKey:r.value?r.value.publicKey:"0".repeat(64)}}},{default:c(()=>[et]),_:1},8,["to"])])])])}}}),da=C(at,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/metadataTxn/views/ViewAccountMetadata.vue"]]);export{da as default};
