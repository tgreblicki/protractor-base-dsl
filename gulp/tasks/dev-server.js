import gulp from 'gulp';

gulp.task('test-server', (cb) => {
    const spawn = require('child_process').exec;
    const process = spawn('yarn storybook');

    process.stdout.on('data', (data) => console.log('stdout: ' + data));
    process.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        cb();
    });
    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        cb();
    });
});
