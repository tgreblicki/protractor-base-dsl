import R from 'ramda';
import {Expectation} from './expectation';
import {ActionUtil} from './action-util';
import {ElementUtil} from './element-util';

/**
 * Base DSL actions.
 *
 * @property {function} click Clicks on element if it's clickable. For example button can be disabled and
 * click won't occur, you need to fetch that unaccepted behavior earlier.
 *
 * @property {function} clickIfClickable Clicks on element nevertheless if it's clickable or not. You can use it when
 * element is appeared only for some period of time and then disappears. As e2e especially for IE is slow it can happen
 * that Protractor can miss to click on that element during that period of time. For example it can be used to close
 * timed notification messages to proceed further, as toastr might hide some elements which you want to click.
 */
export const Action = {
    click: (selector) => {
        Expectation.clickable(selector);
        return ActionUtil.expectExecutedAction(() => ElementUtil.elementFinder(selector).click());
    },
    clickIfClickable: (selector) => {
        const finder = ElementUtil.elementFinder(selector);
        return expect(ActionUtil.execute(() => finder.click().then(R.T, R.T)));
    }
};
