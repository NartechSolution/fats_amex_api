import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { gatePassData, gatePassDetailData } from './gatePass';

const prisma = new PrismaClient();

// ============== ROLES DATA ==============
const rolesData = [
  { id: 'role-admin', name: 'admin', description: 'Administrator with full access - navigates to /selection' },
  { id: 'role-wbs', name: 'wbs', description: 'WBS user - navigates to /wbs/dashboard' },
  { id: 'role-fats', name: 'fats', description: 'FATS user - navigates to /fats-amex/dashboard' },
];

// ============== ROLES TYPE DATA ==============
const rolesTypeData = [
  { id: 'roletype-fats', name: 'fats' },
  { id: 'roletype-wbs', name: 'wbs' },
  { id: 'roletype-both', name: 'both' },
];

// ============== USERS DATA ==============
const usersData = [
  {
    id: 'user-admin',
    email: 'abdulmajid1m2@gmail.com',
    password: '123123',
    name: 'Abdul Majid (Admin)',
    role: 'admin',
    roleIds: ['role-admin'],
  },
  {
    id: 'user-wbs',
    email: 'wbs@fats.com',
    password: '123123',
    name: 'WBS User',
    role: 'wbs',
    roleIds: ['role-wbs'],
  },
  {
    id: 'user-fats',
    email: 'fats@fats.com',
    password: '123123',
    name: 'FATS User',
    role: 'fats',
    roleIds: ['role-fats'],
  },
];

// ============== DEPARTMENTS DATA ==============
const departmentsData = [
  { id: 'dept-it', name: 'Information Technology' },
  { id: 'dept-hr', name: 'Human Resources' },
  { id: 'dept-finance', name: 'Finance & Accounting' },
  { id: 'dept-operations', name: 'Operations' },
  { id: 'dept-maintenance', name: 'Maintenance' },
  { id: 'dept-logistics', name: 'Logistics & Supply Chain' },
  { id: 'dept-quality', name: 'Quality Control' },
  { id: 'dept-safety', name: 'Health, Safety & Environment' },
];

// ============== EMPLOYEES DATA ==============
const employeesData = [
  { id: 'emp-001', employeeId: 'EMP-001', name: 'Ahmed Al-Rashid' },
  { id: 'emp-002', employeeId: 'EMP-002', name: 'Mohammed Fahad' },
  { id: 'emp-003', employeeId: 'EMP-003', name: 'Khalid Hassan' },
  { id: 'emp-004', employeeId: 'EMP-004', name: 'Omar Al-Qahtani' },
  { id: 'emp-005', employeeId: 'EMP-005', name: 'Rene Divino' },
  { id: 'emp-006', employeeId: 'EMP-006', name: 'Hassan Raza' },
  { id: 'emp-007', employeeId: 'EMP-007', name: 'Zaheer Nazir' },
  { id: 'emp-008', employeeId: 'EMP-008', name: 'Ali Zain' },
  { id: 'emp-009', employeeId: 'EMP-009', name: 'Imran Khan' },
  { id: 'emp-010', employeeId: 'EMP-010', name: 'Abdul Matin' },
];

// ============== BRANDS DATA ==============
const brandsData = [
  { id: 'brand-dell', name: 'Dell' },
  { id: 'brand-hp', name: 'HP' },
  { id: 'brand-lenovo', name: 'Lenovo' },
  { id: 'brand-cisco', name: 'Cisco' },
  { id: 'brand-samsung', name: 'Samsung' },
  { id: 'brand-apple', name: 'Apple' },
  { id: 'brand-caterpillar', name: 'Caterpillar' },
  { id: 'brand-siemens', name: 'Siemens' },
  { id: 'brand-schneider', name: 'Schneider Electric' },
  { id: 'brand-honeywell', name: 'Honeywell' },
];

// ============== LOCATIONS DATA ==============
const locationsData = [
  { id: 'loc-hq-f1-101', company: 'AQPCI', building: 'Headquarters', levelFloor: 'Floor 1', office: 'Office 101', room: 'Room A', locationCode: 'HQ-F1-101' },
  { id: 'loc-hq-f1-102', company: 'AQPCI', building: 'Headquarters', levelFloor: 'Floor 1', office: 'Office 102', room: 'Room B', locationCode: 'HQ-F1-102' },
  { id: 'loc-hq-f2-201', company: 'AQPCI', building: 'Headquarters', levelFloor: 'Floor 2', office: 'Office 201', room: 'Meeting Room 1', locationCode: 'HQ-F2-201' },
  { id: 'loc-hq-f2-202', company: 'AQPCI', building: 'Headquarters', levelFloor: 'Floor 2', office: 'Office 202', room: 'Server Room', locationCode: 'HQ-F2-202' },
  { id: 'loc-wh-a-001', company: 'AQPCI', building: 'Warehouse A', levelFloor: 'Ground Floor', office: 'Storage Area', room: 'Section 1', locationCode: 'WH-A-001' },
  { id: 'loc-wh-a-002', company: 'AQPCI', building: 'Warehouse A', levelFloor: 'Ground Floor', office: 'Storage Area', room: 'Section 2', locationCode: 'WH-A-002' },
  { id: 'loc-wh-b-001', company: 'AQPCI', building: 'Warehouse B', levelFloor: 'Ground Floor', office: 'Heavy Equipment', room: 'Bay 1', locationCode: 'WH-B-001' },
  { id: 'loc-site3-001', company: 'AQPCI', building: 'Site 3 Office', levelFloor: 'Floor 1', office: 'Main Office', room: 'Room 1', locationCode: 'S3-F1-001' },
  { id: 'loc-site4-001', company: 'AQPCI', building: 'Site 4 Office', levelFloor: 'Floor 1', office: 'Main Office', room: 'Room 1', locationCode: 'S4-F1-001' },
  { id: 'loc-site5-001', company: 'AQPCI', building: 'Site 5 Office', levelFloor: 'Floor 1', office: 'Main Office', room: 'Room 1', locationCode: 'S5-F1-001' },
];

// ============== FATS CATEGORIES DATA ==============
const fatsCategoriesData = [
  { id: 'fcat-it-comp', mainCatCode: '01', mainCategoryDesc: 'IT Equipment', mainDescription: 'Information Technology Equipment', subCategoryCode: '0101', subCategoryDesc: 'Computers & Laptops' },
  { id: 'fcat-it-net', mainCatCode: '01', mainCategoryDesc: 'IT Equipment', mainDescription: 'Information Technology Equipment', subCategoryCode: '0102', subCategoryDesc: 'Network Equipment' },
  { id: 'fcat-it-print', mainCatCode: '01', mainCategoryDesc: 'IT Equipment', mainDescription: 'Information Technology Equipment', subCategoryCode: '0103', subCategoryDesc: 'Printers & Scanners' },
  { id: 'fcat-off-furn', mainCatCode: '02', mainCategoryDesc: 'Office Equipment', mainDescription: 'Office Furniture & Equipment', subCategoryCode: '0201', subCategoryDesc: 'Office Furniture' },
  { id: 'fcat-off-elec', mainCatCode: '02', mainCategoryDesc: 'Office Equipment', mainDescription: 'Office Furniture & Equipment', subCategoryCode: '0202', subCategoryDesc: 'Office Electronics' },
  { id: 'fcat-mach-heavy', mainCatCode: '03', mainCategoryDesc: 'Machinery', mainDescription: 'Industrial Machinery', subCategoryCode: '0301', subCategoryDesc: 'Heavy Machinery' },
  { id: 'fcat-mach-tools', mainCatCode: '03', mainCategoryDesc: 'Machinery', mainDescription: 'Industrial Machinery', subCategoryCode: '0302', subCategoryDesc: 'Power Tools' },
  { id: 'fcat-veh-car', mainCatCode: '04', mainCategoryDesc: 'Vehicles', mainDescription: 'Transportation Vehicles', subCategoryCode: '0401', subCategoryDesc: 'Cars & SUVs' },
  { id: 'fcat-veh-truck', mainCatCode: '04', mainCategoryDesc: 'Vehicles', mainDescription: 'Transportation Vehicles', subCategoryCode: '0402', subCategoryDesc: 'Trucks & Heavy Vehicles' },
  { id: 'fcat-safety', mainCatCode: '05', mainCategoryDesc: 'Safety Equipment', mainDescription: 'Health & Safety Equipment', subCategoryCode: '0501', subCategoryDesc: 'Personal Protective Equipment' },
];

// ============== ASSET CONDITIONS DATA ==============
const assetConditionsData = [
  { id: 'cond-excellent', condition: 'Excellent' },
  { id: 'cond-good', condition: 'Good' },
  { id: 'cond-fair', condition: 'Fair' },
  { id: 'cond-poor', condition: 'Poor' },
  { id: 'cond-damaged', condition: 'Damaged' },
  { id: 'cond-needs-repair', condition: 'Needs Repair' },
];

// ============== ASSET STATUS DATA ==============
const assetStatusesData = [
  { id: 'status-active', status: 'Active' },
  { id: 'status-inactive', status: 'Inactive' },
  { id: 'status-maintenance', status: 'Under Maintenance' },
  { id: 'status-disposed', status: 'Disposed' },
  { id: 'status-transferred', status: 'Transferred' },
  { id: 'status-lost', status: 'Lost' },
  { id: 'status-pending', status: 'Pending Verification' },
];

// ============== ASSET CAPTURES DATA ==============
const assetCapturesData = [
  {
    id: 'acap-001',
    locationId: 'loc-hq-f2-202',
    fatsCategoryId: 'fcat-it-comp',
    assetDescription: 'Dell OptiPlex 7090 Desktop Computer',
    serialNumber: 'SN-DELL-7090-001',
    assetTag: 'IT-COMP-001',
    quantity: 1,
    employeeId: 'EMP-001',
    extNumber: '1001',
    faNumber: 'FA-2024-001',
    brand: 'Dell',
    modal: 'OptiPlex 7090',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-002',
    locationId: 'loc-hq-f1-101',
    fatsCategoryId: 'fcat-it-comp',
    assetDescription: 'HP ProBook 450 G8 Laptop',
    serialNumber: 'SN-HP-450G8-001',
    assetTag: 'IT-COMP-002',
    quantity: 1,
    employeeId: 'EMP-002',
    extNumber: '1002',
    faNumber: 'FA-2024-002',
    brand: 'HP',
    modal: 'ProBook 450 G8',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-003',
    locationId: 'loc-hq-f2-202',
    fatsCategoryId: 'fcat-it-net',
    assetDescription: 'Cisco Catalyst 9300 Switch',
    serialNumber: 'SN-CISCO-9300-001',
    assetTag: 'IT-NET-001',
    quantity: 1,
    employeeId: 'EMP-001',
    extNumber: null,
    faNumber: 'FA-2024-003',
    brand: 'Cisco',
    modal: 'Catalyst 9300',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-004',
    locationId: 'loc-hq-f1-102',
    fatsCategoryId: 'fcat-it-print',
    assetDescription: 'HP LaserJet Pro MFP M428fdn Printer',
    serialNumber: 'SN-HP-M428-001',
    assetTag: 'IT-PRINT-001',
    quantity: 1,
    employeeId: 'EMP-003',
    extNumber: null,
    faNumber: 'FA-2024-004',
    brand: 'HP',
    modal: 'LaserJet Pro M428fdn',
    isVerified: false,
    isGenerated: true,
  },
  {
    id: 'acap-005',
    locationId: 'loc-wh-b-001',
    fatsCategoryId: 'fcat-mach-heavy',
    assetDescription: 'Caterpillar 320 Excavator',
    serialNumber: 'SN-CAT-320-001',
    assetTag: 'MACH-HVY-001',
    quantity: 1,
    employeeId: 'EMP-004',
    extNumber: null,
    faNumber: 'FA-2024-005',
    brand: 'Caterpillar',
    modal: '320 GC',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-006',
    locationId: 'loc-wh-a-001',
    fatsCategoryId: 'fcat-mach-tools',
    assetDescription: 'Dewalt DCD996 Hammer Drill Kit',
    serialNumber: 'SN-DEWALT-DCD996-001',
    assetTag: 'TOOL-PWR-001',
    quantity: 5,
    employeeId: 'EMP-005',
    extNumber: null,
    faNumber: 'FA-2024-006',
    brand: 'Dewalt',
    modal: 'DCD996',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-007',
    locationId: 'loc-hq-f2-201',
    fatsCategoryId: 'fcat-off-elec',
    assetDescription: 'Samsung 75" Smart TV for Conference Room',
    serialNumber: 'SN-SAMSUNG-TV75-001',
    assetTag: 'OFF-ELEC-001',
    quantity: 1,
    employeeId: 'EMP-006',
    extNumber: null,
    faNumber: 'FA-2024-007',
    brand: 'Samsung',
    modal: 'QN75Q80C',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-008',
    locationId: 'loc-hq-f1-101',
    fatsCategoryId: 'fcat-off-furn',
    assetDescription: 'Herman Miller Aeron Executive Chair',
    serialNumber: 'SN-HM-AERON-001',
    assetTag: 'FURN-CHAIR-001',
    quantity: 1,
    employeeId: 'EMP-007',
    extNumber: null,
    faNumber: 'FA-2024-008',
    brand: 'Herman Miller',
    modal: 'Aeron Size B',
    isVerified: false,
    isGenerated: true,
  },
];

// ============== ASSET CAPTURE PDA DATA ==============
const assetCapturePDAData = [
  {
    id: 'acap-pda-001',
    locationId: 'loc-site3-001',
    fatsCategoryId: 'fcat-it-comp',
    assetDescription: 'Lenovo ThinkPad X1 Carbon',
    serialNumber: 'SN-LEN-X1C-001',
    assetTag: 'IT-COMP-PDA-001',
    quantity: 1,
    employeeId: 'EMP-008',
    extNumber: '3001',
    faNumber: 'FA-2024-PDA-001',
    brand: 'Lenovo',
    modal: 'ThinkPad X1 Carbon Gen 11',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-pda-002',
    locationId: 'loc-site4-001',
    fatsCategoryId: 'fcat-safety',
    assetDescription: 'Honeywell Gas Detector - BW Clip4',
    serialNumber: 'SN-HW-BW4-001',
    assetTag: 'SAFETY-GAS-001',
    quantity: 10,
    employeeId: 'EMP-009',
    extNumber: null,
    faNumber: 'FA-2024-PDA-002',
    brand: 'Honeywell',
    modal: 'BW Clip4',
    isVerified: true,
    isGenerated: true,
  },
  {
    id: 'acap-pda-003',
    locationId: 'loc-site5-001',
    fatsCategoryId: 'fcat-veh-truck',
    assetDescription: 'Ford F-350 Super Duty Service Truck',
    serialNumber: 'VIN-FORD-F350-001',
    assetTag: 'VEH-TRUCK-001',
    quantity: 1,
    employeeId: 'EMP-010',
    extNumber: null,
    faNumber: 'FA-2024-PDA-003',
    brand: 'Ford',
    modal: 'F-350 Super Duty',
    isVerified: false,
    isGenerated: true,
  },
];

// ============== ASSET TAGS DATA ==============
const assetTagsData = [
  { id: 'tag-001', tagNumber: 'AQPCI-TAG-0001', assetCaptureId: 'acap-001', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-002', tagNumber: 'AQPCI-TAG-0002', assetCaptureId: 'acap-002', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-003', tagNumber: 'AQPCI-TAG-0003', assetCaptureId: 'acap-003', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-004', tagNumber: 'AQPCI-TAG-0004', assetCaptureId: 'acap-004', assetCapturePDAId: null, isVerified: false },
  { id: 'tag-005', tagNumber: 'AQPCI-TAG-0005', assetCaptureId: 'acap-005', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-006-1', tagNumber: 'AQPCI-TAG-0006-1', assetCaptureId: 'acap-006', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-006-2', tagNumber: 'AQPCI-TAG-0006-2', assetCaptureId: 'acap-006', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-006-3', tagNumber: 'AQPCI-TAG-0006-3', assetCaptureId: 'acap-006', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-006-4', tagNumber: 'AQPCI-TAG-0006-4', assetCaptureId: 'acap-006', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-006-5', tagNumber: 'AQPCI-TAG-0006-5', assetCaptureId: 'acap-006', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-007', tagNumber: 'AQPCI-TAG-0007', assetCaptureId: 'acap-007', assetCapturePDAId: null, isVerified: true },
  { id: 'tag-008', tagNumber: 'AQPCI-TAG-0008', assetCaptureId: 'acap-008', assetCapturePDAId: null, isVerified: false },
  { id: 'tag-pda-001', tagNumber: 'AQPCI-TAG-PDA-0001', assetCaptureId: null, assetCapturePDAId: 'acap-pda-001', isVerified: true },
  { id: 'tag-pda-002-1', tagNumber: 'AQPCI-TAG-PDA-0002-1', assetCaptureId: null, assetCapturePDAId: 'acap-pda-002', isVerified: true },
  { id: 'tag-pda-002-2', tagNumber: 'AQPCI-TAG-PDA-0002-2', assetCaptureId: null, assetCapturePDAId: 'acap-pda-002', isVerified: true },
  { id: 'tag-pda-003', tagNumber: 'AQPCI-TAG-PDA-0003', assetCaptureId: null, assetCapturePDAId: 'acap-pda-003', isVerified: false },
];

// ============== ASSET VERIFICATION DATA ==============
const assetVerificationsData = [
  {
    id: 'aver-001',
    tagNumber: 'AQPCI-TAG-0001',
    assetCondition: 'Excellent',
    assetStatus: 'Active',
    brand: 'Dell',
    modal: 'OptiPlex 7090',
    serialNumber: 'SN-DELL-7090-001',
    faNumber: 'FA-2024-001',
    extNumber: '1001',
    locationId: 'loc-hq-f2-202',
    assetCategoryId: 'fcat-it-comp',
    assetOldTagNumber: null,
    employeeId: 'EMP-001',
    assetDescription: 'Dell OptiPlex 7090 Desktop Computer',
    image1: '/assets/images/dell-optiplex-7090.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  },
  {
    id: 'aver-002',
    tagNumber: 'AQPCI-TAG-0002',
    assetCondition: 'Good',
    assetStatus: 'Active',
    brand: 'HP',
    modal: 'ProBook 450 G8',
    serialNumber: 'SN-HP-450G8-001',
    faNumber: 'FA-2024-002',
    extNumber: '1002',
    locationId: 'loc-hq-f1-101',
    assetCategoryId: 'fcat-it-comp',
    assetOldTagNumber: 'OLD-HP-001',
    employeeId: 'EMP-002',
    assetDescription: 'HP ProBook 450 G8 Laptop',
    image1: '/assets/images/hp-probook-450.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  },
  {
    id: 'aver-003',
    tagNumber: 'AQPCI-TAG-0003',
    assetCondition: 'Excellent',
    assetStatus: 'Active',
    brand: 'Cisco',
    modal: 'Catalyst 9300',
    serialNumber: 'SN-CISCO-9300-001',
    faNumber: 'FA-2024-003',
    extNumber: null,
    locationId: 'loc-hq-f2-202',
    assetCategoryId: 'fcat-it-net',
    assetOldTagNumber: null,
    employeeId: 'EMP-001',
    assetDescription: 'Cisco Catalyst 9300 Switch',
    image1: '/assets/images/cisco-catalyst-9300.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  },
  {
    id: 'aver-004',
    tagNumber: 'AQPCI-TAG-0005',
    assetCondition: 'Good',
    assetStatus: 'Active',
    brand: 'Caterpillar',
    modal: '320 GC',
    serialNumber: 'SN-CAT-320-001',
    faNumber: 'FA-2024-005',
    extNumber: null,
    locationId: 'loc-wh-b-001',
    assetCategoryId: 'fcat-mach-heavy',
    assetOldTagNumber: 'OLD-CAT-001',
    employeeId: 'EMP-004',
    assetDescription: 'Caterpillar 320 Excavator',
    image1: '/assets/images/cat-320.jpg',
    image2: '/assets/images/cat-320-side.jpg',
    image3: null,
    image4: null,
    image5: null,
  },
  {
    id: 'aver-005',
    tagNumber: 'AQPCI-TAG-0007',
    assetCondition: 'Excellent',
    assetStatus: 'Active',
    brand: 'Samsung',
    modal: 'QN75Q80C',
    serialNumber: 'SN-SAMSUNG-TV75-001',
    faNumber: 'FA-2024-007',
    extNumber: null,
    locationId: 'loc-hq-f2-201',
    assetCategoryId: 'fcat-off-elec',
    assetOldTagNumber: null,
    employeeId: 'EMP-006',
    assetDescription: 'Samsung 75" Smart TV for Conference Room',
    image1: '/assets/images/samsung-tv75.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  },
];

// ============== INVENTORY DATA ==============
const inventoryData = [
  {
    id: 'inv-001',
    transactionId: 'TXN-20250115-001',
    transactionDate: new Date('2025-01-15T09:00:00.000Z'),
    transactionName: 'January 2025 Physical Count - HQ',
    createdBy: 'Abdul Majid',
    status: 'Completed',
    scanningMode: 'Barcode',
  },
  {
    id: 'inv-002',
    transactionId: 'TXN-20250116-001',
    transactionDate: new Date('2025-01-16T10:30:00.000Z'),
    transactionName: 'January 2025 Physical Count - Warehouse',
    createdBy: 'Hassan Raza',
    status: 'Completed',
    scanningMode: 'RFID',
  },
  {
    id: 'inv-003',
    transactionId: 'TXN-20250118-001',
    transactionDate: new Date('2025-01-18T14:00:00.000Z'),
    transactionName: 'Site 3 Asset Verification',
    createdBy: 'Rene Divino',
    status: 'In Progress',
    scanningMode: 'Barcode',
  },
];

// ============== VERIFIED ASSETS DATA ==============
const verifiedAssetsData = [
  {
    id: 'vasset-001',
    majorCategory: '01',
    majorCategoryDescription: 'IT Equipment',
    minorCategory: '0101',
    minorCategoryDescription: 'Computers & Laptops',
    tagNumber: 'AQPCI-TAG-0001',
    serialNumber: 'SN-DELL-7090-001',
    assetDescription: 'Dell OptiPlex 7090 Desktop Computer',
    assetType: 'Fixed Asset',
    assetCondition: 'Excellent',
    country: 'Saudi Arabia',
    region: 'Eastern Province',
    cityName: 'Dammam',
    dao: 'DAO-001',
    daoName: 'Dammam Area Office',
    businessUnit: 'IT Department',
    buildingNo: 'HQ-001',
    floorNo: '2',
    employeeId: 'EMP-001',
    poNumber: 'PO-2024-0001',
    poDate: '2024-01-15',
    deliveryNoteNo: 'DN-2024-0001',
    supplier: 'Dell Technologies',
    invoiceNo: 'INV-DELL-2024-001',
    invoiceDate: '2024-01-20',
    modelOfAsset: 'OptiPlex 7090',
    manufacturer: 'Dell',
    ownership: 'Company Owned',
    bought: 'New',
    terminalId: null,
    atmNumber: null,
    locationTag: 'HQ-F2-202',
    buildingName: 'Headquarters',
    buildingAddress: '123 Industrial Area, Dammam',
    userLoginId: 'ahmed.rashid',
    mainSubSeriesNo: 1,
    assetDateCaptured: '2024-02-01',
    assetTimeCaptured: '09:30:00',
    assetDateScanned: '2025-01-15',
    assetTimeScanned: '09:15:00',
    qty: 1,
    phoneExtNo: '1001',
    fullLocationDetails: 'HQ Building, Floor 2, Server Room',
    journalRefNo: 'JRN-2024-001',
    images: '/assets/images/dell-optiplex-7090.jpg',
    inventoryId: 'inv-001',
  },
  {
    id: 'vasset-002',
    majorCategory: '01',
    majorCategoryDescription: 'IT Equipment',
    minorCategory: '0101',
    minorCategoryDescription: 'Computers & Laptops',
    tagNumber: 'AQPCI-TAG-0002',
    serialNumber: 'SN-HP-450G8-001',
    assetDescription: 'HP ProBook 450 G8 Laptop',
    assetType: 'Fixed Asset',
    assetCondition: 'Good',
    country: 'Saudi Arabia',
    region: 'Eastern Province',
    cityName: 'Dammam',
    dao: 'DAO-001',
    daoName: 'Dammam Area Office',
    businessUnit: 'Operations',
    buildingNo: 'HQ-001',
    floorNo: '1',
    employeeId: 'EMP-002',
    poNumber: 'PO-2024-0002',
    poDate: '2024-02-10',
    deliveryNoteNo: 'DN-2024-0002',
    supplier: 'HP Inc.',
    invoiceNo: 'INV-HP-2024-001',
    invoiceDate: '2024-02-15',
    modelOfAsset: 'ProBook 450 G8',
    manufacturer: 'HP',
    ownership: 'Company Owned',
    bought: 'New',
    terminalId: null,
    atmNumber: null,
    locationTag: 'HQ-F1-101',
    buildingName: 'Headquarters',
    buildingAddress: '123 Industrial Area, Dammam',
    userLoginId: 'mohammed.fahad',
    mainSubSeriesNo: 2,
    assetDateCaptured: '2024-03-01',
    assetTimeCaptured: '10:00:00',
    assetDateScanned: '2025-01-15',
    assetTimeScanned: '09:45:00',
    qty: 1,
    phoneExtNo: '1002',
    fullLocationDetails: 'HQ Building, Floor 1, Office 101',
    journalRefNo: 'JRN-2024-002',
    images: '/assets/images/hp-probook-450.jpg',
    inventoryId: 'inv-001',
  },
  {
    id: 'vasset-003',
    majorCategory: '03',
    majorCategoryDescription: 'Machinery',
    minorCategory: '0301',
    minorCategoryDescription: 'Heavy Machinery',
    tagNumber: 'AQPCI-TAG-0005',
    serialNumber: 'SN-CAT-320-001',
    assetDescription: 'Caterpillar 320 Excavator',
    assetType: 'Heavy Equipment',
    assetCondition: 'Good',
    country: 'Saudi Arabia',
    region: 'Eastern Province',
    cityName: 'Dammam',
    dao: 'DAO-001',
    daoName: 'Dammam Area Office',
    businessUnit: 'Operations',
    buildingNo: 'WH-B',
    floorNo: 'Ground',
    employeeId: 'EMP-004',
    poNumber: 'PO-2023-0050',
    poDate: '2023-06-15',
    deliveryNoteNo: 'DN-2023-0050',
    supplier: 'Caterpillar Arabia',
    invoiceNo: 'INV-CAT-2023-050',
    invoiceDate: '2023-07-01',
    modelOfAsset: '320 GC',
    manufacturer: 'Caterpillar',
    ownership: 'Company Owned',
    bought: 'New',
    terminalId: null,
    atmNumber: null,
    locationTag: 'WH-B-001',
    buildingName: 'Warehouse B',
    buildingAddress: '456 Industrial Area, Dammam',
    userLoginId: 'omar.qahtani',
    mainSubSeriesNo: 1,
    assetDateCaptured: '2023-07-15',
    assetTimeCaptured: '14:30:00',
    assetDateScanned: '2025-01-16',
    assetTimeScanned: '11:00:00',
    qty: 1,
    phoneExtNo: null,
    fullLocationDetails: 'Warehouse B, Ground Floor, Heavy Equipment Bay 1',
    journalRefNo: 'JRN-2023-050',
    images: '/assets/images/cat-320.jpg',
    inventoryId: 'inv-002',
  },
];

// ============== ASSET TRANSACTIONS DATA ==============
const assetTransactionsData = [
  {
    id: 'atxn-001',
    transactionId: 'ATXN-20250115-001',
    type: 'Physical Count',
    name: 'Q1 2025 Physical Count - Headquarters',
    transactionDate: new Date('2025-01-15T09:00:00.000Z'),
    isActive: true,
  },
  {
    id: 'atxn-002',
    transactionId: 'ATXN-20250116-001',
    type: 'Physical Count',
    name: 'Q1 2025 Physical Count - Warehouse',
    transactionDate: new Date('2025-01-16T10:30:00.000Z'),
    isActive: true,
  },
  {
    id: 'atxn-003',
    transactionId: 'ATXN-20250110-001',
    type: 'GatePass',
    name: 'Equipment Transfer to Site 3',
    transactionDate: new Date('2025-01-10T08:00:00.000Z'),
    isActive: true,
  },
  {
    id: 'atxn-004',
    transactionId: 'ATXN-20250112-001',
    type: 'GatePass',
    name: 'Maintenance Equipment Return',
    transactionDate: new Date('2025-01-12T15:00:00.000Z'),
    isActive: false,
  },
];

// ============== WBS CATEGORIES DATA ==============
const wbsCategoriesData = [
  { id: 'wbs-cat-consumables', name: 'Consumables', image: '/wbs/categories/consumables.jpg' },
  { id: 'wbs-cat-safety', name: 'Safety Supplies', image: '/wbs/categories/safety.jpg' },
  { id: 'wbs-cat-electrical', name: 'Electrical Supplies', image: '/wbs/categories/electrical.jpg' },
  { id: 'wbs-cat-plumbing', name: 'Plumbing Supplies', image: '/wbs/categories/plumbing.jpg' },
  { id: 'wbs-cat-tools', name: 'Hand Tools', image: '/wbs/categories/tools.jpg' },
];

// ============== WBS MODIFIERS DATA ==============
const wbsModifiersData = [
  { id: 'wbs-mod-small', name: 'Small', description: 'Small size variant', price: 0, stock: 100, isActive: true },
  { id: 'wbs-mod-medium', name: 'Medium', description: 'Medium size variant', price: 5, stock: 150, isActive: true },
  { id: 'wbs-mod-large', name: 'Large', description: 'Large size variant', price: 10, stock: 75, isActive: true },
  { id: 'wbs-mod-bulk', name: 'Bulk Pack', description: 'Bulk packaging (10 units)', price: -15, stock: 50, isActive: true },
  { id: 'wbs-mod-express', name: 'Express Delivery', description: 'Priority shipping', price: 25, stock: null, isActive: true },
];

// ============== WBS INVENTORY DATA ==============
const wbsInventoryData = [
  {
    id: 'wbs-inv-001',
    name: 'Safety Gloves - Nitrile',
    description: 'Industrial grade nitrile safety gloves, powder-free',
    price: 45.00,
    quantity: 500,
    batchNumber: 'BATCH-2025-001',
    serialNumber: null,
    assetLocation: 'Warehouse A - Section 1',
    expiryDate: new Date('2027-01-15'),
    manufactureDate: new Date('2024-06-15'),
    image: '/wbs/inventory/safety-gloves.jpg',
    categoryId: 'wbs-cat-safety',
    modifierIds: ['wbs-mod-small', 'wbs-mod-medium', 'wbs-mod-large'],
  },
  {
    id: 'wbs-inv-002',
    name: 'Hard Hat - Yellow',
    description: 'ANSI Z89.1 compliant hard hat, adjustable ratchet suspension',
    price: 85.00,
    quantity: 200,
    batchNumber: 'BATCH-2025-002',
    serialNumber: null,
    assetLocation: 'Warehouse A - Section 1',
    expiryDate: null,
    manufactureDate: new Date('2024-08-01'),
    image: '/wbs/inventory/hard-hat.jpg',
    categoryId: 'wbs-cat-safety',
    modifierIds: ['wbs-mod-bulk'],
  },
  {
    id: 'wbs-inv-003',
    name: 'Electrical Wire - 12 AWG',
    description: 'THHN/THWN-2 copper wire, 12 AWG, 500ft spool',
    price: 180.00,
    quantity: 50,
    batchNumber: 'BATCH-2025-003',
    serialNumber: null,
    assetLocation: 'Warehouse A - Section 2',
    expiryDate: null,
    manufactureDate: new Date('2024-10-01'),
    image: '/wbs/inventory/electrical-wire.jpg',
    categoryId: 'wbs-cat-electrical',
    modifierIds: [],
  },
  {
    id: 'wbs-inv-004',
    name: 'PVC Pipe - 2 inch',
    description: 'Schedule 40 PVC pipe, 10ft length',
    price: 25.00,
    quantity: 300,
    batchNumber: 'BATCH-2025-004',
    serialNumber: null,
    assetLocation: 'Warehouse B - Bay 2',
    expiryDate: null,
    manufactureDate: new Date('2024-09-15'),
    image: '/wbs/inventory/pvc-pipe.jpg',
    categoryId: 'wbs-cat-plumbing',
    modifierIds: ['wbs-mod-bulk', 'wbs-mod-express'],
  },
  {
    id: 'wbs-inv-005',
    name: 'Screwdriver Set - Phillips/Flathead',
    description: 'Professional 10-piece screwdriver set with magnetic tips',
    price: 65.00,
    quantity: 100,
    batchNumber: 'BATCH-2025-005',
    serialNumber: null,
    assetLocation: 'Warehouse A - Section 2',
    expiryDate: null,
    manufactureDate: new Date('2024-11-01'),
    image: '/wbs/inventory/screwdriver-set.jpg',
    categoryId: 'wbs-cat-tools',
    modifierIds: ['wbs-mod-express'],
  },
];

// ============== MAIN SEED FUNCTION ==============
async function main() {
  console.log('🌱 Starting comprehensive database seeding...\n');

  try {
    // Clear existing data in reverse order of dependencies
    console.log('🗑️ Clearing existing data...');

    await prisma.refreshToken.deleteMany();
    await prisma.gatePassDetail.deleteMany();
    await prisma.gatePass.deleteMany();
    await prisma.assetTag.deleteMany();
    await prisma.assetCapturePDA.deleteMany();
    await prisma.assetCapture.deleteMany();
    await prisma.verifiedAsset.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.assetTransaction.deleteMany();
    await prisma.assetVerification.deleteMany();
    await prisma.wbsInventory.deleteMany();
    await prisma.wbsModifier.deleteMany();
    await prisma.wbsCategory.deleteMany();
    await prisma.location.deleteMany();
    await prisma.fatsCategory.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.department.deleteMany();
    await prisma.assetCondition.deleteMany();
    await prisma.assetStatus.deleteMany();
    await prisma.rolesType.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    console.log('✅ Existing data cleared\n');

    // Seed Roles
    console.log('📝 Seeding Roles...');
    for (const role of rolesData) {
      await prisma.role.create({ data: role });
    }
    console.log(`   ✅ Created ${rolesData.length} roles`);

    // Seed Roles Types
    console.log('📝 Seeding Role Types...');
    for (const roleType of rolesTypeData) {
      await prisma.rolesType.create({ data: roleType });
    }
    console.log(`   ✅ Created ${rolesTypeData.length} role types`);

    // Seed Users with hashed passwords
    console.log('📝 Seeding Users...');
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          roles: {
            connect: userData.roleIds.map(id => ({ id })),
          },
        },
      });
    }
    console.log(`   ✅ Created ${usersData.length} users (including super admin and member)`);

    // Seed Departments
    console.log('📝 Seeding Departments...');
    for (const dept of departmentsData) {
      await prisma.department.create({ data: dept });
    }
    console.log(`   ✅ Created ${departmentsData.length} departments`);

    // Seed Employees
    console.log('📝 Seeding Employees...');
    for (const emp of employeesData) {
      await prisma.employee.create({ data: emp });
    }
    console.log(`   ✅ Created ${employeesData.length} employees`);

    // Seed Brands
    console.log('📝 Seeding Brands...');
    for (const brand of brandsData) {
      await prisma.brand.create({ data: brand });
    }
    console.log(`   ✅ Created ${brandsData.length} brands`);

    // Seed Locations
    console.log('📝 Seeding Locations...');
    for (const loc of locationsData) {
      await prisma.location.create({ data: loc });
    }
    console.log(`   ✅ Created ${locationsData.length} locations`);

    // Seed FATS Categories
    console.log('📝 Seeding FATS Categories...');
    for (const cat of fatsCategoriesData) {
      await prisma.fatsCategory.create({ data: cat });
    }
    console.log(`   ✅ Created ${fatsCategoriesData.length} FATS categories`);

    // Seed Asset Conditions
    console.log('📝 Seeding Asset Conditions...');
    for (const cond of assetConditionsData) {
      await prisma.assetCondition.create({ data: cond });
    }
    console.log(`   ✅ Created ${assetConditionsData.length} asset conditions`);

    // Seed Asset Statuses
    console.log('📝 Seeding Asset Statuses...');
    for (const status of assetStatusesData) {
      await prisma.assetStatus.create({ data: status });
    }
    console.log(`   ✅ Created ${assetStatusesData.length} asset statuses`);

    // Seed Asset Captures
    console.log('📝 Seeding Asset Captures...');
    for (const capture of assetCapturesData) {
      await prisma.assetCapture.create({ data: capture });
    }
    console.log(`   ✅ Created ${assetCapturesData.length} asset captures`);

    // Seed Asset Capture PDA
    console.log('📝 Seeding Asset Captures (PDA)...');
    for (const capture of assetCapturePDAData) {
      await prisma.assetCapturePDA.create({ data: capture });
    }
    console.log(`   ✅ Created ${assetCapturePDAData.length} asset captures (PDA)`);

    // Seed Asset Tags
    console.log('📝 Seeding Asset Tags...');
    for (const tag of assetTagsData) {
      await prisma.assetTag.create({ data: tag });
    }
    console.log(`   ✅ Created ${assetTagsData.length} asset tags`);

    // Seed Asset Verifications
    console.log('📝 Seeding Asset Verifications...');
    for (const ver of assetVerificationsData) {
      await prisma.assetVerification.create({ data: ver });
    }
    console.log(`   ✅ Created ${assetVerificationsData.length} asset verifications`);

    // Seed Inventory
    console.log('📝 Seeding Inventory...');
    for (const inv of inventoryData) {
      await prisma.inventory.create({ data: inv });
    }
    console.log(`   ✅ Created ${inventoryData.length} inventory records`);

    // Seed Verified Assets
    console.log('📝 Seeding Verified Assets...');
    for (const asset of verifiedAssetsData) {
      await prisma.verifiedAsset.create({ data: asset });
    }
    console.log(`   ✅ Created ${verifiedAssetsData.length} verified assets`);

    // Seed Asset Transactions
    console.log('📝 Seeding Asset Transactions...');
    for (const txn of assetTransactionsData) {
      await prisma.assetTransaction.create({ data: txn });
    }
    console.log(`   ✅ Created ${assetTransactionsData.length} asset transactions`);

    // Seed GatePass
    console.log('📝 Seeding GatePass...');
    for (const gatePass of gatePassData) {
      await prisma.gatePass.create({ data: gatePass });
    }
    console.log(`   ✅ Created ${gatePassData.length} gate passes`);

    // Seed GatePass Details
    console.log('📝 Seeding GatePass Details...');
    for (const detail of gatePassDetailData) {
      await prisma.gatePassDetail.create({ data: detail });
    }
    console.log(`   ✅ Created ${gatePassDetailData.length} gate pass details`);

    // Seed WBS Categories
    console.log('📝 Seeding WBS Categories...');
    for (const cat of wbsCategoriesData) {
      await prisma.wbsCategory.create({ data: cat });
    }
    console.log(`   ✅ Created ${wbsCategoriesData.length} WBS categories`);

    // Seed WBS Modifiers
    console.log('📝 Seeding WBS Modifiers...');
    for (const mod of wbsModifiersData) {
      await prisma.wbsModifier.create({ data: mod });
    }
    console.log(`   ✅ Created ${wbsModifiersData.length} WBS modifiers`);

    // Seed WBS Inventory with modifiers
    console.log('📝 Seeding WBS Inventory...');
    for (const inv of wbsInventoryData) {
      const { modifierIds, ...invData } = inv;
      await prisma.wbsInventory.create({
        data: {
          ...invData,
          modifiers: {
            connect: modifierIds.map(id => ({ id })),
          },
        },
      });
    }
    console.log(`   ✅ Created ${wbsInventoryData.length} WBS inventory items`);

    // Final summary
    console.log('\n📊 Seeding Summary:');
    console.log('══════════════════════════════════════════');
    const counts = {
      roles: await prisma.role.count(),
      rolesTypes: await prisma.rolesType.count(),
      users: await prisma.user.count(),
      departments: await prisma.department.count(),
      employees: await prisma.employee.count(),
      brands: await prisma.brand.count(),
      locations: await prisma.location.count(),
      fatsCategories: await prisma.fatsCategory.count(),
      assetConditions: await prisma.assetCondition.count(),
      assetStatuses: await prisma.assetStatus.count(),
      assetCaptures: await prisma.assetCapture.count(),
      assetCapturePDAs: await prisma.assetCapturePDA.count(),
      assetTags: await prisma.assetTag.count(),
      assetVerifications: await prisma.assetVerification.count(),
      inventories: await prisma.inventory.count(),
      verifiedAssets: await prisma.verifiedAsset.count(),
      assetTransactions: await prisma.assetTransaction.count(),
      gatePasses: await prisma.gatePass.count(),
      gatePassDetails: await prisma.gatePassDetail.count(),
      wbsCategories: await prisma.wbsCategory.count(),
      wbsModifiers: await prisma.wbsModifier.count(),
      wbsInventories: await prisma.wbsInventory.count(),
    };

    Object.entries(counts).forEach(([key, count]) => {
      console.log(`   ${key.padEnd(20)}: ${count}`);
    });

    console.log('══════════════════════════════════════════');
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin (→ /selection):        abdulmajid1m2@gmail.com / 123123');
    console.log('   WBS (→ /wbs/dashboard):      wbs@fats.com / 123123');
    console.log('   FATS (→ /fats-amex/dashboard): fats@fats.com / 123123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
