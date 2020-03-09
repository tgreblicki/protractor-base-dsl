/**
 * Util class to work with the protractor elements.
 */
export class ElementUtil {
    /**
     * Based on provided selector creates a protractor ElementFinder.
     * Selector itself can be provided in several types.
     * If that's already ElementFinder then it will be returned as is.
     * If it was provided as a locator (it can be created as By.css, By.xpath, etc.) then it will be converted to
     * ElementFinder.
     * The last option is to provide a string, at this case By.css locator going to be applied to it and converted
     * to ElementFinder.
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
