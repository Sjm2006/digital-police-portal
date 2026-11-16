-- =====================================================================
-- Digital Police Portal - safe seed data (fictional demonstration data)
-- Contains NO users and NO credentials. Create the first administrator with:
--     php backend/cli/create_admin.php
-- Import after schema.sql. Safe to re-run (uses INSERT IGNORE on unique keys).
-- =====================================================================
SET NAMES utf8mb4;

INSERT IGNORE INTO complaint_categories (name, description) VALUES
  ('Theft and Robbery',        'Stolen property, burglary, snatching, robbery'),
  ('Cyber Crime',              'Online fraud, hacking, identity theft, harassment online'),
  ('Financial Fraud',          'Cheating, forgery, banking and payment fraud'),
  ('Assault and Violence',     'Physical harm, threats, intimidation'),
  ('Harassment',               'Stalking, harassment, public nuisance'),
  ('Domestic Issues',          'Domestic disputes and family-related complaints'),
  ('Missing Person',           'Report of a missing person'),
  ('Lost Property',            'Lost documents, valuables or belongings'),
  ('Traffic and Road Safety',  'Rash driving, accidents, traffic violations'),
  ('Property Dispute',         'Trespassing, encroachment, land-related complaints'),
  ('Corruption and Misconduct','Complaints about misuse of authority'),
  ('Other',                    'Any matter not covered by the categories above');

-- Fictional stations for demonstration only; they do not represent real police stations.
INSERT IGNORE INTO police_stations (station_code, name, address, district, state, pincode, phone) VALUES
  ('DEMO-001', 'Demo Central Police Station',   '1 Demo Road',        'Demo District North', 'West Bengal', '700001', '0000000001'),
  ('DEMO-002', 'Demo East Police Station',      '22 Sample Avenue',   'Demo District East',  'West Bengal', '700002', '0000000002'),
  ('DEMO-003', 'Demo Cyber Crime Unit',         '5 Example Street',   'Demo District North', 'West Bengal', '700003', '0000000003'),
  ('DEMO-004', 'Demo Women Help Desk',          '9 Test Lane',        'Demo District South', 'West Bengal', '700004', '0000000004');
