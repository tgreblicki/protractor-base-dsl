import log from 'loglevel';
import Q from 'q';
import R from 'ramda';
import PrettyError from 'pretty-error';

const delayTime = 1000;
const maxRetries = 3;

const createCallerStack = () => {
    let callerStack;
    try {
        throw new Error();
    } catch (exception) {
        callerStack = exception;
    }
    return callerStack;
};

const processError = (retryFn, callerStack, error, current, max) => {
    if (current <= max) {
        log.info(`Conditions is failed. Attempt ${current} of ${max}`);
        return Q.delay(delayTime).then(() => retryFn(current + 1, max));
    }

    const customError = new Error(error.message);
    customError.stack = callerStack.stack;
    return Q.reject(
        R.pipe(
            (stack) => new PrettyError().render(stack),
            R.append(R.__, [error.message]),
            R.join('\n')
        )(callerStack)
    );
};

/**
 * Contains utils to do repeatable actions.
 * Protractor doesn't behave stable and performing the same action more than once helps to overcome flakiness.
 *
 * @property {function} execute Executes the defined action once and multiple times tries to match it with
 * the expected condition.
 *
 * @property {function} expectExecutedAction Executes an expected action
 *
 * @property {function} repeatAction Executes action multiple times and matches it with the expected condition.
 * This case is useful i.e. when you need to click on the button, Protractor allegedly do it and proceed further but
 * actually click didn't happen.
 *
 */
export const ActionUtil = {
    execute: (action) => {
        const callerStack = createCallerStack();
        const retry = (current, max) =>
            action().then(undefined, (error) => processError(retry, callerStack, error, current, max));
        return retry(1, maxRetries);
    },
    expectExecutedAction: (fn) => expect(ActionUtil.execute(() => fn())),
    repeatAction: (action, condition) => {
        const callerStack = createCallerStack();
        const retry = (current, max) => {
            action();
            return condition().then(Q.resolve, (error) => processError(retry, callerStack, error, current, max));
        };
        return retry(1, maxRetries);
    }
};
