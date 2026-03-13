BEGIN;

CREATE TABLE IF NOT EXISTS season_2025_grand_prix_results (
  round_number INTEGER PRIMARY KEY,
  round_code VARCHAR(3) UNIQUE NOT NULL,
  grand_prix_name VARCHAR(100) NOT NULL,
  host_country VARCHAR(100) NOT NULL,
  pole_position_driver VARCHAR(100) NOT NULL,
  fastest_lap_driver VARCHAR(100) NOT NULL,
  winning_driver VARCHAR(100) NOT NULL,
  winning_constructor VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS season_2025_points_system (
  event_type VARCHAR(10) NOT NULL,
  finishing_position INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL,
  PRIMARY KEY (event_type, finishing_position)
);

CREATE TABLE IF NOT EXISTS season_2025_driver_standings (
  championship_position INTEGER PRIMARY KEY,
  driver_name VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  constructor_name VARCHAR(150) NOT NULL,
  total_points INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS season_2025_constructor_standings (
  championship_position INTEGER PRIMARY KEY,
  constructor_name VARCHAR(150) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  total_points INTEGER NOT NULL
);

DELETE FROM season_2025_grand_prix_results;
DELETE FROM season_2025_points_system;
DELETE FROM season_2025_driver_standings;
DELETE FROM season_2025_constructor_standings;

INSERT INTO season_2025_grand_prix_results (
  round_number,
  round_code,
  grand_prix_name,
  host_country,
  pole_position_driver,
  fastest_lap_driver,
  winning_driver,
  winning_constructor
) VALUES
  (1, 'AUS', 'Australian Grand Prix', 'Australia', 'Lando Norris', 'Lando Norris', 'Lando Norris', 'McLaren-Mercedes'),
  (2, 'CHN', 'Chinese Grand Prix', 'China', 'Oscar Piastri', 'Lando Norris', 'Oscar Piastri', 'McLaren-Mercedes'),
  (3, 'JPN', 'Japanese Grand Prix', 'Japan', 'Max Verstappen', 'Kimi Antonelli', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (4, 'BHR', 'Bahrain Grand Prix', 'Bahrain', 'Oscar Piastri', 'Oscar Piastri', 'Oscar Piastri', 'McLaren-Mercedes'),
  (5, 'SAU', 'Saudi Arabian Grand Prix', 'Saudi Arabia', 'Max Verstappen', 'Lando Norris', 'Oscar Piastri', 'McLaren-Mercedes'),
  (6, 'MIA', 'Miami Grand Prix', 'United States', 'Max Verstappen', 'Lando Norris', 'Oscar Piastri', 'McLaren-Mercedes'),
  (7, 'EMI', 'Emilia Romagna Grand Prix', 'Italy', 'Oscar Piastri', 'Max Verstappen', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (8, 'MON', 'Monaco Grand Prix', 'Monaco', 'Lando Norris', 'Lando Norris', 'Lando Norris', 'McLaren-Mercedes'),
  (9, 'ESP', 'Spanish Grand Prix', 'Spain', 'Oscar Piastri', 'Oscar Piastri', 'Oscar Piastri', 'McLaren-Mercedes'),
  (10, 'CAN', 'Canadian Grand Prix', 'Canada', 'George Russell', 'George Russell', 'George Russell', 'Mercedes'),
  (11, 'AUT', 'Austrian Grand Prix', 'Austria', 'Lando Norris', 'Oscar Piastri', 'Lando Norris', 'McLaren-Mercedes'),
  (12, 'GBR', 'British Grand Prix', 'United Kingdom', 'Max Verstappen', 'Oscar Piastri', 'Lando Norris', 'McLaren-Mercedes'),
  (13, 'BEL', 'Belgian Grand Prix', 'Belgium', 'Lando Norris', 'Kimi Antonelli', 'Oscar Piastri', 'McLaren-Mercedes'),
  (14, 'HUN', 'Hungarian Grand Prix', 'Hungary', 'Charles Leclerc', 'George Russell', 'Lando Norris', 'McLaren-Mercedes'),
  (15, 'NED', 'Dutch Grand Prix', 'Netherlands', 'Oscar Piastri', 'Oscar Piastri', 'Oscar Piastri', 'McLaren-Mercedes'),
  (16, 'ITA', 'Italian Grand Prix', 'Italy', 'Max Verstappen', 'Lando Norris', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (17, 'AZE', 'Azerbaijan Grand Prix', 'Azerbaijan', 'Max Verstappen', 'Max Verstappen', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (18, 'SIN', 'Singapore Grand Prix', 'Singapore', 'George Russell', 'Lewis Hamilton', 'George Russell', 'Mercedes'),
  (19, 'USA', 'United States Grand Prix', 'United States', 'Max Verstappen', 'Kimi Antonelli', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (20, 'MXC', 'Mexico City Grand Prix', 'Mexico', 'Lando Norris', 'George Russell', 'Lando Norris', 'McLaren-Mercedes'),
  (21, 'SAP', 'Sao Paulo Grand Prix', 'Brazil', 'Lando Norris', 'Alexander Albon', 'Lando Norris', 'McLaren-Mercedes'),
  (22, 'LVG', 'Las Vegas Grand Prix', 'United States', 'Lando Norris', 'Max Verstappen', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (23, 'QAT', 'Qatar Grand Prix', 'Qatar', 'Oscar Piastri', 'Oscar Piastri', 'Max Verstappen', 'Red Bull Racing-Honda RBPT'),
  (24, 'ABU', 'Abu Dhabi Grand Prix', 'United Arab Emirates', 'Max Verstappen', 'Charles Leclerc', 'Max Verstappen', 'Red Bull Racing-Honda RBPT');

INSERT INTO season_2025_points_system (event_type, finishing_position, points_awarded) VALUES
  ('race', 1, 25),
  ('race', 2, 18),
  ('race', 3, 15),
  ('race', 4, 12),
  ('race', 5, 10),
  ('race', 6, 8),
  ('race', 7, 6),
  ('race', 8, 4),
  ('race', 9, 2),
  ('race', 10, 1),
  ('sprint', 1, 8),
  ('sprint', 2, 7),
  ('sprint', 3, 6),
  ('sprint', 4, 5),
  ('sprint', 5, 4),
  ('sprint', 6, 3),
  ('sprint', 7, 2),
  ('sprint', 8, 1);

INSERT INTO season_2025_driver_standings (
  championship_position,
  driver_name,
  nationality,
  constructor_name,
  total_points
) VALUES
  (1, 'Lando Norris', 'United Kingdom', 'McLaren-Mercedes', 423),
  (2, 'Max Verstappen', 'Netherlands', 'Red Bull Racing-Honda RBPT', 421),
  (3, 'Oscar Piastri', 'Australia', 'McLaren-Mercedes', 410),
  (4, 'George Russell', 'United Kingdom', 'Mercedes', 319),
  (5, 'Charles Leclerc', 'Monaco', 'Ferrari', 242),
  (6, 'Lewis Hamilton', 'United Kingdom', 'Ferrari', 156),
  (7, 'Kimi Antonelli', 'Italy', 'Mercedes', 150),
  (8, 'Alexander Albon', 'Thailand', 'Williams-Mercedes', 73),
  (9, 'Carlos Sainz Jr.', 'Spain', 'Williams-Mercedes', 64),
  (10, 'Fernando Alonso', 'Spain', 'Aston Martin Aramco-Mercedes', 56),
  (11, 'Nico Hulkenberg', 'Germany', 'Kick Sauber-Ferrari', 51),
  (12, 'Isack Hadjar', 'France', 'Racing Bulls-Honda RBPT', 51),
  (13, 'Oliver Bearman', 'United Kingdom', 'Haas-Ferrari', 41),
  (14, 'Liam Lawson', 'New Zealand', 'Racing Bulls-Honda RBPT', 38),
  (15, 'Esteban Ocon', 'France', 'Haas-Ferrari', 38),
  (16, 'Lance Stroll', 'Canada', 'Aston Martin Aramco-Mercedes', 33),
  (17, 'Yuki Tsunoda', 'Japan', 'Red Bull Racing-Honda RBPT', 33),
  (18, 'Pierre Gasly', 'France', 'Alpine-Renault', 22),
  (19, 'Gabriel Bortoleto', 'Brazil', 'Kick Sauber-Ferrari', 19),
  (20, 'Franco Colapinto', 'Argentina', 'Alpine-Renault', 0),
  (21, 'Jack Doohan', 'Australia', 'Alpine-Renault', 0);

INSERT INTO season_2025_constructor_standings (
  championship_position,
  constructor_name,
  nationality,
  total_points
) VALUES
  (1, 'McLaren-Mercedes', 'United Kingdom', 833),
  (2, 'Mercedes', 'Germany', 469),
  (3, 'Red Bull Racing-Honda RBPT', 'Austria', 451),
  (4, 'Ferrari', 'Italy', 398),
  (5, 'Williams-Mercedes', 'United Kingdom', 137),
  (6, 'Racing Bulls-Honda RBPT', 'Italy', 92),
  (7, 'Aston Martin Aramco-Mercedes', 'United Kingdom', 89),
  (8, 'Haas-Ferrari', 'United States', 79),
  (9, 'Kick Sauber-Ferrari', 'Switzerland', 70),
  (10, 'Alpine-Renault', 'France', 22);

COMMIT;