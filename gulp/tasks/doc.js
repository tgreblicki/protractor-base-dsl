import gulp from 'gulp';
import run from 'gulp-run-command';

gulp.task('doc', run('jsdoc --configure .jsdoc.json'));
