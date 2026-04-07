import { z } from "zod";

const nonEmptyStringSchema = z.string().trim().min(1);
const imagePathSchema = nonEmptyStringSchema;

export const seasonSchema = z.string().regex(/^\d{4}$/);

export const driverSchema = z.object({
  id: z.number().int().nonnegative(),
  name: nonEmptyStringSchema,
  number: z.number().int().nonnegative(),
  team: nonEmptyStringSchema,
  nationality: nonEmptyStringSchema,
  age: z.number().int().positive().optional(),
  points: z.number().nonnegative(),
  wins: z.number().int().nonnegative(),
  podiums: z.number().int().nonnegative(),
  championships: z.number().int().nonnegative(),
  image: imagePathSchema.optional(),
  debutSeason: z.number().int().nonnegative().optional(),
});

export const driverArraySchema = z.array(driverSchema);

export const teamSchema = z.object({
  id: z.number().int().nonnegative(),
  name: nonEmptyStringSchema,
  color: z.string().regex(/^#(?:[0-9A-Fa-f]{3}){1,2}$/),
  points: z.number().nonnegative(),
  wins: z.number().int().nonnegative(),
  podiums: z.number().int().nonnegative(),
  championships: z.number().int().nonnegative(),
  image: imagePathSchema.optional(),
});

export const teamArraySchema = z.array(teamSchema);

export const raceSchema = z.object({
  id: z.number().int().nonnegative(),
  name: nonEmptyStringSchema,
  country: nonEmptyStringSchema,
  date: nonEmptyStringSchema,
  circuit: nonEmptyStringSchema,
  winner: nonEmptyStringSchema,
  fastestLap: nonEmptyStringSchema,
});

export const raceArraySchema = z.array(raceSchema);

export const raceMetadataSchema = z.object({
  id: z.number().int().nonnegative(),
  season: seasonSchema,
  name: nonEmptyStringSchema,
  country: nonEmptyStringSchema,
  date: nonEmptyStringSchema,
  circuit: nonEmptyStringSchema,
  winner: nonEmptyStringSchema,
  fastestLap: nonEmptyStringSchema,
});

export const raceMetadataArraySchema = z.array(raceMetadataSchema);

export const driverBestLapSchema = z.object({
  driverName: nonEmptyStringSchema,
  bestLap: z.number().positive(),
});

export const driverBestLapArraySchema = z.array(driverBestLapSchema);

export const raceResultEntrySchema = z.object({
  positionLabel: nonEmptyStringSchema,
  carNumber: z.number().int().nonnegative(),
  driverName: nonEmptyStringSchema,
  team: nonEmptyStringSchema,
  points: z.number().nonnegative(),
  lapsCompleted: z.number().int().nonnegative(),
  result: nonEmptyStringSchema,
});

export const raceResultEntryArraySchema = z.array(raceResultEntrySchema);

export const driverSeasonStatsSchema = z.object({
  season: z.number().int().nonnegative(),
  points: z.number().nonnegative(),
  wins: z.number().int().nonnegative(),
  podiums: z.number().int().nonnegative(),
});

export const driverSeasonStatsArraySchema = z.array(driverSeasonStatsSchema);

export const newsItemSchema = z.object({
  id: nonEmptyStringSchema,
  fileName: nonEmptyStringSchema,
  fileNames: z.array(nonEmptyStringSchema).optional(),
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  objectPosition: nonEmptyStringSchema.optional(),
  objectFit: nonEmptyStringSchema.optional(),
});

export const newsItemArraySchema = z.array(newsItemSchema);

export const calendarRaceSchema = z.object({
  round: z.number().int().positive(),
  name: nonEmptyStringSchema,
  circuit: nonEmptyStringSchema,
  location: nonEmptyStringSchema,
  country: nonEmptyStringSchema,
  startDate: z.string().date(),
  endDate: z.string().date(),
  sprintWeekend: z.boolean().optional(),
  cancelled: z.boolean().optional(),
  note: nonEmptyStringSchema.optional(),
});

export const calendarRaceArraySchema = z.array(calendarRaceSchema);

export const upcomingRaceContextSchema = z.object({
  season: seasonSchema,
  name: nonEmptyStringSchema,
  country: nonEmptyStringSchema,
  circuit: nonEmptyStringSchema,
  date: z.string().date(),
  summary: nonEmptyStringSchema,
  modelFocus: nonEmptyStringSchema,
  teamBiases: z.record(nonEmptyStringSchema, z.number().positive()),
});

export const statsSummarySchema = z.object({
  totalRaces: z.number().int().nonnegative(),
  topDriver: nonEmptyStringSchema,
  topTeam: nonEmptyStringSchema,
  totalPoints: z.number().nonnegative(),
});

export const consistencyRowSchema = z.object({
  id: z.number().int().positive(),
  driver: nonEmptyStringSchema,
  score: z.number().min(0).max(100),
  avgPosition: z.number().positive(),
});

export const consistencyRowArraySchema = z.array(consistencyRowSchema);

export const driverPointsProgressionPointSchema = z.object({
  raceId: z.number().int().nonnegative(),
  raceName: nonEmptyStringSchema,
  round: z.number().int().positive(),
  position: z.number().int().positive().nullable(),
  points: z.number().nonnegative(),
});

export const driverPointsProgressionArraySchema = z.array(driverPointsProgressionPointSchema);

export const driverStatsRowSchema = z.object({
  name: nonEmptyStringSchema,
  points: z.number().nonnegative(),
  wins: z.number().int().nonnegative(),
  podiums: z.number().int().nonnegative(),
});

export const driverStatsRowArraySchema = z.array(driverStatsRowSchema);

export function createSuccessResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  });
}

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: nonEmptyStringSchema,
});

export function parseNumericRecord<T>(schema: z.ZodType<T>, input: Record<number, unknown>, label: string): Record<number, T> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      const parsedValue = schema.safeParse(value);

      if (!parsedValue.success) {
        throw new Error(`Invalid ${label} entry for key ${key}: ${parsedValue.error.message}`);
      }

      return [Number(key), parsedValue.data] as const;
    })
  ) as Record<number, T>;
}

export type Driver = z.infer<typeof driverSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Race = z.infer<typeof raceSchema>;
export type RaceMetadata = z.infer<typeof raceMetadataSchema>;
export type DriverBestLap = z.infer<typeof driverBestLapSchema>;
export type RaceResultEntry = z.infer<typeof raceResultEntrySchema>;
export type DriverSeasonStats = z.infer<typeof driverSeasonStatsSchema>;
export type NewsItem = z.infer<typeof newsItemSchema>;
export type CalendarRace = z.infer<typeof calendarRaceSchema>;
export type UpcomingRaceContext = z.infer<typeof upcomingRaceContextSchema>;
export type StatsSummary = z.infer<typeof statsSummarySchema>;
export type ConsistencyRow = z.infer<typeof consistencyRowSchema>;
export type DriverPointsProgressionPoint = z.infer<typeof driverPointsProgressionPointSchema>;
export type DriverStatsRow = z.infer<typeof driverStatsRowSchema>;