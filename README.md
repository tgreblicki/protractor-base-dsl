# Protractor Base DSL

This library helps with providing the base DSL classes to lessen the burden of creating protractor scenarios.
DSL prevents the most known issues occurred in Protractor and handles it in a cross-browser way.
It can handle latest Chrome, Firefox and Internet 11 browsers. 

## Global variables

|name|default value|description|
|---|---|---|
|defaultExpectationTimeout|10000|Timeout to wait (in ms) a condition|
|defaultBrowserWidth|1024|Default width of browser to set before running Protractor tests|
|defaultBrowserHeight|768|Default height of browser to set before running Protractor tests|

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

## For maintainers

The build/release process is using [Gulp](https://gulpjs.com/). It helps pretty well with creating flows, which 
easy to develop and maintain.

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

Check [Base DSL API](https://acierto.github.io/protractor-base-dsl/) for more information
