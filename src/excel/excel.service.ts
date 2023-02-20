import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';

@Injectable()
export class ExcelService {
  async downloadExcel(data: any) {
    console.log(data)
    if (!data) {
      throw new NotFoundException('No data to download.');
    }
    let rows = [];
    data.forEach((doc) => {
      rows.push(Object.values(doc));
    });
    let book = new Workbook();
    let sheet = book.addWorksheet('sheet1');
    rows.unshift(Object.keys(data[0]));
    sheet.addRows(rows);
    const file = await new Promise<string>((resolve, reject) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: `MyExcelSheet`,
          postfix: `.xlsx`,
          mode: parseInt(`0600`, 8),
        },
        async (err, file) => {
          if (err) {
            throw new BadRequestException(err);
          }
          book.xlsx
            .writeFile(file)
            .then((_) => {
              resolve(file);
            })
            .catch((err) => {
              throw new BadRequestException(err);
            });
        }
      );
    });

    return file;
  }
}

