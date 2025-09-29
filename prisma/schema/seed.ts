import { PrismaClient } from '@prisma/client';
import { gatePassData, gatePassDetailData } from './gatePass';

const prisma = new PrismaClient() as any;

async function seedGatePass() {
  try {
    console.log('🌱 Starting GatePass seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing GatePass data...');
    await prisma.gatePassDetail.deleteMany();
    await prisma.gatePass.deleteMany();

    // Insert GatePass records
    console.log('📝 Inserting GatePass records...');
    for (const gatePass of gatePassData) {
      await prisma.gatePass.create({
        data: {
          id: gatePass.id,
          gatePassNo: gatePass.gatePassNo,
          gatePassType: gatePass.gatePassType,
          gatePassDate: gatePass.gatePassDate,
          returnable: gatePass.returnable,
          sourceSite: gatePass.sourceSite,
          destinationSite: gatePass.destinationSite,
          sender: gatePass.sender,
          receiver: gatePass.receiver,
          driverName: gatePass.driverName,
          vehicleNo: gatePass.vehicleNo,
          vehicleCompany: gatePass.vehicleCompany,
          preparedBy: gatePass.preparedBy,
          hodName: gatePass.hodName,
          hodStatus: gatePass.hodStatus,
          hodDate: gatePass.hodDate,
          authorizedBy: gatePass.authorizedBy,
          authorizedStatus: gatePass.authorizedStatus,
          authorizedDate: gatePass.authorizedDate,
          remarks: gatePass.remarks,
          qrcode: gatePass.qrcode,
        },
      });
    }

    console.log(`✅ Inserted ${gatePassData.length} GatePass records`);

    // Insert GatePassDetail records
    console.log('📋 Inserting GatePassDetail records...');
    for (const detail of gatePassDetailData) {
      await prisma.gatePassDetail.create({
        data: {
          srNo: detail.srNo,
          itemCode: detail.itemCode,
          description: detail.description,
          uom: detail.uom,
          quantity: detail.quantity,
          remarks: detail.remarks,
          gatePassId: detail.gatePassId,
        },
      });
    }

    console.log(`✅ Inserted ${gatePassDetailData.length} GatePassDetail records`);

    // Verify the data
    const gatePassCount = await prisma.gatePass.count();
    const gatePassDetailCount = await prisma.gatePassDetail.count();

    console.log('📊 Final counts:');
    console.log(`   GatePass records: ${gatePassCount}`);
    console.log(`   GatePassDetail records: ${gatePassDetailCount}`);

    // Show some sample data with relations
    console.log('\n📋 Sample GatePass with details:');
    const sampleGatePass = await prisma.gatePass.findFirst({
      include: {
        details: true,
      },
    });

    if (sampleGatePass) {
      console.log(`   GatePass No: ${sampleGatePass.gatePassNo}`);
      console.log(`   Sender: ${sampleGatePass.sender}`);
      console.log(`   Receiver: ${sampleGatePass.receiver}`);
      console.log(`   Details count: ${sampleGatePass.details.length}`);
      
      if (sampleGatePass.details.length > 0) {
        console.log(`   First item: ${sampleGatePass.details[0].description} (${sampleGatePass.details[0].quantity} ${sampleGatePass.details[0].uom})`);
      }
    }

    console.log('\n🎉 GatePass seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding GatePass data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedGatePass().then(value => {
    console.log("Database seeding completed");
}).catch(error => {
    console.log("Failed to seed database");
    console.error(error);
    process.exit(1);
})

export default seedGatePass;