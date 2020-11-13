import * as path from 'path';

import md5 from 'md5';

import ora from '../utils/ora.js';
import fs from '../utils/fs.js';
import directory from '../utils/directory.js';
import fontmin from '../utils/fontmin.js';

const FILE_LIST = [
  `${directory.TEMPLATE}/common/footer.ejs`,
  `${directory.TEMPLATE}/article/edit_in_github.ejs`,
];

export default async () => {
  const spinner = ora.createSpinner('正在生成通用字体...');
  let text = '0123456789-';
  for (const file of FILE_LIST) {
    text += (await fs.readFile(file)).toString();
  }
  const fontPath = `${directory.STATIC}/common_font.ttf`;
  const filename = await fontmin({
    fontPath,
    text,
    generateFilename: (data) => {
      const dataMd5 = md5(data);
      return `${directory.BUILD}/${dataMd5}${path.parse(fontPath).ext}`;
    },
  });
  spinner.succeed('通用字体已生成');
  return filename.replace(`${directory.BUILD}/`, '');
};
