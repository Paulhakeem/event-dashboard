import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

export default function userUpcomingEvents() {
  const { token } = useAuth()
  const events = ref([])
  const eventsLoading = ref(true)
  const errorMessage = ref(null)

  onMounted(async () => {
    try {
      const res = await $fetch('/api/events/fetch', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      if (res.success) {
        events.value = res.events || []
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      errorMessage.value = error.message || 'Failed to load events'
    } finally {
     eventsLoading.value = false
    }
  })

  return {
    events,
    eventsLoading,
    errorMessage,
  }
}