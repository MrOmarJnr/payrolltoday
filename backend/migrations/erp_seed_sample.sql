-- ============================================================================
-- LEF ERP — sample / demo data (idempotent via INSERT IGNORE, fixed ids)
-- Populates dashboards, charts and tables with realistic enterprise records.
-- Currency: GHS. Dates around 2026.
-- ============================================================================

-- Demo departments (harmless additions; skipped if ids already exist)
INSERT IGNORE INTO departments (id, name, code, description) VALUES
('DEPT-IT','Information Technology','IT','IT & systems'),
('DEPT-FIN','Finance','FIN','Finance & accounts'),
('DEPT-OPS','Operations','OPS','Operations'),
('DEPT-HR','Human Resources','HR','People & culture'),
('DEPT-ADMIN','Administration','ADM','Admin & facilities');

-- Suppliers
INSERT IGNORE INTO suppliers (id, company, contact_person, phone, email, address, tax_number, payment_terms, products_supplied, rating, status) VALUES
('SUP-001','TechHub Ghana Ltd','Kojo Mensah','+233201110001','sales@techhub.gh','Ring Road, Accra','C0012345','Net 30','Laptops, Servers, Networking',4.6,'active'),
('SUP-002','OfficePro Supplies','Ama Boateng','+233201110002','info@officepro.gh','Spintex, Accra','C0012346','Net 15','Stationery, Office Supplies',4.2,'active'),
('SUP-003','PowerLine Electricals','Yaw Owusu','+233201110003','sales@powerline.gh','Tema Industrial','C0012347','Net 30','Electrical, UPS, Cabling',3.9,'active'),
('SUP-004','FleetFuel Energy','Efua Sarpong','+233201110004','ops@fleetfuel.gh','Airport City, Accra','C0012348','Prepaid','Fuel, Lubricants',4.4,'active'),
('SUP-005','CleanCo Services','Kwesi Appiah','+233201110005','hello@cleanco.gh','Osu, Accra','C0012349','Net 15','Cleaning Supplies',4.0,'active'),
('SUP-006','NetSecure Systems','Adjoa Nyarko','+233201110006','sales@netsecure.gh','East Legon, Accra','C0012350','Net 45','Networking, Security',4.7,'active');

-- Expenses (mix of statuses / categories / months)
INSERT IGNORE INTO expenses (id, ref, category_id, department_id, vendor_id, payment_method, amount, tax, total, expense_date, status, created_by, approved_by) VALUES
('EXP-1001','EXP-1001','EXCAT-INTERNET','DEPT-IT','SUP-006','bank_transfer',2400,120,2520,'2026-08-04','approved','F. Officer','Admin'),
('EXP-1002','EXP-1002','EXCAT-ELECTRICITY','DEPT-ADMIN',NULL,'bank_transfer',5600,0,5600,'2026-08-04','paid','F. Officer','Admin'),
('EXP-1003','EXP-1003','EXCAT-RENT','DEPT-ADMIN',NULL,'bank_transfer',18000,0,18000,'2026-08-01','paid','F. Officer','Admin'),
('EXP-1004','EXP-1004','EXCAT-OFFICE','DEPT-OPS','SUP-002','petty_cash',860,43,903,'2026-07-28','approved','F. Officer','Admin'),
('EXP-1005','EXP-1005','EXCAT-TRAVEL','DEPT-OPS',NULL,'reimbursement',3200,0,3200,'2026-07-22','pending','K. Mensah',NULL),
('EXP-1006','EXP-1006','EXCAT-SOFTWARE','DEPT-IT','SUP-001','card',7800,390,8190,'2026-07-15','paid','F. Officer','Admin'),
('EXP-1007','EXP-1007','EXCAT-MARKETING','DEPT-OPS',NULL,'bank_transfer',4500,225,4725,'2026-07-10','approved','F. Officer','Admin'),
('EXP-1008','EXP-1008','EXCAT-REPAIRS','DEPT-ADMIN','SUP-003','bank_transfer',1250,0,1250,'2026-07-05','pending','A. Nyarko',NULL),
('EXP-1009','EXP-1009','EXCAT-WELFARE','DEPT-HR',NULL,'petty_cash',1800,0,1800,'2026-06-30','approved','F. Officer','Admin'),
('EXP-1010','EXP-1010','EXCAT-TRAINING','DEPT-HR',NULL,'bank_transfer',6200,310,6510,'2026-06-18','paid','F. Officer','Admin'),
('EXP-1011','EXP-1011','EXCAT-CLEANING','DEPT-ADMIN','SUP-005','bank_transfer',980,49,1029,'2026-06-12','paid','F. Officer','Admin'),
('EXP-1012','EXP-1012','EXCAT-HOSTING','DEPT-IT','SUP-006','card',1500,75,1575,'2026-06-05','paid','F. Officer','Admin'),
('EXP-1013','EXP-1013','EXCAT-SUBS','DEPT-IT','SUP-001','card',2100,105,2205,'2026-05-28','paid','F. Officer','Admin'),
('EXP-1014','EXP-1014','EXCAT-MEDICAL','DEPT-HR',NULL,'reimbursement',2750,0,2750,'2026-05-20','approved','F. Officer','Admin'),
('EXP-1015','EXP-1015','EXCAT-VEHICLE','DEPT-OPS','SUP-004','bank_transfer',3300,0,3300,'2026-05-11','paid','F. Officer','Admin'),
('EXP-1016','EXP-1016','EXCAT-PRINTING','DEPT-OPS','SUP-002','petty_cash',540,27,567,'2026-08-03','pending','A. Boateng',NULL),
('EXP-1017','EXP-1017','EXCAT-MAINT','DEPT-ADMIN','SUP-003','bank_transfer',2200,110,2310,'2026-08-02','approved','F. Officer','Admin'),
('EXP-1018','EXP-1018','EXCAT-MISC','DEPT-ADMIN',NULL,'petty_cash',320,0,320,'2026-08-04','pending','K. Appiah',NULL);

-- Fuel logs
INSERT IGNORE INTO fuel_logs (id, ref, vehicle, reg_no, driver, department_id, station, fuel_type, litres, price_per_litre, amount, prev_odometer, current_odometer, log_date, status, approved_by) VALUES
('FUEL-2001','FUEL-2001','Toyota Hilux','GR-4521-22','Kofi Asante','DEPT-OPS','Shell Spintex','Diesel',60,14.50,870,45210,45680,'2026-08-03','approved','Admin'),
('FUEL-2002','FUEL-2002','Toyota Corolla','GT-1180-21','Ama Serwaa','DEPT-ADMIN','GOIL Osu','Petrol',40,13.90,556,88120,88410,'2026-08-01','approved','Admin'),
('FUEL-2003','FUEL-2003','Nissan Navara','GR-9032-23','Yaw Darko','DEPT-OPS','Total Tema','Diesel',70,14.50,1015,23110,23640,'2026-07-27','approved','Admin'),
('FUEL-2004','FUEL-2004','Toyota Hilux','GR-4521-22','Kofi Asante','DEPT-OPS','Shell Spintex','Diesel',55,14.50,797.5,44720,45210,'2026-07-20','approved','Admin'),
('FUEL-2005','FUEL-2005','Hyundai Bus','GB-2210-20','Sena Adjei','DEPT-HR','GOIL Airport','Diesel',80,14.50,1160,15020,15560,'2026-07-14','pending',NULL),
('FUEL-2006','FUEL-2006','Toyota Corolla','GT-1180-21','Ama Serwaa','DEPT-ADMIN','GOIL Osu','Petrol',38,13.90,528.2,87800,88120,'2026-07-08','approved','Admin');

-- Budgets
INSERT IGNORE INTO budgets (id, name, fiscal_year, scope, department_id, category_id, allocated, spent, period, status) VALUES
('BUD-3001','IT Department 2026','2026','department','DEPT-IT',NULL,60000,23640,'annual','active'),
('BUD-3002','Operations 2026','2026','department','DEPT-OPS',NULL,80000,58925,'annual','active'),
('BUD-3003','Admin & Facilities 2026','2026','department','DEPT-ADMIN',NULL,120000,96218,'annual','active'),
('BUD-3004','Fuel Budget 2026','2026','category',NULL,'EXCAT-FUEL',50000,4926.7,'annual','active'),
('BUD-3005','Training & Welfare 2026','2026','department','DEPT-HR',NULL,40000,10800,'annual','active');

-- Petty cash
INSERT IGNORE INTO petty_cash_accounts (id, name, location_id, custodian, float_amount, balance, status) VALUES
('PCA-01','HQ Petty Cash','LOC-HQ','Front Desk',5000,2637,'active');
INSERT IGNORE INTO petty_cash_txns (id, account_id, ref, type, amount, balance_after, description, txn_date, created_by) VALUES
(1,'PCA-01','PC-0001','float',5000,5000,'Initial float','2026-07-01','Admin'),
(2,'PCA-01','PC-0002','expense',903,4097,'Office supplies','2026-07-28','Custodian'),
(3,'PCA-01','PC-0003','expense',560,3537,'Printing','2026-08-03','Custodian'),
(4,'PCA-01','PC-0004','expense',320,3217,'Sundry','2026-08-04','Custodian'),
(5,'PCA-01','PC-0005','withdrawal',800,2417,'Cash for errands','2026-08-04','Custodian'),
(6,'PCA-01','PC-0006','replenishment',220,2637,'Top-up','2026-08-04','Admin');

-- Inventory items (includes low-stock and out-of-stock)
INSERT IGNORE INTO inv_items (id, item_code, barcode, name, brand, category_id, unit, quantity, min_quantity, reorder_level, purchase_price, avg_cost, supplier_id, warehouse_id, status) VALUES
('ITM-001','IT-LAP-001','8901234500011','Dell Latitude 5440 Laptop','Dell','INVCAT-IT','pcs',18,5,8,9500,9500,'SUP-001','WH-IT','active'),
('ITM-002','IT-MON-002','8901234500028','24" LED Monitor','HP','INVCAT-IT','pcs',6,10,12,1800,1800,'SUP-001','WH-IT','active'),
('ITM-003','NET-SWT-003','8901234500035','24-Port Gigabit Switch','Cisco','INVCAT-NET','pcs',3,4,6,4200,4200,'SUP-006','WH-IT','active'),
('ITM-004','NET-RTR-004','8901234500042','Enterprise Router','MikroTik','INVCAT-NET','pcs',0,2,4,3500,3500,'SUP-006','WH-IT','active'),
('ITM-005','OFF-A4-005','8901234500059','A4 Paper Ream','JK','INVCAT-STAT','ream',120,40,60,45,45,'SUP-002','WH-MAIN','active'),
('ITM-006','OFF-PEN-006','8901234500066','Ballpoint Pens (Box)','Bic','INVCAT-STAT','box',35,20,30,60,60,'SUP-002','WH-MAIN','active'),
('ITM-007','ELE-UPS-007','8901234500073','1kVA UPS','APC','INVCAT-ELEC','pcs',9,5,8,2200,2200,'SUP-003','WH-MAIN','active'),
('ITM-008','CLN-DET-008','8901234500080','Multi-surface Cleaner (5L)','Dettol','INVCAT-CLEAN','pcs',14,10,15,80,80,'SUP-005','WH-MAIN','active'),
('ITM-009','FURN-CHR-009','8901234500097','Ergonomic Office Chair','Ergohaus','INVCAT-FURN','pcs',22,8,12,1400,1400,'SUP-002','WH-MAIN','active'),
('ITM-010','SAF-EXT-010','8901234500103','Fire Extinguisher 6kg','SafeGuard','INVCAT-SAFETY','pcs',7,6,10,350,350,'SUP-003','WH-MAIN','active'),
('ITM-011','CONS-TNR-011','8901234500110','Toner Cartridge 85A','HP','INVCAT-CONS','pcs',4,6,10,520,520,'SUP-002','WH-IT','active'),
('ITM-012','IT-KBD-012','8901234500127','Wireless Keyboard & Mouse','Logitech','INVCAT-IT','set',26,10,15,320,320,'SUP-001','WH-IT','active');

-- Stock movements
INSERT IGNORE INTO stock_movements (id, ref, item_id, type, quantity, to_warehouse_id, from_warehouse_id, unit_cost, reason, moved_by, movement_date) VALUES
(1,'SM-0001','ITM-001','in',20,'WH-IT',NULL,9500,'Initial stock','Store Mgr','2026-07-02'),
(2,'SM-0002','ITM-001','out',2,NULL,'WH-IT',9500,'Issued to IT','Store Mgr','2026-07-20'),
(3,'SM-0003','ITM-005','in',150,'WH-MAIN',NULL,45,'Purchase GRN','Store Mgr','2026-07-05'),
(4,'SM-0004','ITM-005','out',30,NULL,'WH-MAIN',45,'Office use','Store Mgr','2026-07-25'),
(5,'SM-0005','ITM-004','out',4,NULL,'WH-IT',3500,'Deployed','Store Mgr','2026-07-28'),
(6,'SM-0006','ITM-002','out',4,NULL,'WH-IT',1800,'Issued','Store Mgr','2026-08-01'),
(7,'SM-0007','ITM-011','out',2,NULL,'WH-IT',520,'Printing','Store Mgr','2026-08-02'),
(8,'SM-0008','ITM-009','in',30,'WH-MAIN',NULL,1400,'New chairs','Store Mgr','2026-07-10'),
(9,'SM-0009','ITM-009','transfer',8,'WH-IT','WH-MAIN',1400,'Branch setup','Store Mgr','2026-07-15'),
(10,'SM-0010','ITM-003','adjustment',-1,NULL,'WH-IT',4200,'Damaged in store','Store Mgr','2026-08-03');

-- Assets
INSERT IGNORE INTO assets (id, asset_tag, serial_number, name, category, assigned_department_id, warehouse_id, purchase_date, purchase_cost, warranty, status) VALUES
('AST-001','LEF-LAP-001','DL5440X001','Dell Latitude 5440','Laptops','DEPT-IT',NULL,'2026-02-10',9500,'3 years','in_use'),
('AST-002','LEF-LAP-002','DL5440X002','Dell Latitude 5440','Laptops','DEPT-FIN',NULL,'2026-02-10',9500,'3 years','in_use'),
('AST-003','LEF-SRV-001','HPE-DL380-01','HPE ProLiant Server','Servers','DEPT-IT',NULL,'2025-11-05',42000,'5 years','in_use'),
('AST-004','LEF-PRN-001','CANON-MF445-1','Canon Printer MF445','Printers','DEPT-ADMIN',NULL,'2026-01-18',3800,'2 years','in_use'),
('AST-005','LEF-UPS-001','APC1KVA-0091','APC 1kVA UPS','UPS','DEPT-IT',NULL,'2026-03-22',2200,'2 years','in_use'),
('AST-006','LEF-VEH-001','GR-4521-22','Toyota Hilux','Vehicles','DEPT-OPS',NULL,'2024-06-01',285000,'-','in_use'),
('AST-007','LEF-RTR-001','MK-CCR-0011','MikroTik Router','Routers','DEPT-IT',NULL,'2026-04-14',3500,'1 year','in_use'),
('AST-008','LEF-AC-001','LG-INV-0071','LG Inverter AC','Air Conditioners','DEPT-ADMIN',NULL,'2025-09-30',5600,'2 years','maintenance'),
('AST-009','LEF-PRJ-001','EPSON-EB-001','Epson Projector','Projectors','DEPT-HR',NULL,'2026-05-02',4200,'2 years','in_store'),
('AST-010','LEF-SWT-001','CISCO-2960-1','Cisco Switch 2960','Networking','DEPT-IT',NULL,'2025-12-11',4200,'3 years','in_use');
INSERT IGNORE INTO asset_maintenance (id, asset_id, maint_date, description, cost, performed_by) VALUES
(1,'AST-008','2026-08-01','AC gas refill & servicing',450,'CoolTech'),
(2,'AST-006','2026-07-15','Routine service',1200,'Toyota Ghana');

-- Purchase requests
INSERT IGNORE INTO purchase_requests (id, ref, title, requested_by, department_id, priority, needed_by, status, total_est) VALUES
('PR-4001','PR-4001','New laptops for Finance team','Ama Boateng','DEPT-FIN','high','2026-08-20','approved',28500),
('PR-4002','PR-4002','Networking upgrade – HQ','Kojo Mensah','DEPT-IT','urgent','2026-08-15','submitted',22000),
('PR-4003','PR-4003','Office stationery restock','Front Desk','DEPT-ADMIN','normal','2026-08-25','ordered',3500),
('PR-4004','PR-4004','Fire safety equipment','Kwesi Appiah','DEPT-ADMIN','high','2026-09-01','submitted',5200),
('PR-4005','PR-4005','Ergonomic chairs','Sena Adjei','DEPT-HR','low','2026-09-10','draft',14000);
INSERT IGNORE INTO purchase_request_items (id, request_id, description, quantity, unit, est_price) VALUES
(1,'PR-4001','Dell Latitude 5440',3,'pcs',9500),
(2,'PR-4002','24-Port Gigabit Switch',3,'pcs',4200),
(3,'PR-4002','Enterprise Router',2,'pcs',3500),
(4,'PR-4003','A4 Paper Ream',50,'ream',45),
(5,'PR-4004','Fire Extinguisher 6kg',12,'pcs',350),
(6,'PR-4005','Ergonomic Office Chair',10,'pcs',1400);

-- Purchase orders
INSERT IGNORE INTO purchase_orders (id, ref, request_id, supplier_id, order_date, delivery_date, payment_terms, subtotal, discount, tax, total, status) VALUES
('PO-5001','PO-5001','PR-4001','SUP-001','2026-08-02','2026-08-18','Net 30',28500,500,1400,29400,'sent'),
('PO-5002','PO-5002','PR-4003','SUP-002','2026-08-03','2026-08-12','Net 15',3500,0,175,3675,'confirmed'),
('PO-5003','PO-5003',NULL,'SUP-003','2026-07-28','2026-08-08','Net 30',4400,0,220,4620,'received'),
('PO-5004','PO-5004','PR-4002','SUP-006','2026-08-04','2026-08-20','Net 45',22000,1000,1050,22050,'draft');
INSERT IGNORE INTO purchase_order_items (id, po_id, item_id, description, quantity, unit_price, discount, tax, line_total) VALUES
(1,'PO-5001','ITM-001','Dell Latitude 5440',3,9500,500,1400,29400),
(2,'PO-5002','ITM-005','A4 Paper Ream',50,45,0,112.5,2362.5),
(3,'PO-5002','ITM-006','Ballpoint Pens (Box)',18,60,0,54,1134),
(4,'PO-5003','ITM-007','1kVA UPS',2,2200,0,220,4620),
(5,'PO-5004','ITM-003','24-Port Gigabit Switch',3,4200,600,630,13230),
(6,'PO-5004','ITM-004','Enterprise Router',2,3500,400,420,8820);

-- RFQs
INSERT IGNORE INTO rfqs (id, ref, title, request_id, due_date, status, notes) VALUES
('RFQ-6001','RFQ-6001','Networking upgrade – HQ','PR-4002','2026-08-12','open','Seeking 3 quotes'),
('RFQ-6002','RFQ-6002','Ergonomic chairs supply','PR-4005','2026-08-25','open','Bulk order');
INSERT IGNORE INTO rfq_suppliers (id, rfq_id, supplier_id) VALUES
(1,'RFQ-6001','SUP-006'),(2,'RFQ-6001','SUP-001'),(3,'RFQ-6001','SUP-003'),
(4,'RFQ-6002','SUP-002'),(5,'RFQ-6002','SUP-005');

-- Supplier quotations
INSERT IGNORE INTO supplier_quotations (id, ref, rfq_id, supplier_id, quote_date, valid_until, subtotal, tax, total, delivery_days, warranty, rating, status) VALUES
('SQ-7001','SQ-7001','RFQ-6001','SUP-006','2026-08-05','2026-09-05',21000,1050,22050,14,'2 years',4.7,'shortlisted'),
('SQ-7002','SQ-7002','RFQ-6001','SUP-001','2026-08-06','2026-09-06',22400,1120,23520,10,'1 year',4.5,'received'),
('SQ-7003','SQ-7003','RFQ-6001','SUP-003','2026-08-06','2026-09-06',20500,1025,21525,21,'1 year',3.9,'received'),
('SQ-7004','SQ-7004','RFQ-6002','SUP-002','2026-08-08','2026-09-08',13600,680,14280,7,'1 year',4.2,'received');

-- GRNs
INSERT IGNORE INTO grns (id, ref, po_id, received_date, received_by, status, notes) VALUES
('GRN-8001','GRN-8001','PO-5003','2026-08-08','Store Mgr','completed','All items received'),
('GRN-8002','GRN-8002','PO-5002','2026-08-11','Store Mgr','discrepancy','Short by 2 boxes of pens');
INSERT IGNORE INTO grn_items (id, grn_id, item_id, description, ordered_qty, received_qty, damaged_qty, shortage_qty) VALUES
(1,'GRN-8001','ITM-007','1kVA UPS',2,2,0,0),
(2,'GRN-8002','ITM-005','A4 Paper Ream',50,50,0,0),
(3,'GRN-8002','ITM-006','Ballpoint Pens (Box)',18,16,0,2);

-- Vendor bills
INSERT IGNORE INTO vendor_bills (id, ref, supplier_id, po_id, grn_id, invoice_number, bill_date, due_date, amount, tax, total, match_status, status) VALUES
('VB-9001','VB-9001','SUP-003','PO-5003','GRN-8001','INV-3390','2026-08-08','2026-09-07',4400,220,4620,'matched','approved'),
('VB-9002','VB-9002','SUP-002','PO-5002','GRN-8002','INV-2201','2026-08-11','2026-08-26',3380,169,3549,'exception','pending'),
('VB-9003','VB-9003','SUP-001','PO-5001',NULL,'INV-7781','2026-08-05','2026-09-04',28000,1400,29400,'unmatched','pending'),
('VB-9004','VB-9004','SUP-006',NULL,NULL,'INV-5540','2026-07-30','2026-09-13',1500,75,1575,'unmatched','paid');

-- Contracts
INSERT IGNORE INTO contracts (id, ref, title, supplier_id, start_date, end_date, value, status) VALUES
('CTR-01','CTR-01','Internet & Connectivity SLA','SUP-006','2026-01-01','2026-12-31',28800,'active'),
('CTR-02','CTR-02','Cleaning Services Agreement','SUP-005','2026-03-01','2026-08-31',11760,'renewal_due'),
('CTR-03','CTR-03','Fuel Supply Framework','SUP-004','2025-09-01','2026-08-31',120000,'renewal_due');

-- Approvals queue
INSERT IGNORE INTO approvals (id, module, entity, entity_id, ref, title, amount, requested_by, level, approver_role, status) VALUES
(1,'finance','expense','EXP-1005','EXP-1005','Travel reimbursement',3200,'K. Mensah',1,'Finance Officer','pending'),
(2,'finance','expense','EXP-1008','EXP-1008','Repairs – A/C',1250,'A. Nyarko',1,'Finance Officer','pending'),
(3,'procurement','purchase_request','PR-4002','PR-4002','Networking upgrade – HQ',22000,'Kojo Mensah',2,'Finance Officer','pending'),
(4,'procurement','vendor_bill','VB-9003','VB-9003','Vendor bill – TechHub',29400,'Procurement',2,'Finance Officer','pending'),
(5,'procurement','purchase_request','PR-4004','PR-4004','Fire safety equipment',5200,'K. Appiah',1,'Procurement Officer','pending'),
(6,'finance','fuel','FUEL-2005','FUEL-2005','Fuel – Hyundai Bus',1160,'Sena Adjei',1,'Finance Officer','pending');

-- Audit logs
INSERT IGNORE INTO audit_logs (id, actor, actor_role, action, module, entity, entity_id, details) VALUES
(1,'Admin','Administrator','create','procurement','purchase_order','PO-5001','Created PO for 3 laptops'),
(2,'F. Officer','Finance Officer','approve','finance','expense','EXP-1002','Approved electricity bill'),
(3,'Store Mgr','HR Officer','stock_in','inventory','inv_item','ITM-005','Received 150 reams A4'),
(4,'Admin','Administrator','create','procurement','rfq','RFQ-6001','Issued RFQ to 3 suppliers'),
(5,'F. Officer','Finance Officer','pay','procurement','vendor_bill','VB-9004','Marked bill paid'),
(6,'Store Mgr','HR Officer','adjustment','inventory','inv_item','ITM-003','Adjusted -1 damaged switch'),
(7,'Admin','Administrator','create','finance','budget','BUD-3001','Set IT annual budget'),
(8,'Procurement','Procurement Officer','receive','procurement','grn','GRN-8001','Goods received for PO-5003');
