import nodemailer from 'nodemailer';

const emailcsv = async (activeColumn, data, title, recipientEmail) => {
    const dataArray = data.map(item => {
        const filteredItem = {};
        activeColumn.forEach((key, index) => {
            // Wrap the value in double quotes to prevent splitting by commas
            filteredItem[key] = `"${item[index]}"`;
        });
        return filteredItem;
    });

    const csvContent = `\uFEFF${activeColumn.join(',')}\n${dataArray.map(item => activeColumn.map(title => item[title] || '').join(',')).join('\n')}`;
    try {
        // Create a transporter using your email service credentials
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'service@reportexpert.app',
                pass: 'usel vvcf lpsu swob'
            }
        });

        // Mail options
        const mailOptions = {
            from: 'service@reportexpert.app',
            to: recipientEmail,
            subject: `CSV File - ${title}`,
            text: 'Attached is the CSV file.',
            attachments: [
                {
                    filename: `${title}.csv`,
                    content: csvContent,
                },
            ],
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default emailcsv
