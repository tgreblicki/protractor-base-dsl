/**
 * Utils to work with protractor elements
 */
export class ElementUtil {

    /**
     * Creates protractor ElementFinder
     *
     * @param selector
     */
    static elementFinder(selector) {
        if (selector instanceof protractor.ElementFinder) {
            return selector;
        } else if (selector && selector.findElementsOverride) {
            return element(selector);
        }
        return element(By.css(selector));
    }
}
