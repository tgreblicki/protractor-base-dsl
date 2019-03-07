const ElementUtils = {
    elementFinder: (selector) => {
        if (selector instanceof protractor.ElementFinder) {
            return selector;
        } else if (selector && selector.findElementsOverride) {
            return element(selector);
        }
        return element(By.css(selector));
    },
    expectAbsent: (cssSelector) => {
        expect(element(By.css(cssSelector)).isPresent()).toBe(false);
    },
    expectDisabled: (cssSelector) =>
        ElementUtils.expectHasAttribute(cssSelector, 'disabled'),
    expectEnabled: (cssSelector) =>
        ElementUtils.expectHasNoAttribute(cssSelector, 'disabled'),
    expectHasAttribute: (cssSelector, attrName) =>
        expect(element(By.css(cssSelector)).getAttribute(attrName)).toBeTruthy(),
    expectHasNoAttribute: (cssSelector, attrName) =>
        expect(element(By.css(cssSelector)).getAttribute(attrName)).toBeFalsy(),
    expectPresent: (cssSelector) => {
        expect(element(By.css(cssSelector)).isPresent()).toBe(true);
        expect(element(By.css(cssSelector)).isDisplayed()).toBe(true);
    }
};

export default ElementUtils;
