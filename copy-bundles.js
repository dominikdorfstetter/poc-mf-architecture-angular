//
// This script copies over UMD bundles to the project's assets folder
// It's called by the npm script npx-build-plus:copy-assets
// If you call it manually, call it from your projects root
// > node /copy-bundles.js
//

const copy = require('copy');
const projectPath = 'src/';
const assetsPath = projectPath + 'assets';
const nodePath = 'node_modules';

console.log('Copy UMD bundles ...');

copy('node_modules/@angular/*/bundles/*.umd.js', 'src/assets', {}, _ => {});
copy('node_modules/rxjs/bundles/*.js', 'src/assets/rxjs', {}, _ => {});
copy('node_modules/zone.js/dist/*.js', 'src/assets/zone.js', {}, _ => {});
copy('node_modules/core-js/client/*.js', 'src/assets/core-js', {}, _ => {});
copy(`${nodePath}/immutable/*.js`, `${assetsPath}/immutable`, {}, _ => {});
copy(`${nodePath}/windowed-observable/dist/*.js`, `${assetsPath}/windowed-observable`, {}, _ => {});


