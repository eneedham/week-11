// Leaflet map setup
var map = L.map('map', {
  center: [9.123675, -79.695887],
  zoom: 16
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


// Include this CSS so that torque knows what to do
var CARTOCSS = [
  'Map {',
  '-torque-frame-count:256;',
  '-torque-animation-duration:30;',
  '-torque-time-attribute:"cartodb_id";',
  '-torque-aggregation-function:"count(cartodb_id)";',
  '-torque-resolution:8;',
  '-torque-data-aggregation:linear;',
  '}',
  '#toucan_movement_seed_dispersal_gamboa_kays_et_al{',
    'comp-op: lighter;',
    'marker-fill-opacity: 0.9;',
    'marker-line-color: #FFFFFF;',
    'marker-line-width: 0;',
    'marker-line-opacity: 1;',
    'marker-type: ellipse;',
    'marker-width: 6;',
    'marker-fill: #FF5C00;',
  '}',
  '#toucan_movement_seed_dispersal_gamboa_kays_et_al[frame-offset=1] {',
   'marker-width:8;',
   'marker-fill-opacity:0.45;',
  '}'
].join('\n');

// Create the actual layer to be used
var torqueLayer = new L.TorqueLayer({
  user: 'eneedham',
  cartocss: CARTOCSS
});
torqueLayer.addTo(map);

// On timechange, update the HTML which hovers over the upper right of the map
torqueLayer.on('change:time', function(d) {
  var time = $('<h3>').text('Time - ' + moment(d.time).format('HH:mm'));
  $('div#time-window div').empty();
  $('#time-window div').append(time);
});

// We'll just create some buttons for the first 7 days of cab data
_.each([08, 09, 10, 11, 12], function(num) {
  var button = $('<button>')
    .addClass('btn')
    .addClass('btn-default')
    .text('Play timeline for December ' + num)
    .click(function() {
      $('#time-window').empty();
      $('#time-window')
        .append($('<h1>').text('Date - 2007-12-' + num))
        .append($('<div>'));
      torqueLayer.stop();
      torqueLayer.setSQL("SELECT * FROM toucan_movement_seed_dispersal_gamboa_kays_et_al WHERE individual_local_identifier = '#79896'");
      torqueLayer.play();
    });
  $('#button-container').append(button);
});
