import webdriver from 'selenium-webdriver/lib/webdriver';
import {Condition} from './condition';
import {ElementUtil} from './element-util';

const waitForCondition = (message, condition, selector) => {
    const finder = () => ElementUtil.elementFinder(selector);
    const errorMessage = `${message}. Selector: ${finder().locator()}`;
    const cond = new webdriver.Condition(errorMessage, () => condition(finder()));
    return browser.wait(cond, global.defaultExpectationTimeout || 10000);
};

/**
 * Waits till condition will be met, otherwise error will be thrown after a defined time.
 * It's useful to use as browser requires some time to render a new elements and some waiting is
 * expected to met a certain condition.
 * Expects that global variable *defaultExpectationTimeout* will be defined otherwise default value as
 * 10000 (10 s) will be used instead.
 *
 * @property {function} checkboxChecked Waiting that checkbox will be selected/unselected
 * @property {count} count  Waiting for a certain amount of elements
 * @property {count} displayed Waiting for a displayed element
 * @property {count} enabled Waiting for an enabled element
 * @property {count} notDisplayed Waiting for not displayed element. It means that it can be in DOM but not visible.
 * @property {count} notPresent Waiting for not present element. It means that it is not present in DOM.
 * @property {count} present Waiting for present element. It means that it has to be present in DOM.
 * @property {count} textContains Waiting for element contains a certain text chunk.
 * @property {count} textEquals  Waiting for element has a certain text.
 */
export const WaitCondition = {
    checkboxChecked: (selector, checked) => {
        const condition = Condition.checkboxChecked(checked);
        return waitForCondition('for checkbox is selected', condition, selector);
    },
    count: (selector, expectedCount) => {
        const condition = Condition.elementCount(expectedCount, selector);
        return waitForCondition(`for element's count to be '${expectedCount}'`, condition);
    },
    displayed: (selector) =>
        waitForCondition('For element to be displayed', Condition.displayed, selector),
    enabled: (selector) =>
        waitForCondition('For element to be enabled', Condition.enabled, selector),
    notDisplayed: (selector) => {
        const condition = Condition.not(Condition.displayed);
        return waitForCondition('For element to be displayed', condition, selector);
    },
    notPresent: (selector) => {
        const condition = Condition.not(Condition.present);
        return waitForCondition('For element to be absent', condition, selector);
    },
    present: (selector) =>
        waitForCondition('For element to be present', Condition.present, selector),
    textContains: (selector, text) => {
        const condition = Condition.textContains(text);
        return waitForCondition(`for element's text to contain '${text}'`, condition, selector);
    },
    textEquals: (selector, text) => {
        const condition = Condition.textEquals(text);
        return waitForCondition(`for element's text to be '${text}'`, condition, selector);
    }
};
