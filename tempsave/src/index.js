const excel = require('exceljs');
const _ = require('lodash');

const filepath = `${process.cwd()}/assets/2017进口数据.xlsx`;

async function main() {
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(filepath);

    const sheet1 = workbook.getWorksheet(1);
    const tradeValues = new Map();
    sheet1.eachRow((row, rowNumber) => {
        if (rowNumber <= 1) return;
        const reporter = row.getCell(1).value;
        const partner = row.getCell(2).value;
        const value = row.getCell(4).value;
        tradeValues.set(`${reporter}-${partner}`, value);
    });

    const countries = await getCountries();

    const results = [[undefined, ...countries]];
    for (const reporter of countries) {
        const r = [reporter];
        for (const partner of countries) {
            r.push(tradeValues.get(`${reporter}-${partner}`) || 0);
        }
        results.push(r);
    }

    await saveResults(results);
}

async function getCountries(params) {
    const path = `${process.cwd()}/assets/贸易主体.xlsx`;
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(path);
    const sheet1 = workbook.getWorksheet(1);
    const countries = _.uniq(sheet1.getColumn(1).values.slice(2))
        .filter(i => i);

    return countries;
}

async function saveResults(results) {
    const resultPath = `${process.cwd()}/assets/2017进口数据-处理结果.xlsx`;
    const resultWorkbook = new excel.Workbook();
    const resultSheet = resultWorkbook.addWorksheet(`result${1}`);
    resultSheet.addRows(results)

    resultWorkbook.xlsx.writeFile(resultPath).then(function () {
        console.log('success');
    }, function (err) {
        console.log(err);
    });
}

main();
