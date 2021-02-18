// eslint-disable-line max-lines
import R from 'ramda';
import {code as dragAndDrop} from 'xl-html-dnd';
import {Expectation} from './expectation';
import {JQueryAction} from './jquery-action';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';
import {WaitCondition} from './wait-condition';

const bulkOfClicks = async (action, selectors) => {
    for (const selector of selectors) {
        await action(selector);
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
    static async bulkCtrlKey(selectors) {
        return bulkOfClicks(Action.ctrlClick, selectors);
    }

    /**
     * Performs a bulk of Shift clicks.
     *
     * @param selectors
     */
    static async bulkShiftKey(selectors) {
        return bulkOfClicks(Action.shiftClick, selectors);
    }

    /**
     * Clear text in found element.
     *
     * @param selector
     */
    static async clearText(selector) {
        const action = async () => {
            const selected = await ElementUtil.elementFinder(selector).isSelected();
            if (!selected) {
                await Action.click(ElementUtil.elementFinder(selector));
            }
            const value = await ElementUtil.elementFinder(selector).getAttribute('value');
            if (value) {
                R.times(async () => await ElementUtil.elementFinder(selector)
                    .sendKeys(protractor.Key.ARROW_RIGHT), value.length);

                R.times(async () => await ElementUtil.elementFinder(selector)
                    .sendKeys(protractor.Key.BACK_SPACE), value.length);
            }
        };
        const condition = async () => await WaitCondition.textEquals(selector, '');
        await ActionUtil.repeatAction(action, condition);
    }

    /**
     * Clicks on element if it's clickable.
     * For example button can be disabled and click won't occur, you need to fetch that unaccepted behavior earlier.
     *
     * @param selector CSS Selector or Protractor Element
     * @param delay Delays on specified time before proceeding further.
     */
    static async click(selector, delay = 1000) {
        await Expectation.clickable(selector);

        await browser.executeScript('window.scrollTo(0,0);');
        await ActionUtil.expectExecutedAction(async () => await ElementUtil.elementFinder(selector).click());
        await browser.sleep(delay);
    }

    /**
     * Performs an enter on a certain element.
     */
    static async clickEnter(selector) {
        await Action.sendKeys(selector, protractor.Key.ENTER);
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
    static async clickIfClickable(selector, delay = 1000) {
        const finder = ElementUtil.elementFinder(selector);
        expect(await ActionUtil.execute(() => finder.click().then(R.F, R.F)));

        await browser.sleep(delay);
    }

    /**
     * Performs Ctrl click on a certain element.
     *
     * @param selector
     */
    static async ctrlClick(selector) {
        return JQueryAction.click(selector, {ctrlKey: true});
    }

    /**
     * Performs double click on a certain element.
     *
     * @param selector
     */
    static async doubleClick(selector) {
        await Expectation.displayed(selector);
        const doubleClick = (element) => bean.fire(element, 'dblclick');
        return Action.executeVoidScript(doubleClick, ElementUtil.elementFinder(selector));
    }

    /**
     * Executes native JavaScript function.
     *
     * @param {function} scriptFunction
     * @param {array} scriptArguments
     */
    static async executeVoidScript(scriptFunction, ...scriptArguments) {
        const script = `(${scriptFunction}).apply(null, arguments);`;
        return ActionUtil.expectExecutedAction(async () => await browser.executeScript(script, ...scriptArguments));
    }

    /**
     * Focuses on a certain element.
     * Mainly has to be used for input fields.
     *
     * @param selector
     */
    static async focus(selector) {
        await Expectation.clickable(selector);
        return ActionUtil.expectExecutedAction(async () => await ElementUtil.elementFinder(selector).focus());
    }

    /**
     * Hovers on a certain element by mousing over the specified element.
     *
     * @param selector
     */
    static async hover(selector) {
        await Expectation.displayed(selector);
        const hover = (element) => bean.fire(element, 'mouseover');
        await Action.executeVoidScript(hover, ElementUtil.elementFinder(selector));
    }

    /**
     * Clicks on element by using native JavaScript execution.
     *
     * @param selector CSS Selector or Protractor Element
     * @param delay Delays on specified time before proceeding further.
     */
    static async jsClick(selector, delay = 1000) {
        await Expectation.displayed(selector);
        await Expectation.clickable(selector);

        function clickIt() {
            arguments[0].click(); // eslint-disable-line prefer-rest-params
        }

        await Action.executeVoidScript(clickIt, ElementUtil.elementFinder(selector));
        await browser.sleep(delay);
    }

    /**
     * Drag the element and drops it to a certain area.
     *
     * @param fromElement
     * @param toElement
     * @param waitBeforeDropping time to wait between drag and dropping the element
     */
    static async jsDragAndDrop(fromElement, toElement, waitBeforeDropping = 500) {
        await Expectation.displayed(fromElement);
        await Expectation.displayed(toElement);

        const draggedItem = ElementUtil.elementFinder(fromElement);
        const droppable = ElementUtil.elementFinder(toElement);

        const script = async () =>
            await browser.executeScript(dragAndDrop, draggedItem, droppable, waitBeforeDropping);

        await ActionUtil.expectExecutedAction(script);
        await browser.sleep(1500);
    }

    /**
     * Hovers on a certain element by mousing move to an element
     *
     * @param selector
     */
    static async mousemove(selector) {
        await Expectation.displayed(selector);
        const hover = (element) => bean.fire(element, 'mousemove');
        await Action.executeVoidScript(hover, ElementUtil.elementFinder(selector));
    }

    /**
     * Sends any provided keys for a certain element.
     *
     * @param keys
     * @param selector
     */
    static async sendKeys(selector, keys) {
        await ElementUtil.elementFinder(selector).sendKeys(keys);
    }

    /**
     * Performs Shift click on a certain element.
     *
     * @param selector
     */
    static async shiftClick(selector) {
        return JQueryAction.click(selector, {shiftKey: true});
    }

    /**
     * Switches to the specified frame.
     *
     * @param selector
     */
    static async switchToFrame(selector) {
        await browser.switchTo().frame(browser.driver.findElement(protractor.By.css(selector)));
    }

    /**
     * Switches back to default content.
     * For example when you selected the frame and need to get out from it.
     */
    static async switchToDefaultContent() {
        await browser.switchTo().defaultContent();
    }

    /**
     * Types a text into a specified element.
     *
     * @param selector
     * @param text
     * @param sleep, sleep time (ms) between typing the characters
     */
    static async typeText(selector, text, sleep = 100) {
        if (text) {
            await Action.click(ElementUtil.elementFinder(selector));
            for (const chars of text.split('')) {
                await ElementUtil.elementFinder(selector).sendKeys(chars);
                await browser.sleep(sleep);
            }
        }
        await browser.sleep(200);
    }

    /**
     * Cleans previously typed text and fill in with a new value.
     * @param selector
     * @param text
     * @param sleep, sleep time (ms) between typing the characters
     */
    static typeNewText = async (selector, text, sleep) => {
        await Action.click(ElementUtil.elementFinder(selector));
        await Action.clearText(selector);
        await Action.typeText(selector, text, sleep);
    };
}
