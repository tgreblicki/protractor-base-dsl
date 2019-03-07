import gulp from 'gulp';

gulp.task('build-gh-pages', gulp.series('lint', 'webpack-gh-pages'));

gulp.task('build-development', gulp.series('lint', 'webpack-development'));

gulp.task('build-production', gulp.series('lint', 'webpack-production'));
