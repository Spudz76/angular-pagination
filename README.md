# Angular Pagination [![Build Status](https://travis-ci.org/Spudz76/angular-pagination.png?branch=master)](https://travis-ci.org/Spudz76/angular-pagination)

An AngularJS module for pagination on static or dynamic data. No directives here, just a service and some optional filters.

Mostly based on various snippets which [@svileng](https://twitter.com/svileng) found on JSFiddle, afterwards
modified to support a wider variety of data sets. Also several useful helpers to cut down on controller and view math.

## Quick start

Include `angular-pagination.js` after `angular.min.js`.

Add the `pagination` module as a dependency when creating your app, e.g.

```js
var app = angular.module('myApp', ['pagination'])
```

Inject the `Pagination` service to the controller containing the data which you want to paginate, and set it on the $scope:

```js
app.controller('MyCtrl', ['$scope', 'Pagination',
function($scope, Pagination){
  $scope.pg = new Pagination({start: 0, limit: 10, total: 10})
}])
```

If no object is passed to the constructor it assumes the following defaults
 * start *0*
 * limit *10*
 * total *0*

To set updated values on the same instance use the `set` method. This is especially useful on dynamic backend data
sets that require callbacks. For static front-end data sets the filters can be used.

```js
$scope.pg.set({start: 0, limit: 10, total: 10})
```

After setting the data either through calling `new(obj)` or `set(obj)` the service will automatically setup several
helpers that can be used for rendering which are described below.

## Rendering with Helpers

For dynamic server backed data sets it is good to use helpers over filters here is how.

* First Page `my_start_var = pg.first(); myListFunction()`
* Previous Page `my_start_var = pg.previous(); myListFunction()`
* Next Page `my_start_var = pg.next(); myListFunction()`
* Last Page `my_start_var = pg.last(); myListFunction()`
* Specific page `my_start_var = pg.forPage(3); myListFunction()`

This example assume you have a controller like this
```js
app.controller('MyCtrl', ['$scope', 'Pagination',
function($scope, Pagination){
  $scope.my_start_var = 0
  $scope.pg = new Pagination({start: 0, limit: 10, total: 10})
  $scope.myListFunction = function(){
    someFactory.list({start: my_start_var},function(res){
      $scope.pg.set({start: my_start_var, total: res.count_total})
    })
  }
}])
```

Here is an example view using jade with bootstrap buttons it uses the `buttons()` method
which returns an array of buttons relative to the current page position
```jade
div
    div.pull-right
      div.btn-group
        button.btn.btn-default(ng-disabled="pg.isFirst()", ng-click="start = pg.first(); list()")
          span.glyphicon.glyphicon-fast-backward
        button.btn.btn-default(ng-disabled="pg.isFirst()", ng-click="start = pg.previous(); list()")
          span.glyphicon.glyphicon-step-backward
        button.btn.btn-default(
          ng-repeat="n in pg.buttons()",
          ng-class="{'btn-primary': (n == pg.page)}",
          ng-click="$parent.start = pg.forPage(n); list()"
        ) {{ n }}
        button.btn.btn-default(ng-disabled="pg.isLast()", ng-click="start = pg.next(); list()")
          span.glyphicon.glyphicon-step-forward
        button.btn.btn-default(ng-disabled="pg.isLast()", ng-click="start = pg.last(); list()")
          span.glyphicon.glyphicon-fast-forward
    | {{ pg.range.start }} - {{ pg.range.end }} of {{ pg.range.total }} entries
```

Which should yield something like this:
![Pagination Bar Example](http://ft.trillian.im/32beade6276ff4c3b71543f301afc6fa489725b7/6lm6jqGoRPs3t7wA4opQxfUdshv3H.jpg)

### Dynamic Limit

Sometimes it is useful to change the limit per page dynamically say with a drop down.
That is where `forLimitChange()` becomes useful as it will return the correct start
value after a limit change which will allow everything to line up correctly and the user
to be on a correct page. This will also make sure the database is set to return the
correct starting record as well.

Here is an example:
```jade
div
  select(ng-model="limit", ng-change="start = pg.forLimitChange(limit); list()")
    option(ng-repeat="row in [10,20,50,100,500]", ng-value="row") {{ row }}
  |  Per page
```

In the above example we pass in the currently set limit to get the "would be" start value.
If the database has already been changed then the currently lined up value can be obtained
by doing
```js
$scope.start = pg.forLimitChange()
```

## Rendering with Filters

There is a custom filter called `paginationStart` to help you rendering items per page.

```html
<div ng-repeat="post in posts | paginationStart: pg.start | limitTo: pg.limit">
	<!-- stuff -->
</div>
```

Again, replace `post in posts` with your data.

For pagination links you can either use Next/Previous buttons or page numbers
by using another built-in filter called `paginationRange`.

```html
<button ng-click="pg.set({start: pg.previous()})">Previous</button>
<button ng-click="pg.set({start: pg.next()}).">Next</button>
```

and for rendering page numbers:

```html
<span ng-repeat="n in [] | paginationRange: pg.pages">
	<button ng-click="pg.set({start: pg.forPage(n)})">{{n}}</button>
<span>
```

Optionally you can add some logic to hide/disable the buttons using the `pg.isFirst()` and `pg.isLast()` functions;
here's an example:

```html
<button ng-disabled="pg.isFirst()" ng-click="pg.set({start: pg.first()})">First</button>
<button ng-disabled="pg.isFirst()" ng-click="pg.set({start: pg.previous()})">Previous</button>
<button ng-disabled="pg.isLast()" ng-click="pg.set({start: pg.next()}).">Next</button>
<button ng-disabled="pg.isLast()" ng-click="pg.set({start: pg.last()}).">Last</button>
```

## Contributions

Any pull requests are more than welcome. Please make your changes in your own branch, make sure the current specs in `angular-pagination.spec.js` are passing (Jasmine/Karma) and update/add tests if necessary.

For problems/suggestions please create an issue on Github.

## Contributors

* [@spudz76](https://twitter.com/spudz76) (massive cleanups, renaming)
* [@nullivex](https://twitter.com/nullivex) (api rewrite, updated documentation)

## Credits

* [@svileng](https://twitter.com/svileng) (original repo @ [angular-SimplePagination](https://github.com/svileng/angular-SimplePagination))
* AngularJS range filter: [http://www.yearofmoo.com/](http://www.yearofmoo.com/2012/10/more-angularjs-magic-to-supercharge-your-webapp.html#more-about-loops)
* AngularJS pagination: [http://jsfiddle.net/2ZzZB/56/](http://jsfiddle.net/2ZzZB/56/)
* Other unknown JSFiddles
