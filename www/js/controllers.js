var firebaseConfig = {
    apiKey: "AIzaSyALfNv0TLl8bfVPvA30pX8obmHXxQ6Xz-Q",
    authDomain: "maxapp-63acd.firebaseapp.com",
    databaseURL: "https://maxapp-63acd.firebaseio.com",
    projectId: "maxapp-63acd",
    storageBucket: "maxapp-63acd.appspot.com",
    messagingSenderId: "448164184342",
    appId: "1:448164184342:web:86cacb6fec85d67c031037",
    measurementId: "G-FR5MCHDGZ2"
 };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

angular.module('starter.controllers', [])

//Controlador Para registro de usuario
.controller("registroCtrl",function($scope){

	$scope.uid = "";

	$scope.obtener = function(user){
		firebase.auth().createUserWithEmailAndPassword(user.email, user.contra).then(function a (y){
			swal("Se ha registardo correctamente");
			$scope.uid = y.user.uid;
			firebase.database().ref("/usuario").child($scope.uid).set({
				correo: user.email,
				nombre: user.name,
				uid: $scope.uid
			})
		})

		firebase.auth().signOut().then(function(){		
		}).catch(function(error){
			var mensaje = error.message;
			console.log(mensaje);
		})

		$scope.user = {};
		$state.go("login")
	}		
})

//Controlador vista inicio
.controller("loginCtrl",function($scope, $ionicPopover, $state){
	firebase.auth().signOut().then(function(){		
	}).catch(function(error){
		var mensaje = error.message;
		console.log(mensaje);
	})

	$scope.Inicio = function(userL){
		firebase.auth().signInWithEmailAndPassword(userL.email,userL.password).then(function b(x){
			swal("Se ha iniciado sesión correctamente");
			$state.go("tab.dash");
		}).catch(function(error){
			var mensaje = error.message;
			console.log(mensaje);
		})
	}

//popover
	// .fromTemplate() method
	  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Iniciar</h1> </ion-header-bar> <ion-content class="centrado"> HOLA jsjs! </ion-content></ion-popover-view>';

	  $scope.popover = $ionicPopover.fromTemplate(template, {
	    scope: $scope
	  });

	  // .fromTemplateUrl() method
	  $ionicPopover.fromTemplateUrl('login.html', {
	    scope: $scope
	  }).then(function(popover) {
	    $scope.popover = popover;
	  });


	  $scope.openPopover = function($event) {
	    $scope.popover.show($event);
	  };
	  $scope.closePopover = function() {
	    $scope.popover.hide();
	  };
	  //Cleanup the popover when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.popover.remove();
	  });
	  // Execute action on hidden popover
	  $scope.$on('popover.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove popover
	  $scope.$on('popover.removed', function() {
	    // Execute action
	  });
	//});
})

//Controlador vista principal

.controller("tutorialCtrl",function($scope){

})

.controller("favoritosCtrl",function($scope){

})

//Controlador vista products mostrar productos por categoria filtrados

.controller("productsCtrl",function($scope, $rootScope){

	$rootScope.carrito = [];
	$rootScope.favoritos = [];
	$rootScope.vista;
	$rootScope.nada;
//permite agregar productos al carrito 
	$scope.agregar = function(x,cantidad){
		x["cantidad"]=parseInt(cantidad);
		$rootScope.carrito.push(x);
		$rootScope.vista = true;
		$rootScope.subtotal = $rootScope.carrito[0].precio * $rootScope.carrito[0].cantidad;
		$rootScope.nada = false;
		swal("Perfecto", "Su producto se ha añadido a tu carrito", "success")
	}

	//permite agregar productos a favoritos 
	$scope.addFavorites = function(y){
		$rootScope.favoritos.push(y);
		swal("Perfecto", "Su producto se ha añadido a favoritos", "success")
	}


	//carousel
	$scope.options = {
  		loop: false,
	  	effect: 'fade',
	  	speed: 500,
	}

		$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
		  // data.slider is the instance of Swiper
		  $scope.slider = data.slider;
		});

		$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
		  console.log('Slide change is beginning');
		});

		$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
		  // note: the indexes are 0-based
		  $scope.activeIndex = data.slider.activeIndex;
		  $scope.previousIndex = data.slider.previousIndex;
		});
	})
//controlador vista de productos por categoria sin filtrar
.controller('DashCtrl', function($scope,$rootScope, $state) {
	$rootScope.listaProductos=[];
	$rootScope.lista = [];
	firebase.database().ref("/productos").on("value", function(p){
		$rootScope.listaProductos = p.val();

	p.forEach(function(datos){
		$rootScope.lista.push(datos.val());
	})

		console.log($rootScope.listaProductos);
	})

	//Diccionario categoria de productos
	$rootScope.Categorias = [
		{
			nombreCategoria : "TV y VIDEO",
			imagen : "img/tag1.png",
			descripcion:"Televisores, Audio y Reproductores."
		},
		{
			nombreCategoria : "CELULARES",
			imagen : "img/tag2.png",
		 	descripcion:"Tigo, Claro y Liberados."
		},
		{
			nombreCategoria : "LINEA BLANCA",
			imagen : "img/tag3.png",
			descripcion:"Refrigeracion, Estufas, Lavadoras."
		},
		{
			nombreCategoria : "VIDEOJUEGOS",
			imagen : "img/tag4.png",
			descripcion:"Playstation, Xbox One, Pc Gaming."
		},
		{
			nombreCategoria : "COMPUTACION",
			imagen : "img/tag5.png",
			descripcion:"Laptop, Desktop, Accesorios."
		},
		{
			nombreCategoria : "AUDIO",
			imagen : "img/tag6.png",
			descripcion:"Audifonos, Fiestas, Bocinas Personales."
		}
  
	]

	//mostrar productos filtrados por categoria
	$scope.viewProducts = function(ncategoria){
		$rootScope.nombreCategoria = ncategoria;
		$state.go("products")
	}

})


.controller('carritoCtrl', function($scope, Chats, $rootScope) {
	if($rootScope.carrito == undefined){
		$rootScope.vista = false;
		$rootScope.nada = true;
	}

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});

