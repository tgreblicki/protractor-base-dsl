/**
 * Manages the window settings.
 */
export class Window {
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
}
