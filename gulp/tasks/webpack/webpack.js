import gulp from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';
import paths from '../../utils/paths';
import webpackBuildConfig from './webpack.config.build';

gulp.task('webpack-build', () =>
    gulp
        .src(`${paths.srcDir}/**/*.js`)
        .pipe(plumber())
        .pipe(webpackStream(webpackBuildConfig, webpack))
        .pipe(gulp.dest(paths.distDir))
);
