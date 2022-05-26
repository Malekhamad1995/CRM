export const GoogleMapsStyles = {
  default: [],
  silver: [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        {
          invert_lightness: true
        },
        {
          saturation: '-9'
        },
        {
          lightness: '0'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'all',
      stylers: [
        {
          weight: '1.00'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        {
          weight: '0.49'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'on'
        },
        {
          weight: '0.01'
        },
        {
          lightness: '-7'
        },
        {
          saturation: '-35'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'on'
        }
      ]
    }
  ],
  night: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
  retro: [
    { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#c9b2a6' }],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#dcd2be' }],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ae9e90' }],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#93817c' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#a5b076' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#447530' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f5f1e6' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#fdfcf8' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#e9bc62' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{ color: '#e98d58' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#db8555' }],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#806b63' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8f7d77' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ebe3cd' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b9d3c2' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#92998d' }],
    },
  ],
  hiding: [{
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#ffffff'
    }]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
      color: '#efefef'
    }]
  }, {
    featureType: 'water',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      visibility: 'on'
    }, {
      color: '#dedddd'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      visibility: 'on'
    }, {
      color: '#efefef'
    }]
  }, {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'on'
    }]
  }],
  graa: [{ stylers: [{ saturation: -100 }, { gamma: 0.8 }, { lightness: 4 }, { visibility: 'on' }] }],
  Hopper: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#165c64'
        },
        {
          saturation: 34
        },
        {
          lightness: -69
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#b7caaa'
        },
        {
          saturation: -14
        },
        {
          lightness: -18
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'all',
      stylers: [
        {
          hue: '#cbdac1'
        },
        {
          saturation: -6
        },
        {
          lightness: -9
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#8d9b83'
        },
        {
          saturation: -89
        },
        {
          lightness: -12
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#d4dad0'
        },
        {
          saturation: -88
        },
        {
          lightness: 54
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#bdc5b6'
        },
        {
          saturation: -89
        },
        {
          lightness: -3
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#bdc5b6'
        },
        {
          saturation: -89
        },
        {
          lightness: -26
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#c17118'
        },
        {
          saturation: 61
        },
        {
          lightness: -45
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'all',
      stylers: [
        {
          hue: '#8ba975'
        },
        {
          saturation: -46
        },
        {
          lightness: -28
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#a43218'
        },
        {
          saturation: 74
        },
        {
          lightness: -51
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [
        {
          hue: '#ffffff'
        },
        {
          saturation: 0
        },
        {
          lightness: 100
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'all',
      stylers: [
        {
          hue: '#ffffff'
        },
        {
          saturation: 0
        },
        {
          lightness: 100
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels',
      stylers: [
        {
          hue: '#ffffff'
        },
        {
          saturation: 0
        },
        {
          lightness: 100
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'all',
      stylers: [
        {
          hue: '#ffffff'
        },
        {
          saturation: 0
        },
        {
          lightness: 100
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'all',
      stylers: [
        {
          hue: '#3a3935'
        },
        {
          saturation: 5
        },
        {
          lightness: -57
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.medical',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#cba923'
        },
        {
          saturation: 50
        },
        {
          lightness: -46
        },
        {
          visibility: 'on'
        }
      ]
    }
  ],
};
