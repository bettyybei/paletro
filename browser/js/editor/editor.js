
app.config(function ($stateProvider) {
    $stateProvider.state('editor', {
        url: '/editor/:id',
        controller: 'EditorController',
        templateUrl: 'js/editor/editor.html',
        resolve: {
          theProject: function (ProjectFactory, $stateParams, $state) {
            return ProjectFactory.getAllElements($stateParams.id)
            .then(function(res){
              if (!res.length) return $state.go('home'); //redirect if the projectId does not belong to user
              return res[0];
            })
          }
        }
    });
});


app.controller('EditorController', function ($scope, $rootScope, EditorFactory, ProjectFactory, theProject) {
    $(".button-collapse").sideNav();
    $('.collapsible').collapsible();
    $scope.elements = theProject.elements;
    $scope.projectName = theProject.name;

    var obj = {}

    $scope.colors = ['black', 'brown', 'red', 'deep-orange', 'yellow', 'light-green', 'light-blue', 'indigo', 'purple', 'white', 'grey', 'pink', 'orange', 'lime', 'green', 'teal', 'blue', 'deep-purple'];

    $scope.shades = ['darken-4', 'darken-3', 'darken-2', 'original', 'lighten-1', 'lighten-2', 'lighten-3', 'lighten-4', 'lighten-5']

    $scope.addComponent = function (type) {
      $scope.elements.push({type: type});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addImage = function () {
      $scope.elements.push({type: 'image', url: $scope.image.url});
      $('.button-collapse').sideNav('hide');
    }

    $scope.changeProjectName = function () {
      return ProjectFactory.updateName(theProject.id, $scope.projectName);
    }

    $scope.finished = function () {

      var stringedElements =JSON.stringify($scope.elements)

      obj.contents = stringedElements

      // var p = document.getElementById("canvas");
      // var pClone = p.cloneNode(true);
      // console.log(pClone);
      // console.log(p.innerHTML);
      EditorFactory.delete(1)
      .then(function(){
        $scope.elements.map(element => EditorFactory.createElement(element))
      })
      .then(function(){
        ProjectFactory.create(obj)
      })
    }

    $scope.selectedColor = 'blue';
    $scope.setColor = function (color) {
      $scope.selectedColor = color;
      $rootScope.$broadcast('colorChange', $scope.selectedColor)
    }

    $scope.setShade = function (shade) {
      $scope.selectedShade = shade;
      $rootScope.$broadcast('shadeChange', $scope.selectedShade)
    }

});

