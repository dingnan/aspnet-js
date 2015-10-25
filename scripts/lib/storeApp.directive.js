angular.module('storeApp')
.directive('product', function () {
    return {
        restrict: 'E',
        template: '<div><span>Name: {{productInfo.name}}</div>',
        scope: {
            productInfo: '=info'
        }
    };
});
