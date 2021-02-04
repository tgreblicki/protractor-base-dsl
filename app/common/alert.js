import R from 'ramda';

const doAction = (action) => browser.driver.switchTo().alert().then(action, R.F);

/**
 * Base operations with alert dialog
 */
export class Alert {
    /**
     * Accepts the alert if it is present
     */
    static async accept() {
        await doAction((alert) => alert.accept());
    }

    /**
     * Dismisses the alert if it is present
     */
    static async dismiss() {
        await doAction((alert) => alert.dismiss());
    }

    /**
     * Checks that alert dialog has a certain text.
     *
     * @param text
     */
    static async textEquals(text) {
        const alertDialog = await browser.switchTo().alert();
        expect(await alertDialog.getText()).toEqual(text.toString());
    }
}
