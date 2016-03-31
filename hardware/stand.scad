WIDTH =   120;
HEIGHT =  160;

module two_rods(y) {
  rotate([0, 90, 0]) {
    translate([0, -y, 0])
    cylinder(5, 3, 3, true);
    translate([0, y, 0])
    cylinder(5, 3, 3, true);
  }
}

module rods(y, z) {
  translate([0, 0, -z / 2])
  two_rods(y / 2);
  translate([0, 0, z / 2])
  two_rods(y / 2);
}

module wall() {
  difference() {
    cube([3, WIDTH + 40, HEIGHT + 40], true);

    rotate([0, 90, 0])
    cylinder(5, 15, 15, true);

    rods(WIDTH, HEIGHT);
  }
}

wall();
translate([400, 0, 0])
wall();
