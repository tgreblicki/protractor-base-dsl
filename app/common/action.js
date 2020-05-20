// eslint-disable-line max-lines
import R from 'ramda';
import {code as dragAndDrop} from 'xl-html-dnd';
import {Expectation} from './expectation';
import {JQueryAction} from './jquery-action';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';
import {WaitCondition} from './wait-condition';

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
        const action = () => {
            ElementUtil.elementFinder(selector).isSelected().then((selected) => {
                if (!selected) {
                    Action.click(ElementUtil.elementFinder(selector));
                }

                ElementUtil.elementFinder(selector).getAttribute('value').then((value) => {
                    if (value) {
                        R.times(() => ElementUtil.elementFinder(selector)
                            .sendKeys(protractor.Key.BACK_SPACE), value.length);
                    }
                });
            });
        };
        const condition = () => WaitCondition.textEquals(selector, '');
        ActionUtil.repeatAction(action, condition);
    }

    /**
     * Clicks on element if it's clickable.
     * For example button can be disabled and click won't occur, you need to fetch that unaccepted behavior earlier.
     *
     * @param selector CSS Selector or Protractor Element
     * @param delay Delays on specified time before proceeding further.
     */
    static click(selector, delay = 1000) {
        Expectation.clickable(selector);

        browser.executeScript('window.scrollTo(0,0);').then(() => {
            ActionUtil.expectExecutedAction(() => ElementUtil.elementFinder(selector).click());
        });

        browser.sleep(delay);
    }

    /**
     * Performs an enter on a certain element.
     */
    static clickEnter(selector) {
        Action.sendKeys(selector, protractor.Key.ENTER);
    }

    /**
     * Clicks on element nevertheless if it's clickable or not. You can use it when
     * element is appeared only for some period of time and then disappears.
     * As e2e especially for IE is slow it can happen that Protractor can miss to click on that element during
     * that period of time. For example it can be used to close timed notification messages to proceed further,
     * as toastr might hide some elements which you want to click.
     *
     * @param selector CSS Selector or Protractor Element
     * @param delay Delays on specified time before proceeding further.
     */
    static clickIfClickable(selector, delay = 1000) {
        const finder = ElementUtil.elementFinder(selector);
        expect(ActionUtil.execute(() => finder.click().then(R.F, R.F)));

        browser.sleep(delay);
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
     * Hovers on a certain element by mousing over the specified element.
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
     * @param selector CSS Selector or Protractor Element
     * @param delay Delays on specified time before proceeding further.
     */
    static jsClick(selector, delay = 1000) {
        Expectation.displayed(selector);
        Expectation.clickable(selector);

        function clickIt() {
            arguments[0].click(); // eslint-disable-line prefer-rest-params
        }

        Action.executeVoidScript(clickIt, ElementUtil.elementFinder(selector));
        browser.sleep(delay);
    }

    /**
     * Drag the element and drops it to a certain area.
     *
     * @param fromElement
     * @param toElement
     * @param waitBeforeDropping time to wait between drag and dropping the element
     */
    static jsDragAndDrop(fromElement, toElement, waitBeforeDropping = 500) {
        Expectation.displayed(fromElement);
        Expectation.displayed(toElement);

        const draggedItem = ElementUtil.elementFinder(fromElement);
        const droppable = ElementUtil.elementFinder(toElement);

        const script = () =>
            browser.executeScript(dragAndDrop, draggedItem, droppable, waitBeforeDropping);

        ActionUtil.expectExecutedAction(script);
        browser.sleep(1500);
    }

    /**
     * Hovers on a certain element by mousing move to an element
     *
     * @param selector
     */
    static mousemove(selector) {
        Expectation.displayed(selector);
        const hover = (element) => bean.fire(element, 'mousemove');
        Action.executeVoidScript(hover, ElementUtil.elementFinder(selector));
    }

    /**
     * Sends any provided keys for a certain element.
     *
     * @param keys
     * @param selector
     */
    static sendKeys(selector, keys) {
        ElementUtil.elementFinder(selector).sendKeys(keys);
    }

    /**
     * Performs Shift click on a certain element.
     *
     * @param selector
     */
    static shiftClick(selector) {
        return JQueryAction.click(selector, {shiftKey: true});
    }

    /**
     * Switches to the specified frame.
     *
     * @param selector
     */
    static switchToFrame(selector) {
        browser.switchTo().frame(browser.driver.findElement(protractor.By.css(selector)));
    }

    /**
     * Switches back to default content.
     * For example when you selected the frame and need to get out from it.
     */
    static switchToDefaultContent() {
        browser.switchTo().defaultContent();
    }

    /**
     * Types a text into a specified element.
     *
     * @param selector
     * @param text
     * @param sleep, sleep time (ms) between typing the characters
     */
    static typeText(selector, text, sleep = 100) {
        if (text) {
            Action.click(ElementUtil.elementFinder(selector));
            for (const chars of text.split('')) {
                ElementUtil.elementFinder(selector).sendKeys(chars);
                browser.sleep(sleep);
            }
        }
        browser.sleep(200);
    }

    /**
     * Cleans previously typed text and fill in with a new value.
     * @param selector
     * @param text
     * @param sleep, sleep time (ms) between typing the characters
     */
    static typeNewText = (selector, text, sleep) => {
        Action.click(ElementUtil.elementFinder(selector));
        Action.clearText(selector);
        const action = () => Action.typeText(selector, text, sleep);
        const condition = () => WaitCondition.textEquals(selector, text);
        ActionUtil.repeatAction(action, condition);
    };
}
