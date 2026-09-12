export default function useTicketCancellation() {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const cancellationLoading = ref(false);
  const cancelTicket = async (ticketId) => {
    if (
      !confirm(
        "Cancel ticket?\n\nThis action cannot be reversed. Your refund will be processed within 7 working days, less a 5% cancellation deduction.\n\nDo you want to continue?",
      )
    )
      return;

    cancellationLoading.value = true;
    try {
      const response = await $fetch("/api/tickets/cancel-ticket", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: { ticketId },
      });
      if (response) {
        const refundAmount = Number(response.refundAmount || 0).toLocaleString(
          "en-KE",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 },
        );
        alert(
          `Ticket cancelled successfully. Your refund of KES ${refundAmount} (after the 5% deduction) will be processed within 7 working days. Check your notifications and email for confirmation.`,
        );
        return true;
      } else {
        throw new Error(response.message || "Failed to cancel ticket");
      }
    } catch (err) {
      console.error("CANCEL ERROR:", err);
      throw new Error(err.message || "Failed to cancel ticket");
    } finally {
      cancellationLoading.value = false;
    }
  };
  return {
    loading: cancellationLoading,
    cancellationLoading,
    cancelTicket,
  };
}
