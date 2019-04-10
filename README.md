# Protractor Base DSL

This library will help you with providing base DSL classes to lessen the burden of creating protractor scenarios.

Used global variables: 


|name|default value|description|
|---|---|---|
|defaultExpectationTimeout|10000|Timeout to wait (in ms) a condition|
|defaultBrowserWidth|1024|Default width of browser to set before running Protractor tests|
|defaultBrowserHeight|768|Default height of browser to set before running Protractor tests|

# For maintainers

To build a new version:

`gulp build-dist`

To release a new version:

`gulp complete-release`

Check [Base DSL API](https://acierto.github.io/protractor-base-dsl/) for more information
