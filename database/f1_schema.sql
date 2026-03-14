CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  number INTEGER UNIQUE NOT NULL,
  team VARCHAR(100) NOT NULL,
  nationality VARCHAR(50) NOT NULL,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  podiums INTEGER DEFAULT 0,
  championships INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) NOT NULL,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  podiums INTEGER DEFAULT 0,
  championships INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE races (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  circuit VARCHAR(150) NOT NULL,
  winner_id INTEGER REFERENCES drivers(id),
  fastest_lap_driver_id INTEGER REFERENCES drivers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lap_times (
  id SERIAL PRIMARY KEY,
  race_id INTEGER REFERENCES races(id),
  driver_id INTEGER REFERENCES drivers(id),
  lap_number INTEGER NOT NULL,
  lap_time DECIMAL(6,3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_performance (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id),
  season VARCHAR(4) NOT NULL,
  total_points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_consistency (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES drivers(id),
  season VARCHAR(4) NOT NULL,
  consistency_score INTEGER NOT NULL,
  avg_position DECIMAL(3,1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO drivers (id, name, number, team, nationality, points, wins, podiums, championships) VALUES
  (1,  'Max Verstappen', 3, 'Red Bull Racing', 'Netherlands', 8, 0, 0, 3),
  (2,  'Sergio Perez', 11, 'Red Bull Racing', 'Mexico', 0, 0, 0, 0),
  (3,  'Lewis Hamilton', 44, 'Ferrari', 'Great Britain', 18, 0, 0, 7),
  (4,  'George Russell', 63, 'Mercedes', 'Great Britain', 33, 1, 0, 0),
  (5,  'Charles Leclerc', 16, 'Ferrari', 'Monaco', 22, 0, 1, 0),
  (6,  'Carlos Sainz', 55, 'Williams', 'Spain', 0, 0, 0, 0),
  (7,  'Lando Norris', 1, 'McLaren', 'Great Britain', 15, 0, 0, 0),
  (8,  'Oscar Piastri', 81, 'McLaren', 'Australia', 3, 0, 0, 0),
  (9,  'Valtteri Bottas', 77, 'Cadillac', 'Finland', 0, 0, 0, 0),
  (10, 'Fernando Alonso', 14, 'Alpine', 'Spain', 0, 0, 0, 2),
  (11, 'Lance Stroll', 18, 'Aston Martin', 'Canada', 0, 0, 0, 0),
  (12, 'Oliver Bearman', 50, 'Haas', 'Great Britain', 7, 0, 0, 0),
  (13, 'Pierre Gasly', 10, 'Aline', 'France', 1, 0, 0, 0),
  (14, 'Franco Colapinto', 16, 'Alpine', 'Argentina', 0, 0, 0, 0),
  (15, 'Alex Albon', 23, 'Williams', 'Thailand', 0, 0, 0, 0),
  (16, 'Isack Hadjar', 20, 'Red Bull Racing', 'France', 0, 0, 0, 0),
  (17, 'Liam Lawson', 40, 'Racing Bulls', 'New Zealand', 2, 0, 0, 0),
  (18, 'Nico Hulkenberg', 27, 'Audi', 'Germany', 0, 0, 0, 0),
  (19, 'Arvid Lindblad', 46, 'Racing Bulls', 'Great Britain', 4, 0, 0, 0),
  (20, 'Esteban Ocon', 31, 'Haas', 'France', 0, 0, 0, 0),
  (21, 'Gabriel Bortoleto', 21, 'Audi', 'Brazil', 2, 0, 0, 0),
  (22, 'Kimi Antonelli', 7, 'Mercedes', 'Italy', 22, 0, 1, 0);

INSERT INTO teams (id, name, color, points, wins, podiums, championships) VALUES
  (1, 'Mercedes','#06B6D4', 55, 1, 2, 16),
  (2, 'McLaren', '#F97316', 18, 0, 0, 8),
  (3, 'Red Bull Racing', '#1E40AF', 8, 0, 0, 6),
  (4, 'Ferrari', '#DC2626', 40, 0, 2, 8),
  (5, 'Aston Martin', '#1aa84e', 0, 0, 0, 0),
  (6, 'Alpine', '#8B5CF6', 1, 0, 0, 0),
  (7, 'Williams', '#3B82F6', 0, 0, 0, 0),
  (8, 'Audi', '#02f406', 2, 0, 0, 0),
  (9, 'Racing Bulls', '#7594c2', 6, 0, 0, 0),
  (10, 'Haas', '#f7f5f5', 7, 0, 0, 0),
  (11, 'Cadillac', '#444749', 0, 0, 0, 0);


INSERT INTO races (id, name, country, date, circuit, winner_id, fastest_lap_driver_id) VALUES
  (1, 'Bahrain Grand Prix', 'Bahrain', '2026-03-01', 'Bahrain International Circuit', 5, 7),
  (2, 'Saudi Arabian Grand Prix', 'Saudi Arabia', '2026-03-08', 'Jeddah Corniche Circuit', 3, 5),
  (3, 'Australian Grand Prix', 'Australia', '2026-03-15', 'Albert Park Circuit', 7, 8),
  (4, 'Japanese Grand Prix', 'Japan', '2026-04-05', 'Suzuka Circuit', 5, 3),
  (5, 'Chinese Grand Prix', 'China', '2026-04-19', 'Shanghai International Circuit', 3, 5);

SELECT * FROM drivers;

SELECT name, points, team FROM drivers;

SELECT * FROM drivers WHERE team = 'Ferrari';

SELECT name, points FROM drivers ORDER BY points DESC;

SELECT name, points FROM drivers ORDER BY points DESC LIMIT 3;

SELECT name, wins FROM drivers WHERE wins > 2;

SELECT * FROM drivers WHERE name LIKE '%Hamilton%';

SELECT name, team, points 
FROM drivers 
WHERE team = 'Red Bull Racing' AND points > 150;

SELECT name, nationality 
FROM drivers 
WHERE nationality = 'Great Britain' OR nationality = 'Netherlands';

SELECT name, team 
FROM drivers 
WHERE team IN ('Ferrari', 'McLaren', 'Mercedes');

SELECT COUNT(*) AS total_drivers FROM drivers;

SELECT SUM(points) AS total_points FROM drivers;

SELECT AVG(points) AS average_points FROM drivers;

SELECT MAX(points) AS max_points FROM drivers;

SELECT MIN(points) AS min_points FROM drivers;

SELECT team, COUNT(*) AS driver_count 
FROM drivers 
GROUP BY team;

SELECT team, SUM(points) AS team_total_points 
FROM drivers 
GROUP BY team 
ORDER BY team_total_points DESC;

SELECT team, COUNT(*) AS driver_count 
FROM drivers 
GROUP BY team 
HAVING COUNT(*) > 1;

SELECT 
  r.name AS race_name,
  r.date,
  d.name AS winner_name,
  d.team
FROM races r
INNER JOIN drivers d ON r.winner_id = d.id;

SELECT 
  r.name AS race_name,
  r.country,
  d.name AS winner_name
FROM races r
LEFT JOIN drivers d ON r.winner_id = d.id;

SELECT 
  r.name AS race_name,
  r.date,
  d1.name AS winner,
  d2.name AS fastest_lap
FROM races r
LEFT JOIN drivers d1 ON r.winner_id = d1.id
LEFT JOIN drivers d2 ON r.fastest_lap_driver_id = d2.id;

SELECT name, points 
FROM drivers 
WHERE points > (SELECT AVG(points) FROM drivers);

SELECT name, points 
FROM drivers 
WHERE points = (SELECT MAX(points) FROM drivers);

SELECT name, team 
FROM drivers 
WHERE id IN (SELECT DISTINCT winner_id FROM races WHERE winner_id IS NOT NULL);

UPDATE drivers 
SET points = 320 
WHERE id = 5;

UPDATE drivers 
SET points = points + 10 
WHERE wins > 3;

UPDATE drivers 
SET wins = 6, podiums = 13 
WHERE id = 5;

DELETE FROM drivers WHERE id = 99;

DELETE FROM drivers WHERE points = 0 AND wins = 0;

SELECT 
  name,
  wins,
  (wins * 100.0 / 5) AS win_rate_percentage
FROM drivers
WHERE wins > 0
ORDER BY win_rate_percentage DESC;

SELECT 
  name,
  points,
  RANK() OVER (ORDER BY points DESC) AS ranking
FROM drivers;

SELECT 
  name,
  team,
  points,
  ROW_NUMBER() OVER (ORDER BY points DESC) AS position
FROM drivers;

SELECT 
  team,
  COUNT(*) AS total_drivers,
  SUM(points) AS total_points,
  SUM(wins) AS total_wins
FROM drivers
GROUP BY team
ORDER BY total_points DESC;

SELECT 
  name,
  wins,
  (SELECT AVG(wins) FROM drivers) AS avg_wins
FROM drivers
WHERE wins > (SELECT AVG(wins) FROM drivers);

SELECT 
  d.name,
  COUNT(lt.id) AS laps_completed
FROM drivers d
LEFT JOIN lap_times lt ON d.id = lt.driver_id
GROUP BY d.id, d.name
ORDER BY laps_completed DESC;

CREATE INDEX idx_drivers_team ON drivers(team);
CREATE INDEX idx_drivers_points ON drivers(points DESC);
CREATE INDEX idx_races_date ON races(date);
CREATE INDEX idx_lap_times_driver ON lap_times(driver_id);

CREATE VIEW driver_standings AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY points DESC) AS position,
  name,
  team,
  points,
  wins,
  podiums
FROM drivers
ORDER BY points DESC;

CREATE VIEW team_standings AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY points DESC) AS position,
  name,
  points,
  wins,
  podiums,
  championships
FROM teams
ORDER BY points DESC;

SELECT * FROM driver_standings;
SELECT * FROM team_standings;
