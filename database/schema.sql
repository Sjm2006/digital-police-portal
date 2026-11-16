-- =====================================================================
-- Digital Police Portal (DPP) - complete database schema
-- Target: MySQL 8.0.16+ (also runs on MariaDB 10.5+ as shipped with XAMPP)
-- Engine: InnoDB, charset utf8mb4
--
-- HOW TO USE
--   Local:  create the database in phpMyAdmin (utf8mb4_unicode_ci), select it, then Import this file.
--   Cloud:  most providers pre-create the database; just import this file into it.
--   Optional (only if your account may create databases):
--     CREATE DATABASE digital_police_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--     USE digital_police_portal;
--
-- This file contains no DROP statements on purpose: re-importing into a populated
-- database fails loudly instead of destroying data.
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';   -- all timestamps are stored in UTC; the app converts for display

-- ---------------------------------------------------------------------
-- 1. users : common authentication data for all three roles
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       VARCHAR(20)  NOT NULL COMMENT 'Public ID, e.g. CIT-483920 / OFF-120554 / ADM-771203',
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL COMMENT 'Stored lower-case',
  phone         VARCHAR(15)  NOT NULL COMMENT 'Normalised 10-digit Indian mobile number',
  password_hash VARCHAR(255) NOT NULL COMMENT 'password_hash() output only',
  role          ENUM('CITIZEN','OFFICER','ADMIN') NOT NULL,
  status        ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  last_login_at DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_user_id (user_id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone),
  KEY idx_users_role_status (role, status),
  CONSTRAINT chk_users_user_id_prefix CHECK (
    (role = 'CITIZEN' AND user_id LIKE 'CIT-%') OR
    (role = 'OFFICER' AND user_id LIKE 'OFF-%') OR
    (role = 'ADMIN'   AND user_id LIKE 'ADM-%')
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. citizen_profiles
-- ---------------------------------------------------------------------
CREATE TABLE citizen_profiles (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  address_line  VARCHAR(255) NULL,
  city          VARCHAR(100) NULL,
  state         VARCHAR(100) NULL,
  pincode       CHAR(6) NULL,
  date_of_birth DATE NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_citizen_profiles_user (user_id),
  CONSTRAINT fk_citizen_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT chk_citizen_pincode CHECK (pincode IS NULL OR pincode REGEXP '^[0-9]{6}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. police_stations (fictional demonstration stations)
-- ---------------------------------------------------------------------
CREATE TABLE police_stations (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  station_code VARCHAR(20)  NOT NULL,
  name         VARCHAR(150) NOT NULL,
  address      VARCHAR(255) NULL,
  district     VARCHAR(100) NOT NULL,
  state        VARCHAR(100) NOT NULL,
  pincode      CHAR(6) NULL,
  phone        VARCHAR(20) NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_police_stations_code (station_code),
  UNIQUE KEY uq_police_stations_name_district (name, district),
  KEY idx_police_stations_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. officer_profiles
-- ---------------------------------------------------------------------
CREATE TABLE officer_profiles (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id           BIGINT UNSIGNED NOT NULL,
  designation       VARCHAR(100) NOT NULL,
  department        VARCHAR(100) NOT NULL,
  police_station_id INT UNSIGNED NOT NULL,
  created_by        BIGINT UNSIGNED NULL COMMENT 'Admin who created the account',
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_officer_profiles_user (user_id),
  KEY idx_officer_profiles_station (police_station_id),
  CONSTRAINT fk_officer_profiles_user    FOREIGN KEY (user_id)           REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_officer_profiles_station FOREIGN KEY (police_station_id) REFERENCES police_stations (id),
  CONSTRAINT fk_officer_profiles_creator FOREIGN KEY (created_by)        REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. admin_profiles
-- ---------------------------------------------------------------------
CREATE TABLE admin_profiles (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  designation VARCHAR(100) NOT NULL DEFAULT 'System Administrator',
  department  VARCHAR(100) NOT NULL DEFAULT 'Administration',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_profiles_user (user_id),
  CONSTRAINT fk_admin_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. complaint_categories
-- ---------------------------------------------------------------------
CREATE TABLE complaint_categories (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_complaint_categories_name (name),
  KEY idx_complaint_categories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. complaint_sequences : race-free yearly counter for DPP-YYYY-NNNNNN
--    Usage (inside the submit transaction):
--      INSERT INTO complaint_sequences (seq_year, last_number) VALUES (?, LAST_INSERT_ID(1))
--      ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1);
--      SELECT LAST_INSERT_ID();   -- the number to use
-- ---------------------------------------------------------------------
CREATE TABLE complaint_sequences (
  seq_year    SMALLINT UNSIGNED NOT NULL,
  last_number INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (seq_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. complaints
-- ---------------------------------------------------------------------
CREATE TABLE complaints (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  complaint_ref       VARCHAR(20) NOT NULL COMMENT 'Public reference, e.g. DPP-2026-000001',
  citizen_id          BIGINT UNSIGNED NOT NULL COMMENT 'users.id of the complainant',
  category_id         INT UNSIGNED NOT NULL,
  subject             VARCHAR(200) NOT NULL,
  description         TEXT NOT NULL,
  incident_date       DATE NOT NULL,
  incident_location   VARCHAR(255) NOT NULL,
  status              ENUM('SUBMITTED','UNDER_REVIEW','ASSIGNED','INVESTIGATION_IN_PROGRESS',
                           'RESOLVED','CLOSED','REJECTED') NOT NULL DEFAULT 'SUBMITTED',
  rejection_reason    VARCHAR(500) NULL,
  assigned_officer_id BIGINT UNSIGNED NULL COMMENT 'Current officer (denormalised from complaint_assignments)',
  police_station_id   INT UNSIGNED NULL,
  submitted_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at         DATETIME NULL,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_complaints_ref (complaint_ref),
  KEY idx_complaints_citizen_status (citizen_id, status),
  KEY idx_complaints_officer_status (assigned_officer_id, status),
  KEY idx_complaints_status_submitted (status, submitted_at),
  KEY idx_complaints_category (category_id),
  KEY idx_complaints_station (police_station_id),
  CONSTRAINT fk_complaints_citizen  FOREIGN KEY (citizen_id)          REFERENCES users (id),
  CONSTRAINT fk_complaints_category FOREIGN KEY (category_id)         REFERENCES complaint_categories (id),
  CONSTRAINT fk_complaints_officer  FOREIGN KEY (assigned_officer_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_complaints_station  FOREIGN KEY (police_station_id)   REFERENCES police_stations (id) ON DELETE SET NULL,
  CONSTRAINT chk_complaints_ref_format CHECK (complaint_ref REGEXP '^DPP-[0-9]{4}-[0-9]{6}$'),
  CONSTRAINT chk_complaints_rejection CHECK (status <> 'REJECTED' OR rejection_reason IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. complaint_evidence : metadata only; files live outside the web root
-- ---------------------------------------------------------------------
CREATE TABLE complaint_evidence (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  complaint_id      BIGINT UNSIGNED NOT NULL,
  uploaded_by       BIGINT UNSIGNED NOT NULL,
  evidence_type     ENUM('CITIZEN_EVIDENCE','INVESTIGATION_DOCUMENT') NOT NULL DEFAULT 'CITIZEN_EVIDENCE',
  original_filename VARCHAR(255) NOT NULL COMMENT 'Display only; never used to build a path',
  stored_filename   CHAR(40) NOT NULL COMMENT 'Random server-generated name incl. extension, e.g. 32 hex + .pdf',
  mime_type         VARCHAR(100) NOT NULL,
  file_extension    VARCHAR(10) NOT NULL,
  file_size         INT UNSIGNED NOT NULL COMMENT 'Bytes',
  sha256            CHAR(64) NOT NULL,
  uploaded_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_evidence_stored_filename (stored_filename),
  KEY idx_evidence_complaint (complaint_id),
  KEY idx_evidence_uploader (uploaded_by),
  CONSTRAINT fk_evidence_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE,
  CONSTRAINT fk_evidence_uploader  FOREIGN KEY (uploaded_by)  REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. complaint_assignments : full assignment history
--     Exactly one current row per complaint, enforced by the unique key on
--     the generated column (NULL for historical rows, complaint_id for the current one).
--     complaint_id uses the default RESTRICT action (required for generated-column bases).
-- ---------------------------------------------------------------------
CREATE TABLE complaint_assignments (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  complaint_id         BIGINT UNSIGNED NOT NULL,
  officer_id           BIGINT UNSIGNED NOT NULL,
  assigned_by          BIGINT UNSIGNED NOT NULL,
  note                 VARCHAR(500) NULL,
  is_current           TINYINT(1) NOT NULL DEFAULT 1,
  assigned_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unassigned_at        DATETIME NULL,
  current_complaint_id BIGINT UNSIGNED GENERATED ALWAYS AS (IF(is_current = 1, complaint_id, NULL)) VIRTUAL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_assignments_one_current (current_complaint_id),
  KEY idx_assignments_complaint (complaint_id),
  KEY idx_assignments_officer_current (officer_id, is_current),
  CONSTRAINT fk_assignments_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id),
  CONSTRAINT fk_assignments_officer   FOREIGN KEY (officer_id)   REFERENCES users (id),
  CONSTRAINT fk_assignments_admin     FOREIGN KEY (assigned_by)  REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. complaint_updates : chronological status history and official remarks
-- ---------------------------------------------------------------------
CREATE TABLE complaint_updates (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  complaint_id          BIGINT UNSIGNED NOT NULL,
  updated_by            BIGINT UNSIGNED NOT NULL,
  old_status            ENUM('SUBMITTED','UNDER_REVIEW','ASSIGNED','INVESTIGATION_IN_PROGRESS',
                             'RESOLVED','CLOSED','REJECTED') NULL COMMENT 'NULL for the initial submission row',
  new_status            ENUM('SUBMITTED','UNDER_REVIEW','ASSIGNED','INVESTIGATION_IN_PROGRESS',
                             'RESOLVED','CLOSED','REJECTED') NOT NULL,
  remark                TEXT NULL,
  is_visible_to_citizen TINYINT(1) NOT NULL DEFAULT 1 COMMENT '0 = internal note for officers/admins only',
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_updates_complaint_created (complaint_id, created_at),
  KEY idx_updates_user (updated_by),
  CONSTRAINT fk_updates_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE,
  CONSTRAINT fk_updates_user      FOREIGN KEY (updated_by)   REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. notifications
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  complaint_id BIGINT UNSIGNED NULL,
  type         ENUM('COMPLAINT_SUBMITTED','STATUS_CHANGED','COMPLAINT_ASSIGNED','REMARK_ADDED',
                    'EVIDENCE_ADDED','ACCOUNT','SYSTEM') NOT NULL,
  title        VARCHAR(150) NOT NULL,
  message      VARCHAR(500) NOT NULL,
  is_read      TINYINT(1) NOT NULL DEFAULT 0,
  read_at      DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user_read_created (user_id, is_read, created_at),
  KEY idx_notifications_complaint (complaint_id),
  CONSTRAINT fk_notifications_user      FOREIGN KEY (user_id)      REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_notifications_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. audit_logs : append-only; never store passwords, hashes, session IDs or tokens
-- ---------------------------------------------------------------------
CREATE TABLE audit_logs (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED NULL COMMENT 'NULL for system/CLI or failed anonymous actions',
  action        VARCHAR(64) NOT NULL COMMENT 'e.g. LOGIN_SUCCESS, COMPLAINT_ASSIGNED, ADMIN_BOOTSTRAPPED',
  entity_type   VARCHAR(40) NULL,
  entity_id     VARCHAR(40) NULL,
  details       JSON NULL COMMENT 'Non-sensitive context only',
  ip_address    VARCHAR(45) NULL,
  user_agent    VARCHAR(255) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_actor_created (actor_user_id, created_at),
  KEY idx_audit_action_created (action, created_at),
  KEY idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 14. login_attempts : supports login rate limiting (extension to the original 12 tables)
-- ---------------------------------------------------------------------
CREATE TABLE login_attempts (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  identifier    VARCHAR(190) NOT NULL COMMENT 'Lower-cased email or user_id as typed',
  ip_address    VARCHAR(45) NOT NULL,
  was_successful TINYINT(1) NOT NULL DEFAULT 0,
  attempted_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_login_identifier_time (identifier, attempted_at),
  KEY idx_login_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
