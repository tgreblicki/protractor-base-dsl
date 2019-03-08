import gulp from 'gulp';

gulp.task('build-dist', gulp.series('lint', 'webpack-build'));
