 export default function useTicketCancellation() {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const cancelTicket = async (ticketId) => {
    confirm(
      "Are you sure you want to cancel this ticket? This action cannot be undone.•",
     );
    try {
      const response = await $fetch(`${config.public.ticketCancelApi}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: { ticketId },
      });
      if (response) {
        alert(
          "Your ticket has been cancelled. Check your email for confirmation.",
        );
      } else {
        throw new Error(response.message || "Failed to cancel ticket");
      }
    } catch (err) {
         console.error("CANCEL ERROR:", err);
      throw new Error(err.message || "Failed to cancel ticket");
    }
  };
  return {
    cancelTicket,
  };
}
