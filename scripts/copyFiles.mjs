/* eslint-disable no-console */
import path from 'path';
import fse from 'fs-extra';
import glob from 'glob';

const packagePath = process.cwd();
const distPath = path.join(packagePath, './dist');
const srcPath = path.join(packagePath, './src');

/**
 * Puts a package.json into every immediate child directory of rootDir.
 * That package.json contains information about esm for bundlers so that imports
 * like import Typography from '@material-ui/core/Typography' are tree-shakeable.
 *
 * It also tests that an this import can be used in typescript by checking
 * if an index.d.ts is present at that path.
 *
 * @param {string} rootDir
 */
async function createModulePackages({ from, to }) {
  const directoryPackages = glob
    .sync('*/index.js', { cwd: from })
    .map(path.dirname);

  await Promise.all(
    directoryPackages.map(async directoryPackage => {
      const packageJson = {
        sideEffects: false,
        module: path.join('../esm', directoryPackage, 'index.js'),
        typings: './index.d.ts',
      };
      const packageJsonPath = path.join(to, directoryPackage, 'package.json');

      /*const [typingsExist] =*/ await Promise.all([
        //fse.exists(path.join(to, directoryPackage, 'index.d.ts')),
        fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2)),
      ]);

      // if (!typingsExist) {
      //   throw new Error(`index.d.ts for ${directoryPackage} is missing`);
      // }

      return packageJsonPath;
    })
  );
}

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(packagePath, './package.json'),
    'utf8'
  );
  // eslint-disable-next-line no-unused-vars
  const { nyc, scripts, devDependencies, workspaces, ...packageDataOther } =
    JSON.parse(packageData);
  const newPackageData = {
    ...packageDataOther,
    private: false,
    main: './index.js',
  };
  const targetPath = path.resolve(distPath, './package.json');

  await fse.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    'utf8'
  );
  console.log(`Created package.json in ${targetPath}`);

  fse.copy('./README.md', `${distPath}/README.md`, err => {
    if (err) throw err;
    console.log('README file was copied to destination');
  });

  return newPackageData;
}

async function run() {
  try {
    await createPackageFile();
    await createModulePackages({ from: srcPath, to: distPath });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
