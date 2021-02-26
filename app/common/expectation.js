/* eslint-disable max-lines */
import R from 'ramda';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';
import {Condition} from './condition';
import {WaitCondition} from './wait-condition';

const checkCondition = async (selector, message, condition) =>
    await ActionUtil.expectExecutedAction(async () => await WaitCondition.check(message, condition, selector));

const checkPresenceAndCondition = async (selector, condition) => {
    const EC = protractor.ExpectedConditions;
    const elementFinder = ElementUtil.elementFinder(selector);

    return ActionUtil.expectExecutedAction(async () =>
        browser.wait(EC.and(EC.presenceOf(elementFinder), condition), global.defaultExpectationTimeout));
};

/**
 * Expectations created based on WaitCondition DSL methods.
 */
export class Expectation {
    /**
     * Checks that attribute of element meets a certain condition.
     *
     * @param selector
     * @param attrName
     * @param condition
     */
    static async attributeCondition(selector, attrName, condition) {
        const cond = () => {
            const finder = ElementUtil.elementFinder(selector);
            return Condition.attributeCondition(attrName, condition)(finder);
        };
        return checkPresenceAndCondition(selector, cond);
    }

    /**
     * Checks if attribute has expected text.
     *
     * @param selector
     * @param attribute
     * @param text
     */
    static async attributeEquals(selector, attribute, text) {
        const elementFinder = ElementUtil.elementFinder(selector);
        const textIs = () =>
            elementFinder.getAttribute(attribute).then(
                (actualText) => R.equals(R.trim(actualText), R.trim(text))
            );

        return checkPresenceAndCondition(selector, textIs);
    }

    /**
     * Checks that attribute doesn't have specified text.
     *
     * @param selector
     * @param attribute
     * @param text
     */
    static async attributeNotEqual(selector, attribute, text) {
        const elementFinder = ElementUtil.elementFinder(selector);
        const textIs = () =>
            elementFinder.getAttribute(attribute).then(
                (actualText) => !R.equals(R.trim(actualText), R.trim(text))
            );

        return checkPresenceAndCondition(selector, textIs);
    }

    /**
     * Checks that attribute value contains an expected text.
     *
     * @param selector
     * @param attrName
     * @param value
     */
    static async attributeContainsValue(selector, attrName, value) {
        const condition = (actualValue) => R.gt(actualValue.indexOf(value), -1);
        return Expectation.attributeCondition(selector, attrName, condition);
    }

    /**
     * Checks that attribute does not contain a specified value in a certain text.
     *
     * @param selector
     * @param attrName
     * @param value
     */
    static async attributeDoesntContainValue(selector, attrName, value) {
        const condition = (actualValue) => R.equals(actualValue.indexOf(value), -1);
        return Expectation.attributeCondition(selector, attrName, condition);
    }

    /**
     * Checks that attribute value is not less than a specified value.
     *
     * @param selector
     * @param attrName
     * @param minValue
     */
    static async attributeValueNotLessThan(selector, attrName, minValue) {
        const condition = (actualValue) => R.gte(parseInt(actualValue, 10), minValue);
        return Expectation.attributeCondition(selector, attrName, condition);
    }

    /**
     * Checks that attribute value is not more than a specified value.
     *
     * @param selector
     * @param attrName
     * @param maxValue
     */
    static async attributeValueNotMoreThan(selector, attrName, maxValue) {
        const condition = (actualText) => R.lte(Math.abs(parseInt(actualText, 10) - maxValue), 1);
        return Expectation.attributeCondition(selector, attrName, condition);
    }

    /**
     * Checks that checkbox will be selected/unselected.
     *
     * @param selector
     * @param checked
     */
    static async checkboxChecked(selector, checked) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.checkboxChecked(selector, checked));
    }

    /**
     * Checks if element is clickable.
     * @param selector
     */
    static async clickable(selector) {
        return checkCondition(selector, 'for element to be clickable', Condition.clickable);
    }

    /**
     * Checks that provided condition is met.  You can use it when no other expectation
     * doesn't fit your current needs.
     * @param conditionFunction
     * @param message
     */
    static async condition(conditionFunction, message) {
        return ActionUtil.expectExecutedAction(() =>
            browser.wait(conditionFunction, global.defaultExpectationTimeout, message, global.defaultExpectationTimeout)
        );
    }

    /**
     * Checks that number of elements are present.
     *
     * @param selector
     * @param expectedCount
     */
    static async count(selector, expectedCount) {
        const countIs = () => element.all(By.css(selector)).count().then((count) => R.equals(count, expectedCount));
        return Expectation.condition(countIs);
    }

    /**
     * Checks not less than certain number of elements are present.
     *
     * @param selector
     * @param expectedCount
     */
    static async countAtLeast(selector, expectedCount) {
        const countIs = () =>
            element.all(By.css(selector)).count().then((count) => R.gte(count, expectedCount));
        return Expectation.condition(countIs);
    }

    /**
     * Checks that date component has an expected value
     *
     * @param selector
     * @param dateValue
     * @param defaultDateFormat
     */
    static async dateValue(selector, dateValue, defaultDateFormat) {
        const expectationFunction = async (dateFormat) =>
            await Expectation.attributeEquals(selector, 'value', dateValue.format(dateFormat));
        return Expectation.withLocaleDate(expectationFunction, defaultDateFormat);
    }

    /**
     * Checks that element is disabled.
     *
     * @param selector
     */
    static async disabled(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.disabled(selector));
    }

    /**
     * Checks that element is in DOM and visible to the user.
     *
     * @param selector
     */
    static async displayed(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.displayed(selector));
    }

    /**
     * Checks that it is an empty text for a certain element.
     *
     * @param selector
     */
    static async emptyText(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.textEquals(selector, ''));
    }

    /**
     * Checks that element is enabled (opposite to disabled), you can use it to check that
     * element is not disabled anymore and you can perform some actions.
     *
     * @param selector
     */
    static async enabled(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.enabled(selector));
    }

    /**
     * Checks that element has a scrolling.
     *
     * @param selector
     */
    static async hasScroll(selector) {
        const element = ElementUtil.elementFinder(selector);
        expect(element.getSize().then(
            (size) =>
                Expectation.attributeValueNotLessThan(element, 'scrollHeight', size.height - 10)));
    }

    /**
     * Checks that element doesn't have a scrolling.
     *
     * @param selector
     */
    static async hasNoScroll(selector) {
        const element = ElementUtil.elementFinder(selector);
        expect(element.getSize().then(
            (size) =>
                Expectation.attributeValueNotMoreThan(element, 'scrollHeight', size.height)));
    }

    /**
     * Checks if element has a certain attribute name.
     *
     * @param selector
     * @param attrName
     */
    static async hasAttribute(selector, attrName) {
        const elementFilter = () => ElementUtil.elementFinder(selector);
        const hasAttr = () =>
            elementFilter().getAttribute(attrName).then((attrValue) => !R.isNil(attrValue), R.F);
        return checkPresenceAndCondition(selector, hasAttr);
    }

    static async hasClassName(selector, className) {
        const element = ElementUtil.elementFinder(selector);
        return element.getAttribute('class').then((classes) => R.includes(className, classes.split(' ')));
    }

    /**
     * Checks that element doesn't have a certain attribute name.
     *
     * @param selector
     * @param attrName
     */
    static async hasNoAttribute(selector, attrName) {
        const elementFilter = () => ElementUtil.elementFinder(selector);
        const hasNoAttr = () =>
            elementFilter().getAttribute(attrName).then((attrValue) => R.isNil(attrValue), R.F);
        return checkPresenceAndCondition(selector, hasNoAttr);
    }

    /**
     * This function is used with a combination in other function to check a date in a local date format.
     *
     * @param expectationFunction
     * @param defaultDateFormat
     */
    static async withLocaleDate(expectationFunction, defaultDateFormat = 'MMM D, YYYY') {
        return ActionUtil.expectExecutedAction(() =>
            browser.executeScript(() =>
                navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.userLanguage
            ).then(() => defaultDateFormat).then((dateFormat) => expectationFunction(dateFormat))
        );
    }

    /**
     * Checks that element is not visible to user but can be present in DOM.
     *
     * @param selector
     */
    static async notDisplayed(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.notDisplayed(selector));
    }

    /**
     * Checks that element is not visible to user and not present in DOM.
     *
     * @param selector
     */
    static async notPresent(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.notPresent(selector));
    }

    /**
     * Checks that element might be not visible to the user but present in DOM.
     *
     * @param selector
     */
    static async present(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.present(selector));
    }

    /**
     * Checks that element containing a specified text is present.
     *
     * @param selector
     */
    static async presentWithText(selector) {
        return ActionUtil.expectExecutedAction(async () => await WaitCondition.presentWithText(selector));
    }

    /**
     * Checks that element has readonly attribute.
     *
     * @param selector
     */
    static async readOnly(selector) {
        await Expectation.present(selector);
        return Expectation.attributeContainsValue(selector, 'readonly', 'true');
    }

    /**
     * Checks that element contains a certain text.
     *
     * @param selector
     * @param text
     */
    static async textContains(selector, text) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.textContains(selector, text));
    }

    /**
     * Checks that element has a certain text.
     *
     * @param selector
     * @param text
     */
    static async textEquals(selector, text) {
        return ActionUtil.expectExecutedAction(() => WaitCondition.textEquals(selector, text));
    }

    /**
     * Checks that element doesn't have a certain text.
     *
     * @param selector
     * @param text
     */
    static async textNotEqual(selector, text) {
        const msg = `for element's text not to be ${text}`;
        return checkCondition(selector, msg, Condition.not(Condition.textEquals(text)));
    }

    /**
     * Checks that element doesn't have a certain text.
     *
     * @param selector
     * @param regex
     */
    static async textMatches(selector, regex) {
        const msg = `for element text to be matched by '${regex}'`;
        return checkCondition(selector, msg, Condition.textMatches(regex));
    }
}

/* eslint-enable max-lines */
