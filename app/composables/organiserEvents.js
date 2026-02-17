export default function useOrganiserEvents() {
    const { token } = useAuth()
    const events = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
    
    onMounted(async () => {
      loading.value = true
      try {
        const res = await $fetch('/api/organiser/total-events', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
        console.log('API Response:', res)
        if (res.success && res.events) {
          events.value = res.events
          console.log('Events assigned:', events.value)
        } else {
          error.value = 'Failed to fetch events'
          console.error('Response not successful:', res)
        }
      } catch (err) {
        error.value = err.message || 'An error occurred while fetching events'
        console.error('Fetch error:', err)
      } finally {
        loading.value = false
      }
    })

    return {
        events,
        loading,
        error,
        formatDate,
    }
}