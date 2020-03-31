function sumsum(){
	var gameDOM = document.getElementsByClassName( "game" ) , s = gameDOM.length
	while( s-- ){ // FOREACH GAME
		var inputDOM = gameDOM[ s ].getElementsByTagName( "input" ) , t = inputDOM.length

		while( t-- ){ // FOREACH INPUT
			var input = inputDOM[ t ] , attrib = input.attributes , u = attrib.length

			input.value = input.attributes.value !== undefined ? input.attributes.value.value : "" //reset
			input.ranges = []

			while( u-- ){ // parse rNN_NN attributes and put into input.ranges
				var rng = attrib[ u ].name.match( /r(\d+)_(\d+)/ )
				if( rng ) input.ranges.push( [ rng[ 0 ] , parseInt( rng[ 1 ] ) , parseInt( rng[ 2 ] ) ] )
			}

			var play = function( evt ){
				var node = evt.target , v = node.value , rng  = node.ranges.find( r => v >= r[ 1 ] && v <= r[ 2 ] ? r[ 0 ] : false )
				var game = node.closest( ".game" )
				if( rng ){
					var result = node.attributes[ rng[ 0 ] ].nodeValue
					game.querySelector( ".gameover" ).textContent = result

					if( evt.once ) return true

				}else if( !evt.once ){ 	// check the other inputs

					var other = game.getElementsByTagName( "input" ) , r = other.length
					while( r-- ){ if( other[ r ] != node && other[ r ].play ){

						var result = other[ r ].play( { target : other[ r ] , once : true } )
						if( result ) break

					} }

					// sustainable
					if( !result ){
						var over = game.querySelector( ".gameover" )
						over.textContent = game.attributes.win.nodeValue
						over.className += " gamewon"
						var r = other.length
						while( r-- ){ other[ r ].disabled = true }
					}
				}
				return false
			}

			if( input.ranges.length > 0 ) input.addEventListener( "change" , play )
			input.play = play
		}
	}
		
}
