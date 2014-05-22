# Famo.us-Angular beginner tutorial 


There has been much excitement of late concerning the new [Famo.us](http://famo.us) Javascript framework for developing graphically rich web-apps, based on a physics rendering engine.
Famous is opening up possibilities especially for graphically complex UIs ... and allows you to create interfaces very quickly that previously were only possible in native apps.

However, Famous really only solves the problem of managing your view and there are some rather good Javascript frameworks out there already providing a nice thick client MVC.

Enter Famous-Angular ... developed by the guys at Thomas Street, it's a very elegant and useable combination of the two frameworks, providing the ease and scalability of Angular with the feature-rich views of Famous. So here is a very simple tutorial to get you going.

Some of this will be replicated from the https://github.com/Famous/famous-angular github page.

####Before you start, tools you will need
* Download and install [git](http://git-scm.com/downloads)
* Download and install [nodeJS](http://nodejs.org/download/)
* Install bower `npm install bower`

####What shall we make?
A simple color-scheme tester. We want to be able to create a set of boxes on the page and set each of their background and text colors as well as edit the text, all in real-time. Clicking on a box should perform a wiggle animation on that box.

####Create your app:
Install bower libraries:- 
```bash
bower install famous-angular
bower install angular-ui-router
bower install underscore
bower install jquery
``` 
this should download the dependencies into `bower_components`. 

Create an index.html which looks like this

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="integrationApp">
    <head>
        <title></title>
        <link rel="stylesheet" href="bower_components/famous-angular/dist/famous-angular.css"/>
    </head>
    <body>
        <ui-view></ui-view>

        <script src="bower_components/underscore/underscore.js"></script>
        <script src="bower_components/jquery/dist/jquery.js"></script>
        <script src="bower_components/angular/angular.js"></script>
        <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
        <script src="bower_components/requirejs/require.js"></script>
        <script src="bower_components/famous-angular/dist/famous-angular.js"></script>
        <script>
            //set requirejs's base to where the famous lib folder lives
            require.config({baseUrl: 'bower_components'});
        </script>
        <script src="bower_components/famous-angular/dist/famous-angular.js"></script>

        <script src="scripts/app.js"></script>
        <script src="scripts/controllers/main.js"></script>
    </body>
</html>
```
---

####Create the Angular module:

We will now create a `scripts/app.js` file to create the Angular app and inject famous.angular. Let's add a simple router (using `ui.router`) so that we can put our view in a seperate file. The router renders the view in the `<ui-view>` tag in index.html.

```js
angular.module('integrationApp',['famous.angular', 'ui.router'])
.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state("main", {
        url: "/",
        templateUrl: "views/main.html",
        controller: "MainCtrl"
    });
});
```
---

####Create the Famo.us Template
we will create the template file `views/main.html` to contain all the magic. Note how Famous-Angular implements the Famo.us API as directives in the template. 
```html
<table>
    <tr><td>Text:</td><td><input ng-model="text"/></td></tr>
    <tr><td>No. boxes:</td><td><input type="number" ng-model="number"/></td></tr>
    <tr><td>X-Offset:</td><td><input ng-model="offset"/></td></tr>
</table>
<fa-app>
    <fa-view
             ng-repeat="box in boxes"
             fa-size="[250, 50]">
        <fa-modifier fa-translate="[offset, 55*$index, 0]">
            <fa-modifier id="{{'box-' + $index}}">
                <fa-surface
                            fa-background-color="box.bg_color"
                            fa-color="box.color"
                            fa-size="[250, 50]">
                    <table>
                        <tr>
                            <td>
                                <input style="width: 50px" ng-model="box.bg_color"/><br>
                                <input style="width: 50px" ng-model="box.color"/>
                            </td>
                            <td align="center" fa-click="click($index)">
                                {{text}}
                            </td>
                        </tr>
                    </table>
                </fa-surface>
            </fa-modifier>
        </fa-modifier>

        <fa-animation id="{{'shake-animation-' + $index}}" duration="750">
            <animate  targetModSelector="{{'#box-' + $index}}"
                     field="translate"
                     startValue="[0,0,0]"
                     endValue="[-40,0,0]"
                     curve="linear"
                     timelineLowerBound="0"
                     timelineUpperBound=".075"/>
            <animate  targetModSelector="{{'#box-' + $index}}"
                     field="translate"
                     startValue="[0,0,0]"
                     endValue="[30,0,0]"
                     curve="linear"
                     timelineLowerBound=".075"
                     timelineUpperBound=".15"/>
            <animate  targetModSelector="{{'#box-' + $index}}"
                     field="translate"
                     startValue="[40,0,0]"
                     endValue="[0,0,0]"
                     curve="outElastic"
                     timelineLowerBound=".15"
                     timelineUpperBound="1"/>
        </fa-animation>

    </fa-view>
</fa-app>
```
Here we are iterating over an array called `boxes` on our Angular model and creating some surfaces with modifiers and animations. As in normal Angular we can use `$scope` variables in the template using the brackets `{{variable}}` notation.

We now need our controller to set up our variables and handle the click event that we have already declared in the template
    
```html
<td align="center" fa-click="click($index)">
    TEXT
</td>
```

----
####Create the Angular Controller:

We now create a file `scripts/controllers.main.js` where we will declare our Main controller and handle the two-way binding for the template

```js
angular.module('integrationApp')
.controller('MainCtrl',function ($scope, $famous) {
    $scope.number = 6;
    $scope.offset = 200;
    $scope.text = "TEXT";
    $scope.boxes = [];

    $scope.$watch('number', function (num) {
        var arr = [];
        for (var i = 0; i < $scope.number; i++) {
            arr.push({bg_color: '#333', color: '#ccc'});
        }
        $scope.boxes = arr;
    });

    $scope.click = function (index) {
        $famous.find('#shake-animation-' + index)[0].replay();
    };
});
```

This responds to changes of `$scope.number` and initialises a new set of boxes ready for editing. We also initialise some of the other properties for our view as well as triggering the animation for a surface.

####That's it! We're done ... just run the index.html file in your browser
