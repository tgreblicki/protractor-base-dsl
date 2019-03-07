import R from 'ramda';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import paths from '../utils/paths';

const lintStream = (stream) => stream
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

gulp.task('lint', () => lintStream(gulp.src(`${paths.srcDir}/**/*.js`)));

gulp.task('watch-lint', () => {
    const watch = (glob, taskName) => gulp.watch(glob, gulp.parallel(taskName)).on('error', R.F);
    watch(`${paths.srcDir}/**/*.js`, 'lint');
});
