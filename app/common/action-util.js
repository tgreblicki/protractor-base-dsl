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
 */
export class ActionUtil {
    /**
     * Executes the action once and multiple times tries to match it with the expected condition.
     *
     * @param action
     */
    static async execute(action) {
        const callerStack = createCallerStack();
        const retry = async (current, max) =>
            action().then(undefined, (error) => processError(retry, callerStack, error, current, max));
        return retry(1, maxRetries);
    }

    /**
     * Executes an action and expects to match with that certain expectation.
     *
     * @param fn {function} Action to execute
     */
    static async expectExecutedAction(fn) {
        return expect(await ActionUtil.execute(() => fn()));
    }

    /**
     * Executes an action multiple times and matches it with the expected condition.
     * This case is useful i.e. when you need to click on the button,
     * Protractor allegedly do it and proceed further but actually click didn't happen.
     *
     * @param action
     * @param condition
     */
    static async repeatAction(action, condition) {
        const callerStack = createCallerStack();
        const retry = async (current, max) => {
            await action();
            return condition().then(Q.resolve, (error) => processError(retry, callerStack, error, current, max));
        };
        return retry(1, maxRetries);
    }

    /**
     * Executes the same action N times with a timeout between actions.
     * This method is required when you can't apply any condition to be sure that action was occurred, but you
     * find some piece of code quite flaky in Protractor and once in a while this action is not happening.
     *
     * @param action
     * @param timesToExecute
     * @param timeout
     */
    static async times(action, timesToExecute, timeout = delayTime) {
        R.forEach(async () => {
            await action();
            await browser.sleep(timeout);
        }, R.range(0, timesToExecute));
    }
}
