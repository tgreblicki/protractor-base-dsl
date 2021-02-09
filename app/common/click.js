import {Action} from './action';
import {ActionUtil} from './action-util';
import {WaitCondition} from './wait-condition';

/**
 * Utility method to work with clicking.
 */
export class Click {
    /**
     *  Click on the element and expects that affected element to be displayed
     *
     * @param clickSelector
     * @param displayedSelector
     */
    static async andExpectDisplayed(clickSelector, displayedSelector) {
        const action = async () => await Action.click(clickSelector);
        const condition = async () => await WaitCondition.displayed(displayedSelector);
        await ActionUtil.repeatAction(action, condition);
    }

    /**
     *  Click on the element and expects that affected element to be not displayed
     *
     * @param clickSelector
     * @param displayedSelector
     */
    static async andExpectNotDisplayed(clickSelector, displayedSelector) {
        const action = async () => await Action.click(clickSelector);
        const condition = async () => await WaitCondition.notDisplayed(displayedSelector);
        await ActionUtil.repeatAction(action, condition);
    }
}
