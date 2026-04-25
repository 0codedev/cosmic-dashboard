const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = process.argv[2];

if (!pdfPath) {
    console.error('Please provide a PDF file path');
    process.exit(1);
}

console.log(`Attempting to read file: ${pdfPath}`);
try {
    const stats = fs.statSync(pdfPath);
    console.log(`File size: ${stats.size} bytes`);

    let dataBuffer = fs.readFileSync(pdfPath);
    console.log('File read into buffer');

    pdf(dataBuffer).then(function (data) {
        console.log('PDF parsed successfully');
        console.log('Number of pages:', data.numpages);
        console.log('Info:', JSON.stringify(data.info));
        console.log('----------------TEXT START----------------');
        console.log(data.text.slice(0, 2000)); // Print first 2000 chars only for test
        console.log('----------------TEXT END----------------');
    }).catch(function (error) {
        console.error('Error in pdf-parse promise:', error);
    });

} catch (e) {
    console.error('File system error:', e);
}
