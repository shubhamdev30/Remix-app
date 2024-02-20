import * as XLSX from 'xlsx';

const convertexcel = (activeColumn, data, title) => {
    try {
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

        // Use XLSX.writeFile instead of XLSX.write
        XLSX.writeFile(workbook, `${title}.xlsx`, { bookSST: true, type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    } catch (error) {
        console.error('Error in convertexcel:', error);
    }
};

export default convertexcel;
