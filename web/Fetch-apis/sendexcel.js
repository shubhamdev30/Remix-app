import * as XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';

const emailexcel = async (activeColumn, data, title, recipientEmail) => {
    try {
        // Convert data to Excel
        const dataArray = data.map(item => {
            const filteredItem = {};
            activeColumn.forEach((key, index) => {
                filteredItem[key] = item[index];
            });
            return filteredItem;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataArray);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

        // Save the Excel file locally
        const filePath = `${title}.xlsx`;
        XLSX.writeFile(workbook, filePath, { bookSST: true, type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

        // Create a nodemailer transporter
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
            subject: 'Excel File Attached',
            text: 'Please find the attached Excel file.',
            attachments: [
                {
                    filename: `${title}.xlsx`,
                    path: filePath,
                },
            ],
        });

        console.log('Email sent successfully.');

        // Delete the local file after sending the email
        await fs.unlink(filePath);
        console.log('Local file deleted.');
    } catch (error) {
        console.error('Error:', error);
    }
};

export default emailexcel;
