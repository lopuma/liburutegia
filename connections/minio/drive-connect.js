function toLowerCase(str) {
    return str.toLowerCase();
}
const config = require('../../src/config');
const disks = toLowerCase(config.FILESYSTEM_DRIVER || 'local');
let driveClient;
if (disks === 'minio') {
    const Minio = require('minio');
    const { minioDatabase } = require('./minio-keys');
    driveClient = new Minio.Client(minioDatabase);
} else if (disks === 'aws') {
    const { S3Client } = require("@aws-sdk/client-s3");
    const { s3Database } = require('./s3-keys');
    driveClient = new S3Client(s3Database);
} else {
    driveClient = "local"
}

module.exports = { driveClient, disks };
