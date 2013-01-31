(function($) {

    /////-----     MODELS     -----/////

    window.Region = Backbone.Model.extend({
        
        initialize : function () {
            var image = new Image();
            image.src = this.get('image');
            this.set({image: image});
        }
        
    });

    window.Controller = Backbone.Model.extend({

        defaults : {
            active : -1
        },

        setActive : function(act) {
            this.set({
                'active' : act
            });
        },

        getActive : function() {
            return this.get('active');
        }
    });

    /////-----     COLLECTIONS     -----/////

    window.Regions = Backbone.Collection.extend({
        url : 'regions.json',
        model : Region,

        initialize : function() {
            this.fetch({
                update : true
            });
        },
    });

    window.regions = new Regions();
    window.controller = new Controller;

    $(document).ready(function() {

        /////-----     VIEW     -----/////

        window.MapView = Backbone.View.extend({
        template : Handlebars.compile($('#map-template').html()),

        events : {
            'click .mapRegion' : 'openCoalition',
            'mouseover .mapRegion' : 'mouseOverRegion',
            'mouseout .mapRegion' : 'mouseOutRegion'
        },
        
        initialize : function () {
            this.controller = this.options.controller;
            this.collection.bind('reset', this.render, this);
        },

        render : function () {
            $(this.el).html(this.template());
            return this;
        }, 
        
        openCoalition : function (event) {
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
        
        mouseOverRegion : function (event) {
            var className = $(event.currentTarget).attr('id'),
                id = $(event.currentTarget).data('id'),
                active = this.controller.getActive();
            
            $('#map').addClass(className+'Hover');
            
            if(active != id && active >= 0){
                this.controller.setActive(id);
                this.regionView = new RegionView({
                    model: this.collection.at(id),
                    el: $('#mapInfo'),
                    collection: this.collection,
                    controller : this.controller
                });
                this.regionView.render();
            }else if (active < 0){
                this.controller.setActive(id);
                this.regionView = new RegionView({
                    model: this.collection.at(id),
                    el: $('#mapInfo'),
                    collection: this.collection,
                    controller : this.controller
                });
                this.regionView.render();
            }
        },
        
        mouseOutRegion : function (event) {
            var id = $(event.currentTarget).attr('id');
            
            $('#map').removeClass(id+'Hover');
        }
    });

    window.RegionView = Backbone.View.extend({
        template : Handlebars.compile($('#region-template').html()),
        countyTemplate: Handlebars.compile($('#county-template').html()),

        render : function() {
            var counties = this.model.get('counties');
            $(this.el).html(this.template(this.model.toJSON()));
            
            for(var i = 0; i < counties.length; i+=1){
                $('#countyList').append(this.countyTemplate({name: counties[i].name}));
            }
            
            return this;
        }
    });

    /////-----     ROUTER     -----/////
    window.App = Backbone.Router.extend({

        routes : {
            '' : 'home'
        },

        initialize : function() {
            //this.controller = this.options.controller;
        },

        home : function() {
            this.mapView = new MapView({
                el : $('#mapApp'),
                collection: window.regions,
                controller : window.controller
            });
            //this.mapView.render();
        }
    });

    $(function() {
        window.App = new App();
        Backbone.history.start();
    });

});
})(jQuery);
