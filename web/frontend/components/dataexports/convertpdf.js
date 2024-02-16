import jsPDF from 'jspdf';
import 'jspdf-autotable';

const convertpdf = (columns, data, dte) => {
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt' });
    pdf.setFont('calibri'); 

    const sltemp = { title: 'Sample Subheading' };

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

    // Set options for small heading
    const smallHeadingOptions = {
        align: 'center',
        fontSize: 8,
        fontStyle: 'normal',
    };

    // Add subheading
    pdf.text(sltemp.title, pageWidth / 2, y, subheadingOptions);
    y += 20;

    // Add small heading
    pdf.text(`${dte.start} - ${dte.end}`, pageWidth / 2, y, smallHeadingOptions);
    y += 20;

    // Define table columns
    const pdfColumns = ['Key', 'Value'];

    // Define an array to hold the table data
    const pdfData = [];

    data.forEach((item, index) => {
        pdfData.push([{ content: (index + 1).toString(), styles: { lineWidth: 0.5, lineColor: [0, 0, 0], fillColor: [200, 200, 200], fontStyle: 'normal',font: 'Roboto-Regular' } }, '']);
        for (let i = 0; i < columns.length; i++) {
            console.log(item[i].toString())
            pdfData.push([columns[i], item[i].toString()]);
        }
        if (y + 20 > pageHeight) {
            pdf.addPage();
            currentPage++;
            y = 30;
        }
    });
    console.log(pdfData)

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

    // Generate a temporary file path for the PDF
    const pdfFilePath = 'temp.pdf';

    // Save the PDF to a file
    pdf.save(pdfFilePath);

    console.log(`PDF generated with ${currentPage} pages.`);
    return pdfFilePath;
};

export default convertpdf;
