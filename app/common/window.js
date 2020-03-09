import fs from 'fs';
import R from 'ramda';
import log from 'loglevel';
import {ActionUtil} from './action-util';

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
                const fullPath = `${logsFolder}/${logFileName}`;
                browser.manage().logs().get('browser')
                    .then((browserLog) => {
                        if (browserLog.length) {
                            fs.access(logsFolder, fs.constants.F_OK, (err) => {
                                if (err) {
                                    fs.mkdir(logsFolder, () => {
                                        fs.access(fullPath, fs.constants.F_OK, (err1) => {
                                            const text = browserLog.map(JSON.stringify).join(';\n');

                                            if (err1) {
                                                fs.writeFile(fullPath, text, (err2) => {
                                                    if (err2) {
                                                        log.err(err2);
                                                    }
                                                });
                                            } else {
                                                fs.appendFile(fullPath, text, (err3) => {
                                                    if (err3) {
                                                        log.err(err3);
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
     * Sets the default window size.
     */
    static setDefaultSize = () =>
        Window.setSize(
            global.defaultBrowserWidth || 768,
            global.defaultBrowserHeight || 1024
        );

    /**
     * Sets the custom window size.
     *
     * @param width
     * @param height
     */
    static setSize = (width, height) => {
        const resize = (windowWidth, windowHeight) =>
            window.resizeTo(windowWidth, windowHeight);
        ActionUtil.execute(() => browser.executeScript(resize, width, height));
    };

    /**
     * Refreshes the window content.
     */
    static refresh = () =>
        browser.driver.navigate().refresh();
}
