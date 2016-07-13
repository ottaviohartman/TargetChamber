function Cone( theta, phi ) {
    
    var that = this;

    var _theta = deg_to_rad(theta + 90),
        _phi = deg_to_rad(phi),    
        
        // radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded
        _cone_geometry = new THREE.CylinderGeometry(10, .5, 200, 12, 10, false), 
        
        _cone_material = new THREE.MeshLambertMaterial({
            color: 0xee0000
        }),
    
        _radius = 162.611;
    
    _cone_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 100, 0)); // Change rotation point
    
    this.mesh = new THREE.Mesh(_cone_geometry, _cone_material);
    this.mesh.rotation.y = _theta;
    this.mesh.rotation.z = _phi;
    
    this.rotate = function( theta, phi ) {
        
        _theta = deg_to_rad(theta + 90); 
        _phi = deg_to_rad(phi);
        that.mesh.rotation.y = _theta;
        that.mesh.rotation.z = _phi;
        
    };
    
    this.setRadius = function( radius ) {
        
        _radius = radius;
        
        _cone_geometry = new THREE.CylinderGeometry(10, .1, _radius, 12, 10, false); 
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, radius / 2.0, 0)); //Change rotation point
                
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeRotationZ( _phi ));
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeRotationY( _theta ));
        
        that.mesh = new THREE.Mesh(_cone_geometry, _cone_material);        
    }
    
    this.changeCenter = function( center ) { // Takes THREE.Vector3
        
        var start = polar_to_cart( rad_to_deg( _theta ) + 90, rad_to_deg( _phi ), _radius ); // Vector3
//        console.log( start );
//        console.log( center );
        var subtraction = start.sub( center );
//        console.log( subtraction );
//        console.log( "new" );
        var c = cart_to_polar( subtraction.x, subtraction.z, subtraction.y ); // Must switch z and y
        console.log( _theta );
        console.log( _phi );
        console.log( c );
        
        _cone_geometry = new THREE.CylinderGeometry(10, .1, c.z, 12, 10, false); 
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, c.z / 2.0, 0)); //Change rotation point
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeRotationZ( c.y ));
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeRotationY( c.x ));
        _cone_geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -center.x, center.y, center.z ) );

        that.mesh = new THREE.Mesh(_cone_geometry, _cone_material);        
        
    }
}

function draw_beam_cones() {
    if (beam_cones.length) {
        for (var i = 0; i < beam_cones.length; i++) {
            beam_cones[i].mesh.visible ^= true;
        }
    } else {
        for (var i = 0; i < beamPorts.length; i++) {
            //var center = new THREE.Vector3(0, -100, 0);

            //var a = change_beam_cone_center(center, parseInt(beamPorts[i].theta), parseInt(beamPorts[i].phi));
            //console.log(a);
            //var cone = draw_cone(a.x, a.y);

            //var cone = draw_cone( parseInt( beamPorts[i].theta ), parseInt( beamPorts[i].phi ) );
            var cone = new Cone( parseInt( beamPorts[i].theta ), parseInt( beamPorts[i].phi ) );
            cone.mesh.visible = true;
            cone.setRadius( 180 );
            cone.changeCenter( new THREE.Vector3(50,30,0) );

            scene.add(cone.mesh); // only storing mesh!!!
            beam_cones.push(cone);
        }
    }
}

function change_beam_cone_center(center, theta, phi) {
    // Returns new theta and phi
    // Changes az and polar angles to cartesian, adds the center, then converts back

    var radius = 162.6; // Radius of Target Chamber
    var ret = polar_to_cart(theta, phi, radius); //Vector3

    ret.x += center.x;
    ret.y += center.y;
    ret.z += center.z;
    //console.log(ret);

    ret = cart_to_polar(ret.x, ret.y, ret.z);

    ret.x = rad_to_deg(ret.x);
    ret.y = rad_to_deg(ret.y);
    console.log(ret);

    //console.log(ret);
    return ret;
}

