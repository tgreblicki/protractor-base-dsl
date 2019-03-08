import gulp from 'gulp';
import jsdoc from 'gulp-jsdoc3';
import paths from '../utils/paths';
import config from '../../jsdoc.json';

gulp.task('doc', function (cb) {
    gulp.src(['README.md', `${paths.srcDir}/app/**/*.js`], {read: false})
        .pipe(jsdoc(config, cb));
});
