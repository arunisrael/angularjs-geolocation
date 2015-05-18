'use strict';

angular.module('geolocation',[]).constant('geolocation_msgs', {
        'errors.location.unsupportedBrowser':'Browser does not support location services',
        'errors.location.permissionDenied':'You have rejected access to your location',
        'errors.location.positionUnavailable':'Unable to determine your location',
        'errors.location.timeout':'Service timeout has been reached'
});

angular.module('geolocation')
  .factory('geolocation', ['$q','$rootScope','$window','geolocation_msgs',function ($q,$rootScope,$window,geolocation_msgs) {
    return {
      getLocation: function (opts) {
        var deferred = $q.defer();
        if ($window.navigator && $window.navigator.geolocation) {
          $window.navigator.geolocation.getCurrentPosition(function(position){
            $rootScope.$apply(function(){deferred.resolve(position);});
          }, function(error) {
            switch (error.code) {
              case 1:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.permissionDenied']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.permissionDenied']);
                });
                break;
              case 2:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.positionUnavailable']);
                });
                break;
              case 3:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.timeout']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.timeout']);
                });
                break;
            }
          }, opts);
        }
        else
        {
          $rootScope.$broadcast('error',geolocation_msgs['errors.location.unsupportedBrowser']);
          deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);
        }
        return deferred.promise;
      }
    };
}]);
