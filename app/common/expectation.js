import Condition from './condition';
import ElementUtils from './element-utils';

const waitForCondition = (message, condition, selector) => {
    const finder = () => ElementUtils.elementFinder(selector);
    const errorMessage = `${message}. Selector: ${finder().locator()}`;
    browser.wait(new webdriver.Condition(errorMessage, () => condition(finder())), global.defaultExpectationTimeout);
};

const Expectation = {
    checkboxChecked: (selector, checked) => {
        const condition = Condition.checkboxChecked(checked);
        waitForCondition('for checkbox is selected', condition, selector);
    },
    count: (selector, expectedCount) => {
        const condition = Condition.elementCount(expectedCount, selector);
        waitForCondition(`for element's count to be '${expectedCount}'`, condition);
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

export default Expectation;
