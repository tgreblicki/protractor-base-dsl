# Protractor Base DSL

This library helps with providing the base DSL classes to lessen the burden of creating protractor scenarios.
DSL prevents the most known issues occurred in Protractor and handles it in a cross-browser way.
It can handle latest Chrome, Firefox and Internet 11 browsers. 

## Global variables: 
|name|default value|description|
|---|---|---|
|defaultExpectationTimeout|10000|Timeout to wait (in ms) a condition|
|defaultBrowserWidth|1024|Default width of browser to set before running Protractor tests|
|defaultBrowserHeight|768|Default height of browser to set before running Protractor tests|

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
