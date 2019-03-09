import R from 'ramda';
import log from 'loglevel';
import Q from 'q';

/**
 * Basic conditions functions which can be used to use in expectations of more high level DSL functions.
 */
export class Condition {
    /**
     * Checks if checkbox is selected or not.
     *
     * @param expected
     */
    static checkboxChecked(expected) {
        return (finder) => Condition.compose(Condition.displayed(finder), () =>
            finder.getAttribute('checked').then((checked) =>
                R.equals(String(expected || false), String(checked || false))
            )
        );
    }

    /**
     * Checks if element is displayed and can be clicked on.
     *
     * @param finder
     */
    static clickable(finder) {
        return Condition.compose(Condition.displayed(finder), () => Condition.enabled(finder));
    }

    /**
     * Checks two conditions. Second condition won't be checked if first will fail.
     *
     * @param currentResult
     * @param nextCondition
     */
    static compose(currentResult, nextCondition) {
        return Q.when(currentResult).then((result) => {
            if (result) {
                try {
                    return Q.when(nextCondition());
                } catch (error) {
                    log.info('Happened error in condition compose: ', error);
                }
            }
            return Q.when(result);
        });
    }

    /**
     * Checks that expected number of elements were found.
     *
     * @param selector
     * @param expectedCount
     */
    static count(selector, expectedCount) {
        return () =>
            element.all(By.css(selector)).count().then((count) => R.equals(count, expectedCount));
    }

    /**
     * Checks that element is present and displayed.
     *
     * @param finder
     */
    static displayed(finder) {
        return Condition.compose(Condition.present(finder), () => Condition.onlyDisplayed(finder));
    }

    /**
     * Checks that element is enabled.
     *
     * @param finder
     */
    static enabled(finder) {
        return finder.isEnabled();
    }

    /**
     * Returns texts of the specified element.
     *
     * @param finder
     */
    static getText(finder) {
        return finder.getAttribute('type').then((tagType) => {
            if (R.equals(tagType, 'checkbox')) {
                return finder.getAttribute('checked').then((checked) => R.toString(R.equals(checked, 'true')));
            } else if (R.equals(tagType, 'text')) {
                return finder.getAttribute('value');
            }
            return finder.getText();
        });
    }

    /**
     * Negates the condition expectation.
     *
     * @param condition
     */
    static not(condition) {
        return (finder) => condition(finder).then((result) => !result);
    }

    /**
     * Checks that element is displayed.
     *
     * @param finder
     */
    static onlyDisplayed(finder) {
        return finder.isDisplayed();
    }

    /**
     * Checks that element is present.
     *
     * @param finder
     */
    static present(finder) {
        return finder.isPresent();
    }

    /**
     * Checks that text contains provided text chunk.
     *
     * @param text
     */
    static textContains(text) {
        return (finder) =>
            Condition.compose(Condition.present(finder),
                () => Condition.getText(finder).then((elText) =>
                    elText.indexOf(text) > -1
                ));
    }

    /**
     * Checks that text equals to expected value.
     *
     * @param text
     */
    static textEquals(text) {
        let times = 1;

        const compareText = (finder) => Condition.getText(finder).then(
            (elText) => {
                if (times > 3) {
                    log.warn('Expected that ', elText, ' be equal to: ', text, ' tries: ', times);
                }
                times += 1;
                return R.equals(elText, text);
            }
        );

        return (finder) =>
            Condition.compose(Condition.present(finder), compareText(finder));
    }

    /**
     * Checks that text matches to provided regex pattern.
     *
     * @param regex
     */
    static textMatches(regex) {
        return (finder) =>
            Condition.compose(Condition.present(finder),
                () => Condition.getText(finder).then((elText) =>
                    R.test(regex, elText)
                ));
    }
}
