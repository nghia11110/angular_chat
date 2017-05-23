(function() {
        'use strict';

        angular
            .module('app.core')
            .directive('myEnter', function () {
                return function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if(event.which === 13) {
                            scope.$apply(function (){
                                scope.$eval(attrs.myEnter);
                            });
                            console.log('enter enter');
                            event.preventDefault();
                        }
                    });
                };
            });

    })();