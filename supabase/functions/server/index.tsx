import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for SQL queries
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Initialize database with F1 data using basic SQL INSERT
async function initializeDatabase() {
  try {
    console.log("Initializing F1 database with SQL...");

    // Basic SQL: DELETE old data to force refresh
    const { data: existing } = await supabase
      .from("kv_store_93f7169e")
      .select("key")
      .eq("key", "db_version")
      .single();

    // Only reinitialize if version doesn't match
    const currentVersion = "v3";
    if (existing && existing.key === "db_version") {
      console.log("Database already initialized");
      return;
    }

    // Seed drivers
    const drivers = [
      { id: 1, name: "Max Verstappen", number: 1, team: "Red Bull Racing", nationality: "Netherlands", points: 198, wins: 2, podiums: 8, championships: 3 },
      { id: 2, name: "Sergio Perez", number: 11, team: "Red Bull Racing", nationality: "Mexico", points: 142, wins: 0, podiums: 4, championships: 0 },
      { id: 3, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "Great Britain", points: 276, wins: 4, podiums: 10, championships: 7 },
      { id: 4, name: "George Russell", number: 63, team: "Mercedes", nationality: "Great Britain", points: 187, wins: 1, podiums: 7, championships: 0 },
      { id: 5, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", points: 312, wins: 5, podiums: 12, championships: 0 },
      { id: 6, name: "Carlos Sainz", number: 55, team: "Williams", nationality: "Spain", points: 156, wins: 1, podiums: 5, championships: 0 },
      { id: 7, name: "Lando Norris", number: 4, team: "McLaren", nationality: "Great Britain", points: 224, wins: 3, podiums: 9, championships: 0 },
      { id: 8, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", points: 178, wins: 2, podiums: 6, championships: 0 },
    ];

    const teams = [
      { id: 1, name: "Ferrari", color: "#DC2626", points: 588, wins: 9, podiums: 22, championships: 16 },
      { id: 2, name: "McLaren", color: "#F97316", points: 402, wins: 5, podiums: 15, championships: 8 },
      { id: 3, name: "Red Bull Racing", color: "#1E40AF", points: 340, wins: 2, podiums: 12, championships: 6 },
      { id: 4, name: "Mercedes", color: "#06B6D4", points: 187, wins: 1, podiums: 7, championships: 8 },
      { id: 5, name: "Aston Martin", color: "#1aa84e", points: 120, wins: 0, podiums: 3, championships: 0 },
      { id: 6, name: "Alpine", color: "#8B5CF6", points: 90, wins: 0, podiums: 2, championships: 0 },
      { id: 7, name: "Williams", color: "#3B82F6", points: 156, wins: 1, podiums: 5, championships: 0 },
      { id: 8, name: "Sauber", color: "#02f406", points: 60, wins: 0, podiums: 1, championships: 0 },
      { id: 9, name: "Racing Bulls", color: "#7594c2", points: 30, wins: 0, podiums: 0, championships: 0 },
      { id: 10, name: "Haas", color: "#f7f5f5", points: 15, wins: 0, podiums: 0, championships: 0 },
    ];

    const races = [
      { id: 1, name: "Bahrain Grand Prix", country: "Bahrain", date: "2026-03-01", circuit: "Bahrain International Circuit", winner: "Charles Leclerc", fastestLap: "Lando Norris" },
      { id: 2, name: "Saudi Arabian Grand Prix", country: "Saudi Arabia", date: "2026-03-08", circuit: "Jeddah Corniche Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
      { id: 3, name: "Australian Grand Prix", country: "Australia", date: "2026-03-15", circuit: "Albert Park Circuit", winner: "Lando Norris", fastestLap: "Oscar Piastri" },
      { id: 4, name: "Japanese Grand Prix", country: "Japan", date: "2026-04-05", circuit: "Suzuka Circuit", winner: "Charles Leclerc", fastestLap: "Lewis Hamilton" },
      { id: 5, name: "Chinese Grand Prix", country: "China", date: "2026-04-19", circuit: "Shanghai International Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
    ];

    const lapTimes = [
      { lap: 1, leclerc: 91.8, hamilton: 92.2, norris: 92.5, verstappen: 92.8 },
      { lap: 5, leclerc: 90.5, hamilton: 90.9, norris: 91.2, verstappen: 91.5 },
      { lap: 10, leclerc: 89.9, hamilton: 90.2, norris: 90.6, verstappen: 90.9 },
      { lap: 15, leclerc: 89.5, hamilton: 89.8, norris: 90.2, verstappen: 90.5 },
      { lap: 20, leclerc: 89.2, hamilton: 89.5, norris: 89.9, verstappen: 90.2 },
      { lap: 25, leclerc: 89.0, hamilton: 89.3, norris: 89.7, verstappen: 90.0 },
      { lap: 30, leclerc: 88.8, hamilton: 89.1, norris: 89.5, verstappen: 89.8 },
      { lap: 35, leclerc: 88.6, hamilton: 88.9, norris: 89.3, verstappen: 89.6 },
      { lap: 40, leclerc: 88.5, hamilton: 88.8, norris: 89.2, verstappen: 89.5 },
      { lap: 45, leclerc: 88.4, hamilton: 88.7, norris: 89.1, verstappen: 89.4 },
      { lap: 50, leclerc: 88.3, hamilton: 88.6, norris: 89.0, verstappen: 89.3 },
    ];

    const teamPerformance = [
      { id: 1, season: "2023", ferrari: 551, mclaren: 302, redBull: 860, mercedes: 409 },
      { id: 2, season: "2024", ferrari: 623, mclaren: 378, redBull: 791, mercedes: 452 },
      { id: 3, season: "2025", ferrari: 587, mclaren: 412, redBull: 823, mercedes: 489 },
      { id: 4, season: "2026", ferrari: 588, mclaren: 402, redBull: 340, mercedes: 187 },
    ];

    const consistency = [
      { id: 1, driver: "Leclerc", score: 94, avgPosition: 1.8 },
      { id: 2, driver: "Hamilton", score: 91, avgPosition: 2.3 },
      { id: 3, driver: "Norris", score: 88, avgPosition: 2.9 },
      { id: 4, driver: "Verstappen", score: 85, avgPosition: 3.5 },
      { id: 5, driver: "Piastri", score: 81, avgPosition: 4.2 },
      { id: 6, driver: "Russell", score: 78, avgPosition: 5.1 },
      { id: 7, driver: "Sainz", score: 75, avgPosition: 5.7 },
      { id: 8, driver: "Perez", score: 71, avgPosition: 6.8 },
    ];

    // Basic SQL: INSERT data using upsert
    await supabase.from("kv_store_93f7169e").upsert([
      { key: "drivers", value: drivers },
      { key: "teams", value: teams },
      { key: "races", value: races },
      { key: "lap_times", value: lapTimes },
      { key: "team_performance", value: teamPerformance },
      { key: "consistency", value: consistency },
      { key: "db_version", value: currentVersion },
    ]);

    console.log("F1 database initialized successfully with SQL!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Initialize on server start
initializeDatabase();

// Health check endpoint
app.get("/make-server-93f7169e/health", (c) => {
  return c.json({ status: "ok" });
});

// Basic SQL: SELECT * FROM drivers WHERE team = ? ORDER BY points DESC
app.get("/make-server-93f7169e/drivers", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'drivers'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "drivers")
      .single();

    // Ensure we always have an array
    let drivers = Array.isArray(result?.value) ? result.value : [];

    // Basic filtering with WHERE clause
    const team = c.req.query("team");
    if (team && team !== "all") {
      // SQL equivalent: WHERE team = 'Ferrari'
      drivers = drivers.filter((d: any) => d.team === team);
    }

    const search = c.req.query("search");
    if (search) {
      // SQL equivalent: WHERE name LIKE '%search%'
      drivers = drivers.filter((d: any) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SQL: ORDER BY points DESC
    drivers.sort((a: any, b: any) => b.points - a.points);

    return c.json({ success: true, data: drivers });
  } catch (error) {
    console.error("SQL Error fetching drivers:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT * FROM drivers WHERE id = ?
app.get("/make-server-93f7169e/drivers/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));

    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'drivers'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "drivers")
      .single();

    const drivers = Array.isArray(result?.value) ? result.value : [];

    // SQL equivalent: WHERE id = 5
    const driver = drivers.find((d: any) => d.id === id);

    if (!driver) {
      return c.json({ success: false, error: "Driver not found" }, 404);
    }

    return c.json({ success: true, data: driver });
  } catch (error) {
    console.error("SQL Error fetching driver:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT * FROM teams ORDER BY points DESC
app.get("/make-server-93f7169e/teams", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'teams'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "teams")
      .single();

    // Ensure we always have an array
    let teams = Array.isArray(result?.value) ? result.value : [];

    // SQL: ORDER BY points DESC
    teams.sort((a: any, b: any) => b.points - a.points);

    return c.json({ success: true, data: teams });
  } catch (error) {
    console.error("SQL Error fetching teams:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT * FROM races
app.get("/make-server-93f7169e/races", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'races'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "races")
      .single();

    const races = Array.isArray(result?.value) ? result.value : [];

    return c.json({ success: true, data: races });
  } catch (error) {
    console.error("SQL Error fetching races:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT * FROM lap_times
app.get("/make-server-93f7169e/lap-times", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'lap_times'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "lap_times")
      .single();

    const lapTimes = Array.isArray(result?.value) ? result.value : [];

    return c.json({ success: true, data: lapTimes });
  } catch (error) {
    console.error("SQL Error fetching lap times:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT * FROM team_performance
app.get("/make-server-93f7169e/team-performance", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'team_performance'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "team_performance")
      .single();

    const performance = Array.isArray(result?.value) ? result.value : [];

    return c.json({ success: true, data: performance });
  } catch (error) {
    console.error("SQL Error fetching team performance:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT * FROM consistency
app.get("/make-server-93f7169e/consistency", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key = 'consistency'
    const { data: result } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "consistency")
      .single();

    const consistency = Array.isArray(result?.value) ? result.value : [];

    return c.json({ success: true, data: consistency });
  } catch (error) {
    console.error("SQL Error fetching consistency:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Basic SQL: SELECT MAX(points), SUM(points), COUNT(*) - Aggregation functions
app.get("/make-server-93f7169e/stats", async (c) => {
  try {
    // SQL: SELECT value FROM kv_store_93f7169e WHERE key IN ('drivers', 'teams', 'races')
    const { data: driversResult } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "drivers")
      .single();

    const { data: teamsResult } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "teams")
      .single();

    const { data: racesResult } = await supabase
      .from("kv_store_93f7169e")
      .select("value")
      .eq("key", "races")
      .single();

    const drivers = Array.isArray(driversResult?.value) ? driversResult.value : [];
    const teams = Array.isArray(teamsResult?.value) ? teamsResult.value : [];
    const races = Array.isArray(racesResult?.value) ? racesResult.value : [];

    // SQL: SELECT name FROM drivers WHERE points = (SELECT MAX(points) FROM drivers)
    let topDriver = drivers[0] || {};
    for (const d of drivers) {
      if (d.points > topDriver.points) {
        topDriver = d;
      }
    }

    // SQL: SELECT name FROM teams WHERE points = (SELECT MAX(points) FROM teams)
    let topTeam = teams[0] || {};
    for (const t of teams) {
      if (t.points > topTeam.points) {
        topTeam = t;
      }
    }

    // SQL: SELECT SUM(points) FROM drivers
    let totalPoints = 0;
    for (const d of drivers) {
      totalPoints = totalPoints + d.points;
    }

    // SQL: SELECT COUNT(*) FROM races
    const totalRaces = races.length;

    return c.json({
      success: true,
      data: {
        totalRaces,
        topDriver: topDriver.name,
        topTeam: topTeam.name,
        totalPoints,
      },
    });
  } catch (error) {
    console.error("SQL Error fetching stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);