CREATE OR REPLACE FUNCTION update_team_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE teams SET points = points + NEW.points WHERE id = NEW.team_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_team_performance_insert
AFTER INSERT ON team_performance
FOR EACH ROW EXECUTE FUNCTION update_team_points();
