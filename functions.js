/////////////////////////
//				 //
//		MISC FUNCTIONS   //
//  				//
/////////////////////////
//
//        ANGLE FUNCTIONS
//
//
//
function deg_to_rad(deg) {
    return deg * Math.PI / 180.0;
}

function rad_to_deg(rad) {
    return 180 * rad / Math.PI;
}

function cart_to_polar(x, y, z) {
    var ret = new THREE.Vector3();
    ret.set(Math.atan2(y, x), Math.atan2(Math.sqrt(x * x + y * y), z), Math.sqrt(x*x + y*y + z*z));
    return ret;
}

function polar_to_cart(theta, phi, radius) {
    var ret = new THREE.Vector3();
    theta = deg_to_rad(90 - theta);
    phi = deg_to_rad(phi);
    ret.set(radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)); // Y AND Z ARE SWITCHED
    return ret;
}

function angle_between_vectors(a, b) { // CARETESIAN VECTORS
    var dot_product = a.x * b.x + a.y * b.y + a.z * b.z;
    return rad_to_deg(Math.acos(dot_product));
}

function angle_to_positive(angle) {
    if (angle < 0) {
        return (360.0 + angle);
    } else {
        return angle;
    }
}
//        
//        
//
//        LOADING FUNCTION
//
//
//
//
function load_ports() {
    var x,
        loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    //console.log( port_names );
    loader.load("TargetChamberPorts.dae", function (collada) {
        var dae_large = collada.scene.getDescendants();
        for ( x = 0; x < port_names.length; x += 1) {

            dae = dae_large[x]; // Geometry
            var port_texture = new THREE.ImageUtils.loadTexture('data/textures/' + dae.name.replace('_', '') + '.png'), // LAST HERE. Find descrepency entre port_names[x] and dae.name!!
                port_material = new THREE.MeshBasicMaterial({
                    map: port_texture,
                    transparent: true,
                    opacity: 1.0
                });
            dae.name = port_names[x];
            dae.scale.x = dae.scale.y = dae.scale.z = SCALE;
            dae.rotation.y = -0.328; // Weird shift in orientation...I think the models were exported incorrectly oriented
            dae.updateMatrix(loader.options.convertUpAxis = true);
            dae.geometry.computeBoundingBox();
            dae.material = port_material;
            
            scene.add(dae);
            objects.push(dae);
            
            if (include(leg1_names, port_names[x])) {
                leg1_ports.push(dae);
            } else if (include(leg2_names, port_names[x])) {
                leg2_ports.push(dae);
            } else if (include(leg3_names, port_names[x])) {
                leg3_ports.push(dae);
            }
            
        }
    });
}
//        
//        
//
//        TOGGLES
//
//
//
//
function toggle_diagnostic(name) {
    //var e = document.getElementById("diag_select");
    //var strUser = e.options[e.selectedIndex].value;
    //console.log( name );
    var i;
    for (i = 0; i < diagnostics.length; i += 1) {
        //console.log( diagnostics[i].name );
        console.log(diagnostics[i].name);
        console.log(name);
        if (diagnostics[i].name.trim() == name.trim()) {
            console.log("MATCH");
            var obj = diagnostics[i];
            obj.visible ^= true;
            break;
        }
    }

}

function toggle_TC() {
    target_chamber.visible ^= true;
}

// Check what array port is in
function include(arr, obj) {
    return (arr.indexOf(obj) !== -1);
}

// Turn on and off ports

function toggle_ports(id) {
    var i;
    switch (id) {
    case 0: // LEG 1 (Blue)
        for (i = 0; i < leg1_ports.length; i += 1) {
            leg1_ports[i].visible ^= true;
        }
        break;
    case 1: // LEG 2 (Green)
        for (i = 0; i < leg2_ports.length; i += 1) {
            leg2_ports[i].visible ^= true;
        }
        break;
    case 2: // LEG 3 (Red)
        for (i = 0; i < leg3_ports.length; i += 1) {
            leg3_ports[i].visible ^= true;
        }
        break;
    }
}

function change_opacity() {
    var i;
    for (i = 0; i < objects.length; i++) {
        objects[i].material.opacity < 1 ? objects[i].material.opacity = 1 : objects[i].material.opacity = 0.4;
    }
}

function toggle_tools_visibility() {
    var e = document.getElementById("tools_div");
    if (e.style.display == 'block') {
        e.style.display = 'none';
    } else {
        e.style.display = 'block';
    }
}

function choose_obj_by_id(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].portID == id) {
            return array[i];
        }
    }
    return null;
}

//        
//        
//
//        DRAWING
//
//
//
// Beam port lines needs lots of fixing, but I'm triaging for now and leaving it alone
function draw_beam_port_lines() { // AUTOMATICALLY TOGGLES
    if (beam_port_lines.length) {
        //console.log(beam_port_lines);
        for (var i = 0; i < beam_port_lines.length; i++) {
            beam_port_lines[i].visible ^= true;
        }
    } else {
        for (var i = 0; i < beamPorts.length; i++) {

            var line = new draw_line_polar(260, parseInt(beamPorts[i].theta), parseInt(beamPorts[i].phi), Math.random() * 0xffffff, 2, true, 10, 3, 0);
            line.visible = false;
            scene.add(line);
            //console.log( line );
            beam_port_lines.push(line);
        }
    }
}


function draw_line(start, end, color, line_width, dashed, dash_size, gap_size) {
    var geometry = new THREE.Geometry();
    var vert_array = geometry.vertices;
    vert_array.push(start, end);
    geometry.computeLineDistances();
    if (dashed) {
        var line_material = new THREE.LineDashedMaterial({
            color: color,
            dashSize: dash_size,
            gapSize: gap_size,
            linewidth: line_width
        });
    } else {
        var line_material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: line_width
        });
    }
    var line = new THREE.Line(geometry, line_material);
    //console.log( line );
    return line;
}

function draw_line_polar(radius, theta, phi, color, line_width, dashed, dash_size, gap_size, full_line) {
    // Takes degrees!
    var start = new THREE.Vector3(0, 0, 0);
    var end = polar_to_cart(theta, phi, radius);

    return draw_line(start, end, color, line_width, dashed, dash_size, gap_size);

}



//        
//        
//
//        MISC
//
//
//
//
//quick and dirty open/close tab method
function TabButton(item) {
    var theContentArea = item.id.split("Button")[0] + "Content";
    var buttonID = $(item).attr('class').split(" ")[0];
    buttonId = buttonID.split("Button")[0];

    //alert($(item).attr('rel'));

    if ($(item).attr('rel') == "open") {
        $('#' + theContentArea).animate({
            width: '-500px'
        }, '4000');
        if (buttonId == "right") {
            $(item).animate({
                left: '+500px'
            }, '4000');
        } else {
            $(item).animate({
                left: '-500px'
            }, '4000');
        }

        $(item).attr('rel', 'close');
    } else {
        $('#' + theContentArea).animate({
            width: '+500px'
        }, '4000');
        if (buttonId == "right") {
            $(item).animate({
                left: '0px'
            }, '4000');
        } else {
            $(item).animate({
                left: '0px'
            }, '4000');
        }

        $(item).attr('rel', 'open');
    }
}