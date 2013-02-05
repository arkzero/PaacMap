/*Bryan Nissen - Bryan@webizly.com*/

/*global window, Backbone, Image, document, Handlebars, setTimeout, clearTimeout, jQuery */
(function ($) {
    "use strict";
    
    var fields = [2,3,4,5,6,7,8];
    
    /////-----     MODELS     -----/////
    Drupal.behaviors.newsFeed = {

        attach: function () {
            Drupal.Backbone.Models.Region = Drupal.Backbone.Models.Node.extend({
        
                initialize: function () {
                    var image = new Image();
                    image.src = filePath + '/'+this.get('image');
                    this.set({
                        image: image
                    });
                }
            });
        
            Drupal.Backbone.Models.Controller = Drupal.Backbone.Models.Node.extend({
        
                defaults: {
                    active: -1,
                    next: -1,
                    animate: true
                },
                
                initialize: function () {

                    /*$.ajax({
                        url: Drupal.settings.basePath + 'sites/all/modules/backbone/modules/paacMap_module/php/getNode.php',
                        type: 'POST',
                        data: {nid: 2},
                        success: function (data){
                            data = JSON.parse(data);
                            var title = data.title;
                            var className = data.field_classname.und[0].value;
                            var image =data.field_bgimage.und[0].value;
                            var counties = data.field_counties.und[0].value.split(',');
                            
                            var node =  new Drupal.Backbone.Models.Region({
                                title: title,
                                className: className,
                                image: image,
                                counties: counties
                            });
                            console.log(node)
                        }
                    });*/
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
        
            Drupal.Backbone.Collection.Regions = Drupal.Backbone.Collections.NodeView.extend({
                url: filePath+'/regions.json',
                model: Drupal.Backbone.Models.Region,
        
                initialize: function () {
                    var self = this;
                    /*this.fetch({
                        update: true,
                        success: function(){
                            window.app.mapView.render();
                        }
                    });*/
                    this.loadNodes();
                },
                
                loadNodes: function () {
                    var self = this,
                        title,
                        className,
                        image,
                        counties,
                        node, i,
                        _fields = JSON.stringify(fields),
                        obj;
                    
                    $.ajax({
                        url: Drupal.settings.basePath + 'sites/all/modules/backbone/modules/paacMap_module/php/getNode.php',
                        type: 'POST',
                        data: {fields: _fields},
                        success: function (data){
                            data = JSON.parse(data);
                            
                            for (i = 0; i < data.length; i+=1){
                                obj = JSON.parse(data[i]);
                                title = obj.title;
                                className = obj.field_classname.und[0].value;
                                image =obj.field_bgimage.und[0].value;
                                counties = obj.field_counties.und[0].value.split(',');
                                console.log(counties[0])
                                
                                node =  new Drupal.Backbone.Models.Region({
                                    title: title,
                                    className: className,
                                    image: image,
                                    counties: counties
                                });
                                self.add(node);
                            }

                        }
                    });
                }
            });
        
            window.regions = new Drupal.Backbone.Collection.Regions();
            window.regions.viewName = 'paacMap';
            window.controller = new Drupal.Backbone.Models.Controller();
        
            $(document).ready(function () {
        
                /////-----     VIEW     -----/////
        
                window.RegionView = Drupal.Backbone.View.extend({
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
        
                        $(this.el).prepend(this.template({
                            title: this.model.get('title'),
                            className: this.model.get('className')
                        }));
                        $('.' + this.model.get('className')).addClass('new');
                        for (i = 0; i < counties.length; i += 1) {
                            if (i % 2 === 0) {
                                $target = $('#even');
                            } else {
                                $target = $('#odd');
                            }
                            $target.append(this.countyTemplate({
                                name: counties[i]
                            }));
                        }
                        this.transition();
                        return this;
                    },
        
        
                    transition: function () {
                        var self = this;
                        $('#mapInfo').css('width', '350px');
                        $('#mapInfo').css('left', '7px');
                        $('.new').animate({
                            width: '306px'
                        }, 250, function () {
                            $('#mapInfo').css('width', '343px');
                            $('#mapInfo').css('left', '0px');
                            $(this).removeClass('new');
                            $(this).addClass('old');
        
                            $('.countyList').animate({
                                opacity: 1
                            }, 50, function () {
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
                        }, 250, function () {
                            $(this).remove();
                        });
                        $('.old h2').animate({
                            opacity: 0
                        }, 250);
                        $('.old ul').animate({
                            opacity: 0
                        }, 250);
                    }
        
                });
        
                window.MapView = Drupal.Backbone.View.extend({
                    template: Handlebars.compile($('#map-template').html()),
        
                    events: {
                        'click .mapRegion': 'openCoalition',
                        'mouseover .mapRegion': 'regionHover',
                        'mouseout .mapRegion': 'hoverReset'
                    },
        
                    initialize: function () {
                        this.controller = this.options.controller;
                        this.collection.bind('reset', this.render, this);
                        this.collection.bind('add', this.render, this);
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
        
                    initialize: function (){
                        this.mapView = new window.MapView({
                            el: $('#mapApp'),
                            collection: window.regions,
                            controller: window.controller
                        });
                        //this.controller = this.options.controller;
                        /*this.mapView = new window.MapView({
                            el: $('#mapApp'),
                            collection: window.regions,
                            controller: window.controller
                        });*/
                    },
        
                    home: function () {
                        
                        //this.mapView.render();
                    }
                });
        
                $(function () {
                    window.app = new window.App();
                    Backbone.history.start()
                });
        
            });
            
            },

        unattach: function () {
            $('#page').html('');
        }

    };
}(jQuery));

