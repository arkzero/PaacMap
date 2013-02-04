/*Bryan Nissen - Bryan@webizly.com*/

/*global window, Backbone, Image, document, Handlebars, setTimeout, clearTimeout, jQuery */
(function ($) {
    "use strict";
    /////-----     MODELS     -----/////

    window.Region = Backbone.Model.extend({

        initialize: function () {
            var image = new Image();
            image.src = this.get('image');
            this.set({
                image: image
            });
        }
    });

    window.Controller = Backbone.Model.extend({

        defaults: {
            active: -1,
            next: -1,
            animate: true
        },

        setActive: function (act) {
            this.set({
                'active': act
            });
        },

        getActive: function () {
            return this.get('active');
        },

        setAnimate: function (ani) {
            this.set({
                'animate': ani
            });
        },

        getAnimate: function () {
            return this.get('animate');
        },

        setNext: function (nex) {
            this.set({
                'next': nex
            });
        },

        getNext: function () {
            return this.get('next');
        }
    });

    /////-----     COLLECTIONS     -----/////

    window.Regions = Backbone.Collection.extend({
        url: 'regions.json',
        model: window.Region,

        initialize: function () {
            this.fetch({
                update: true
            });
        }
    });

    window.regions = new window.Regions();
    window.controller = new window.Controller();

    $(document).ready(function () {

        /////-----     VIEW     -----/////

        window.RegionView = Backbone.View.extend({
            template: Handlebars.compile($('#region-template').html()),
            countyTemplate: Handlebars.compile($('#county-template').html()),

            initialize: function () {
                this.controller = this.options.controller;
                this.parent = this.options.parent;
            },

            render: function () {
                var counties = this.model.get('counties'),
                    $target,
                    i;

                $(this.el).prepend(this.template(this.model.toJSON()));
                $('.' + this.model.get('className')).addClass('new');
                for (i = 0; i < counties.length; i += 1) {
                    if (i % 2 === 0) {
                        $target = $('#even');
                    } else {
                        $target = $('#odd');
                    }
                    $target.append(this.countyTemplate({
                        name: counties[i].name
                    }));
                }
                this.transition();
                return this;
            },


            transition: function () {
                var self = this;
                $('.new').animate({
                    width: '306px'
                }, 400, function () {
                    $(this).removeClass('new');
                    $(this).addClass('old');

                    $('.countyList').animate({
                        opacity: 1
                    }, 100, function () {
                        if (self.controller.getNext() >= 0) {
                            self.controller.setAnimate(true);
                            self.parent.openInfoPanel(self.controller.getNext());
                            self.controller.setNext(-1);
                        } else {
                            self.controller.setAnimate(true);
                        }
                    });
                });

                $('.old').css('padding-left', '0px');
                $('.old').css('padding-right', '0px');
                $('.old').animate({
                    width: '0px'
                }, 400, function () {
                    $(this).remove();
                });
                $('.old h2').animate({
                    opacity: 0
                }, 400);
                $('.old ul').animate({
                    opacity: 0
                }, 400);
            }

        });

        window.MapView = Backbone.View.extend({
            template: Handlebars.compile($('#map-template').html()),

            events: {
                'click .mapRegion': 'openCoalition',
                'mouseover .mapRegion': 'regionHover',
                'mouseout .mapRegion': 'hoverReset'
            },

            initialize: function () {
                this.controller = this.options.controller;
                this.collection.bind('reset', this.render, this);
            },

            render: function () {
                $(this.el).html(this.template());
                return this;
            },

            openCoalition: function (event) {
                var id = $(event.currentTarget).data('id');

                switch (id) {
                case 0:
                    document.location.href = "http://paac.webizly.biz/coalition/northwest-regional-action-coalition";
                    break;
                case 1:
                    document.location.href = "http://paac.webizly.biz/coalition/southwest-regional-action-coalition";
                    break;
                case 2:
                    document.location.href = "http://paac.webizly.biz/coalition/north-central-regional-action-coalition";
                    break;
                case 3:
                    document.location.href = "http://paac.webizly.biz/coalition/south-central-regional-action-coalition";
                    break;
                case 4:
                    document.location.href = "http://paac.webizly.biz/coalition/northeast-regional-action-coalition";
                    break;
                case 5:
                    document.location.href = "http://paac.webizly.biz/coalition/southeast-regional-action-coalition-1";
                    break;
                case 6:
                    document.location.href = "http://paac.webizly.biz/coalition/southeast-regional-action-coalition-2";
                    break;
                }
            },

            regionHover: function (event) {
                var self = this,
                    controller = this.controller,
                    active,
                    id = $(event.currentTarget).attr('id');
                this.counter = setTimeout(function () {
                    //$('#map').addClass(id + 'Hover');
                    id = $(event.currentTarget).data('id');
                    active = controller.getActive();
                    if (self.controller.getAnimate() && id !== active) {
                        self.openInfoPanel(id);
                    } else if (!self.controller.getAnimate()) {
                        self.controller.setNext(id);
                    }
                }, 350);
            },

            hoverReset: function () {
                clearTimeout(this.counter);
            },

            openInfoPanel: function (id) {
                var className;
                if (this.controller.getAnimate() === true) {
                    this.controller.setAnimate(false);
                    if (this.controller.getActive() >= 0) {
                        className = this.collection.at(this.controller.getActive()).get('className') + 'Hover';
                        $('#map').removeClass(className);
                    }
                    className = this.collection.at(id).get('className') + 'Hover';
                    $('#map').addClass(className);
                    this.controller.setActive(id);
                    this.regionView = new window.RegionView({
                        model: this.collection.at(id),
                        el: $('#mapInfo'),
                        collection: this.collection,
                        controller: this.controller,
                        parent: this
                    });
                    this.regionView.render();
                }
            }

        });

        /////-----     ROUTER     -----/////
        window.App = Backbone.Router.extend({

            routes: {
                '': 'home'
            },

            initialize: function () {
                //this.controller = this.options.controller;
            },

            home: function () {
                this.mapView = new window.MapView({
                    el: $('#mapApp'),
                    collection: window.regions,
                    controller: window.controller
                });
                //this.mapView.render();
            }
        });

        $(function () {
            window.App = new window.App();
            Backbone.history.start();
        });

    });
}(jQuery));

