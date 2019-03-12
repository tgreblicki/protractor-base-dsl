import {Action} from './action';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';
import {Expectation} from './expectation';

const simulate = (simulateFunction, selector) => {
    const code = (element) =>
        simulateFunction(element);
    return Action.executeVoidScript(code, ElementUtil.elementFinder(selector));
};

/**
 * Base DSL actions for React components
 */
export class ReactAction {
    /**
     * Leaves the focus from the React element.
     *
     * @param selector
     */
    static blur(selector) {
        return simulate(ReactTestUtils.Simulate.blur, selector);
    }

    /**
     * Focuses on a certain React element.
     * Mainly has to be used for input fields.
     *
     * @param selector
     */
    static focus(selector) {
        return simulate(ReactTestUtils.Simulate.focus, selector);
    }

    /**
     * Leaves the hover from the React component.
     *
     * @param selector
     */
    static mouseLeave(selector) {
        return simulate(ReactTestUtils.Simulate.mouseLeave, selector);
    }

    /**
     * Sets the specified date in date picker.
     *
     * @param selector
     * @param dateValue
     */
    static setDatePickerValue(selector, dateValue) {
        const selectedDateSelector = '.react-datepicker__day--selected';
        const setDate = (element, value) =>
            ReactTestUtils.Simulate.change(element, {target: {value: value}});

        const expectationFunction = (dateFormat) =>
            Action.executeVoidScript(setDate, ElementUtil.elementFinder(selector), dateValue.format(dateFormat));
        Expectation.withLocaleDate(expectationFunction);

        ReactAction.reactFocus(selector);
        Expectation.displayed(selectedDateSelector);

        const action = () => Action.click(selectedDateSelector);
        const condition = () => Expectation.notPresent(selectedDateSelector);
        ActionUtil.repeatAction(action, condition);

        ReactAction.blur(selector);
        ReactAction.mouseLeave(selector);
    }
}
