/*
 * --------------------------------*
 *           Global vars           *
 * --------------------------------*
 */

/* global _, Clusterize */

var map = L.map('saber-map', {
        center: [36, -36],
        zoom: 3,
        minZoom: 3,
        maxZoom: 7,
        maxBounds: [[-57, -200], [80, 200]],
        zoomControl: false,
        wheelPxPerZoomLevel: 120,
        maxBoundsViscosity: 1
    }),

    helperCoords = map.options.center,
    clusterArray = {},
    clusterArrayCopy = {},

    rowsArray = [],
    clusterize,

    countries = {},

    countryUrl = 'https://scoresaber.com/global?country=',
    altCountry = 'https://ssr.motzel.dev/ranking/',
    saberProfile = 'https://scoresaber.com/u/',
    altProfile = 'https://ssr.motzel.dev/u/',
    newApi = 'https://new.scoresaber.com',

    // ------------------
    //   Color Markers
    // ------------------

    // eslint-disable-next-line no-unused-vars
    greenIcon = L.icon({
        iconUrl: 'images/marker-icon-green.png',
        iconRetinaUrl: 'images/marker-icon-2x-green.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    }),

    // eslint-disable-next-line no-unused-vars
    yellowIcon = L.icon({
        iconUrl: 'images/marker-icon-yellow.png',
        iconRetinaUrl: 'images/marker-icon-2x-yellow.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    }),

    // eslint-disable-next-line no-unused-vars
    orangeIcon = L.icon({
        iconUrl: 'images/marker-icon-orange.png',
        iconRetinaUrl: 'images/marker-icon-2x-orange.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    }),

    // eslint-disable-next-line no-unused-vars
    blueIcon = L.icon({
        iconUrl: 'images/marker-icon-blue.png',
        iconRetinaUrl: 'images/marker-icon-2x-blue.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    }),

    // eslint-disable-next-line no-unused-vars
    darkblueIcon = L.icon({
        iconUrl: 'images/marker-icon-darkblue.png',
        iconRetinaUrl: 'images/marker-icon-2x-darkblue.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    }),

    // eslint-disable-next-line no-unused-vars
    redIcon = L.icon({
        iconUrl: 'images/marker-icon-red.png',
        iconRetinaUrl: 'images/marker-icon-2x-red.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    }),

    helperIcon = L.icon({
        iconUrl: 'images/marker-icon-black.png',
        iconRetinaUrl: 'images/marker-icon-2x-black.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: 'helper-marker'
    }),

    discordIcon = L.icon({
        iconUrl: 'images/discord-icon.png',
        iconRetinaUrl: 'images/discord-icon-2x.png',
        shadowUrl: '',
        iconSize: [35, 40],
        iconAnchor: [35, 40],
        popupAnchor: [-17, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [40, 40]
    }),

    // Create a helper marker
    helperMarker = L.marker(helperCoords, {
        icon: helperIcon,
        draggable: true
    }),

    // Display a helper popup with current position coordinates
    helperPopup = L.popup({
        closeButton: false,
        closeOnClick: false,
        className: 'helper-popup'
    }).setLatLng(helperCoords)
        .setContent('[' + helperCoords[0] + ', ' + helperCoords[1] + ']'),

    discordLayer = L.layerGroup(),

    discordMarkers = [
        {
            position: [55.5, -108],
            tooltip: 'Beat Saber Canadian Discord 🍁',
            popup: getPopupMarkup('Beat Saber Canadian Discord 🍁', null, null, 'https://discord.gg/vvq7wX3')
        },
        {
            position: [52.39, -0.24],
            tooltip: 'British Beat Saber Discord',
            popup: getPopupMarkup('British Beat Saber Discord', null, null, 'https://discord.gg/FC2pzeN')
        },
        {
            position: [53.37, -7.9],
            tooltip: 'Beat Saber na hÉireann',
            popup: getPopupMarkup('Beat Saber na hÉireann', null, null, 'https://discord.gg/uKQzjRQ')
        },
        {
            position: [49.31, 14.36],
            tooltip: 'CzechSaber Community',
            popup: getPopupMarkup('CzechSaber', null, null, 'https://discord.gg/r42NEPt3w5')
        },
        {
            position: [63.23, 88.24],
            tooltip: 'Beato Saba',
            popup: getPopupMarkup('Beato Saba', 'RU, UA, BY, KZ, etc.', null, 'https://discord.gg/5JXRY8z')
        },
        {
            position: [52.6, 26.19],
            tooltip: 'Beato Saba',
            popup: getPopupMarkup('Beato Saba', 'RU, UA, BY, KZ, etc.', null, 'https://discord.gg/5JXRY8z')
        },
        {
            position: [49.4, 33.27],
            tooltip: 'Beato Saba',
            popup: getPopupMarkup('Beato Saba', 'RU, UA, BY, KZ, etc.', null, 'https://discord.gg/5JXRY8z')
        },
        {
            position: [48.75, 69.17],
            tooltip: 'Beato Saba',
            popup: getPopupMarkup('Beato Saba', 'RU, UA, BY, KZ, etc.', null, 'https://discord.gg/5JXRY8z')
        },
        {
            position: [-23.5, 134.6],
            tooltip: 'AU Discord',
            popup: getPopupMarkup('AU Discord', 'Australia, New Zealand', 'SimplyMarvellous#0290')
        },
        {
            position: [52, 10.5],
            tooltip: 'BeatSaber Community DE',
            popup: getPopupMarkup('BeatSaber Community DE', null, null, 'https://discord.gg/y4G6ruN')
        },
        {
            position: [44.4, 5],
            tooltip: 'Beat Saber FR',
            popup: getPopupMarkup('Beat Saber FR', null, null, 'https://discord.gg/8cAAa7J')
        },
        {
            position: [46.6, 9.71],
            tooltip: 'SwissSaber',
            popup: getPopupMarkup('SwissSaber', null, null, 'https://discord.gg/eV6SUUF')
        },
        {
            position: [60.45, 14.88],
            tooltip: 'Beat Saber Sweden',
            popup: getPopupMarkup('Beat Saber Sweden', null, null, 'https://discord.gg/9HavEGBzZz')
        },
        {
            position: [47.49, 13.43],
            tooltip: 'Beatsaber Community Austria',
            popup: getPopupMarkup('Beatsaber Community Austria', null, null, 'https://discord.gg/TvRkNY2')
        },
        {
            position: [30.91, 34.88],
            tooltip: 'Beat Saber Israel',
            popup: getPopupMarkup('Beat Saber Israel', null, null, 'https://discord.gg/HHH7sK8')
        },
        {
            position: [53, 5.8],
            tooltip: 'Nederlandse Beat Saber Groep',
            popup: getPopupMarkup('Nederlandse Beat Saber Groep', null, null, 'https://discord.gg/sDa7xrE')
        },
        {
            position: [61.21, 8.61],
            tooltip: 'Beat Saber Norge',
            popup: getPopupMarkup('Beat Saber Norge', null, null, 'https://discord.gg/nZuY3yM')
        },
        {
            position: [42.4, -5.2],
            tooltip: 'BeatSaber España',
            popup: getPopupMarkup('BeatSaber España', null, null, 'https://discord.gg/x6mChxk')
        },
        {
            position: [41.29, 15.03],
            tooltip: 'Italian Beat Saber community',
            popup: getPopupMarkup('Italian Beat Saber community', null, null, 'https://discord.gg/asdJZ7cTxe')
        },
        {
            position: [64.13, 28.04],
            tooltip: 'Tahti Sapeli',
            popup: getPopupMarkup('Tahti Sapeli', null, null, 'https://discord.gg/qCtX7yBv7J')
        },
        {
            position: [37, 128.9],
            tooltip: 'KOR Community',
            popup: getPopupMarkup('KOR Community', 'South Korea', null, 'https://discord.gg/SEFBZrG')
        },
        {
            position: [55.6, 8.9],
            tooltip: 'Dane Saber',
            popup: getPopupMarkup('Dane Saber', null, null, null, '<a href="https://forms.gle/AhgBFSK7RnRDDMHa9" target="_blank">Application Form</a>')
        },
        {
            position: [50.9, 3.08],
            tooltip: 'Belgian Beat Saber Community',
            popup: getPopupMarkup('Belgian Beat Saber Community', null, null, null, '<a href="https://forms.gle/26VXi4HmnZnDoPZN7" target="_blank">Application Form</a>')
        },
        {
            position: [5.9, 102.2],
            tooltip: 'Asia VR Community',
            popup: getPopupMarkup('Asia VR Community', 'Malaysia, Singapore, India,<br>Taiwan, Thailand, Philippines,<br>South Korea, Japan, China, etc.', null, null, '<a href="https://forms.gle/Ga3jWoCkugPBD6BZ6" target="_blank">Application Form</a>')
        },
        {
            position: [37.16, 44.69],
            tooltip: 'Beat Saber Middle East',
            popup: getPopupMarkup('Beat Saber Middle East', 'Egypt, Iran, Turkey, Iraq,<br>Saudi Arabia, Yemen, UAE, Kuwait, etc.', null, null, '<a href="https://forms.gle/Vbh6eRpEqpZ8w4R77" target="_blank">Application Form</a>')
        },
        {
            position: [31.7, 99.2],
            tooltip: 'CN Community (QQ)',
            popup: getPopupMarkup('CN Community', null, null, null, '<strong>QQ group ID</strong>: 916499592')
        }
    ];

/*
 * --------------------------------*
 *            Functions            *
 * --------------------------------*
 */

// Get popup markup
function getPopupMarkup (title, countries, contact, invite, comment) {
    var markup = '<div class="popup-info"><div class="popup-item -name">' + title + '</div>';
    if (countries) {
        markup += '<div class="popup-item -info"><strong>Countries:</strong>&nbsp;' + countries + '</div>';
    }
    if (contact) {
        markup += '<div class="popup-item -info"><strong>Contact:</strong>&nbsp;' + contact + '</div>';
    }
    if (invite) {
        markup += '<div class="popup-item -info"><strong>Invite:</strong>&nbsp;<a href="' + invite + '" target="_blank">' + invite + '</a></div>';
    }
    if (comment) {
        markup += '<div class="popup-item -info">' + comment + '</div>';
    }
    markup += '</div>';
    return markup;
}

// Set map view on a marker with ID
function goToMarker (country, id, name) {
    for (var code in clusterArray) {
        if (code !== country) {
            clusterArray[code].unspiderfy();
        }
    }

    clusterArray[country].eachLayer(function (layer) {
        if ((!_.isNil(id) && layer.feature.id === id) ||
            (!_.isNil(name) && layer.feature.properties.n === name)) {
            clusterArray[country].zoomToShowLayer(layer, function () {
                layer.openPopup();
            });
        }
    });
}

// Reset map zoom/position and close all popups
function resetMap (map) {
    map.setView(map.options.center, map.options.zoom).closePopup();
}

// Return icon with color based on months
function getColor (rank) {
    switch (true) {
        case (rank < 10): return 'red';
        case (rank < 100): return 'orange';
        case (rank < 500): return 'green';
        case (rank < 1000): return 'blue';
        case (rank < 2000): return 'darkblue';
        default: return 'yellow';
    }
}

// Fetch suitable rows
function filterRows (rows) {
    var results = [];
    for (var i = 0, ii = rows.length; i < ii; i++) {
        if (rows[i].active) {
            results.push(rows[i].markup);
        }
    }
    return results;
}

// Reset list
function resetList (rows, $counter) {
    var $players = $('#players');

    for (var i = 0, ii = rows.length; i < ii; i++) {
        rows[i].active = true;
    }

    clusterize.update(filterRows(rows));
    $players.find('.active').removeClass('active');
    $players.perfectScrollbar('update');
    $('#search').val('').focus();
    $counter.text(rows.length);
}

// Filter list by different conditions
function filterList (rows, $counter, callback, term) {
    var counter = 0;
    for (var i = 0, ii = rowsArray.length; i < ii; i++) {
        var suitable = false;
        if (callback(rowsArray[i], term)) {
            suitable = true;
            counter++;
        }
        rowsArray[i].active = suitable;
    }
    clusterize.update(filterRows(rowsArray));
    $('#players').perfectScrollbar('update');
    $counter.text(counter);
}

// Match name condition
function matchName (row, term) {
    return row.n.toLowerCase().indexOf(term.toLowerCase()) + 1;
}

// Match rank condition
function matchRank (row, rank) {
    return row.id < rank;
}

// Match region condition
function matchRegion (row, region) {
    if (!(row.properties.c)) {
        console.log(row);
    }
    return countries[row.properties.c.toUpperCase()].continent === region;
}

// Match new players
/* function matchNewPlayers (row) {
    return row.properties.new;
} */

// Filter map by rank
function filterMap (cluster, clusterCopy, callback, term) {
    for (var country in cluster) {
        var markerArray = [];
        clusterCopy[country].forEach(function (layer) {
            if (callback(layer.feature, term)) {
                markerArray.push(layer);
            }
        });
        cluster[country].clearLayers();
        if (markerArray.length) {
            cluster[country].addLayers(markerArray);
        }
    }
}

// Reset clusters on the map
function resetMapClusters (cluster, clusterCopy) {
    for (var country in cluster) {
        cluster[country].clearLayers();
        cluster[country].addLayers(clusterCopy[country]);
    }
}

// Disable current button and enable all others
function disableBtn ($this) {
    $this.closest('.block').find('.btn').prop('disabled', false);
    $this.prop('disabled', true);
}

/*
 * --------------------------------*
 *               Main              *
 * --------------------------------*
 */

$(document).ready(function () {
    // --------------------
    //   jQuery variables
    // --------------------

    var $players = $('#players'),
        $blocks = $('#blocks'),
        $playerSearch = $('#search'),
        $counter = $('#counter');

    // ---------------------------
    //   Leaflet Custom Controls
    // ---------------------------

    L.Control.ZoomReset = L.Control.extend({
        onAdd: function (map) {
            var className = 'leaflet-control-reset-zoom',
                container = L.DomUtil.create('div', 'leaflet-bar'),
                link = L.DomUtil.create('a', className, container),
                options = this.options;

            link.innerHTML = options.html;
            link.href = '#';
            link.title = options.title;
            link.setAttribute('role', 'button');
            link.setAttribute('aria-label', options.title);

            L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', function () {
                    resetMap(map);
                });

            return container;
        }
    });

    // Sidebar Toggle Control declaration
    L.Control.Sidebar = L.Control.extend({
        onAdd: function () {
            var zoomName = 'leaflet-control-sidebar',
                container = L.DomUtil.create('div', zoomName + ' leaflet-bar'),
                options = this.options;

            this._createButton(options.html, options.title,
                zoomName + '-' + options.side, container, this._toggleSidebar);

            return container;
        },

        _toggleSidebar: function (e) {
            var $wrapper = $('.wrapper'),
                wrapperClass = 'toggled-' + this.options.side;
            e.preventDefault();
            $wrapper.toggleClass(wrapperClass);

            // Need to recalculate map bounds after sidebar was toggled
            setTimeout(function () {
                map.invalidateSize();
            }, 500);
        },

        _createButton: function (html, title, className, container, fn) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = title;
            link.setAttribute('role', 'button');
            link.setAttribute('aria-label', title);

            L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this);
        }
    });

    L.control.zoomreset = function (options) {
        return new L.Control.ZoomReset(options);
    };

    L.control.sidebar = function (options) {
        return new L.Control.Sidebar(options);
    };

    // Add 'toggle Left sidebar' control
    L.control.sidebar({
        position: 'topleft',
        html: '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        title: 'Toggle Left',
        side: 'left'
    }).addTo(map);

    // Add 'toggle right sidebar' control
    L.control.sidebar({
        position: 'topright',
        html: '<i class="fa fa-chevron-right" aria-hidden="true"></i>',
        title: 'Toggle Right',
        side: 'right'
    }).addTo(map);

    // Add default zoom controls
    L.control.zoom({
        position: 'topright',
        zoomInText: '<i class="fa fa-search-plus" aria-hidden="true"></i>',
        zoomOutText: '<i class="fa fa-search-minus" aria-hidden="true"></i>'
    }).addTo(map);

    // Add 'reset zoom' control
    L.control.zoomreset({
        position: 'topright',
        html: '<i class="fa fa-home" aria-hidden="true"></i>',
        title: 'Reset Position'
    }).addTo(map);

    // Player search
    $playerSearch.on('input', _.debounce(function (e) {
        var term = e.target.value.trim(),
            len = term.length;

        if (len === 0) {
            resetList(rowsArray, $counter);
            return true;
        }

        if (len > 2) {
            filterList(rowsArray, $counter, matchName, term);
        }
    }, 500));

    // Reset input on button click
    $counter.click(function (e) {
        e.preventDefault();
        resetList(rowsArray, $counter);
    });

    // Go to marker after clicking on player name
    // + highlight the list item
    $players.on('click', '.list-group-item', function () {
        var $this = $(this),
            id = $this.data('id'),
            country = $this.data('country');

        $players.find('.active').removeClass('active');
        $this.addClass('active');

        goToMarker(country, id);
    });

    // Scroll to contact
    /* $('.link-goto').click(function (e) {
        e.preventDefault();
        goToMarker('by', null, 'n3tman');
    }); */

    // Reset clusters on the map
    $('.map-reset').click(function () {
        disableBtn($(this));
        resetMapClusters(clusterArray, clusterArrayCopy);
        resetList(rowsArray, $counter);
    });

    // Filter players by rank
    $('#top10').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRank, 10);
        filterList(rowsArray, $counter, matchRank, 10);
    });

    $('#top100').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRank, 100);
        filterList(rowsArray, $counter, matchRank, 100);
    });

    $('#top500').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRank, 500);
        filterList(rowsArray, $counter, matchRank, 500);
    });

    $('#top1000').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRank, 1000);
        filterList(rowsArray, $counter, matchRank, 1000);
    });

    $('#top2000').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRank, 2000);
        filterList(rowsArray, $counter, matchRank, 2000);
    });

    $('#region-na').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRegion, 'NA');
        filterList(rowsArray, $counter, matchRegion, 'NA');
    });

    $('#region-sa').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRegion, 'SA');
        filterList(rowsArray, $counter, matchRegion, 'SA');
    });

    $('#region-eu').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRegion, 'EU');
        filterList(rowsArray, $counter, matchRegion, 'EU');
    });

    $('#region-af').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRegion, 'AF');
        filterList(rowsArray, $counter, matchRegion, 'AF');
    });

    $('#region-as').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRegion, 'AS');
        filterList(rowsArray, $counter, matchRegion, 'AS');
    });

    $('#region-oc').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchRegion, 'OC');
        filterList(rowsArray, $counter, matchRegion, 'OC');
    });

    /* $('#new-players').click(function () {
        disableBtn($(this));
        filterMap(clusterArray, clusterArrayCopy, matchNewPlayers);
        filterList(rowsArray, $counter, matchNewPlayers);
    }); */

    // ---------------
    //   Main Action
    // ---------------

    $blocks.perfectScrollbar();

    L.tileLayer('https://n3tman.github.io/SaberMap/tiles/{z}/{x}/{y}.png', {
        opacity: 0.6,
        attribution: 'Countries &copy; <a href="http://www.naturalearthdata.com/downloads/10m-cultural-vectors/">Natural Earth</a> | Tiles by <a href="http://ilya.zverev.info/">Zverik</a>'
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png', {
        attribution: 'Labels by <a href="https://carto.com/location-data-services/basemaps/">Carto</a>'
    }).addTo(map);

    // Add a helper marker to help get coordinates
    helperMarker.addTo(map)
        .bindPopup(helperPopup).openPopup()
        // recalculate marker position on drag
        // + don't close it while dragging
        .on('drag', function () {
            var latlng = this.getLatLng();
            helperPopup.setContent('[' + _.round(latlng.lat, 2) + ', ' + _.round(latlng.lng, 2) + ']');
            this.openPopup();
        });

    discordMarkers.forEach(function (marker) {
        var layer = L.marker(marker.position, {icon: discordIcon});
        layer.bindTooltip(marker.tooltip, {sticky: true});
        layer.bindPopup(marker.popup, {
            closeButton: false,
            minWidth: 250,
            maxWidth: 250
        });
        layer.on('popupopen', function () {
            this.closeTooltip();
        });
        layer.addTo(discordLayer);
    });

    discordLayer.addTo(map);

    L.control.layers({}, {'Discord Servers': discordLayer}, {
        collapsed: false
    }).addTo(map);

    // Get country data
    $.getJSON('data/countries.json', function (data) {
        countries = data;
    });

    // Load the player data and add all the markers to the map
    $.ajax({
        cache: false,
        url: 'data/players.json',
        dataType: 'json',
        success: function (data) {
            L.geoJSON(data, {
                // Iterate over players
                onEachFeature: function (feature, layer) {
                    // Construct the contents of the player tooltip and popup
                    var country = feature.properties.c,
                        name = feature.properties.n,
                        rank = feature.properties.r,
                        points = feature.properties.p,
                        url = saberProfile + feature.properties.i,
                        alt = altProfile + feature.properties.i,
                        avatar = newApi + feature.properties.a,
                        id = feature.id,
                        // newPlayer = feature.properties.new,
                        labelColor = getColor(id),
                        tooltipContent, popupContent;

                    tooltipContent = '<span class="tooltip-item -text">' +
                        name + '</span><br><span class="tooltip-item -text">' +
                        rank + '</span>';

                    popupContent = '<div class="popup-photo"><img src="' +
                        avatar + '"></div><div class="popup-info">' +
                        '<div class="popup-item -name">' + name + '</div>' +
                        '<div class="popup-item -profile"><img src="images/ScoreSaberLogo.svg">&nbsp;<a href="' + url + '" target="_blank">ScoreSaber</a> | <img class="ssr" src="images/ssr.png">&nbsp;<a href="' + alt + '" target="_blank">Reloaded</a></div>' +
                        '<div class="popup-item -info"><span><strong>World Rank:</strong>&nbsp;' + rank + '</span></div>' +
                        '<div class="popup-item -info"><span><strong>Points:</strong>&nbsp;' + points + '</span></div>' +
                        '<div class="popup-item -country"><img src="images/blank.gif" class="flag flag-' +
                        country + '">&nbsp;<a href="' + countryUrl + country + '" target="_blank">' + countries[country.toUpperCase()].name + '</a> | <img class="ssr" src="images/ssr.png">&nbsp;<a href="' + altCountry + country + '" target="_blank">SSR</a></div></div>';

                    // Bind the constructed tooltip and popup to the player
                    layer.bindTooltip(tooltipContent, {
                        sticky: true
                    }).bindPopup(popupContent, {
                        closeButton: false,
                        minWidth: 450,
                        maxWidth: 450,
                        className: '-player'
                    }).on('popupopen', function () {
                        this.closeTooltip();
                    });

                    if (!clusterArray[country]) {
                        clusterArray[country] = L.markerClusterGroup({
                            chunkedLoading: true,
                            showCoverageOnHover: false,
                            maxClusterRadius: 160
                        });
                    }

                    clusterArray[country].addLayer(layer);

                    rowsArray.push({
                        n: name,
                        properties: {
                            c: country
                            // new: newPlayer
                        },
                        id: id,
                        active: true,
                        markup: '<li class="list-group-item" data-id="' + id + '" data-country="' + country + '">' +
                            '<div class="primary"><h4 class="list-group-item-heading">' +
                            name + '</h4><p class="list-group-item-text">Points: ' + points + '</p></div>' +
                            '<div class="secondary"><span class="label label-as-badge rank label-' + labelColor + '">' +
                            rank + '</span><p class="list-group-item-text">' +
                            '<img src="images/blank.gif" class="flag flag-' + country + '">&nbsp;' +
                            '<span class="item -country">' + country.toUpperCase() + '</span></p></div></li>'
                    });
                },

                pointToLayer: function (feature, latlng) {
                    var coords = [latlng.lng, latlng.lat],
                        markerIcon = window[getColor(feature.id) + 'Icon'];

                    return L.marker(coords, {icon: markerIcon});
                }
            });

            for (var country in clusterArray) {
                map.addLayer(clusterArray[country]);
                clusterArrayCopy[country] = clusterArray[country].getLayers();
            }

            clusterize = new Clusterize({
                rows: filterRows(rowsArray),
                scrollId: 'players',
                contentId: 'players',
                show_no_data_row: false
            });

            $('#players').perfectScrollbar();
        }
    });
});
