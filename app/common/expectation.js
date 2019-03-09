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
 */
export class Expectation {
    /**
     * Checks if attribute has expected text.
     *
     * @param cssSelector
     * @param attribute
     * @param text
     */
    static attributeEquals(cssSelector, attribute, text) {
        const EC = protractor.ExpectedConditions;
        const elementFinder = ElementUtil.elementFinder(cssSelector);
        const textIs = () =>
            elementFinder.getAttribute(attribute).then(
                (actualText) => R.equals(R.trim(actualText), R.trim(text))
            );
        return Expectation.condition(EC.and(EC.presenceOf(elementFinder), textIs));
    }

    /**
     * Checks if element is clickable.
     * @param selector
     */
    static clickable(selector) {
        checkCondition(selector, 'for element to be clickable', Condition.clickable);
    }

    /**
     * Checks that provided condition is met.  You can use it when no other expectation
     * doesn't fit your current needs.
     * @param conditionFunction
     * @param message
     */
    static condition(conditionFunction, message) {
        ActionUtil.expectExecutedAction(() =>
            browser.wait(conditionFunction, global.defaultExpectationTimeout, message, global.defaultExpectationTimeout)
        );
    }

    /**
     * Checks that number of elements are present.
     *
     * @param selector
     * @param expectedCount
     */
    static count(selector, expectedCount) {
        const countIs = () =>
            element.all(By.css(selector)).count().then((count) => R.equals(count, expectedCount));
        return Expectation.condition(countIs);
    }

    /**
     * Checks not less than certain number of elements are present.
     *
     * @param selector
     * @param expectedCount
     */
    static countAtLeast(selector, expectedCount) {
        const countIs = () =>
            element.all(By.css(selector)).count().then((count) => R.gte(count, expectedCount));
        return Expectation.condition(countIs);
    }

    /**
     * Checks that element is in DOM and visible to the user.
     *
     * @param selector
     */
    static displayed(selector) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.displayed(selector));
    }

    /**
     * Checks that it is an empty text for a certain element.
     *
     * @param selector
     */
    static emptyText(selector) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.textEquals(selector, ''));
    }

    /**
     * Checks that element is enabled (opposite to disabled), you can use it to check that
     * element is not disabled anymore and you can perform some actions.
     *
     * @param selector
     */
    static enabled(selector) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.enabled(selector));
    }

    /**
     * Checks that element is not visible to user but can be present in DOM.
     *
     * @param selector
     */
    static notDisplayed(selector) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.notDisplayed(selector));
    }

    /**
     * Checks that element is not visible to user and not present in DOM.
     *
     * @param selector
     */
    static notPresent(selector) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.notPresent(selector));
    }

    /**
     * Checks that element might be not visible to the user but present in DOM.
     *
     * @param selector
     */
    static present(selector) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.present(selector));
    }

    /**
     * Checks that element contains a certain text.
     *
     * @param selector
     * @param text
     */
    static textContains(selector, text) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.textContains(selector, text));
    }

    /**
     * Checks that element has a certain text.
     *
     * @param selector
     * @param text
     */
    static textEquals(selector, text) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.textEquals(selector, text));
    }

    /**
     * Checks that element doesn't have a certain text.
     *
     * @param selector
     * @param text
     */
    static textNotEqual(selector, text) {
        const msg = `for element's text not to be '${text}'`;
        return checkCondition(selector, msg, Condition.not(Condition.textEquals(text)));
    }
}
