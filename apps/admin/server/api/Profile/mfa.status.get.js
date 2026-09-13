import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event);
  const user = await User.findById(authUser.id).select("mfaEnabled");
  return {
    success: true,
    mfaEnabled: Boolean(user?.mfaEnabled),
  };
});