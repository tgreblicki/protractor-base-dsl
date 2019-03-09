/**
 * Finds an element with help of XPath selector
 */
export class XPath {
    /**
     * Selector to find a button containing a provided text
     *
     * @param text
     */
    static buttonContains(text) {
        return By.xpath(`.//button[text() = ${text}']`);
    }

    /**
     * Selector to find an element containing a provided CSS class name and having a certain text.
     *
     * @param className
     * @param text
     */
    static classContains(className, text) {
        return By.xpath(`.//*[contains(@class, "${className}") and text() = '${text}']`);
    }

    /**
     * Selector to find a div element containing a provided text.
     *
     * @param text
     */
    static divContains(text) {
        return By.xpath(`.//div[text() = '${text}']`);
    }

    /**
     * Selector to find a label element containing a provided text.
     *
     * @param text
     */
    static labelContains(text) {
        return By.xpath(`.//label[text() = '${text}']`);
    }

    /**
     * Selector to find a link element containing a provided text.
     *
     * @param text
     */
    static linkContains(text) {
        return By.xpath(`.//a[text() = '${text}']`);
    }

    /**
     * Selector to find p element containing a provided text.
     *
     * @param text
     */
    static paragraphContains(text) {
        return By.xpath(`.//p[text() = '${text}']`);
    }

    /**
     * Selector to find span element containing a provided text.
     *
     * @param text
     */
    static spanContains(text) {
        return By.xpath(`.//span[text() = '${text}']`);
    }

    /**
     * Selector to find a button containing a provided text inside already found element by an additional selector.
     *
     * @param selector
     * @param text
     */
    static withButtonContains(selector, text) {
        return element(By.css(selector)).element(XPath.buttonContains(text));
    }

    /**
     * Selector to find an element containing a provided CSS class name and having a certain text inside already
     * found element by an additional selector.
     *
     * @param selector
     * @param className
     * @param text
     */
    static withClassContains(selector, className, text) {
        return element(By.css(selector)).element(XPath.classContains(className, text));
    }

    /**
     * Selector to find a div element containing a provided text inside already found element by an additional selector.
     *
     * @param selector
     * @param text
     */
    static withDivContains(selector, text) {
        return element(By.css(selector)).element(XPath.divContains(text));
    }

    /**
     * Selector to find a label element containing a provided text inside already
     * found element by an additional selector.
     *
     * @param selector
     * @param text
     */
    static withLabelContains(selector, text) {
        return element(By.css(selector)).element(XPath.labelContains(text));
    }

    /**
     * Selector to find a link element containing a provided text inside already found element
     * by an additional selector.
     *
     * @param selector
     * @param text
     */
    static withLinkContains(selector, text) {
        return element(By.css(selector)).element(XPath.linkContains(text));
    }

    /**
     * Selector to find a span element containing a provided text
     * inside already found element by an additional selector.
     *
     * @param selector
     * @param text
     */
    static withSpanContains(selector, text) {
        return element(By.css(selector)).element(XPath.spanContains(text));
    }

    /**
     * Selector to find a paragraph element containing a provided text inside
     * already found element by an additional selector.
     *
     * @param selector
     * @param text
     */
    static withParagraphContains(selector, text) {
        return element(By.css(selector)).element(XPath.paragraphContains(text));
    }
}
