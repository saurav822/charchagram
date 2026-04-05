import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function restoreMongoDB() {
    try {
        const location = "/Users/trip/git/charchamanchNodejs/mongodump-2025-09-27T15-44-49";
        const mongoUri = "mongodb+srv://trip:ooKoVQhrUlYfmyg9@cluster0.qowhuke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        
        console.log('🚀 Starting MongoDB restore process...');
        console.log(`📂 Restore from: ${location}`);
        console.log(`🔗 Database: ${mongoUri.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@')}`);
        console.log('');
        
        // Check if backup directory exists
        const fs = await import('fs');
        if (!fs.existsSync(location)) {
            throw new Error(`Backup directory not found: ${location}`);
        }
        
        const command = `mongorestore --uri="${mongoUri}" --drop "${location}"`;
        
        console.log('💾 Running mongorestore...');
        console.log('   Command:', command.replace(mongoUri, 'mongodb+srv://***:***@***'));
        
        const { stdout, stderr } = await execAsync(command);
        
        if (stdout) {
            console.log('📄 Output:', stdout);
        }
        
        if (stderr && !stderr.includes('done')) {
            console.error('⚠️  Warnings/Errors:', stderr);
        }
        
        console.log('');
        console.log('✅ MongoDB restore completed successfully!');
        
    } catch (error) {
        console.error('');
        console.error('❌ Restore failed!');
        console.error('Error:', error.message);
        
        if (error.stderr) {
            console.error('stderr:', error.stderr);
        }
        
        if (error.stdout) {
            console.error('stdout:', error.stdout);
        }
    }
}

restoreMongoDB();

