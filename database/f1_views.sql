CREATE VIEW driver_stats AS
SELECT d.id, d.name, d.team, d.points, d.wins, d.podiums, dc.consistency_score, dc.avg_position
FROM drivers d
LEFT JOIN driver_consistency dc ON d.id = dc.driver_id;

CREATE VIEW team_stats AS
SELECT t.id, t.name, t.points, t.wins, t.podiums, tp.total_points
FROM teams t
LEFT JOIN team_performance tp ON t.id = tp.team_id;
