'use strict';

angular.module('geolocation',[]).constant('geolocation_msgs', {
        'errors.location.unsupportedBrowser':'Browser does not support location services',
        'errors.location.notFound':'Unable to determine your location',
});

angular.module('geolocation')
  .factory('geolocation', ['$q','$rootScope','$window','geolocation_msgs',function ($q,$rootScope,$window,geolocation_msgs) {
    return {
      getLocation: function () {
        var deferred = $q.defer();
        if ($window.navigator && $window.navigator.geolocation) {
          $window.navigator.geolocation.getCurrentPosition(function(position){
            $rootScope.$apply(function(){deferred.resolve(position);});
          }, function(error) {
            $rootScope.$broadcast('error',geolocation_msgs['errors.location.notFound']);
            $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.notFound']);});
          });
        }
        else
        {
          $rootScope.$broadcast('error',geolocation_msgs['errors.location.unsupportedBrowser']);
          $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);});
        }
        return deferred.promise;
      }
    };
}]);
