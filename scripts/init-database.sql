-- ReYog Database Initialization Script
-- This script creates the initial database structure for the ReYog rural governance platform

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_queries_status ON queries(status);
CREATE INDEX IF NOT EXISTS idx_queries_user_id ON queries(user_id);
CREATE INDEX IF NOT EXISTS idx_queries_panchayat_id ON queries(panchayat_id);
CREATE INDEX IF NOT EXISTS idx_offices_department_id ON offices(department_id);
CREATE INDEX IF NOT EXISTS idx_offices_panchayat_id ON offices(panchayat_id);
CREATE INDEX IF NOT EXISTS idx_ratings_office_id ON ratings(office_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Create spatial indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_offices_location ON offices USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_panchayats_location ON panchayats USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_queries_location ON queries USING GIST (ST_Point(longitude, latitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT)
RETURNS FLOAT AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
            sin(radians(lat1)) * sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to update query budget spent
CREATE OR REPLACE FUNCTION update_query_budget()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.budget_spent_delta IS NOT NULL THEN
        UPDATE queries 
        SET budget_spent = budget_spent + NEW.budget_spent_delta,
            updated_at = NOW()
        WHERE id = NEW.query_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update query budget when query_updates are added
CREATE TRIGGER trigger_update_query_budget
    AFTER INSERT ON query_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_query_budget();

-- Create function to auto-close resolved queries after 7 days
CREATE OR REPLACE FUNCTION auto_close_resolved_queries()
RETURNS void AS $$
BEGIN
    UPDATE queries 
    SET status = 'CLOSED',
        closed_at = NOW(),
        updated_at = NOW()
    WHERE status = 'RESOLVED' 
    AND resolved_at IS NOT NULL 
    AND resolved_at < NOW() - INTERVAL '7 days'
    AND closed_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a view for query statistics
CREATE OR REPLACE VIEW query_statistics AS
SELECT 
    p.name as panchayat_name,
    p.district,
    COUNT(*) as total_queries,
    COUNT(CASE WHEN q.status = 'PENDING_REVIEW' THEN 1 END) as pending_queries,
    COUNT(CASE WHEN q.status = 'IN_PROGRESS' THEN 1 END) as in_progress_queries,
    COUNT(CASE WHEN q.status = 'RESOLVED' THEN 1 END) as resolved_queries,
    COUNT(CASE WHEN q.status = 'CLOSED' THEN 1 END) as closed_queries,
    AVG(CASE WHEN q.resolved_at IS NOT NULL AND q.accepted_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (q.resolved_at - q.accepted_at))/86400 END) as avg_resolution_days,
    SUM(q.budget_issued) as total_budget_issued,
    SUM(q.budget_spent) as total_budget_spent
FROM queries q
JOIN panchayats p ON q.panchayat_id = p.id
GROUP BY p.id, p.name, p.district;

-- Create a view for office ratings summary
CREATE OR REPLACE VIEW office_ratings_summary AS
SELECT 
    o.id as office_id,
    o.name as office_name,
    d.name as department_name,
    p.name as panchayat_name,
    COUNT(r.id) as total_ratings,
    AVG(r.rating) as average_rating,
    COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_ratings,
    COUNT(CASE WHEN r.rating <= 2 THEN 1 END) as negative_ratings
FROM offices o
JOIN departments d ON o.department_id = d.id
JOIN panchayats p ON o.panchayat_id = p.id
LEFT JOIN ratings r ON o.id = r.office_id
GROUP BY o.id, o.name, d.name, p.name;

COMMENT ON SCRIPT IS 'ReYog Database Initialization - Creates indexes, functions, triggers, and views for optimal performance';
