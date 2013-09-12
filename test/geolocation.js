'use strict';

describe('Service: geolocation', function () {

  // load the service's module
  beforeEach(module('geolocation'));

  // instantiate service
  var geolocation,$rootScope,$window,geolocation_msgs;
  beforeEach(inject(function (_geolocation_,_$rootScope_,_$window_,_geolocation_msgs_) {
    geolocation = _geolocation_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    geolocation_msgs = _geolocation_msgs_;
  }));

  it('should obtain user location', function () {
    var results;
    spyOn($window.navigator.geolocation,"getCurrentPosition").andCallFake(function() {
        var position = { coords: { latitude: 32, longitude: -96 } };
        arguments[0](position);
    });
    geolocation.getLocation().then(function(data){
      results = data;
    });
    $rootScope.$digest();
    expect(results).toEqual({ coords : { latitude : 32, longitude : -96 } });
  });

  it('should not obtain user location due to missing geolocation', function () {
    var results,old_navigator;
    spyOn($rootScope, '$broadcast');
    old_navigator = $window.navigator;
    $window.navigator = {geolocation:false};
    geolocation.getLocation().then(function(){},function(error) {
      results = error;
    });
    $rootScope.$digest();
    expect($rootScope.$broadcast).toHaveBeenCalledWith('error',geolocation_msgs['errors.location.unsupportedBrowser']);
    expect(results).toEqual(geolocation_msgs['errors.location.unsupportedBrowser']);
    $window.navigator = old_navigator;
  });

  it('should not obtain user location', function () {
    var results;
    spyOn($rootScope, '$broadcast');
    spyOn($window.navigator.geolocation,"getCurrentPosition").andCallFake(function() {
        arguments[1]();
    });
    geolocation.getLocation().then(function(){},function(error) {
      results = error;
    });
    $rootScope.$digest();
    expect($rootScope.$broadcast).toHaveBeenCalledWith('error',geolocation_msgs['errors.location.notFound']);
    expect(results).toEqual(geolocation_msgs['errors.location.notFound']);
  });

});
