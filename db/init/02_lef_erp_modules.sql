-- ============================================================================
--  LEF ERP — Finance / Inventory modules (auto-import #02)
--  Runs after 01_lef_payroll.sql on first DB creation. Idempotent.
--  (The Procurement module was retired; the `suppliers` table is kept as a
--   shared vendor directory for Finance & Inventory.)
-- ============================================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. ROLES (add the two ERP roles)
INSERT IGNORE INTO `roles` (`id`, `name`) VALUES
(5, 'Finance Officer'),
(6, 'Procurement Officer');

-- 2. FINANCE ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `expense_categories` (
  `id` VARCHAR(60) NOT NULL, `name` VARCHAR(120) NOT NULL,
  `type` VARCHAR(40) DEFAULT 'operational', `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` VARCHAR(60) NOT NULL, `ref` VARCHAR(40) DEFAULT NULL,
  `category_id` VARCHAR(60) DEFAULT NULL, `department_id` VARCHAR(60) DEFAULT NULL,
  `vendor_id` VARCHAR(60) DEFAULT NULL, `project` VARCHAR(120) DEFAULT NULL,
  `payment_method` VARCHAR(40) DEFAULT 'bank_transfer', `amount` DECIMAL(14,2) DEFAULT 0.00,
  `tax` DECIMAL(14,2) DEFAULT 0.00, `total` DECIMAL(14,2) DEFAULT 0.00,
  `currency` VARCHAR(8) DEFAULT 'GHS', `expense_date` DATE DEFAULT NULL,
  `status` ENUM('draft','pending','approved','rejected','paid') DEFAULT 'pending',
  `approval_date` DATE DEFAULT NULL, `receipt_url` VARCHAR(255) DEFAULT NULL,
  `invoice_url` VARCHAR(255) DEFAULT NULL, `notes` TEXT DEFAULT NULL,
  `created_by` VARCHAR(60) DEFAULT NULL, `approved_by` VARCHAR(60) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_exp_cat` (`category_id`), KEY `idx_exp_dept` (`department_id`),
  KEY `idx_exp_status` (`status`), KEY `idx_exp_date` (`expense_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(60) NOT NULL, `name` VARCHAR(120) NOT NULL, `reg_no` VARCHAR(60) DEFAULT NULL,
  `department_id` VARCHAR(60) DEFAULT NULL, `fuel_type` VARCHAR(40) DEFAULT 'Diesel',
  `status` ENUM('active','inactive') DEFAULT 'active', `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `fuel_logs` (
  `id` VARCHAR(60) NOT NULL, `ref` VARCHAR(40) DEFAULT NULL, `vehicle_id` VARCHAR(60) DEFAULT NULL,
  `vehicle` VARCHAR(120) DEFAULT NULL, `reg_no` VARCHAR(60) DEFAULT NULL, `driver` VARCHAR(120) DEFAULT NULL,
  `department_id` VARCHAR(60) DEFAULT NULL, `station` VARCHAR(120) DEFAULT NULL,
  `fuel_type` VARCHAR(40) DEFAULT 'Diesel', `litres` DECIMAL(12,2) DEFAULT 0.00,
  `price_per_litre` DECIMAL(12,2) DEFAULT 0.00, `amount` DECIMAL(14,2) DEFAULT 0.00,
  `prev_odometer` INT DEFAULT 0, `current_odometer` INT DEFAULT 0, `receipt_url` VARCHAR(255) DEFAULT NULL,
  `log_date` DATE DEFAULT NULL, `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `approved_by` VARCHAR(60) DEFAULT NULL, `notes` TEXT DEFAULT NULL, `created_by` VARCHAR(60) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_fuel_dept` (`department_id`), KEY `idx_fuel_date` (`log_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `petty_cash_accounts` (
  `id` VARCHAR(60) NOT NULL, `name` VARCHAR(120) NOT NULL, `location_id` VARCHAR(60) DEFAULT NULL,
  `custodian` VARCHAR(120) DEFAULT NULL, `float_amount` DECIMAL(14,2) DEFAULT 0.00,
  `balance` DECIMAL(14,2) DEFAULT 0.00, `status` ENUM('active','closed') DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `petty_cash_txns` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `account_id` VARCHAR(60) DEFAULT NULL, `ref` VARCHAR(40) DEFAULT NULL,
  `type` ENUM('float','withdrawal','replenishment','expense') DEFAULT 'expense', `amount` DECIMAL(14,2) DEFAULT 0.00,
  `balance_after` DECIMAL(14,2) DEFAULT 0.00, `description` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending','approved','rejected') DEFAULT 'approved', `txn_date` DATE DEFAULT NULL,
  `created_by` VARCHAR(60) DEFAULT NULL, `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_pc_acct` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. INVENTORY --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inv_categories` (
  `id` VARCHAR(60) NOT NULL, `name` VARCHAR(120) NOT NULL, `code` VARCHAR(40) DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL, `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` VARCHAR(60) NOT NULL, `name` VARCHAR(120) NOT NULL, `code` VARCHAR(40) DEFAULT NULL,
  `location_id` VARCHAR(60) DEFAULT NULL, `manager` VARCHAR(120) DEFAULT NULL, `capacity` INT DEFAULT 0,
  `status` ENUM('active','inactive') DEFAULT 'active', `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `inv_items` (
  `id` VARCHAR(60) NOT NULL, `item_code` VARCHAR(60) DEFAULT NULL, `name` VARCHAR(160) NOT NULL,
  `description` TEXT DEFAULT NULL, `brand` VARCHAR(120) DEFAULT NULL, `category_id` VARCHAR(60) DEFAULT NULL,
  `unit` VARCHAR(30) DEFAULT 'pcs', `quantity` DECIMAL(14,2) DEFAULT 0.00, `min_quantity` DECIMAL(14,2) DEFAULT 0.00,
  `reorder_level` DECIMAL(14,2) DEFAULT 0.00, `purchase_price` DECIMAL(14,2) DEFAULT 0.00,
  `avg_cost` DECIMAL(14,2) DEFAULT 0.00, `supplier_id` VARCHAR(60) DEFAULT NULL, `warehouse_id` VARCHAR(60) DEFAULT NULL,
  `purchase_date` DATE DEFAULT NULL, `warranty` VARCHAR(80) DEFAULT NULL,
  `status` ENUM('active','inactive','discontinued') DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_item_cat` (`category_id`), KEY `idx_item_wh` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `ref` VARCHAR(40) DEFAULT NULL, `item_id` VARCHAR(60) DEFAULT NULL,
  `type` ENUM('in','out','transfer','adjustment','return','damaged','disposed') NOT NULL,
  `quantity` DECIMAL(14,2) DEFAULT 0.00, `from_warehouse_id` VARCHAR(60) DEFAULT NULL,
  `to_warehouse_id` VARCHAR(60) DEFAULT NULL, `unit_cost` DECIMAL(14,2) DEFAULT 0.00,
  `reason` VARCHAR(255) DEFAULT NULL, `attachment_url` VARCHAR(255) DEFAULT NULL, `moved_by` VARCHAR(60) DEFAULT NULL,
  `movement_date` DATE DEFAULT NULL, `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_mov_item` (`item_id`), KEY `idx_mov_type` (`type`), KEY `idx_mov_date` (`movement_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `assets` (
  `id` VARCHAR(60) NOT NULL, `asset_tag` VARCHAR(60) DEFAULT NULL, `serial_number` VARCHAR(80) DEFAULT NULL,
  `name` VARCHAR(160) NOT NULL, `category` VARCHAR(80) DEFAULT NULL, `assigned_employee_id` VARCHAR(60) DEFAULT NULL,
  `assigned_department_id` VARCHAR(60) DEFAULT NULL, `warehouse_id` VARCHAR(60) DEFAULT NULL,
  `purchase_date` DATE DEFAULT NULL, `purchase_cost` DECIMAL(14,2) DEFAULT 0.00, `warranty` VARCHAR(80) DEFAULT NULL,
  `status` ENUM('in_use','in_store','maintenance','retired','disposed') DEFAULT 'in_store', `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), KEY `idx_asset_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `asset_maintenance` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `asset_id` VARCHAR(60) DEFAULT NULL, `maint_date` DATE DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL, `cost` DECIMAL(14,2) DEFAULT 0.00, `performed_by` VARCHAR(120) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), KEY `idx_maint_asset` (`asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. SUPPLIERS — shared vendor directory (Finance vendor bills, Inventory item sourcing) ---
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` VARCHAR(60) NOT NULL, `company` VARCHAR(160) NOT NULL, `contact_person` VARCHAR(120) DEFAULT NULL,
  `phone` VARCHAR(40) DEFAULT NULL, `email` VARCHAR(120) DEFAULT NULL, `address` VARCHAR(255) DEFAULT NULL,
  `tax_number` VARCHAR(60) DEFAULT NULL, `bank_details` VARCHAR(255) DEFAULT NULL, `payment_terms` VARCHAR(80) DEFAULT NULL,
  `products_supplied` VARCHAR(255) DEFAULT NULL, `rating` DECIMAL(3,1) DEFAULT 0.0,
  `status` ENUM('active','inactive','blacklisted') DEFAULT 'active', `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. HR — LEAVE ---------------------------------------------------------
-- HR-managed leave records: HR logs the leave (not employee self-service),
-- and later updates status to approved/rejected. approved_by + approval_date
-- give a per-employee audit trail alongside created_by/created_at.
CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` VARCHAR(60) NOT NULL, `employee_id` VARCHAR(50) DEFAULT NULL,
  `leave_type` VARCHAR(40) DEFAULT 'Annual', `start_date` DATE DEFAULT NULL, `end_date` DATE DEFAULT NULL,
  `days` DECIMAL(6,1) DEFAULT 0, `reason` TEXT DEFAULT NULL,
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `created_by` VARCHAR(60) DEFAULT NULL, `approved_by` VARCHAR(60) DEFAULT NULL, `approval_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_leave_emp` (`employee_id`), KEY `idx_leave_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. ADMINISTRATION ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `actor` VARCHAR(120) DEFAULT NULL, `actor_role` VARCHAR(80) DEFAULT NULL,
  `action` VARCHAR(80) DEFAULT NULL, `module` VARCHAR(40) DEFAULT NULL, `entity` VARCHAR(60) DEFAULT NULL,
  `entity_id` VARCHAR(60) DEFAULT NULL, `details` VARCHAR(255) DEFAULT NULL, `ip` VARCHAR(60) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_audit_module` (`module`), KEY `idx_audit_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. REFERENCE DATA ---------------------------------------------------------
INSERT IGNORE INTO `expense_categories` (`id`, `name`) VALUES
('EXCAT-FUEL','Fuel'),('EXCAT-INTERNET','Internet'),('EXCAT-ELECTRICITY','Electricity'),
('EXCAT-WATER','Water'),('EXCAT-RENT','Rent'),('EXCAT-OFFICE','Office Supplies'),
('EXCAT-PRINTING','Printing'),('EXCAT-TRAVEL','Travel'),('EXCAT-ACCOM','Accommodation'),
('EXCAT-TRAINING','Training'),('EXCAT-MARKETING','Marketing'),('EXCAT-REPAIRS','Repairs'),
('EXCAT-MAINT','Maintenance'),('EXCAT-VEHICLE','Vehicle Expenses'),('EXCAT-SOFTWARE','Software Licenses'),
('EXCAT-HOSTING','Hosting'),('EXCAT-DOMAINS','Domains'),('EXCAT-SSL','SSL Certificates'),
('EXCAT-SUBS','Subscriptions'),('EXCAT-WELFARE','Staff Welfare'),('EXCAT-MEDICAL','Medical'),
('EXCAT-CLEANING','Cleaning'),('EXCAT-MISC','Miscellaneous');

INSERT IGNORE INTO `inv_categories` (`id`, `name`, `code`) VALUES
('INVCAT-IT','IT Equipment','IT'),('INVCAT-NET','Networking','NET'),('INVCAT-FURN','Furniture','FURN'),
('INVCAT-OFFICE','Office Supplies','OFF'),('INVCAT-STAT','Stationery','STAT'),('INVCAT-CLEAN','Cleaning Supplies','CLN'),
('INVCAT-ELEC','Electrical','ELEC'),('INVCAT-MAINT','Maintenance','MNT'),('INVCAT-SAFETY','Safety Equipment','SAF'),
('INVCAT-CONS','Consumables','CONS'),('INVCAT-STORE','General Store','GEN');

INSERT IGNORE INTO `warehouses` (`id`, `name`, `code`, `manager`, `capacity`) VALUES
('WH-HQ','LEF HQ Store','HQ','Store Officer',10000);

INSERT IGNORE INTO `vehicles` (`id`, `name`, `reg_no`, `department_id`, `fuel_type`) VALUES
('VEH-001','Toyota Hilux','GR-4521-22','DEPT1782292409237','Diesel'),
('VEH-002','Toyota Corolla','GT-1180-21','DEPT1782293427422','Petrol'),
('VEH-003','Company Bus','GB-2210-20','DEPT1782292409237','Diesel');

-- 8. MOBILE SYNC — allow 'Mobile' as an attendance source (from the Aura app)
ALTER TABLE `attendance_logs`
  MODIFY `source` ENUM('Manual','Hikvision','Mobile') DEFAULT 'Manual';

SET FOREIGN_KEY_CHECKS = 1;
