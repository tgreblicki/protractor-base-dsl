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
 * @property {function} attributeEquals Checks if attribute has expected text.
 * @property {function} clickable Checks if element is clickable.
 * @property {function} condition Checks that provided condition is met.  You can use it when no other expectation
 * doesn't fit your current needs.
 * @property {function} count Checks that number of elements are present.
 * @property {function} countAtLeast Checks not less than certain number of elements are present.
 * @property {function} displayed Checks that element is in DOM and visible to the user.
 * @property {function} emptyText Checks that it is an empty text for a certain element.
 * @property {function} enabled Checks that element is enabled (opposite to disabled), you can use it to check that
 * element is not disabled anymore and you can perform some actions.
 * @property {function} notDisplayed Checks that element is not visible to user but can be present in DOM.
 * @property {function} notPresent Checks that element is not visible to user and not present in DOM.
 * @property {function} present Checks that element might be not visible to the user but present in DOM.
 * @property {function} textContains Checks that element contains a certain text.
 * @property {function} textEquals Checks that element has a certain text.
 * @property {function} textNotEqual Checks that element doesn't have a certain text.
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
