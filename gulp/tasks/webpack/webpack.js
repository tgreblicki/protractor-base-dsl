import gulp from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';
import paths from '../../utils/paths';
import webpackDevConfig from './webpack.config.dev';
import webpackGhPagesConfig from './webpack.config.ghpages';
import webpackProdConfig from './webpack.config.prod';

gulp.task('webpack-gh-pages', () =>
    gulp
        .src(`${paths.srcDir}/**/*.js`)
        .pipe(plumber())
        .pipe(webpackStream(webpackGhPagesConfig, webpack))
        .pipe(gulp.dest(paths.ghPagesDir))
);

gulp.task('webpack-development', () =>
    gulp
        .src(`${paths.srcDir}/**/*.js`)
        .pipe(plumber())
        .pipe(webpackStream(webpackDevConfig, webpack))
        .pipe(gulp.dest(paths.devDistDir))
);

gulp.task('webpack-production', () =>
    gulp
        .src(`${paths.srcDir}/**/*.js`)
        .pipe(plumber())
        .pipe(webpackStream(webpackProdConfig, webpack))
        .pipe(gulp.dest(paths.distDir))
);
