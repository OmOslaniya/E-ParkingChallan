const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const Docxtemplater = require('docxtemplater');


const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
router.use('/download_receipt', express.static(path.join(__dirname, '../../fsd_client/public')));
router.post('/download_receipt/template.docx', async(req, res) => {
    const { mdate, pdate, name } = req.body;

    const templatePath = path.join(__dirname, '../../fsd_client/public', 'template.docx');
    const outputPath = path.join(__dirname, '../../fsd_client/public', 'output.docx');

    try {
        // Read the Word template asynchronously
        const contentBuffer = await fs.readFile(templatePath);

        // Create a docxtemplater instance
        const doc = new Docxtemplater();
        doc.loadZip(contentBuffer);

        // Fetch details from the request body
        const details = {
            memodate: mdate,
            paydate: pdate,
            person_name: name,
        };

        // Set the template data
        doc.setData(details);

        // Render the document (replace placeholders with actual data)
        doc.render();

        // Save the output document
        const updatedBuffer = doc.getZip().generate({ type: 'nodebuffer' });
        await fs.writeFile(outputPath, updatedBuffer);

        // Send the generated document to the client
        res.download(outputPath, 'output.docx', (err) => {
            // Cleanup: Remove the generated document after it's sent
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;