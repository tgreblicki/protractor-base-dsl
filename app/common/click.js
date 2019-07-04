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
    static andExpectDisplayed(clickSelector, displayedSelector) {
        const action = () => Action.click(clickSelector);
        const condition = () => WaitCondition.displayed(displayedSelector);
        ActionUtil.repeatAction(action, condition);
    }

    /**
     *  Click on the element and expects that affected element to be not displayed
     *
     * @param clickSelector
     * @param displayedSelector
     */
    static andExpectNotDisplayed(clickSelector, displayedSelector) {
        const action = () => Action.click(clickSelector);
        const condition = () => WaitCondition.notDisplayed(displayedSelector);
        ActionUtil.repeatAction(action, condition);
    }
}
