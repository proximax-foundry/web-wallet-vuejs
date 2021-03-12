<template>
  <div>
    <div class="transition ease-in duration-300 w-full rounded-full px-5 py-1 mb-5" :class="borderColor">
      <input v-model="filters['global'].value" type="text" class="w-full outline-none text-sm" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
    </div>
    <DataTable
      :value="transaction"
      v-model:filters="filters"
      filterDisplay="row"
      @row-click="rowClick"
      :paginator="true"
      :rows="4"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      :globalFilterFields="['type','flow','sender','recipient']">
      <Column field="type" header="Type" headerStyle="width:50px;"></Column>
      <Column field="flow" header="In/Out" headerStyle="width:50px"></Column>
      <Column field="sender" header="Sender" headerStyle="width:300px"></Column>
      <Column field="recipient" header="Recipient" headerStyle="width:300px"></Column>
      <template #empty>
        No records found
      </template>
    </DataTable>
    <TransactionModal :showModal="showTransactionModel" :d="modalData" />
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import TransactionModal from '@/components/TransactionModal.vue'

export default{
  components: { DataTable, Column, TransactionModal },
  name: 'NavigationMenu',
  data() {
    return {
      filters: {
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      },
      transaction: [
        {"type": "Transfer", "flow": 'in', "sender": "VCYV4I-MG7FEN-QNRAAR-MEHAZE-ND5AI2-V4325W-RNRM", "recipient": "	VALIO3-KGXNUK-H2ELVZ-EKZILU-TSDCHD-DA62KD-HCWI", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Transfer", "flow": 'in', "sender": "VCYV4I-MG7FEN-QNRAAR-MEHAZE-ND5AI2-V4325W-RNRM", "recipient": "	VALIO3-KGXNUK-H2ELVZ-EKZILU-TSDCHD-DA62KD-HCWI", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 2", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Transfer", "flow": 'out', "sender": "VCYV4I-MG7FEN-QNRAAR-MEHAZE-ND5AI2-V4325W-RNRM", "recipient": "VALIO3-KGXNUK-H2ELVZ-EKZILU-TSDCHD-DA62KD-HCWI", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 3", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'out', "sender": "VCYV4I-MG7FEN-QNRAAR-MEHAZE-ND5AI2-V4325W-RNRM", "recipient": "VALIO3-KGXNUK-H2ELVZ-EKZILU-TSDCHD-DA62KD-HCWI", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 4", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Transfer", "flow": 'in', "sender": "VCYV4I-MG7FEN-QNRAAR-MEHAZE-ND5AI2-V4325W-RNRM", "recipient": "	VALIO3-KGXNUK-H2ELVZ-EKZILU-TSDCHD-DA62KD-HCWI", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'in', "sender": "MMMMM-MMMMM-MMMMM-MMMMMM-MMMMMM-MMMM", "recipient": "	MMMM-XXXXX-ZZZZZZ-WWWWWW", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'in', "sender": "MMMMM-OOOOO-YYYYYY-KKKK-JJJJJ-IIIIII", "recipient": "	VVVV-RRRRR-VVVVVVV-YYYYYYY", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'in', "sender": "MMMMM-MMMMM-MMMMM-MMMMMM-MMMMMM-MMMM", "recipient": "	MMMM-XXXXX-ZZZZZZ-WWWWWW", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'in', "sender": "MMMMM-OOOOO-YYYYYY-KKKK-JJJJJ-IIIIII", "recipient": "	VVVV-VVVV-DDDDDD-VVVVVVVVVV", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'in', "sender": "MMMMM-DDDDDD-GGGGGG-HHHHHH-MMMMMM-MMMM", "recipient": "	MMMM-XXXXX-CCCCC-WWWWWW", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
        {"type": "Req", "flow": 'in', "sender": "MMMMM-OOOOO-YYYYYY-KKKK-JJJJJ-IIIIII", "recipient": "	VVVV-VVVV-VVVVVVV-VVVVVVVVVV", "date": "3/8/2021, 10:14:44 PM - UTC", "fee": "25.3260", "height":"48410065", typeid: "5265", msg: "Dummy testing 5", "amount":"10,000", "signature": "110473F78707A3EF7F8B5F1EE74BF381A6107E0C0E794634A4B7D6909B189840A63B70C7C8F7342B2DBD3041ED711807766DFD65D0A6C1DF1F64C1B3EA543C00", "hash": "FD182DFBB7CB01A0669DCEF9BD55A9945E4CB2F5DAB84039BCCD2550F3B7CE97"},
      ],
      borderColor: 'border border-gray-400',
      showTransactionModel: false,
      modalData: null,
    };
  },
  methods: {
    clickInputText: function() {
      this.borderColor = 'border border-white-100 drop-shadow';
    },

    blurInputText: function() {
      this.borderColor = 'border border-gray-400';
    },

    rowClick: function(e) {
      this.showTransactionModel = true;
      this.modalData = e.data;
    }
  },
  mounted() {
    this.emitter.on("CLOSE_MODAL", payload => {
      this.showTransactionModel = payload;
    });
  }
}
</script>

