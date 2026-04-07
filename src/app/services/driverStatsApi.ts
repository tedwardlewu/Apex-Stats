import { createSuccessResponseSchema, driverStatsRowArraySchema } from "../data/schemas";

const driverStatsResponseSchema = createSuccessResponseSchema(driverStatsRowArraySchema);

export async function getDriverStats() {

  const driverStats = [
    { name: "Max Verstappen", points: 420, wins: 15, podiums: 18 },
    { name: "Lewis Hamilton", points: 300, wins: 5, podiums: 12 },
    { name: "Charles Leclerc", points: 250, wins: 2, podiums: 10 },
  ];

  return driverStatsResponseSchema.parse({ success: true, data: driverStats });
}
