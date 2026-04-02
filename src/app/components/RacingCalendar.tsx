import { raceCalendar2026, CalendarRace } from "../data/raceCalendarData";

const COUNTRY_FLAG: Record<string, string> = {
	Australia:    "/Countries/Australia.webp",
	China:        "/Countries/China.png",
	Japan:        "/Countries/Japan.png",
	Bahrain:      "/Countries/Bahrain.webp",
	"Saudi Arabia": "/Countries/Saudi Arabia.png",
	USA:          "/Countries/USA.png",
	Italy:        "/Countries/Italy.webp",
	Monaco:       "/Countries/Monaco.svg",
	Spain:        "/Countries/Spain.svg",
	Canada:       "/Countries/Canada.svg",
	Austria:      "/Countries/Austria.png",
	UK:           "/Countries/UK.webp",
	Belgium:      "/Countries/Belgium.png",
	Hungary:      "/Countries/Hungary.png",
	Dutch:        "/Countries/Dutch.webp",
	Azerbaijan:   "/Countries/Azerbaijan.svg",
	Singapore:    "/Countries/Singapore.png",
	Mexico:       "/Countries/Mexico.svg",
	Brazil:       "/Countries/Brazil.webp",
	Qatar:        "/Countries/Qatar.png",
	UAE:          "/Countries/UAE.svg",
};

function formatDateRange(start: string, end: string): string {
	const s = new Date(start);
	const e = new Date(end);
	const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	if (s.getMonth() === e.getMonth()) {
		return `${months[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}`;
	}
	return `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
}

function isUpcoming(race: CalendarRace): boolean {
	const today = new Date();
	const start = new Date(race.startDate);
	return start >= today;
}

function isThisWeekend(race: CalendarRace): boolean {
	const today = new Date();
	const start = new Date(race.startDate);
	const end = new Date(race.endDate);
	return today >= start && today <= end;
}

export function RacingCalendar() {
	const nextRace = raceCalendar2026.find(r => !r.cancelled && isUpcoming(r));

	return (
		<div className="space-y-4">
			<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
				<div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 px-6 py-4">
					<div>
							<h2 className="text-lg font-bold text-white">2026 Formula 1 Calendar</h2>
							<p className="text-slate-200 text-xs mt-0.5">
								{raceCalendar2026.filter(r => !r.cancelled).length} races &bull;{" "}
								{raceCalendar2026.filter(r => r.sprintWeekend && !r.cancelled).length} sprint weekends
							</p>
					</div>
				</div>

				{nextRace && (
					<div className="px-6 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800 flex items-center gap-3">
						<div className="flex-shrink-0">
							{COUNTRY_FLAG[nextRace.country] && (
								<img
									src={COUNTRY_FLAG[nextRace.country]}
									alt={nextRace.country}
									className="h-6 w-9 object-cover rounded-sm"
								/>
							)}
						</div>
						<div className="text-sm">
							<span className="font-semibold text-orange-800 dark:text-orange-300">Next: </span>
							<span className="text-orange-700 dark:text-orange-400">{nextRace.name} &mdash; {formatDateRange(nextRace.startDate, nextRace.endDate)}</span>
						</div>
					</div>
				)}
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
								<th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">Rd</th>
								<th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Race</th>
								<th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Circuit</th>
								<th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
								<th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
							{raceCalendar2026.map((race) => {
								const live = isThisWeekend(race);
								const past = !isUpcoming(race) && !live;
								const isNext = nextRace?.round === race.round;

								return (
									<tr
										key={race.round}
										className={`transition-colors ${
											race.cancelled
												? "bg-red-50/50 dark:bg-red-900/10 opacity-60"
												: live
												? "bg-green-50 dark:bg-green-900/20"
												: isNext
												? "bg-orange-50 dark:bg-orange-900/10"
												: past
												? "opacity-50"
												: "hover:bg-gray-50 dark:hover:bg-gray-700/30"
										}`}
									>
										<td className="px-4 py-3">
											<span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
												live ? "bg-green-500 text-white" :
												isNext ? "bg-orange-500 text-white" :
												past || race.cancelled ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" :
												"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
											}`}>{race.round}</span>
										</td>

										<td className="px-4 py-3">
											<div className="flex items-center gap-2.5">
												{COUNTRY_FLAG[race.country] && (
													<img
														src={COUNTRY_FLAG[race.country]}
														alt={race.country}
														className="h-5 w-7 object-cover rounded-sm flex-shrink-0"
													/>
												)}
												<div className="min-w-0">
													<p className={`font-semibold leading-tight truncate ${race.cancelled ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
														{race.name}
													</p>
													<p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{race.location}</p>
												</div>
											</div>
										</td>

										<td className="px-4 py-3 hidden sm:table-cell">
											<span className="text-gray-600 dark:text-gray-400 text-xs">{race.circuit}</span>
										</td>

										<td className="px-4 py-3 whitespace-nowrap">
											<span className="text-gray-600 dark:text-gray-300 text-xs font-medium">
												{formatDateRange(race.startDate, race.endDate)}
											</span>
											{race.note && (
												<div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">{race.note}</div>
											)}
										</td>

										<td className="px-4 py-3 whitespace-nowrap">
											{race.cancelled ? (
												<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700">
													Cancelled
												</span>
											) : live ? (
												<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 animate-pulse">
													🔴 Live
												</span>
											) : race.sprintWeekend ? (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700">
													Sprint
												</span>
											) : (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
													Standard
												</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default RacingCalendar;
