# Protractor Base DSL

This library helps with providing the base DSL classes to lessen the burden of creating protractor scenarios.
DSL prevents the most known issues occurred in Protractor and handles it in a cross-browser way.
It can handle latest Chrome, Firefox and Internet 11 browsers. 

## Complete API Documentation

Check here [Base DSL API](https://acierto.github.io/protractor-base-dsl/)

## Global variables

|name|default value|description|
|---|---|---|
|defaultExpectationTimeout|10000|Timeout to wait (in ms) a condition|
|defaultBrowserWidth|1024|Default width of browser to set before running Protractor tests|
|defaultBrowserHeight|768|Default height of browser to set before running Protractor tests|

## Overview of several DSL functions

### ActionUtil.repeatAction

One of the most significant problems existing in Protractor is flakiness when certain action considered to be executed
but in reality it is just skipped by certain reasons. For example you click on a button and expect some action and 
1 out of 10/20 times test fails due to this. To overcome such issue you can use `ActionUtil.repeatAction`. Example
of usage:

```javascript
import {Action, ActionUtil, WaitCondition} from 'protractor-base-dsl';
const action = () => Action.click('button');
const condition = () => WaitCondition.present('.modal-dialog');
ActionUtil.repeatAction(action, condition);
```

At this case `action` method will be 3 times and calls each time expected `condition`. It is essential to use at this
case `WaitCondition`, not `Expectation` or `Condition` DSL. 

### Action.jsClick

At some situations it happens that click just not propagated by protractor to an element. Without some logical reason.
When you stuck with such a case, I suggest to use the approach with `Action.jsClick`. It uses execution of pure javascript
in the browser to click on the element. 

```javascript
Action.jsClick(`.click-me-button`);
```

### Action.typeText

If you don't use this method but rather default typing of Protractor. You'll be very disappointed, especially if you 
test Internet Explorer or Firefox. The problem of in missed letters. It can also happening on Chrome, much less
often. When you start using [debounce](https://www.npmjs.com/package/debounce) the problem will be also obvious.
Usage of this DSL is pretty simple

```javascript
Action.typeText('input', 'text to type')
Action.typeText('input', 'text to type', 300) // if you wish to type slower, by default it is 100 ms.
```

### Working with iFrame?

Consider to use next DSL to make elements searchable inside of iFrame.

```javascript
Action.switchToFrame('#specific-iframe-id')
```
After executing this DSL, the scope visibility becomes only this iframe with elements inside it. If you won't do it,
protractor just won't see any of it. Same applies for elements outside of iframe. Now they are not accessible either.
To come back to a scope of the main application, use this DSL method:  

```javascript
Action.switchToDefaultContent()
```

## How to configure the project to use this package

Most of the functionality works without any extra configuration. What you have to do is only use this package 
as dependency. 

Example:

```javascript
import {Expectation, XPath} from 'protractor-base-dsl';

const buttonSelector = (buttonLabel) => XPath.withLinkContains('.dsfaApp .nav', buttonLabel);
const adminButtonVisible = () => Expectation.displayed(buttonSelector('Admin'));
```

### Usage of ReactAction DSL

This package can be used by React project and therefore for that some of functionality is implemented based on the react
packages. For that React specific actions are collected in `ReactAction` DSL. Using action emulation
with a help of jQuery or embedded Protractor methods won't work. For that is required to use `ReactTestUtils`. 
What do you need to do in your project for that? 
In your webpack configuration you have to expose that variable, by adding a loader

```javascript
    {
        test: require.resolve('react-dom/test-utils'),
        use: [{
            loader: 'expose-loader',
            options: 'ReactTestUtils'
        }]
    }
```

### Usage of doubleClick and hover from Action DSL

As a standard protractor library doesn't provide with such functionality there is `bean` npm package was used to 
achieve it. To make it work, in your project you have to add in webpack configuration extra loader which expose 
bean:

```javascript
{
    test: require.resolve('bean'),
    use: [{
        loader: 'expose-loader',
        options: 'bean'
    }]
}
```

### Usage of JQueryAction DSL

If in some case it will be required for you to execute jQuery actions, you can use it as well. To make it work, 
in your project you have to add in webpack configuration extra loader which expose several definitions of jQuery 
global object:

```javascript
{
    test: require.resolve('jquery'),
    use: [{
        loader: 'expose-loader',
        options: 'jQuery'
    }, {
        loader: 'expose-loader',
        options: 'jquery'
    }, {
        loader: 'expose-loader',
        options: '$'
    }]
}
```

### Usage of XPath DSL

This kind of DSL is useful for example when you have multiple element result on specific CSS selector.
And only the different in text inside of element.
For example: `<button>Save</button>` and `<button>Close</button>`. If code is yours and you are ok 
to add extra css class name, then you won't need this DSL. For the rest, it will look like then:

```javascript
import {XPath} from 'protractor-base-dsl';
const controlPanel = `#pane-with-reports .report .btn-panel`;
const hideFiltersButton = XPath.withButtonContains(controlPanel, 'Hide filters');
const showFiltersButton = XPath.withButtonContains(controlPanel, 'Show filters');
``` 

## For maintainers

The build/release process is using [Gulp](https://gulpjs.com/). It helps pretty well with creating flows, which 
easy to develop and maintain.

You have to install Gulp 4 globally as npm package:

`yarn add global gulp` or `npm i -g gulp` 

Verification that you have proper version: 
`gulp -v` should resulted into

```text
CLI version: 2.2.0
Local version: 4.0.2
```

There are next gulp tasks can be executed:

|Gulp task name|Description|
|---|---|
|build-dist|Executes next gulp tasks: `clean`, `lint`, `webpack-build` |
|clean|Cleans a `dist` directory.|
|doc|Generates API documentation for all provided DSL by parsing js docs|
|gh-pages|Executes next gulp tasks: `doc`, `publish` |
|lint|Verifies app folder that scripts follow `.eslintrc` rules.| 
|publish|Publishes `dist` folder to gh-pages branch. What makes API documentation available here [protractor-base-dsl](https://acierto.github.io/protractor-base-dsl/)|
|webpack-build|Generates a bundle with help of [Webpack](https://webpack.js.org/) into `dist` folder.|
|watch-lint|Runs the lint watcher for all js changes in `app` folder|
|complete-release|Rebuilds the bundle, regenerates documentation and publishes it to gh-pages. Bumps up the version in package.json and uploads the new version to NPM. *Note*: For this task you have to be logged in NPM|

### To build a new version:

`gulp build-dist`

### To release a new version:

`gulp complete-release`
