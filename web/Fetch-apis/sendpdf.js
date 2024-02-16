import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';

const sendpdf = async (columns, data, title, recipientEmail) => {
    try {
        const pdf = new jsPDF();
        const sltemp = { title: title }

        const pageWidth = pdf.internal.pageSize.width;
        const tableWidth = 0.9 * pageWidth;
        const pageHeight = pdf.internal.pageSize.height;

        let y = 30;
        let currentPage = 1;

        // Set options for subheading
        const subheadingOptions = {
            align: 'center',
            fontSize: 18,
            fontStyle: 'italic',
        };

        // Add subheading
        pdf.text(sltemp.title, pageWidth / 2, y, subheadingOptions);
        y += 20;
        const pdfColumns = ['Key', 'Value'];
        const pdfData = [];

        data.forEach((item, index) => {
            pdfData.push([{ content: index + 1, styles: { lineWidth: 0.5, lineColor: [0, 0, 0], fillColor: [200, 200, 200], fontStyle: 'bold' } }, '']);
            for (let i = 0; i < columns.length; i++) {
                pdfData.push([columns[i], item[i]]);
            }
            if (y + 20 > pageHeight) {
                pdf.addPage();
                currentPage++;
                y = 30;
            }
        });

        const options = {
            startY: y,
            margin: { top: 20 },
            columnStyles: {
                0: { lineWidth: 0.5, lineColor: [0, 0, 0] },
                1: { lineWidth: 0.5, lineColor: [0, 0, 0] },
            },
            tableWidth,
        };

        pdf.autoTable(pdfColumns, pdfData, options);
        const pdfFilePath = 'temp.pdf';

        pdf.save(pdfFilePath);

        console.log(`PDF generated with ${currentPage} pages.`);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'service@reportexpert.app',
                pass: 'usel vvcf lpsu swob'
            }
        });

        // Send email with attachment
        await transporter.sendMail({
            from: 'service@reportexpert.app',
            to: recipientEmail,
            subject: 'PDF File Attached',
            text: 'Please find the attached PDF file.',
            attachments: [
                {
                    filename: 'temp.pdf',
                    path: pdfFilePath,
                },
            ],
        });

        console.log('Email sent successfully.');

        // Delete the local PDF file after sending the email
        await fs.unlink(pdfFilePath);
        console.log('Local PDF file deleted.');
    } catch (error) {
        console.error('Error:', error);
    }
};

export default sendpdf;
