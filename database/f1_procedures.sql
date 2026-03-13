CREATE OR REPLACE PROCEDURE add_driver(
  p_name VARCHAR,
  p_number INTEGER,
  p_team VARCHAR,
  p_nationality VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO drivers(name, number, team, nationality) VALUES (p_name, p_number, p_team, p_nationality);
END;
$$;

CREATE OR REPLACE PROCEDURE award_points(
  p_driver_id INTEGER,
  p_points INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE drivers SET points = points + p_points WHERE id = p_driver_id;
END;
$$;
