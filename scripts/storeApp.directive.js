angular.module('storeApp')
.directive('product', function () {
    return {
        restrict: 'E',
        template: '<div><h4>{{item.title}}</h4></div><div><img ng-src="{{item.imageUrl}}" /></div><div><h4>{{item.price|currency}}</h4></div>',
        scope: {
            item: '='
        }
    };
});
