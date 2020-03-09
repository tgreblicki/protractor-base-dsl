import gulp from 'gulp';

gulp.task('build-dist', gulp.series('clean', 'lint', 'webpack-build'));
