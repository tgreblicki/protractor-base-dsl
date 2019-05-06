import path from 'path';

const projectDir = path.resolve(__dirname, '..', '..');
const distDir = path.resolve(projectDir, 'dist');
const docsDir = path.resolve(projectDir, 'docs');
const srcDir = path.resolve(projectDir, 'app');
const testDir = path.resolve(projectDir, 'test');

export default {
    nodeModulesDir: `${projectDir}/node_modules`,
    distDir,
    docsDir,
    srcDir,
    testDir
}
