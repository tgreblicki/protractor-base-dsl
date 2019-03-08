import webdriver from 'selenium-webdriver/lib/webdriver';
import R from 'ramda';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';
import {Condition} from './condition';
import {WaitCondition} from './wait-condition';

const checkCondition = (selector, message, condition) => {
    const action = () => {
        const finder = () => ElementUtil.elementFinder(selector);
        const errorMessage = `${message}. Selector: ${finder().locator()}`;
        const cond = new webdriver.Condition(errorMessage, () => condition(finder()));
        return browser.wait(cond, global.defaultExpectationTimeout);
    };
    return expect(ActionUtil.execute(action));
};

/**
 * Expectations created based on WaitCondition DSL methods.
 *
 * @property {function} attributeEquals
 * @property {function} clickable
 * @property {function} condition
 * @property {function} count
 * @property {function} countAtLeast
 * @property {function} displayed
 * @property {function} emptyText
 * @property {function} enabled
 * @property {function} notDisplayed
 * @property {function} notPresent
 * @property {function} present
 * @property {function} textContains
 * @property {function} textEquals
 * @property {function} textNotEqual
 *
 */
export const Expectation = {
    attributeEquals: (cssSelector, attribute, text) => {
        const EC = protractor.ExpectedConditions;
        const elementFinder = ElementUtil.elementFinder(cssSelector);
        const textIs = () =>
            elementFinder.getAttribute(attribute).then(
                (actualText) => R.equals(R.trim(actualText), R.trim(text))
            );
        return Expectation.condition(EC.and(EC.presenceOf(elementFinder), textIs));
    },
    clickable: (selector) =>
        checkCondition(selector, 'for element to be clickable', Condition.clickable),
    condition: (conditionFunction, message) =>
        ActionUtil.expectExecutedAction(() =>
            browser.wait(conditionFunction, global.defaultExpectationTimeout, message, global.defaultExpectationTimeout)
        ),
    count: (selector, expectedCount) => {
        const countIs = () =>
            element.all(By.css(selector)).count().then((count) => R.equals(count, expectedCount));
        return Expectation.condition(countIs);
    },
    countAtLeast: (selector, expectedCount) => {
        const countIs = () =>
            element.all(By.css(selector)).count().then((count) => R.gte(count, expectedCount));
        return Expectation.condition(countIs);
    },
    displayed: (selector) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.displayed(selector)),
    emptyText: (selector) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.textEquals(selector, '')),
    enabled: (selector) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.enabled(selector)),
    notDisplayed: (selector) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.notDisplayed(selector)),
    notPresent: (selector) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.notPresent(selector)),
    present: (selector) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.present(selector)),
    textContains: (selector, text) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.textContains(selector, text)),
    textEquals: (selector, text) =>
        ActionUtil.expectExecutedAction(() => WaitCondition.textEquals(selector, text)),
    textNotEqual: (selector, text) =>
        checkCondition(selector, `for element's text not to be '${text}'`, Condition.not(Condition.textEquals(text)))
};
