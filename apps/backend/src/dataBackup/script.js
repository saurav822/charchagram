// scripts/mongodump-to-digitalocean.js
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
// import exec from 'child_process';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from './initS3Client.js';

dotenv.config();

const execAsync = promisify(exec);
console.log('process.env.DO_SPACES_KEY, process.env.DO_SPACES_SECRET, process.env.DO_SPACES_NAME, process.env.DO_SPACES_REGION ',process.env.DO_SPACES_KEY, process.env.DO_SPACES_SECRET, process.env.DO_SPACES_NAME, process.env.DO_SPACES_REGION);
// Configuration
const config = {
  // MongoDB connection
  mongoUri: "mongodb+srv://trip:ooKoVQhrUlYfmyg9@cluster0.qowhuke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  
  // DigitalOcean Spaces
  spacesName: process.env.DO_SPACES_NAME || 'your-backup-space',
  spacesRegion: process.env.DO_SPACES_REGION || 'fra1',
  spacesAccessKey: process.env.DO_SPACES_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET,
  
  // Backup settings
  tempDir: '/tmp',
  compressionLevel: 6 // 1-9, higher = better compression
};

// Create AWS-style signature for DigitalOcean Spaces
function createAuthSignature(method, path, headers, secretKey) {
  const stringToSign = [
    method,
    headers['content-md5'] || '',
    headers['content-type'] || '',
    headers['date'] || '',
    path
  ].join('\n');
  
  return crypto
    .createHmac('sha1', secretKey)
    .update(stringToSign)
    .digest('base64');
}

// Upload file to DigitalOcean Spaces
async function uploadDirectoryToDigitalOceanBucket(dirPath, remoteBaseDir = '') {
    try {
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) {
        throw new Error(`${dirPath} is not a directory.`);
      }
  
      const items = await fs.readdir(dirPath, { withFileTypes: true });
  
      const uploadPromises = items.map(async (item) => {
        const fullPath = path.join(dirPath, item.name);
        const remoteKey = path.join(remoteBaseDir, item.name);
  
        if (item.isDirectory()) {
          // Recursively call the function for subdirectories
          return uploadDirectoryToDigitalOceanBucket(fullPath, remoteKey);
        } else if (item.isFile()) {
          const fileStream = await fs.open(fullPath, 'r');
          const fileBody = fileStream.createReadStream();
  
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: config.spacesName,
              Key: remoteKey,
              Body: fileBody,
              ACL: 'public-read', // Set access control as needed
            },
          });
  
          upload.on('httpUploadProgress', (progress) => {
            console.log(`Uploading ${remoteKey}: ${Math.round((progress.loaded / progress.total) * 100)}%`);
          });
  
          await upload.done();
          console.log(`Successfully uploaded: ${remoteKey}`);
          await fileStream.close();
        }
      });
  
      await Promise.all(uploadPromises);
      console.log(`Finished uploading directory: ${dirPath}`);
    } catch (error) {
      console.error(`Error uploading directory ${dirPath}:`, error);
      throw error;
    }
  }

// Main backup function
async function createMongoBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupName = `mongodump-${timestamp}`;
    const backupDir = path.join('./', backupName);

    
    try {
      // Step 1: Create backup directory
      await execAsync(`mkdir -p "${backupDir}"`);
      
      // Step 2: Run mongodump
      const mongodumpCmd = [
        'mongodump',
        `--uri="${config.mongoUri}"`,
        `--out="${backupDir}"`,
        '--forceTableScan',
        '--quiet'
      ].join(' ');      
      const { stdout, stderr } = await execAsync(mongodumpCmd);
      
      if (stderr && !stderr.includes('writing')) {
        console.log('⚠️  mongodump warnings:', stderr);
      }
      
      console.log('✅ mongodump completed successfully');
      
      // Step 3: Upload to DigitalOcean Spaces
      console.log('☁️  Uploading to DigitalOcean Spaces...');
      const uploadResult = await uploadDirectoryToDigitalOceanBucket(backupDir);
      
      console.log('✅ Upload successful!');
    //   console.log(`🔗 Backup URL: ${uploadResult.url}`);
      
      // Step 4: Cleanup
    //   console.log('🧹 Cleaning up temporary files...');
    //   await execAsync(`rm -rf "${backupDir}"`);
      
      console.log('');
      console.log('🎉 Backup process completed successfully!');
      console.log('📊 Summary:');
      console.log(`   • Backup name: ${backupName}`);
    //   console.log(`   • File size: ${(uploadResult.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   • Storage location: DigitalOcean Spaces`);
    //   console.log(`   • Download URL: ${uploadResult.url}`);
      
      return {
        success: true,
        backupName,
        // url: uploadResult.url,
        // size: uploadResult.size,
        timestamp
      };
      
    } catch (error) {
      console.error('');
      console.error('❌ Backup failed!');
      console.error('Error:', error.message);
      
      // Cleanup on failure
      try {
        await execAsync(`rm -rf "${backupDir}"`);
        console.log('🧹 Cleaned up temporary files');
      } catch (cleanupError) {
        console.warn('⚠️  Cleanup warning:', cleanupError.message);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

// Validate required environment variables
function validateConfig() {
  const required = [
    { key: 'DO_SPACES_ACCESS_KEY', value: config.spacesAccessKey },
    { key: 'DO_SPACES_SECRET_KEY', value: config.spacesSecretKey }
  ];
  
  const missing = required.filter(item => !item.value);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(item => console.error(`   • ${item.key}`));
    console.error('');
    console.error('Please set these in your .env file or environment variables.');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔧 MongoDB Backup to DigitalOcean Spaces');
  console.log('==========================================');
  
  validateConfig();
  
  createMongoBackup()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error.message);
      process.exit(1);
    });
}

export default createMongoBackup;