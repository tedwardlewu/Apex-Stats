import { calendarRaceArraySchema, type CalendarRace } from "./schemas";

export type { CalendarRace } from "./schemas";

export const raceCalendar2026: CalendarRace[] = calendarRaceArraySchema.parse([
	{ round: 1,  name: "Australian Grand Prix",     circuit: "Albert Park Circuit",            location: "Melbourne",      country: "Australia",     startDate: "2026-03-08", endDate: "2026-03-08", sprintWeekend: true },
	{ round: 2,  name: "Chinese Grand Prix",         circuit: "Shanghai International Circuit", location: "Shanghai",       country: "China",         startDate: "2026-03-15", endDate: "2026-03-15", sprintWeekend: true },
	{ round: 3,  name: "Japanese Grand Prix",        circuit: "Suzuka Circuit",                 location: "Suzuka",         country: "Japan",         startDate: "2026-03-28", endDate: "2026-03-29" },
	{ round: 4,  name: "Bahrain Grand Prix",         circuit: "Bahrain International Circuit",  location: "Sakhir",         country: "Bahrain",       startDate: "2026-04-17", endDate: "2026-04-19", cancelled: true },
	{ round: 5,  name: "Saudi Arabian Grand Prix",   circuit: "Jeddah Corniche Circuit",        location: "Jeddah",         country: "Saudi Arabia",  startDate: "2026-04-24", endDate: "2026-04-26", cancelled: true },
	{ round: 6,  name: "Miami Grand Prix",           circuit: "Miami International Autodrome",  location: "Miami",          country: "USA",           startDate: "2026-05-01", endDate: "2026-05-03", sprintWeekend: true },
	{ round: 7,  name: "Canadian Grand Prix",        circuit: "Circuit Gilles Villeneuve",      location: "Montreal",       country: "Canada",        startDate: "2026-05-24", endDate: "2026-05-24" },
	{ round: 8,  name: "Monaco Grand Prix",          circuit: "Circuit de Monaco",              location: "Monte Carlo",    country: "Monaco",        startDate: "2026-06-07", endDate: "2026-06-07" },
	{ round: 9,  name: "Barcelona-Catalunya Grand Prix", circuit: "Circuit de Barcelona-Catalunya", location: "Barcelona", country: "Spain", startDate: "2026-06-14", endDate: "2026-06-14", sprintWeekend: true },
	{ round: 10, name: "Austrian Grand Prix",        circuit: "Red Bull Ring",                  location: "Spielberg",      country: "Austria",       startDate: "2026-06-28", endDate: "2026-06-28", sprintWeekend: true },
	{ round: 11, name: "British Grand Prix",         circuit: "Silverstone Circuit",            location: "Silverstone",    country: "UK",            startDate: "2026-07-05", endDate: "2026-07-05" },
	{ round: 12, name: "Belgian Grand Prix",         circuit: "Circuit de Spa-Francorchamps",   location: "Spa",            country: "Belgium",       startDate: "2026-07-19", endDate: "2026-07-19" },
	{ round: 13, name: "Hungarian Grand Prix",       circuit: "Hungaroring",                    location: "Budapest",       country: "Hungary",       startDate: "2026-07-26", endDate: "2026-07-26", sprintWeekend: true },
	{ round: 14, name: "Dutch Grand Prix",           circuit: "Circuit Zandvoort",              location: "Zandvoort",      country: "Dutch",         startDate: "2026-08-23", endDate: "2026-08-23" },
	{ round: 15, name: "Italian Grand Prix",         circuit: "Autodromo Nazionale Monza",      location: "Monza",          country: "Italy",         startDate: "2026-09-06", endDate: "2026-09-06", sprintWeekend: true },
	{ round: 16, name: "Spanish Grand Prix",         circuit: "Circuit de Barcelona-Catalunya", location: "Barcelona",      country: "Spain",         startDate: "2026-09-13", endDate: "2026-09-13" },
	{ round: 17, name: "Azerbaijan Grand Prix",      circuit: "Baku City Circuit",              location: "Baku",           country: "Azerbaijan",    startDate: "2026-09-26", endDate: "2026-09-26" },
	{ round: 18, name: "Singapore Grand Prix",       circuit: "Marina Bay Street Circuit",      location: "Singapore",      country: "Singapore",     startDate: "2026-10-11", endDate: "2026-10-11", sprintWeekend: true },
	{ round: 19, name: "United States Grand Prix",   circuit: "Circuit of the Americas",        location: "Austin",         country: "USA",           startDate: "2026-10-25", endDate: "2026-10-25" },
	{ round: 20, name: "Mexico City Grand Prix",     circuit: "Autodromo Hermanos Rodriguez",   location: "Mexico City",    country: "Mexico",        startDate: "2026-11-01", endDate: "2026-11-01" },
	{ round: 21, name: "Brazilian Grand Prix",       circuit: "Autodromo Jose Carlos Pace",     location: "São Paulo",      country: "Brazil",        startDate: "2026-11-08", endDate: "2026-11-08", sprintWeekend: true },
	{ round: 22, name: "Las Vegas Grand Prix",       circuit: "Las Vegas Street Circuit",       location: "Las Vegas",      country: "USA",           startDate: "2026-11-21", endDate: "2026-11-21" },
	{ round: 23, name: "Qatar Grand Prix",           circuit: "Lusail International Circuit",   location: "Lusail",         country: "Qatar",         startDate: "2026-11-29", endDate: "2026-11-29", sprintWeekend: true },
	{ round: 24, name: "Abu Dhabi Grand Prix",       circuit: "Yas Marina Circuit",             location: "Abu Dhabi",      country: "UAE",           startDate: "2026-12-06", endDate: "2026-12-06" },
]);
