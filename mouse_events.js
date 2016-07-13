	/////////////////////////
	//							  //
	//		MOUSE EVENTS     //
	//  						  //
	/////////////////////////

	function onDocumentMouseDown(event) {

		//event.preventDefault();
		CLICKED = true;
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5);
		projector.unprojectVector(vector, camera);

		var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

		var intersects = raycaster.intersectObjects(objects);

		if (intersects.length > 0) {

			var vector = new THREE.Vector3();
			var obj = intersects[0].object;

			ortho_camera.position.x = 32.5*(obj.geometry.boundingBox.max.x + obj.geometry.boundingBox.min.x)/2;
			ortho_camera.position.y = 32.5*(obj.geometry.boundingBox.max.y + obj.geometry.boundingBox.min.y)/2;
			ortho_camera.position.z = 32.5*(obj.geometry.boundingBox.max.z + obj.geometry.boundingBox.min.z)/2;
			ortho_camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
			var sphere_geometry = new THREE.SphereGeometry((obj.geometry.boundingBox.max.x + obj.geometry.boundingBox.min.x)/2,
																			 (obj.geometry.boundingBox.max.y + obj.geometry.boundingBox.min.y)/2, 
																			 (obj.geometry.boundingBox.max.z + obj.geometry.boundingBox.min.z)/2);
			var sphere_material = new THREE.MeshLambertMaterial({
				color : 0xffffff,
				transparent: true,
				opacity: .5
			});

			var sphere_mesh = new THREE.Mesh(sphere_geometry, sphere_material);
			scene.add(sphere_mesh);

			//obj.material.color.setHex(Math.random() * 0xffffff);		
			SELECTED_PORTS.unshift( obj ); // put obj at front of array
			if (SELECTED_PORTS.length > 2) SELECTED_PORTS.pop();
			if (SELECTED_PORTS.length == 2) {
				document.getElementById("selected_port1").innerHTML = SELECTED_PORTS[0].name;
				document.getElementById("selected_port2").innerHTML = SELECTED_PORTS[1].name;
				var port1 = choose_obj_by_id( phpArray.Data, SELECTED_PORTS[0].name );
				var port2 = choose_obj_by_id( phpArray.Data, SELECTED_PORTS[1].name );

				var vec1 = polar_to_cart( parseInt( port1.azimuthalangle ), parseInt( port1.polarangle ), 1 ); //RADIUS OF 1 FOR NORMALIZATION
				var vec2 = polar_to_cart( parseInt( port2.azimuthalangle ), parseInt( port2.polarangle ), 1 );
				//console.log( vec1 );
				//console.log( angle_between_vectors( vec1, vec2 ) );
				document.getElementById( "angle_between" ).innerHTML = angle_between_vectors( vec1, vec2 ).toFixed(3) + "°";

			} else {
				document.getElementById("selected_port1").innerHTML = obj.name;	
			}
			/*document.getElementById("div-test").style.left = mouse_real.x + "px";
			document.getElementById("div-test").style.top = mouse_real.y  + "px";
			
			document.getElementById("test").style.border = "5px solid #cc0000";
			$('span').addClass('change');*/
			
			/*projector.projectVector( vector.set((obj.geometry.boundingBox.min.x + obj.geometry.boundingBox.max.x) / .02, 
															(obj.geometry.boundingBox.min.y + obj.geometry.boundingBox.max.y) / .02, 
															(obj.geometry.boundingBox.min.z + obj.geometry.boundingBox.max.z) / .02 ), camera );
			
			vector.x = ( vector.x * widthHalf ) + widthHalf;
			vector.y = - ( vector.y * heightHalf ) + heightHalf;*/
			
			//console.log( vector.x, vector.y );					
			//console.log( (obj.geometry.boundingBox.min.x + obj.geometry.boundingBox.max.x) / 2,
			//				 (obj.geometry.boundingBox.min.y + obj.geometry.boundingBox.max.y) / 2,
			//				 (obj.geometry.boundingBox.min.z + obj.geometry.boundingBox.max.z) / 2 );
		} else {
			CLICKED = false;
		}
	}
	
	function onDocumentMouseMove( event ) {
		
		event.preventDefault();
		mouse_real.x = event.clientX;
		mouse_real.y = event.clientY;
		
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	}
	
	$(document).keydown(function(e) {
    switch(e.which) {
        case 84: // 't': toggle TC visibility
        toggle_TC();
        break;

        case 79: // 'o': port opacity
        change_opacity();
        break;

        case 80: // 'p': port view
        show_port_view ^= true;
        break;
        
        case 188: // ',': decrease FOV
        camera.fov -= 5;
		  camera.updateProjectionMatrix();
        break;
        
        case 190:
        camera.fov +=5;
		  camera.updateProjectionMatrix();
		  break;
		  	
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
	