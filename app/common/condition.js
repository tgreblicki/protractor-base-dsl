import R from 'ramda';
import log from 'loglevel';
import Q from 'q';

const Condition = {
    checkboxChecked: (expected) =>
        (finder) => Condition.compose(Condition.displayedCondition(finder), () =>
            finder.getAttribute('checked').then((checked) =>
                R.equals(String(expected || false), String(checked || false))
            )
        ),
    clickable: (finder) =>
        Condition.compose(Condition.displayed(finder), () => Condition.enabled(finder)),
    compose: (currentResult, nextCondition) =>
        currentResult.then((result) => {
            if (result) {
                try {
                    return Q.when(nextCondition());
                } catch (error) {
                    log.info('Happened error in condition compose: ', error);
                }
            }
            return Q.when(result);
        }),
    count: (selector, expectedCount) => () =>
        element.all(By.css(selector)).count().then((count) => R.equals(count, expectedCount)),
    displayed: (finder) =>
        Condition.compose(Condition.present(finder), () => Condition.onlyDisplayed(finder)),
    enabled: (finder) => finder.isEnabled(),
    getText: (finder) => {
        finder.getAttribute('type').then((tagType) => {
            if (R.equals(tagType, 'checkbox')) {
                return finder.getAttribute('checked').then((checked) => R.toString(R.equals(checked, 'true')));
            } else if (R.equals(tagType, 'text')) {
                return finder.getAttribute('value');
            }
            return finder.getText();
        });
    },
    not: (condition) => (finder) => condition(finder).then((result) => !result),
    onlyDisplayed: (finder) => finder.isDisplayed(),
    present: (finder) => finder.isPresent(),
    textContains: (text) => (finder) =>
        Condition.compose(Condition.present(finder),
            () => Condition.getText(finder).then((elText) =>
                elText.indexOf(text) > -1
            )),
    textEquals: (text) => {
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
    },
    textMatches: (regex) => (finder) =>
        Condition.compose(Condition.present(finder),
            () => Condition.getText(finder).then((elText) =>
                R.test(regex, elText)
            ))

};

export default Condition;
