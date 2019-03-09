/**
 * Manages the window settings.
 */
export class Window {
    /**
     * Set the default window size.
     */
    static setDefaultSize = () =>
        browser.manage().window().setSize(global.defaultBrowserWidth, global.defaultBrowserHeight);

    /**
     * Set the custom window size.
     *
     * @param width
     * @param height
     */
    static setSize = (width, height) =>
        browser.manage().window().setSize(width, height);
}
