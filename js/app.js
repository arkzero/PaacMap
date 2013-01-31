(function($) {

	/////-----     MODELS     -----/////

	window.Region = Backbone.Model.extend({

		initialize : function() {
			var image = new Image();
			image.src = this.get('image');
			this.set({
				image : image
			});
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
				'mouseover .mapRegion' : 'regionHover',
				'mouseout .mapRegion' : 'hoverReset'
			},

			initialize : function() {
				this.controller = this.options.controller;
				this.collection.bind('reset', this.render, this);
			},

			render : function() {
				$(this.el).html(this.template());
				return this;
			},

			openCoalition : function(event) {
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

			mouseOverRegion : function(event) {
				var className = $(event.currentTarget).attr('id'), id = $(event.currentTarget).data('id'), active = this.controller.getActive();

				$('#map').addClass(className + 'Hover');

				if (active != id && active >= 0) {
					this.controller.setActive(id);
					this.regionView = new RegionView({
						model : this.collection.at(id),
						el : $('#mapInfo'),
						collection : this.collection,
						controller : this.controller
					});
					this.regionView.render();
				} else if (active < 0) {
					this.controller.setActive(id);
					this.regionView = new RegionView({
						model : this.collection.at(id),
						el : $('#mapInfo'),
						collection : this.collection,
						controller : this.controller
					});
					this.regionView.render();
				}
			},

			mouseOutRegion : function(event) {
				var id = $(event.currentTarget).attr('id');

				$('#map').removeClass(id + 'Hover');
			},

			regionHover : function(event) {
				var self = this, collection = this.collection, controller = this.controller, active, 
					id = $(event.currentTarget).attr('id');
					
				this.counter = setTimeout(function() {
					$('#map').addClass(id + 'Hover');
					id = $(event.currentTarget).data('id');
					active = controller.getActive();

					if (id != active) {
						self.openInfoPanel(id);
					}
				}, 500);
			},

			hoverReset : function(event) {
				var id = $(event.currentTarget).attr('id');
				clearTimeout(this.counter);
			},
			
			openInfoPanel : function (id) {
				var className;
				if(this.controller.getActive() >= 0){
					className = this.collection.at(this.controller.getActive()).get('className') + 'Hover';
					$('#map').removeClass(className)
				}
				console.log(className)
				this.controller.setActive(id);
				this.regionView = new RegionView({
					model : this.collection.at(id),
					el : $('#mapInfo'),
					collection : this.collection,
					controller : this.controller
				});
				this.regionView.render();
			}

		});

		window.RegionView = Backbone.View.extend({
			template : Handlebars.compile($('#region-template').html()),
			countyTemplate : Handlebars.compile($('#county-template').html()),

			render : function() {
				var counties = this.model.get('counties');
				$(this.el).prepend(this.template(this.model.toJSON()));
				$('.'+this.model.get('className')).addClass('new');
				for (var i = 0; i < counties.length; i += 1) {
					$('#countyList').append(this.countyTemplate({
						name : counties[i].name
					}));
				}
				this.transition()
				return this;
			},
			
			transition : function () {
				console.log($('.new').html())
				$('.new').animate({
					width: '306px'
				}, 1000, function (){
					$(this).removeClass('new');
					$(this).addClass('old');
				});
				$('.old').css('padding-left', '0px');
				$('.old').css('padding-right', '0px');
				$('.old').animate({
					width: '0px'
				}, 1000, function (){
					$(this).remove();
				});
				$('.old h2').animate({
					opacity: 0
				}, 1000);
				$('.old ul').animate({
					opacity: 0
				}, 1000)
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
					collection : window.regions,
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
