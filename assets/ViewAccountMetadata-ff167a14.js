import{d as C,k as H,o as b,b as h,s as c,z as r,A as U,t as y,C as g,e as l,f as k,p as E,j as D,_ as V,r as M,c as S,w as _,E as f,a as L,B as v}from"./index-a7feb194.js";import{_ as $}from"./icon-plus-7207f329.js";import{_ as R,A as j,a as W}from"./AccountTabs-18dc7757.js";import{s as w,a as B}from"./column.esm-e004bfdb.js";import{U as F}from"./UTF8-f98e5a8f.js";import"./jdenticon-module-028d553f.js";import"./functions-af00d9b6.js";import"./TextInput-1b27ff32.js";import"./TextInputClean-ab325344.js";import"./icon-key-5b3f7dda.js";const I=i=>(E("data-v-3dab97a9"),i=i(),D(),i),O={class:"flex"},Q={key:0,class:"ml-3 text-gray-400 font-semibold"},z={key:0,class:"flex"},Y=I(()=>l("div",{class:"ml-3 text-gray-400 font-semibold"},"utf-8",-1)),Z={class:"text-xs"},q=I(()=>l("img",{src:R,title:"Update Metadata",class:"inline-block w-3 h-3 text-black cursor-pointer ml-1"},null,-1)),G=C({__name:"AccountMetadataDatatable",props:{accMetadata:Array,publicKey:String},setup(i){return(m,o)=>{const u=H("router-link");return b(),h("div",null,[c(g(B),{value:i.accMetadata,paginator:!0,rows:10,dataKey:"id",paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown",rowsPerPageOptions:[10,20,30,40,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",responsiveLayout:"scroll"},{empty:r(()=>[U(y(m.$t("general.noRecord")),1)]),loading:r(()=>[U(y(m.$t("dashboard.fetchingTx")),1)]),default:r(()=>[c(g(w),{field:"scopedMetadataKey",header:"Scoped Metadata Key"},{body:r(({data:t})=>[l("div",O,[l("div",null,y(t.scopedMetadataKeyHex),1),t.scopedMetadataKeyUtf8?(b(),h("div",Q,"hex")):k("v-if",!0)]),t.scopedMetadataKeyUtf8?(b(),h("div",z,[l("div",null,y(t.scopedMetadataKeyUtf8),1),Y])):k("v-if",!0)]),_:1}),c(g(w),{field:"currentValue",header:"Current Value"},{body:r(({data:t})=>[l("span",Z,y(t.value),1)]),_:1}),c(g(w),{field:"action",header:"Action"},{body:r(({data:t})=>[c(u,{to:{name:"ViewUpdateAccountMetadata",params:{targetPublicKey:i.publicKey,scopedMetadataKey:t.scopedMetadataKeyUtf8?t.scopedMetadataKeyUtf8:t.scopedMetadataKeyHex}}},{default:r(()=>[q]),_:2},1032,["to"])]),_:1})]),_:1},8,["value"])])}}});const J=V(G,[["__scopeId","data-v-3dab97a9"],["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/metadataTxn/components/AccountMetadataDatatable.vue"]]),X={class:"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5"},ee={class:"border-2 border-t-0"},ae=l("button",{class:"mx-6 my-4 blue-btn py-3 px-3 flex items-center"},[l("img",{src:$,class:"inline-block w-4 h-4 mr-2"}),U("Create New Account Metadata")],-1),te=C({__name:"ViewAccountMetadata",props:{address:String},setup(i){const m=i;M(0);const o=S(()=>{if(!_.currentLoggedInWallet)return null;let e=_.currentLoggedInWallet.accounts.find(a=>a.address==m.address)||_.currentLoggedInWallet.others.find(a=>a.address==m.address);return e||null});S(()=>o.value?o.value.getDirectParentMultisig().length>0:!1);const u=M([]);M([]),M([]);const t=e=>new Promise(a=>setTimeout(a,e)),N=async()=>{if(!o.value)return;let e=new v.MetadataQueryParams;e.metadataType=v.MetadataType.ACCOUNT,e.pageSize=100,e.pageNumber=1,e.targetKey=v.PublicAccount.createFromPublicKey(o.value.publicKey,f.networkType);let a=await f.chainAPI.metadataAPI.searchMetadatas(e);for(let d=0;d<a.metadataEntries.length;d++){let s=a.metadataEntries;u.value.push({scopedMetadataKeyUtf8:s[d].scopedMetadataKey.toHex()==x(s[d].scopedMetadataKey.toHex())?null:x(s[d].scopedMetadataKey.toHex()),scopedMetadataKeyHex:s[d].scopedMetadataKey.toHex(),value:s[d].value})}let K=a.pagination.totalPages;await t(250);for(let d=2;d<=K;d++){let s=new v.MetadataQueryParams;s.metadataType=v.MetadataType.ACCOUNT,s.pageSize=100,s.pageNumber=d,s.targetKey=o.value.publicKey;let T=await f.chainAPI.metadataAPI.searchMetadatas(s);for(let n=0;n<T.metadataEntries.length;n++){let p=T.metadataEntries;u.value.push({scopedMetadataKeyUtf8:p[n].scopedMetadataKey.toHex()==x(p[n].scopedMetadataKey.toHex())?null:x(p[n].scopedMetadataKey.toHex()),scopedMetadataKeyHex:p[n].scopedMetadataKey.toHex(),value:p[n].value}),await t(250)}}},A=e=>(e.endsWith("00")&&(e=e.substring(0,e.length-2),e=A(e)),e),x=e=>{e=A(e);let a=v.Convert.hexToUint8(e);return F.isNotUTF8(a)||(e=v.Convert.decodeHexToUtf8(e)),e},P=async()=>{N()};if(f.isReady)P();else{let e=L(f,a=>{a.isReady&&(P(),e())})}return(e,a)=>{const K=H("router-link");return b(),h("div",null,[l("div",X,[c(j,{address:i.address,class:"mb-6"},null,8,["address"]),c(W,{address:i.address,selected:"metadata"},null,8,["address"]),l("div",ee,[c(J,{publicKey:o.value?o.value.publicKey:"0".repeat(64),accMetadata:u.value},null,8,["publicKey","accMetadata"]),k(` <select class=" my-4" v-model="filterSelection">
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
                </div> `),c(K,{to:{name:"ViewUpdateAccountMetadata",params:{targetPublicKey:o.value?o.value.publicKey:"0".repeat(64)}}},{default:r(()=>[ae]),_:1},8,["to"])])])])}}}),ue=V(te,[["__file","/home/runner/work/web-wallet-vuejs/web-wallet-vuejs/src/modules/metadataTxn/views/ViewAccountMetadata.vue"]]);export{ue as default};
