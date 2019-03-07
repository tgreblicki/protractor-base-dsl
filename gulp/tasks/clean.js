import gulp from 'gulp';
import del from 'del';
import paths from '../utils/paths';

gulp.task('clean', function (cb) {
    del.sync([paths.distDir, paths.devDistDir], {force: true});
    cb();
});
