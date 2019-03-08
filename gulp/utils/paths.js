import path from 'path';

const projectDir = path.resolve(__dirname, '..', '..');
const distDir = path.resolve(projectDir, 'dist');
const docsDir = path.resolve(projectDir, 'docs');
const srcDir = path.resolve(projectDir, 'app');
const testsDir = path.resolve(projectDir, 'tests');

export default {
    nodeModulesDir: `${projectDir}/node_modules`,
    distDir,
    docsDir,
    projectDir,
    srcDir,
    testsDir
}
