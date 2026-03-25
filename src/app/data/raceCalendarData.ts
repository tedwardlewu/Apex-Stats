export interface CalendarRace {
	round: number;
	name: string;
	circuit: string;
	location: string;
	country: string;
	startDate: string;
	endDate: string;
	sprintWeekend?: boolean;
	cancelled?: boolean;
	note?: string;
}

export const raceCalendar2026: CalendarRace[] = [
	{ round: 1,  name: "Australian Grand Prix",     circuit: "Albert Park Circuit",            location: "Melbourne",      country: "Australia",     startDate: "2026-03-13", endDate: "2026-03-15" },
	{ round: 2,  name: "Chinese Grand Prix",         circuit: "Shanghai International Circuit", location: "Shanghai",       country: "China",         startDate: "2026-03-20", endDate: "2026-03-22", sprintWeekend: true },
	{ round: 3,  name: "Japanese Grand Prix",        circuit: "Suzuka Circuit",                 location: "Suzuka",         country: "Japan",         startDate: "2026-04-03", endDate: "2026-04-05" },
	{ round: 4,  name: "Bahrain Grand Prix",         circuit: "Bahrain International Circuit",  location: "Sakhir",         country: "Bahrain",       startDate: "2026-04-17", endDate: "2026-04-19", cancelled: true },
	{ round: 5,  name: "Saudi Arabian Grand Prix",   circuit: "Jeddah Corniche Circuit",        location: "Jeddah",         country: "Saudi Arabia",  startDate: "2026-04-24", endDate: "2026-04-26", cancelled: true },
	{ round: 6,  name: "Miami Grand Prix",           circuit: "Miami International Autodrome",  location: "Miami",          country: "USA",           startDate: "2026-05-01", endDate: "2026-05-03", sprintWeekend: true },
	{ round: 7,  name: "Emilia Romagna Grand Prix",  circuit: "Autodromo Enzo e Dino Ferrari",  location: "Imola",          country: "Italy",         startDate: "2026-05-15", endDate: "2026-05-17" },
	{ round: 8,  name: "Monaco Grand Prix",          circuit: "Circuit de Monaco",              location: "Monte Carlo",    country: "Monaco",        startDate: "2026-05-22", endDate: "2026-05-24" },
	{ round: 9,  name: "Spanish Grand Prix",         circuit: "Circuit de Barcelona-Catalunya", location: "Barcelona",      country: "Spain",         startDate: "2026-05-29", endDate: "2026-05-31" },
	{ round: 10, name: "Canadian Grand Prix",        circuit: "Circuit Gilles Villeneuve",      location: "Montreal",       country: "Canada",        startDate: "2026-06-12", endDate: "2026-06-14" },
	{ round: 11, name: "Austrian Grand Prix",        circuit: "Red Bull Ring",                  location: "Spielberg",      country: "Austria",       startDate: "2026-06-26", endDate: "2026-06-28", sprintWeekend: true },
	{ round: 12, name: "British Grand Prix",         circuit: "Silverstone Circuit",            location: "Silverstone",    country: "UK",            startDate: "2026-07-03", endDate: "2026-07-05" },
	{ round: 13, name: "Belgian Grand Prix",         circuit: "Circuit de Spa-Francorchamps",   location: "Spa",            country: "Belgium",       startDate: "2026-07-17", endDate: "2026-07-19" },
	{ round: 14, name: "Hungarian Grand Prix",       circuit: "Hungaroring",                    location: "Budapest",       country: "Hungary",       startDate: "2026-07-31", endDate: "2026-08-02" },
	{ round: 15, name: "Dutch Grand Prix",           circuit: "Circuit Zandvoort",              location: "Zandvoort",      country: "Dutch",         startDate: "2026-08-28", endDate: "2026-08-30" },
	{ round: 16, name: "Madrid Grand Prix",          circuit: "Madrid Street Circuit",          location: "Madrid",         country: "Spain",         startDate: "2026-09-04", endDate: "2026-09-06", note: "Subject to FIA circuit homologation" },
	{ round: 17, name: "Italian Grand Prix",         circuit: "Autodromo Nazionale Monza",      location: "Monza",          country: "Italy",         startDate: "2026-09-11", endDate: "2026-09-13" },
	{ round: 18, name: "Azerbaijan Grand Prix",      circuit: "Baku City Circuit",              location: "Baku",           country: "Azerbaijan",    startDate: "2026-09-18", endDate: "2026-09-20" },
	{ round: 19, name: "Singapore Grand Prix",       circuit: "Marina Bay Street Circuit",      location: "Singapore",      country: "Singapore",     startDate: "2026-10-02", endDate: "2026-10-04" },
	{ round: 20, name: "United States Grand Prix",   circuit: "Circuit of the Americas",        location: "Austin",         country: "USA",           startDate: "2026-10-16", endDate: "2026-10-18", sprintWeekend: true },
	{ round: 21, name: "Mexico City Grand Prix",     circuit: "Autodromo Hermanos Rodriguez",   location: "Mexico City",    country: "Mexico",        startDate: "2026-10-23", endDate: "2026-10-25" },
	{ round: 22, name: "São Paulo Grand Prix",       circuit: "Autodromo Jose Carlos Pace",     location: "São Paulo",      country: "Brazil",        startDate: "2026-11-06", endDate: "2026-11-08", sprintWeekend: true },
	{ round: 23, name: "Las Vegas Grand Prix",       circuit: "Las Vegas Street Circuit",       location: "Las Vegas",      country: "USA",           startDate: "2026-11-19", endDate: "2026-11-21" },
	{ round: 24, name: "Qatar Grand Prix",           circuit: "Lusail International Circuit",   location: "Lusail",         country: "Qatar",         startDate: "2026-11-27", endDate: "2026-11-29", sprintWeekend: true },
	{ round: 25, name: "Abu Dhabi Grand Prix",       circuit: "Yas Marina Circuit",             location: "Abu Dhabi",      country: "UAE",           startDate: "2026-12-04", endDate: "2026-12-06" },
];
