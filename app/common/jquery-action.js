import {Action} from './action';
import {Expectation} from './expectation';
import {ElementUtil} from './element-util';

/**
 * Base DSL actions created with JQuery
 */
export class JQueryAction {
    /**
     * Clicks on element with an extra parameters.
     * This function can be used for example to perform Ctrl, Shift clicks.
     *
     * @param selector
     * @param clickEvent
     */
    static click(selector, clickEvent) {
        Expectation.displayed(selector);
        const code = (element, codeEvent) =>
            $(element).trigger($.Event('click', codeEvent)); // eslint-disable-line new-cap
        return Action.executeVoidScript(code, ElementUtil.elementFinder(selector), clickEvent);
    }

    /**
     * Performs a custom keydown event on a certain element.
     *
     * @param selector
     * @param keyCode
     */
    static keyDown(selector, keyCode) {
        Expectation.displayed(selector);
        const code = (element, codeEvent) =>
            $(element).trigger($.Event('keydown', {keyCode: codeEvent})); // eslint-disable-line new-cap
        return Action.executeVoidScript(code, ElementUtil.elementFinder(selector), keyCode);
    }

    /**
     * Performs right click on a certain element.
     */
    static rightClick(selector) {
        Expectation.clickable(selector);
        const code = (element) => {
            const elem = $(element)[0];
            const clientRect = elem.getBoundingClientRect();
            const coordinates = {pageX: clientRect.left, pageY: clientRect.top};
            const event = $.Event('contextmenu', coordinates); // eslint-disable-line new-cap
            $(element).trigger(event);
        };
        return Action.executeVoidScript(code, selector);
    }
}
