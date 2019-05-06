import env from 'gulp-env';
import gulp from 'gulp';
import {runProtractor} from './protractor';

const runLocalProtractor = (browser) => (cb) => runProtractor(cb, env.set({
    SELENIUM_TEST_BROWSER: browser
}));

gulp.task('local-chrome', runLocalProtractor('chrome'));
gulp.task('local-firefox', runLocalProtractor('firefox'));

gulp.task('e2e', gulp.series('webdriver-update', 'test-server', 'protractor'));
