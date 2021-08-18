<template>
  <div>
    <div class="px-5 py-2 text-left text-xs text-gray-500">{{hints}}</div>
    <div class="transition ease-in duration-300 w-full rounded-full px-5 py-1 mb-5" :class="borderColor">
      <input v-model="filterText" type="text" class="w-full outline-none text-sm" placeholder="Search" @click="clickInputText()" @blur="blurInputText()" :title="hints" >
    </div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column field="typeName" header="Type" headerStyle="width:110px">
        <template #body="{data}">
          <span class="font-semibold">{{data.typeName}}</span>
        </template>
      </Column>
      <Column header="Details" >
        <template #body="{data}">
          <div v-if="data.innerTransactions">
            <div v-for="innerTx in data.innerTransactions" :key="innerTx">
              <div class="font-bold"> {{ innerTx.typeName }}</div>
              <div class="flex space-x-2 pt-1 pb-1" v-for="displayRow in innerTx.displayTips" :key="displayRow">
                <span v-for="displayTip in displayRow.rowTips" :key="displayTip" >
                  <span v-if="displayTip.tipType === 'toRightArrow'">
                    <font-awesome-icon icon="arrow-right" class="text-gray-600 inline-block"></font-awesome-icon>
                  </span>
                  <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'asset'" class="text-xs font-semibold bg-yellow-300 inline-block truncate px-2 py-2 rounded">
                    <a :href="getAssetExplorerUrl(displayTip.displayValue)" target="_blank">
                      <img class="inline-block" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'namespace' || displayTip.tipType === 'namespaceId'" class="text-xs font-semibold bg-yellow-400 inline-block truncate px-2 py-2 rounded">
                    <a :href="getNamespaceExplorerUrl(displayTip.displayValue)" target="_blank">
                      <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'publicKey'" class="text-xs font-semibold bg-gray-300 inline-block truncate px-2 py-2 rounded">
                    <a :href="getPublicKeyExplorerUrl(displayTip.displayValue)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'empty'" class="border border-black text-xs font-semibold bg-gray-50 inline-block truncate px-2 py-2 rounded">
                    {{ displayTip.displayValue }}
                  </span>
                  <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'other'" class="text-xs font-semibold bg-green-50 inline-block truncate px-2 py-2 rounded">
                    {{ displayTip.displayValue }}
                  </span>
                  <span :title="displayTip.value" v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'plain'" class="text-xs font-semibold bg-blue-200 inline-block truncate px-2 py-2 rounded">
                    <a @click="$emit('openMessage', displayTip.value)">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'encrypted'" class="text-xs font-semibold bg-blue-200 inline-block truncate px-2 py-2 rounded">
                    {{ displayTip.displayValue }}
                  </span>
                  <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'absoluteAmount'" class="text-xs font-semibold bg-yellow-50 inline-block truncate px-2 py-2 rounded">
                    {{ displayTip.displayValue }}
                  </span>
                  <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'exactAmount'" class="text-xs font-semibold bg-green-300 inline-block truncate px-2 py-2 rounded">
                    {{ displayTip.displayValue }} 
                  </span>
                  <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'address'" class="text-xs font-semibold bg-green-300 inline-block truncate px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'transfer'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                    <font-awesome-icon icon="arrow-right" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                    <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'transferUnresolved'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                    <font-awesome-icon icon="arrow-right" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                    <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'addressRestrictMod'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'namespaceAmount'" class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded"> 
                    <a :href="getNamespaceExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'assetAmount'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                    <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                      <img class="inline-block" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                      {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'hash'" class="text-xs font-semibold bg-yellow-100 inline-block px-2 py-2 rounded">
                    <a :href="getHashExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'assetAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                    <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                      <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                      <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                        {{ displayTip.displayValue }}
                      </a>
                    </span>
                    <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                    <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                      <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                        {{ displayTip.displayValue2 }}
                      </a>
                    </span>
                  </span>
                  <span v-else-if="displayTip.tipType === 'removeAssetAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                    <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                      <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                      <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                        {{ displayTip.displayValue }}
                      </a>
                    </span>
                    <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                    <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                      <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                        {{ displayTip.displayValue2 }}
                      </a>
                    </span>
                  </span>
                  <span v-else-if="displayTip.tipType === 'addressAlias'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                    <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                      <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                      <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                        {{ displayTip.displayValue }}
                      </a>
                    </span>
                    <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                    <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                      <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                        {{ displayTip.displayValue2 }}
                      </a>
                    </span>
                  </span>
                  <span v-else-if="displayTip.tipType === 'removeAddressAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                    <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                      <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                      <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                        {{ displayTip.displayValue }}
                      </a>
                    </span>
                    <font-awesome-icon icon="not-equal" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                    <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                      <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                        {{ displayTip.displayValue2 }}
                      </a>
                    </span>
                  </span>
                  <span v-else-if="displayTip.tipType === 'linkPublicKey'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                    <font-awesome-icon icon="link" class="ml-2 mr-2 text-blue-600 inline-block"></font-awesome-icon>
                    <a :href="getPublicKeyExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'unlinkPublicKey'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                    <font-awesome-icon icon="unlink" class="ml-2 mr-2 text-blue-600 inline-block"></font-awesome-icon>
                    <a :href="getPublicKeyExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <span v-else-if="displayTip.tipType === 'supplyAmount'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                    {{ displayTip.displayValue }}{{ displayTip.displayValue2 }}
                  </span>
                  <span v-else-if="displayTip.tipType === 'msgNamespace'" class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                    <a :href="getNamespaceExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                  <span :title="displayTip.displayValue" v-else class="text-xs font-semibold bg-blue-300 inline-block truncate px-2 py-2 rounded">
                    {{ displayTip.displayValue }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex space-x-2 pt-1 pb-1" v-for="displayRow in data.displayTips" :key="displayRow">
              <span v-for="displayTip in displayRow.rowTips" :key="displayTip" >
                <span v-if="displayTip.tipType === 'toRightArrow'">
                  <font-awesome-icon icon="arrow-right" class="text-gray-600 inline-block"></font-awesome-icon>
                </span>
                <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'asset'" class="text-xs font-semibold bg-yellow-300 inline-block truncate px-2 py-2 rounded">
                  <a :href="getAssetExplorerUrl(displayTip.displayValue)" target="_blank">
                    <img class="inline-block" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                    {{ displayTip.displayValue }}
                  </a>
                </span>
                <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'namespace' || displayTip.tipType === 'namespaceId'" class="text-xs font-semibold bg-yellow-400 inline-block truncate px-2 py-2 rounded">
                  <a :href="getNamespaceExplorerUrl(displayTip.displayValue)" target="_blank">
                    <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                    {{ displayTip.displayValue }}
                  </a>
                </span>
                <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'publicKey'" class="text-xs font-semibold bg-gray-300 inline-block truncate px-2 py-2 rounded">
                  <a :href="getPublicKeyExplorerUrl(displayTip.displayValue)" target="_blank">
                    {{ displayTip.displayValue }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'empty'" class="border border-black text-xs font-semibold bg-gray-50 inline-block truncate px-2 py-2 rounded">
                  {{ displayTip.displayValue }}
                </span>
                <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'other'" class="text-xs font-semibold bg-green-50 inline-block truncate px-2 py-2 rounded">
                  {{ displayTip.displayValue }}
                </span>
                <span :title="displayTip.value" v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'plain'" class="text-xs font-semibold bg-blue-200 inline-block truncate px-2 py-2 rounded">
                  <a @click="$emit('openMessage', displayTip.value)">
                    {{ displayTip.displayValue }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'encrypted'" class="text-xs font-semibold bg-blue-200 inline-block truncate px-2 py-2 rounded">
                  {{ displayTip.displayValue }}
                </span>
                <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'absoluteAmount'" class="text-xs font-semibold bg-yellow-50 inline-block truncate px-2 py-2 rounded">
                  {{ displayTip.displayValue }}
                </span>
                <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'exactAmount'" class="text-xs font-semibold bg-green-300 inline-block truncate px-2 py-2 rounded">
                  {{ displayTip.displayValue }} 
                </span>
                <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'address'" class="text-xs font-semibold bg-green-300 inline-block truncate px-2 py-2 rounded">
                  <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                    {{ displayTip.displayValue }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'transfer'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                  <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                    {{ displayTip.displayValue }}
                  </a>
                  <font-awesome-icon icon="arrow-right" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                  <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                    {{ displayTip.displayValue2 }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'transferUnresolved'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                  <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                    {{ displayTip.displayValue }}
                  </a>
                  <font-awesome-icon icon="arrow-right" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                  <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                    {{ displayTip.displayValue2 }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'addressRestrictMod'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                  <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                    {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'namespaceAmount'" class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded"> 
                  <a :href="getNamespaceExplorerUrl(displayTip.value2)" target="_blank">
                    {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'assetAmount'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                  <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                    <img class="inline-block" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                    {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'hash'" class="text-xs font-semibold truncate bg-blue-200 inline-block px-2 py-2 rounded">
                  <a :href="getHashExplorerUrl(displayTip.value)" target="_blank">
                    {{ displayTip.displayValue }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'assetAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                  <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                    <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                    <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                  <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                </span>
                <span v-else-if="displayTip.tipType === 'removeAssetAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                  <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                    <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                    <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                  <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                </span>
                <span v-else-if="displayTip.tipType === 'addressAlias'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                  <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                    <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                    <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                  <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                </span>
                <span v-else-if="displayTip.tipType === 'removeAddressAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                  <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                    <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                    <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                      {{ displayTip.displayValue }}
                    </a>
                  </span>
                  <font-awesome-icon icon="not-equal" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                  <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                    <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                      {{ displayTip.displayValue2 }}
                    </a>
                  </span>
                </span>
                <span v-else-if="displayTip.tipType === 'linkPublicKey'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                  <font-awesome-icon icon="link" class="ml-2 mr-2 text-blue-600 inline-block"></font-awesome-icon>
                  <a :href="getPublicKeyExplorerUrl(displayTip.value)" target="_blank">
                     {{ displayTip.displayValue }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'unlinkPublicKey'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                  <font-awesome-icon icon="unlink" class="ml-2 mr-2 text-blue-600 inline-block"></font-awesome-icon>
                  <a :href="getPublicKeyExplorerUrl(displayTip.value)" target="_blank">
                     {{ displayTip.displayValue }}
                  </a>
                </span>
                <span v-else-if="displayTip.tipType === 'supplyAmount'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                  {{ displayTip.displayValue }}{{ displayTip.displayValue2 }}
                </span>
                <span v-else-if="displayTip.tipType === 'msgNamespace'" class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                  <a :href="getNamespaceExplorerUrl(displayTip.value2)" target="_blank">
                    {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                  </a>
                </span>
                <span :title="displayTip.displayValue" v-else class="text-xs font-semibold bg-blue-300 inline-block truncate px-2 py-2 rounded">
                  {{ displayTip.displayValue }}
                </span>
              </span>
            </div>
          </div>
        </template>
      </Column>
      <Column headerStyle="width: 12%" v-if="showBlock" field="block" header="Block" :sortable="true" >
        <template #body="{data}">
          <div>{{ data.block }}</div>
          <div v-if="data.timestamp">{{ data.timestamp }}</div>
          <div v-if="data.fee">{{$t('dashboard.fee')}}: {{ data.fee}}</div>
        </template>
      </Column>
      <Column headerStyle="width: 12%" v-if="showAction" header="Action" >
        <template #body="{data}">
          <SplitButton label="Explorer" @click="gotoHashExplorer(data.hash)" icon="pi pi-external-link" class="p-button-help p-mb-2" :model="setSplitButtonItems(data)"></SplitButton>
        </template>
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
      <template #loading>
          {{$t('dashboard.loadingmessage')}}
      </template>
    </DataTable>
    <DynamicModelComponent :modelName="dynamicModelComponentDisplay" :showModal="showTransactionModel" :transaction="modalData" />
  </div>
</template>

<script>
import { getCurrentInstance, ref, computed, watch  } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import DynamicModelComponent from '@/modules/dashboard/components/DynamicModelComponent.vue'
import { networkState } from "@/state/networkState";
import Tooltip from 'primevue/tooltip';
import { TipType } from '../model/dashboardClasses'
import SplitButton from 'primevue/splitbutton';

export default{
  components: { DataTable, Column, DynamicModelComponent, SplitButton },
  name: 'DashboardDataTable',
  props: {
    transactions: Array,
    showBlock: Boolean,
    showAction: Boolean
  },
  emits: ['openMessage'],
  directives: {
    'tooltip': Tooltip
  },
  setup(p, context){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');
    const showTransactionModel = ref(false);
    const modalData = ref(null);
    const filterText = ref("");
    /*
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    */
    watch(
     ()=> filterText.value, (newValue)=>{
       context.emit('confirmedFilter', newValue);
    });

    const nsHint = "\`ns:\` - filter by Namespace (ID or name)";
    const nsHint2 = "\`ns:-\` - filter with Namespace Name alias";
    const nsHint3 = "\`ns:'\` - convert namespace name to Namespace ID, will ignore when invalid";
    const hashHint = "\`hash:\` - filter Transaction Hash ";
    const pkHint = "\`pk:\` - Public Key";
    const assetHint = "\`asset:\` - filter by Asset ID";
    const addressHint = "\`add:\` - filter by Address"; 

    const hints = [hashHint, assetHint, pkHint, addressHint, nsHint, nsHint2, nsHint3].join('\n');

    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const blockExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.blockRoute);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const hashExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    const dynamicModelComponentDisplay = ref('TransferTransactionModal');

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const rowClick = (e) => {
      // console.log(e.data.typeName);
      console.log(e.data);
      switch(e.data.typeName){
        case 'Transfer':
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
          break;
        case 'LockFund':
          dynamicModelComponentDisplay.value = 'LockFundModal';
          break;
        case 'Aggregate Bonded':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        case 'Aggregate Complete':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        default:
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
      }
      showTransactionModel.value = true;
      // modalData.value = Object.assign({}, e.data);
      modalData.value = e.data;
    };

    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

    const setSplitButtonItems = (data) =>{

      let items = [
            {
                label: 'Sample',
                icon: 'pi pi-external-link',
                command: () => {
                    window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + data.hash, "_blank");
                }
            },
        /*
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    //toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    //toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
                }
            },
            {
                label: 'Vue Website',
                icon: 'pi pi-external-link',
                command: () => {
                    window.location.href = 'https://vuejs.org/'
                }
            },
            {   label: 'Upload',
                icon: 'pi pi-upload',
                command: () => {
					          //window.location.hash = "/fileupload"
				        }
            }
            */
        ];

      return items;
    }

    const getPublicKeyExplorerUrl = (publicKey) =>{

      return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
    }

    const getNamespaceExplorerUrl = (namespaceIdHex) =>{

      return explorerBaseURL.value + namespaceExplorerURL.value + "/" + namespaceIdHex
    }

    const getAssetExplorerUrl = (assetIdHex) =>{

      return explorerBaseURL.value + assetExplorerURL.value + "/" + assetIdHex
    }

    const getAddressExplorerUrl = (address) =>{

      return explorerBaseURL.value + addressExplorerURL.value + "/" + address
    }

    const getHashExplorerUrl = (hash) =>{

      return explorerBaseURL.value + hashExplorerURL.value + "/" + hash
    }

    const gotoHashExplorer = (hash)=>{
      window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
    }

    return {
      borderColor,
      filterText,
      clickInputText,
      blurInputText,
      modalData,
      rowClick,
      showTransactionModel,
      dynamicModelComponentDisplay,
      blockExplorerURL,
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      hashExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL,
      hints,
      getPublicKeyExplorerUrl,
      getNamespaceExplorerUrl,
      getAssetExplorerUrl,
      getAddressExplorerUrl,
      getHashExplorerUrl,
      setSplitButtonItems,
      gotoHashExplorer
    }
  }
}
</script>

<style lang="scss">
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}

.truncate {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-splitbutton-defaultbutton{
  .p-button-label{
    padding-left: 5px;
    padding-right: 5px;
  }
}

.p-menu{
  background-color: white;
  min-width: 105px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;

  .p-menuitem-link{
    padding-bottom: 3px;
    padding-top: 3px;

    .p-menuitem-icon{
      padding: 5px;
    }

    .p-menuitem-text{
      padding-right: 30px;
    }

    &:hover{
      --tw-bg-opacity: 1;
      background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
    }
  }
}

</style>