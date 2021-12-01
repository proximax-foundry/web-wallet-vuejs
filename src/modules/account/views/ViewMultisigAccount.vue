<template>
  <div>
    <div class='mt-4 w-11/12 ml-auto mr-auto '>
      <div class = 'flex text-xxs md:text-xs font-semibold border-b-2 '>
        <router-link :to="{ name: 'ViewAccountDisplayAll'}" class= 'w-18 text-center '>Overview</router-link>
        <router-link :to="{ name: 'ViewNormalAccount'}" class=" w-28 text-center "  style="width:6.5rem">My Accounts</router-link>
        <div class="text-center border-b-2 pb-4 lg:pb-3 border-yellow-500" style="width:9rem">Multisig Accounts</div>
        <router-link :to="{ name: 'ViewOtherAccount'}" class="text-center " style="width:8rem">Other Accounts</router-link>
        <div class="flex flex-row gap-1 ml-auto">
          <img src="@/modules/account/img/icon-account-settings.svg" class="w-4 h-4">
          <div>Accounts Settings</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ViewMultisigAccount',
}
</script>

<style>

</style>