import gulp from 'gulp';
import ghPages from 'gh-pages';
import paths from '../utils/paths';

gulp.task('publish', (cb) => ghPages.publish(`${paths.docsDir}`, {dotfiles: true}, cb));

gulp.task('gh-pages', gulp.series('doc', 'publish'));
