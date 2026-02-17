import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import { User } from "../../models/User.js";

export default defineEventHandler(async () => {
  await connectDB();
  try {
    // aggregate events per month (YYYY-MM)
    const eventsAgg = await Event.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // aggregate users per month (YYYY-MM)
    const usersAgg = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // transform to maps for quick lookup
    const eventsMap = {};
    for (const e of eventsAgg) eventsMap[e._id] = e.count;
    const usersMap = {};
    for (const u of usersAgg) usersMap[u._id] = u.count;

    // build last 12 months keys (YYYY-MM)
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${y}-${m}`;
      // short label e.g., 'Jan'
      const label = d.toLocaleString("en-US", { month: "short" });
      months.push({ key, label });
    }

    const monthly = months.map((m) => ({
      key: m.key,
      month: m.label,
      events: eventsMap[m.key] || 0,
      users: usersMap[m.key] || 0,
    }));

    return { success: true, monthly };
  } catch (err) {
    return { success: false, message: err.message };
  }
});