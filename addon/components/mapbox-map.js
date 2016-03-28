import Ember from 'ember';
import layout from '../templates/components/mapbox-map';
import { MAP_EVENTS } from '../constants/events';

export default Ember.Component.extend({
  layout: layout,
  divId: 'map',

  mapId: null,

  setup: Ember.on('didInsertElement', function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      let map = L.mapbox.map(this.get('divId'), this.get('mapId'));

      // Setters
      if (this.get('center')) {
        map.setView(this.get('center'), this.get('zoom'));
      }

      // Bind Events
      MAP_EVENTS.forEach((event) => {
        map.on(event, (e) => this.sendAction('on' + event, map, e));
      });

      if (this.get('click')) {
        Ember.deprecate('The "click" action in mapbox-map is deprecated, please use "onclick" instead.', false, {
          id: 'mapbox-map-click-action',
          url: 'https://github.com/binhums/ember-cli-mapbox',
          until: '1 April 2016'
        });

        map.on('click', (e) => this.sendAction('click', map, e));
      }

      // Set
      this.set('map', map);
    });
  }),

  centerChange: Ember.observer('center', function() {
    let map = this.get('map');
    if (map === null) {
      return;
    }
    map.setView(this.get('center'));
  }),

  zoomChange: Ember.observer('zoom', function() {
    let map = this.get('map');
    if (map === null) {
      return;
    }
    map.setView(this.get('center'), this.get('zoom'));
  }),

});
