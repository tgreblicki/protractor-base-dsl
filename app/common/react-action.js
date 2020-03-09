import {Action} from './action';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';
import {Expectation} from './expectation';
import {WaitCondition} from './wait-condition';

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
        function code(element) {
            ReactTestUtils.Simulate.blur(element);
        }
        return Action.executeVoidScript(code, ElementUtil.elementFinder(selector));
    }

    /**
     * Focuses on a certain React element.
     * Mainly has to be used for input fields.
     *
     * @param selector
     */
    static focus(selector) {
        function code(element) {
            ReactTestUtils.Simulate.focus(element);
        }
        return Action.executeVoidScript(code, ElementUtil.elementFinder(selector));
    }

    /**
     * Performs a custom keydown event on a certain element.
     *
     * @param selector
     * @param keyCode
     */
    static keyDown = (selector, keyCode) => {
        const sendKey = (element, code) =>
            ReactTestUtils.Simulate.keyDown(element, {charCode: code, keyCode: code, which: code});
        return Action.executeVoidScript(sendKey, ElementUtil.elementFinder(selector), keyCode);
    };

    /**
     * Performs a custom keyPress event on a certain element.
     *
     * @param selector
     * @param keyCode
     */
    static keyPress = (selector, keyCode) => {
        const sendKey = (element, code) =>
            ReactTestUtils.Simulate.keyPress(element, {charCode: code, keyCode: code, which: code});
        return Action.executeVoidScript(sendKey, ElementUtil.elementFinder(selector), keyCode);
    };

    /**
     * Leaves the hover from the React component.
     *
     * @param selector
     */
    static mouseLeave(selector) {
        function code(element) {
            ReactTestUtils.Simulate.mouseLeave(element);
        }
        return Action.executeVoidScript(code, ElementUtil.elementFinder(selector));
    }

    /**
     * Hovers the specified React component.
     *
     * @param selector
     */
    static mouseMove(selector) {
        function code(element) {
            ReactTestUtils.Simulate.mouseMove(element);
        }
        return Action.executeVoidScript(code, ElementUtil.elementFinder(selector));
    }

    /**
     * Sets the specified date in date picker.
     *
     * This method is created fo testing react-datepicker library.
     *
     * @param selector
     * @param dateValue
     * @param blurAction a function if specified to be executed before focusing back to a component. That's required
     * to apply the value.
     */
    static setDatePickerValue(selector, dateValue, blurAction) {
        const selectedDateSelector = '.react-datepicker__day--selected';
        const setDate = (element, value) =>
            ReactTestUtils.Simulate.change(element, {target: {value}});

        const expectationFunction = (dateFormat) =>
            Action.executeVoidScript(setDate, ElementUtil.elementFinder(selector), dateValue.format(dateFormat));
        Expectation.withLocaleDate(expectationFunction);

        if (blurAction) {
            blurAction();
        }
        ReactAction.focus(selector);
        Expectation.displayed(selectedDateSelector);

        const action = () => Action.click(selectedDateSelector);
        const condition = () => WaitCondition.notPresent(selectedDateSelector);
        ActionUtil.repeatAction(action, condition);

        ReactAction.blur(selector);
        ReactAction.mouseLeave(selector);
    }

    static specialClick(selector) {
        Expectation.displayed(selector);
        const sendKey = (element) =>
            ReactTestUtils.Simulate.click(element);
        return Action.executeVoidScript(sendKey, ElementUtil.elementFinder(selector));
    }
}
