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
        maxZoom: 8,
        maxBounds: [[-57, -200], [80, 200]],
        zoomControl: false,
        wheelPxPerZoomLevel: 120,
        maxBoundsViscosity: 1
    }),

    // helperCoords = map.options.center,
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

    /* helperIcon = L.icon({
        iconUrl: 'images/marker-icon-black.png',
        iconRetinaUrl: 'images/marker-icon-2x-black.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: 'helper-marker'
    }), */

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
    /* helperMarker = L.marker(helperCoords, {
        icon: helperIcon,
        draggable: true
    }),

    // Display a helper popup with current position coordinates
    helperPopup = L.popup({
        closeButton: false,
        closeOnClick: false,
        className: 'helper-popup'
    }).setLatLng(helperCoords)
        .setContent('[' + helperCoords[0] + ', ' + helperCoords[1] + ']'), */

    discordLayer = L.layerGroup(),

    discordMarkers = [
        {
            position: [31, -57],
            tooltip: 'Beat Saber Modding Group',
            popup: getPopupMarkup('Beat Saber Modding Group', null, null, 'https://discord.gg/beatsabermods', 'The largest Beat Saber Discord server')
        },
        {
            position: [31, -45],
            tooltip: 'ScoreSaber',
            popup: getPopupMarkup('ScoreSaber Discord', null, null, 'https://discord.gg/WpuDMwU', 'Dedicated to unofficial player ranking')
        },
        {
            position: [31, -33],
            tooltip: 'Reddit Community',
            popup: getPopupMarkup('Reddit Community', null, null, 'https://discord.gg/PNyawF6', '/r/beatsaber community')
        },
        {
            position: [31, -21],
            tooltip: 'BeastSaber',
            popup: getPopupMarkup('BeastSaber', null, null, 'https://discord.gg/GdRbkye', 'BSaber.com server')
        },
        {
            position: [60, -120],
            tooltip: 'Canadian Discord',
            popup: getPopupMarkup('Canadian Discord', 'Canada', 'Yun0#1355', null, '<a href="https://docs.google.com/forms/d/e/1FAIpQLSfWhARJyoYJ_FcbChiVUTAPPkBlVsENsBF2bs5twkJkrbjbGQ/viewform" target="_blank">Join-Up Form</a>')
        },
        {
            position: [56.4, -3.2],
            tooltip: 'UK Discord',
            popup: getPopupMarkup('UK Discord', 'United Kingdom, Ireland', 'Rocker#1234')
        },
        {
            position: [-23.5, 134.6],
            tooltip: 'AU Discord',
            popup: getPopupMarkup('AU Discord', 'Australia, New Zealand', 'SimplyMarvellous#0290')
        },
        {
            position: [52, 10.5],
            tooltip: 'DE Community',
            popup: getPopupMarkup('DE Community', 'Germany, Austria', null, 'https://discord.gg/SX7mKqk')
        },
        {
            position: [44.4, 5],
            tooltip: 'Communauté Francophone BS',
            popup: getPopupMarkup('Communauté Francophone BS', 'France, Belgium, Switzerland, Québec, etc.', 'ExUnReal#0020')
        },
        {
            position: [51.4, 5.5],
            tooltip: 'Dutch Discord',
            popup: getPopupMarkup('Dutch Discord', 'Netherlands', 'miitchel#0001, SilverHaze#0001,<br>CoolingCloset#0001', null, 'Events & Tournaments')
        },
        {
            position: [55.6, 8.9],
            tooltip: 'Danish Discord',
            popup: getPopupMarkup('Danish Discord', 'Denmark', 'Prans👑#0020')
        },
        {
            position: [61.3, 19.3],
            tooltip: 'Nordic Discord',
            popup: getPopupMarkup('Nordic Discord', 'Sweden, Norway,<br>Denmark, Finland, Iceland', 'Samuel 💜#0001')
        },
        {
            position: [42.4, -5.2],
            tooltip: 'Spanish Discord',
            popup: getPopupMarkup('Spanish Discord', 'Spain', 'animaleco#0827')
        },
        {
            position: [37, 128.9],
            tooltip: 'KOR Community',
            popup: getPopupMarkup('KOR Community', 'South Korea', null, 'https://discord.gg/3ZuEH7y')
        },
        {
            position: [33.3, 126.5],
            tooltip: 'KPOP BS',
            popup: getPopupMarkup('KPOP BS', null, null, 'https://discord.gg/3ZuEH7y', 'K-Pop and Beat Saber fans 🥰')
        },
        {
            position: [5.9, 102.2],
            tooltip: 'Asia VR Community',
            popup: getPopupMarkup('Asia VR Community', 'Malaysia, Singapore, India,<br>Taiwan, Thailand, Philippines,<br>South Korea, Japan, China, etc.', null, 'https://discord.gg/255UW8b', 'General, has a Beat Saber channel')
        },
        {
            position: [31.7, 99.2],
            tooltip: 'CN Community (QQ)',
            popup: getPopupMarkup('CN Community', null, null, null, '<strong>QQ group ID</strong>: 916499592')
        },
        {
            position: [53.4, 35.86],
            tooltip: 'VR RUS',
            popup: getPopupMarkup('VR RUS', 'Russia, Ukraine, Belarus, etc.', null, 'https://discord.gg/pAvAwfR', 'General, has a Beat Saber channel')
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

    L.tileLayer('http://zverik.openstreetmap.ru/mbtiles/w/political-ua/{z}/{x}/{y}.png', {
        opacity: 0.55,
        attribution: 'Countries &copy; <a href="http://www.naturalearthdata.com/downloads/10m-cultural-vectors/">Natural Earth</a> | Tiles by <a href="http://ilya.zverev.info/">Zverik</a>'
    }).addTo(map);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png', {
        attribution: 'Labels by <a href="https://carto.com/location-data-services/basemaps/">Carto</a>'
    }).addTo(map);

    // Add a helper marker to help get coordinates
    /* helperMarker.addTo(map)
        .bindPopup(helperPopup).openPopup()
        // recalculate marker position on drag
        // + don't close it while dragging
        .on('drag', function () {
            var latlng = this.getLatLng();
            helperPopup.setContent('[' + _.round(latlng.lat, 5) + ', ' + _.round(latlng.lng, 5) + ']');
            this.openPopup();
        }); */

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
                        '<div class="popup-item -profile"><img src="images/ScoreSaberLogo.svg">&nbsp;<a href="' + url + '" target="_blank">Profile</a></div>' +
                        '<div class="popup-item -info"><span><strong>World Rank:</strong>&nbsp;' + rank + '</span></div>' +
                        '<div class="popup-item -info"><span><strong>Points:</strong>&nbsp;' + points + '</span></div>' +
                        '<div class="popup-item -country"><img src="images/blank.gif" class="flag flag-' +
                        country + '">&nbsp;<a href="' + countryUrl + country + '" target="_blank">' + countries[country.toUpperCase()].name + '</a></div></div>';

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
