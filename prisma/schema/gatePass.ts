// GatePass seed data
export interface GatePassData {
  id: string;
  gatePassNo: string;
  gatePassType: string;
  gatePassDate: Date;
  returnable: boolean;
  sourceSite: string;
  destinationSite: string;
  sender: string;
  receiver: string;
  driverName: string;
  vehicleNo: string;
  vehicleCompany: string;
  preparedBy: string;
  hodName: string;
  hodStatus: string;
  hodDate: Date;
  authorizedBy: string;
  authorizedStatus: string;
  authorizedDate: Date;
  remarks: string;
  qrcode: string;
}

export interface GatePassDetailData {
  srNo: number;
  itemCode: string;
  description: string;
  uom: string;
  quantity: number;
  remarks: string;
  gatePassId: string;
}

export const gatePassData: GatePassData[] = [
  {
    id: 'cm2abc001def',
    gatePassNo: 'AQPCI-2025090001',
    gatePassType: 'Internal',
    gatePassDate: new Date('2025-09-20T04:37:05.000Z'),
    returnable: true,
    sourceSite: 'Site-3',
    destinationSite: 'Site-5',
    sender: 'Abdul Matin',
    receiver: 'Rene Divino',
    driverName: 'Rashid',
    vehicleNo: 'ABC-793',
    vehicleCompany: 'AQPCI',
    preparedBy: 'Hassan Raza',
    hodName: 'Muataz Ali',
    hodStatus: 'VERIFIED',
    hodDate: new Date('2025-09-25T07:11:32.000Z'),
    authorizedBy: 'Malek Mardini',
    authorizedStatus: 'AUTHORIZED',
    authorizedDate: new Date('2025-09-26T08:10:25.000Z'),
    remarks: 'Dummy remarks',
    qrcode: 'QR001'
  },
  {
    id: 'cm2abc002def',
    gatePassNo: 'AQPCI-2025090002',
    gatePassType: 'Internal',
    gatePassDate: new Date('2025-09-27T23:53:53.000Z'),
    returnable: false,
    sourceSite: 'Site-2',
    destinationSite: 'Site-5',
    sender: 'Abdul Matin',
    receiver: 'Ali Zain',
    driverName: 'Ahmed',
    vehicleNo: 'ABC-699',
    vehicleCompany: 'AQPCI',
    preparedBy: 'Zaheer Nazir',
    hodName: 'Mohammed Fahad',
    hodStatus: 'VERIFIED',
    hodDate: new Date('2025-09-21T19:43:11.000Z'),
    authorizedBy: 'Malek Mardini',
    authorizedStatus: 'AUTHORIZED',
    authorizedDate: new Date('2025-09-26T01:39:08.000Z'),
    remarks: 'Dummy remarks',
    qrcode: 'QR002'
  },
  {
    id: 'cm2abc003def',
    gatePassNo: 'AQPCI-2025090003',
    gatePassType: 'Internal',
    gatePassDate: new Date('2025-09-21T11:38:42.000Z'),
    returnable: false,
    sourceSite: 'Site-2',
    destinationSite: 'Site-4',
    sender: 'Khalid Ali',
    receiver: 'Rene Divino',
    driverName: 'Omar',
    vehicleNo: 'ABC-719',
    vehicleCompany: 'AQPCI',
    preparedBy: 'Zaheer Nazir',
    hodName: 'Saad Al Harbi',
    hodStatus: 'VERIFIED',
    hodDate: new Date('2025-09-21T19:20:21.000Z'),
    authorizedBy: 'Fahad Al Qahtani',
    authorizedStatus: 'AUTHORIZED',
    authorizedDate: new Date('2025-09-24T18:10:15.000Z'),
    remarks: 'Dummy remarks',
    qrcode: 'QR003'
  },
  {
    id: 'cm2abc004def',
    gatePassNo: 'AQPCI-2025090004',
    gatePassType: 'Internal',
    gatePassDate: new Date('2025-09-27T14:06:46.000Z'),
    returnable: true,
    sourceSite: 'Site-2',
    destinationSite: 'Site-4',
    sender: 'Zaheer Ahmed',
    receiver: 'Rene Divino',
    driverName: 'Rashid',
    vehicleNo: 'ABC-673',
    vehicleCompany: 'AQPCI',
    preparedBy: 'Imran Khan',
    hodName: 'Mohammed Fahad',
    hodStatus: 'VERIFIED',
    hodDate: new Date('2025-09-25T04:01:33.000Z'),
    authorizedBy: 'Fahad Al Qahtani',
    authorizedStatus: 'AUTHORIZED',
    authorizedDate: new Date('2025-09-24T18:29:29.000Z'),
    remarks: 'Dummy remarks',
    qrcode: 'QR004'
  },
  {
    id: 'cm2abc005def',
    gatePassNo: 'AQPCI-2025090005',
    gatePassType: 'Internal',
    gatePassDate: new Date('2025-09-27T16:00:52.000Z'),
    returnable: true,
    sourceSite: 'Site-3',
    destinationSite: 'Site-4',
    sender: 'Khalid Ali',
    receiver: 'Ali Zain',
    driverName: 'Ahmed',
    vehicleNo: 'ABC-534',
    vehicleCompany: 'AQPCI',
    preparedBy: 'Hassan Raza',
    hodName: 'Muataz Ali',
    hodStatus: 'VERIFIED',
    hodDate: new Date('2025-09-20T23:29:36.000Z'),
    authorizedBy: 'Malek Mardini',
    authorizedStatus: 'AUTHORIZED',
    authorizedDate: new Date('2025-09-24T14:45:17.000Z'),
    remarks: 'Dummy remarks',
    qrcode: 'QR005'
  }
];

export const gatePassDetailData: GatePassDetailData[] = [
  {
    srNo: 1,
    itemCode: 'ITEM-6036',
    description: 'Pipe Coating',
    uom: 'KG',
    quantity: 42,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc001def'
  },
  {
    srNo: 1,
    itemCode: 'ITEM-4884',
    description: 'Pump Motor',
    uom: 'LTR',
    quantity: 49,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc002def'
  },
  {
    srNo: 2,
    itemCode: 'ITEM-3838',
    description: 'Pipe Coating',
    uom: 'LTR',
    quantity: 18,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc002def'
  },
  {
    srNo: 1,
    itemCode: 'ITEM-8536',
    description: 'Sigma Gard CSF',
    uom: 'KG',
    quantity: 31,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc003def'
  },
  {
    srNo: 2,
    itemCode: 'ITEM-7507',
    description: 'Valve',
    uom: 'PCS',
    quantity: 17,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc003def'
  },
  {
    srNo: 3,
    itemCode: 'ITEM-9471',
    description: 'Pump Motor',
    uom: 'LTR',
    quantity: 24,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc003def'
  },
  {
    srNo: 4,
    itemCode: 'ITEM-4820',
    description: 'Sigma Gard CSF',
    uom: 'PCS',
    quantity: 23,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc003def'
  },
  {
    srNo: 1,
    itemCode: 'ITEM-8521',
    description: 'Valve',
    uom: 'KG',
    quantity: 41,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc004def'
  },
  {
    srNo: 2,
    itemCode: 'ITEM-9641',
    description: 'Pump Motor',
    uom: 'PCS',
    quantity: 3,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc004def'
  },
  {
    srNo: 3,
    itemCode: 'ITEM-3794',
    description: 'Valve',
    uom: 'KG',
    quantity: 31,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc004def'
  },
  {
    srNo: 4,
    itemCode: 'ITEM-3610',
    description: 'Sigma Gard CSF',
    uom: 'KG',
    quantity: 38,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc004def'
  },
  {
    srNo: 1,
    itemCode: 'ITEM-2414',
    description: 'Valve',
    uom: 'KG',
    quantity: 5,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc005def'
  },
  {
    srNo: 2,
    itemCode: 'ITEM-1022',
    description: 'Pump Motor',
    uom: 'LTR',
    quantity: 38,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc005def'
  },
  {
    srNo: 3,
    itemCode: 'ITEM-6731',
    description: 'Pipe Coating',
    uom: 'KG',
    quantity: 49,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc005def'
  },
  {
    srNo: 4,
    itemCode: 'ITEM-1052',
    description: 'Valve',
    uom: 'LTR',
    quantity: 45,
    remarks: 'Detail remarks',
    gatePassId: 'cm2abc005def'
  }
];
