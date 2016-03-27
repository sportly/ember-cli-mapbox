import Ember from 'ember';
import layout from '../templates/components/mapbox-marker';
import { MARKER_EVENTS } from '../constants/events';

export default Ember.Component.extend({
  classNameBindings: ['isLoaded'],
  layout: layout,
  symbol: '',
  color: '#444444',
  draggable: false,
  hasPopup: false,
  marker: null,

  isLoaded: Ember.computed('map', 'marker', function() {
    let map = this.get('map');
    let marker = this.get('marker');
    let cluster = this.get('cluster');
    if (!Ember.isEmpty(map) && !Ember.isEmpty(marker)) {
      if (!Ember.isEmpty(cluster)) {
        cluster.addLayer(marker);
      } else {
        marker.addTo(map);
      }
      return true;
    } else {
      return false;
    }
  }),

  iconChange: Ember.observer('color', 'size', 'symbol', function() {
    let map = this.get('map');
    let marker = this.get('marker');
    if (typeof map !== 'undefined' && marker != null) {
      marker.setIcon(L.mapbox.marker.icon({
        'marker-color': this.get('color'),
        'marker-size': this.get('size'),
        'marker-symbol': this.get('symbol')
      }));
    }
  }),

  coordinatesChange: Ember.observer('coordinates', function() {
    let marker = this.get('marker');
    if (marker === null) {
      return;
    }
    marker.setLatLng(this.get('coordinates'));
  }),

  setup: Ember.on('init', function() {
    let marker = L.marker(this.get('coordinates'), {
      icon: L.mapbox.marker.icon({
        'marker-color': this.get('color'),
        'marker-size': this.get('size'),
        'marker-symbol': this.get('symbol')
      }),
      draggable: this.get('draggable')
    });

    if (this.get('hasPopup')) {
      marker.bindPopup(this.get('popup-title'));
    }

    MARKER_EVENTS.forEach((event) => {
      marker.on(event, (e) => this.sendAction('on' + event, marker, e));
    });

    this.set('marker', marker);
  }),

  teardown: Ember.on('willDestroyElement', function() {
    let marker = this.get('marker');
    let map = this.get('map');
    if (map && marker) {
      map.removeLayer(marker);
    }
  }),

  popup: Ember.on('didRender', function() {
    if (this.get('is-open')) {
      this.get('marker').openPopup();
      if (this.get('recenter')) {
        this.get('map').setView(this.get('coordinates'));
      }
    }
  })
});
