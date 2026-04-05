import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Constituency from '../models/constituency.js';
import { constituencyData } from '../utils/constituencyData.js';
import connectDB from '../config/db.js';
dotenv.config({ path: "/Users/trip/git/blogMemeScripts/.env" });

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Constituency.deleteMany({});
    console.log('Cleared existing constituencies');

    // Generate fresh UUIDs for each department
    const constituenciesWithUUIDs = constituencyData.map(constituency => ({
      ...constituency,
      dept_info: constituency.dept_info.map(dept => ({
        ...dept,
        id: uuidv4()
      })),
      other_candidates: constituency.other_candidates.map(candidate => ({
        ...candidate,
        id: uuidv4()
      }))
    }));

    // Insert sample data
    const result = await Constituency.insertMany(constituenciesWithUUIDs);
    console.log(`Successfully inserted ${result.length} constituencies`);

    // Verify the data
    const count = await Constituency.countDocuments();
    console.log(`Total constituencies in database: ${count}`);

    // Display sample data
    const constituencies = await Constituency.find({}, 'area_name vidhayak_info.name dept_info.dept_name');
    // console.log('\nSample constituencies: ', constituencies );
    constituencies.forEach(constituency => {
      console.log(`- ${constituency.area_name} (${constituency.vidhayak_info.name}) (${constituency?.other_candidates})`);
      console.log(`  Departments: ${constituency.dept_info.map(dept => dept.dept_name).join(', ')}`);
    });

    console.log('\nDatabase seeding completed successfully! ', JSON.stringify(constituenciesWithUUIDs, null, 2));
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
