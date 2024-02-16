const convertcsv = (activeColumn, data, title, emails) => {
    console.log(activeColumn);
    const dataArray = data.map(item => {
        const filteredItem = {};
        activeColumn.forEach((key, index) => {
            // Wrap the value in double quotes to prevent splitting by commas
            filteredItem[key] = `"${item[index]}"`;
        });
        return filteredItem;
    });

    const csvContent = `\uFEFF${activeColumn.join(',')}\n${dataArray.map(item => activeColumn.map(title => item[title] || '').join(',')).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
};

export default convertcsv;
