import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth' // adjust path if needed

export default function useBookingData() {
  const { token } = useAuth()
  const loading = ref(true)
  const booking = ref([])
  const error = ref(null)

  onMounted(async () => {
    try {
      const res = await $fetch('/api/users/userInfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      booking.value = res.bookings || []
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  })

  return {
    booking,
    loading,
    error,
  }
}
