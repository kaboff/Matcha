
 app = angular.module('matcha', ['rzModule', 'ngTagsInput']);


 app.controller('search',function($scope, $http, $filter, $timeout){
      $scope.tags = '';
      $scope.default = ['-distance', 'score', '-same_tags'];
      $scope.MyOrder = ['-distance', 'score', 'same_tags'];
      $scope.reverse = true;

      var score_max = 0;
      var score_min = 0;

      for (var i = 0; all_user[i]; i++) {
        if (all_user[i].score > score_max)
          score_max = all_user[i].score;
        if (all_user[i].score < score_min)
          score_min = all_user[i].score;
      };

      $scope.all_users = all_user;
      if (score_max == 0)
        score_max = 100;
      if (score_min == 0)
        score_min = 0;

      angular.element(document).ready(function () {
          $('.my_filter').hide();
          $('#background_loader').fadeOut(600);
      });

      $scope.slider_age = {
        minValue: 18,
        maxValue: 100,
        options: {
            floor: 18,
            ceil: 100,
            step: 1
        }
      };

      $scope.slider_score = {
        minValue: score_min,
        maxValue: score_max,
        options: {
            floor: score_min,
            ceil: score_max,
            step: 1
        }
      };

      $scope.slide_filter = function(e) {
        $('.my_filter').slideToggle('600');
      }

      $scope.sortBy = function(propertyName, event) {
        if ($(event.target).attr('class') == 'ion-close')
        {
          $('h2 li').each(function(index)
          {
            $(this).attr('class', 'ion-close');
            $(this).switchClass('ion-arrow-up-b');
            $(this).css('color', 'black');
          });
          $(event.target).attr('class', 'ion-arrow-up-b');
          $(event.target).css('color', 'rgb(27, 219, 27)');
        }
        else if ($(event.target).attr('class') == 'ion-arrow-up-b')
          $(event.target).attr('class', 'ion-arrow-down-b');
        else if ($(event.target).attr('class') == 'ion-arrow-down-b')
          $(event.target).attr('class', 'ion-arrow-up-b');
        if (propertyName && propertyName[0] && propertyName[1] && propertyName[1] == '-distance')
        {
          $scope.default = ['-connect', 'distance'];
          propertyName = $scope.default;
        }
        else if (propertyName && propertyName[0] && propertyName[1] && propertyName[1] == 'distance')
        {
          $scope.default = ['connect', '-distance'];
          propertyName = $scope.default;
        }
        else
          $scope.reverse = ($scope.MyOrder === propertyName) ? !$scope.reverse : false;
        $scope.MyOrder = propertyName;
      };

      $scope.flip = function(e) {
        $(e.target).parent().parent().addClass("flip");
        $timeout(callAtTimeout, 5000);
        function callAtTimeout() {
          $(e.target).parent().parent().removeClass("flip");
        }
     };

      $scope.full_img = function(e) {
        $(e.target).next().next().next().next().next().children().addClass('full_img');
        $(e.target).next().next().next().next().next().next().hide();
        $(e.target).next().next().next().hide();
        $(e.target).prev().show();
        $(e.target).hide();
      };

      $scope.delete_full_img = function(e) {
        $(e.target).next().next().next().next().next().next().children().removeClass('full_img');
        $(e.target).next().next().next().next().next().next().next().show();
        $(e.target).hide().next().show().next().next().next().show();
      };

      $scope.autocomplete = function(e)
      {
        var search = [];
        for (var i = 0; $scope.all_users[i]; i++)
        {
          if ($scope.all_users[i].tags != null && $scope.all_users[i].tags)
          {
            var split = $scope.all_users[i].tags.split(';');
            for (var o = 0; o < split.length; o++){
                e = e.toUpperCase();
                split[o] = split[o].toUpperCase();
                if (split[o].includes(e))
                  if (!search.includes(split[o]))
                    search.push(split[o]);
            }
          }
        }
        return search;
      };
})
  app.filter('mytags', function() {
     return function( items, condition) {
      var filtered = [];

      if (condition === undefined || condition === '' || !condition.tags || !condition.tags[0]){
        return items;
      }

      angular.forEach(items, function(item) {      
        for (var i = 0; condition.tags[i]; i++) {
          if (!filtered.includes(item))
          {
            if (item.tags != null && item.tags)
            {
              var split = item.tags.split(';');
              for (var o = 0; o < split.length; o++){
                  split[o] = split[o].toUpperCase();
              }
              if (split.includes(condition.tags[i].text.toUpperCase()))
                filtered.push(item);
            }
          }
        };
      });
      return filtered;
    }});

  app.filter('filter_age', function() {
     return function( items, condition) {
      var filtered = [];

      if (condition === undefined || condition === ''){
        return items;
      }

      angular.forEach(items, function(item) {          
         if(item.age >= condition.min && item.age <= condition.max){
           filtered.push(item);
         }
      });
      return filtered;
    }});

  app.filter('filter_score', function() {
     return function( items, condition) {
      var filtered = [];

      if (condition === undefined || condition === ''){
        return items;
      }

      angular.forEach(items, function(item) {          
         if(item.score >= condition.min && item.score <= condition.max){
           filtered.push(item);
         }
      });

      return filtered;
    }});