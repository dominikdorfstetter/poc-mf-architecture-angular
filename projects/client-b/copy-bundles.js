//
// This script copies over UMD bundles to the project's assets folder
// It's called by the npm script npx-build-plus:copy-assets
// If you call it manually, call it from your projects root
// > node projects/client-b//copy-bundles.js
//

const copy = require('copy');
const projectPath = 'projects/client-b';
const assetsPath = projectPath + '/src/assets';

const nodePath = 'node_modules';
console.log('Copy UMD bundles ...');

copy(`${nodePath}/@angular/*/bundles/*.umd.js`, assetsPath, {}, _ => {});
copy(`${nodePath}/rxjs/bundles/*.js`, `${assetsPath}/rxjs`, {}, _ => {});
copy(`${nodePath}/zone.js/dist/*.js`, `${assetsPath}/zone.js`, {}, _ => {});
copy(`${nodePath}/core-js/client/*.js`, `${assetsPath}/core-js`, {}, _ => {});
copy(`${nodePath}/immutable/*.js`, `${assetsPath}/immutable`, {}, _ => {});
copy(`${nodePath}/windowed-observable/dist/*.js`, `${assetsPath}/windowed-observable`, {}, _ => {});
copy(`src/app/core/*/*.ts`, projectPath + '/src/core', {}, _ => {});

