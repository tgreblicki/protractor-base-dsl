import gulp from 'gulp';

gulp.task('build-gh-pages', gulp.series('lint', 'webpack-gh-pages'));

gulp.task('build-dist', gulp.series('lint', 'webpack-build'));
