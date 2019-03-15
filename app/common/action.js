import R from 'ramda';
import KeyCodes from 'keycode-js';
import {code as dragAndDrop} from 'xl-html-dnd';
import {Expectation} from './expectation';
import {JQueryAction} from './jquery-action';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';

const bulkOfClicks = (action, selectors) => {
    for (const selector of selectors) {
        action(selector);
    }
};

/**
 * Base DSL actions
 */
export class Action {
    /**
     * Performs a bulk of Ctrl clicks.
     *
     * @param selectors
     */
    static bulkCtrlKey(selectors) {
        return bulkOfClicks(Action.ctrlClick, selectors);
    }

    /**
     * Performs a bulk of Shift clicks.
     *
     * @param selectors
     */
    static bulkShiftKey(selectors) {
        return bulkOfClicks(Action.shiftClick, selectors);
    }

    /**
     * Clear text in found element.
     *
     * @param selector
     */
    static clearText(selector) {
        const element = ElementUtil.elementFinder(selector);
        element.getAttribute('value').then((value) => {
            if (value) {
                R.times(() => element.sendKeys(protractor.Key.BACK_SPACE), value.length);
            }
        });
        return Expectation.emptyText(selector);
    }

    /**
     * Clicks on element if it's clickable.
     * For example button can be disabled and click won't occur, you need to fetch that unaccepted behavior earlier.
     *
     * @param {Object} selector CSS Selector or Protractor Element
     */
    static click(selector) {
        Expectation.clickable(selector);
        ActionUtil.expectExecutedAction(() => ElementUtil.elementFinder(selector).click());
        browser.sleep(500);
    }

    /**
     * Clicks on element nevertheless if it's clickable or not. You can use it when
     * element is appeared only for some period of time and then disappears.
     * As e2e especially for IE is slow it can happen that Protractor can miss to click on that element during
     * that period of time. For example it can be used to close timed notification messages to proceed further,
     * as toastr might hide some elements which you want to click.
     *
     * @param {Object} selector CSS Selector or Protractor Element
     */
    static clickIfClickable(selector) {
        const finder = ElementUtil.elementFinder(selector);
        return expect(ActionUtil.execute(() => finder.click().then(R.F, R.F)));
    }

    /**
     * Performs an enter on a certain element.
     *
     * @param selector
     */
    static clickEnter(selector) {
        return Action.keyPress(selector, KeyCodes.KEY_RETURN);
    }

    /**
     * Performs an escape on a certain element.
     *
     * @param selector
     */
    static clickEscape(selector) {
        return Action.keyPress(selector, KeyCodes.KEY_ESCAPE);
    }

    /**
     * Performs double click on a certain element.
     *
     * @param selector
     */
    static doubleClick(selector) {
        Expectation.displayed(selector);
        const doubleClick = (element) => bean.fire(element, 'dblclick');
        return Action.executeVoidScript(doubleClick, ElementUtil.elementFinder(selector));
    }

    /**
     * Performs Ctrl click on a certain element.
     *
     * @param selector
     */
    static ctrlClick(selector) {
        return JQueryAction.click(selector, {ctrlKey: true});
    }

    /**
     * Executes native JavaScript function.
     *
     * @param {function} scriptFunction
     * @param {array} scriptArguments
     */
    static executeVoidScript(scriptFunction, ...scriptArguments) {
        const script = `(${scriptFunction}).apply(null, arguments);`;
        return ActionUtil.expectExecutedAction(() => browser.executeScript(script, ...scriptArguments));
    }

    /**
     * Focuses on a certain element.
     * Mainly has to be used for input fields.
     *
     * @param selector
     */
    static focus(selector) {
        Expectation.clickable(selector);
        return ActionUtil.expectExecutedAction(() => ElementUtil.elementFinder(selector).focus());
    }

    /**
     * Hovers on a certain element.
     *
     * @param selector
     */
    static hover(selector) {
        Expectation.displayed(selector);
        const hover = (element) => bean.fire(element, 'mouseover');
        Action.executeVoidScript(hover, ElementUtil.elementFinder(selector));
    }

    /**
     * Clicks on element by using native JavaScript execution.
     *
     * @param {Object} selector CSS Selector or Protractor Element
     */
    static jsClick(selector) {
        Expectation.displayed(selector);
        Expectation.clickable(selector);

        function clickIt() {
            arguments[0].click(); // eslint-disable-line prefer-rest-params
        }

        return Action.executeVoidScript(clickIt, ElementUtil.elementFinder(selector));
    }

    /**
     * Drag the element and drops it to a certain area.
     *
     * @param fromElement
     * @param toElement
     */
    static jsDragAndDrop(fromElement, toElement) {
        Expectation.displayed(fromElement);
        Expectation.displayed(toElement);

        const draggedItem = ElementUtil.elementFinder(fromElement);
        const droppable = ElementUtil.elementFinder(toElement);

        const script = () =>
            browser.executeScript(dragAndDrop, draggedItem, droppable, 500);

        ActionUtil.expectExecutedAction(script);
        browser.sleep(1500);
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
     * Performs Shift click on a certain element.
     *
     * @param selector
     */
    static shiftClick(selector) {
        return JQueryAction.click(selector, {shiftKey: true});
    }

    /**
     * Types a text into a specified element.
     *
     * @param selector
     * @param text
     */
    static typeText(selector, text) {
        if (text) {
            Action.click(ElementUtil.elementFinder(selector));
            for (const chars of text.match(/.{1,10}/g)) {
                ElementUtil.elementFinder(selector).sendKeys(chars);
            }
        }
    }

    /**
     * Cleans previously typed text and fill in with a new value.
     * @param selector
     * @param text
     */
    static typeNewText = (selector, text) => {
        Action.clearText(selector);
        Action.typeText(selector, text);
    }
}
