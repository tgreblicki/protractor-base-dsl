/**
 * Utils to work with protractor elements
 *
 * @property {function} elementFinder Creates protractor ElementFinder
 */
export const ElementUtils = {
    elementFinder: (selector) => {
        if (selector instanceof protractor.ElementFinder) {
            return selector;
        } else if (selector && selector.findElementsOverride) {
            return element(selector);
        }
        return element(By.css(selector));
    }
};
