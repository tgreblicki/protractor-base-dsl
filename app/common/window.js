import fs from 'fs';
import R from 'ramda';
import log from 'loglevel';

/**
 * Manages the window settings.
 */
export class Window {
    /**
     * Captures browser logs and saves it to a specified (by defined global variable) folder.
     */
    static captureBrowserLogs = () => {
        const logsFolder = global.capturedBrowserLogsFolder || 'build/reports';
        browser.getCapabilities().then((capabilities) => {
            const browserName = capabilities.get('browserName');
            if (!R.equals(browserName, 'internet explorer') && !R.equals(browserName, 'firefox')) {
                const logFileName = 'consoleErrors.txt';
                const fullPath = `${(logsFolder)}/${logFileName}`;
                browser.manage().logs().get('browser')
                    .then((browserLog) => {
                        if (browserLog.length) {
                            fs.exists(logsFolder, (exists) => {
                                if (!exists) {
                                    fs.mkdir(logsFolder, () => {
                                        fs.exists(fullPath, () => {
                                            const text = browserLog.map(JSON.stringify).join(';\n');

                                            if (!exists) {
                                                fs.writeFile(fullPath, text, (err) => {
                                                    if (err) {
                                                        log.err(err);
                                                    }
                                                });
                                            } else {
                                                fs.appendFile(fullPath, text, (err) => {
                                                    if (err) {
                                                        log.err(err);
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
            }
        });
    };

    /**
     * Set the default window size.
     */
    static setDefaultSize = () =>
        browser.manage().window().setSize(
            global.defaultBrowserWidth || 768,
            global.defaultBrowserHeight || 1024
        );

    /**
     * Set the custom window size.
     *
     * @param width
     * @param height
     */
    static setSize = (width, height) =>
        browser.manage().window().setSize(width, height);

    /**
     * Refreshes the window content.
     */
    static refresh = () =>
        browser.driver.navigate().refresh();
}
