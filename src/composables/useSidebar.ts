import { ref } from 'vue'

const isOpen = ref(false)

export const useSidebar = () => {
  return {
    isOpen
  }
}
