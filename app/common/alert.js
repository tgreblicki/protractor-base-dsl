import R from 'ramda';

const doAction = (action) => browser.driver.switchTo().alert().then(action, R.F);

/**
 * Base operations with alert dialog
 */
export class Alert {
    /**
     * Accepts the alert if it is present
     */
    static accept() {
        doAction((alert) => alert.accept());
    }

    /**
     * Dismisses the alert if it is present
     */
    static dismiss() {
        doAction((alert) => alert.dismiss());
    }

    /**
     * Checks that alert dialog has a certain text.
     *
     * @param text
     */
    static textEquals(text) {
        const alertDialog = browser.switchTo().alert();
        expect(alertDialog.getText()).toEqual(text.toString());
    }
}
