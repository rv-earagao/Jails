define(function(){

	var
		Jails, config, $;

	Jails = {

		config :{ templates :{ type :'x-tmpl-mustache'} },
		context:null,

		start :function(cfg, ctx){

			$ = cfg.base;
			Jails.context = $( document.documentElement );

			$.extend( true, Jails.config, cfg );
			Scanner.start( ctx );
		}

	};

	var Scanner = {

		start :function(context){

			var type, modules = [];

			context = context || Jails.context;
			type = Jails.config.templates.type;

			Scanner.scan( 'partial', 'script[type='+type+']', context, modules);
			Scanner.scan( 'component', '[data-component]', context, modules);
			Scanner.scan( 'view', '[data-view]', context, modules);
			Scanner.scan( 'controller', '[data-controller]', context, modules);
			Scanner.scan( 'include', '[data-include]', context, modules );
			Scanner.scan( 'app', '[data-app]', context, modules );


			Module.start( modules );
		},

		scan :function(name, query, context, modules){

			context = context || Jails.context;
			var el, els, len, scan;

			els = context.get(0).querySelectorAll(query);
			len = els.length;

			for(var i = 0; i < len; i++){
				el = $(els[i]);
				scan = Scanner[name];
				scan?
					scan(name, el, modules) :Scanner.module( name, el, modules );
			}
		},

		include:function(type, el, modules){

			var url = el.data(type);

			$.get( url ).done(function(html){
				html = $(html);
				el.append(html);
				Scanner.start( el );
				el.replaceWith( html );
			});
		},

		module :function(type, el, modules){

			var name, object, m, sufix = 's';
			name = el.data(type);

			object = new Module[ type ]._class( name, el, type );

			m = Jails[type+sufix][ name ];
			m? m.apply( object, [el] ) :null;

			modules.push( object );
		},

		partial :function(type, el){

			var cfg = Jails.config.templates.prefix;
			var name = el.prop('id').split( cfg || 'tmpl-').pop();

			Jails.templates[name] = $.trim( el.html() );
		},

		component :function(type, el, modules){

			var name, components, object, m;

			name = el.data(type);
			components = name.replace(/\s/g, '').split(/\,/);

			$.each( components, function(i, n){

				object = new Module[type]._class( n, el );
				m = Jails.components[n];
				m? m.apply( object, [el] ) :null;

				modules.push( object );
			});
		}

	};

	var Module = {

		start :function(modules){

			var len = modules.length;
			for(var i = 0; i < len; i++)
				if( modules[i].init ) modules[i].init();

			modules = null;
		},

		common :{

			_class :function(name, element){

				var _self = this, data;

				this.name = name;

				element.on('get-instance', function(e, getter){
					getter( _self );
					e.stopPropagation();
				});

				this.get = function(type, query){

					var el;
					if(query) el = element.find('[data-'+type+'*="'+query+'"]');
					else el = element.find('[data-'+type+']');

					return Entity( el );
				};

				this.data = function(vo){

					if(vo){
						this.get('view').broadcast('render', vo);
						data = vo;
					}

					else return data;
				};

				this.broadcast = function(target, ev){
					$(target).trigger(ev);
				};

				this.listen = function(name, method){
					element.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
				};

				this.emit = function( simbol, args ){
					args = Array.prototype.slice.call(arguments);
					args.shift();
					element.trigger(name+':'+simbol, { args :args, element :element.get(0) });
				};
			}
		},

		app :{

			_class :function( name, element ){
				Module.common._class.apply(this, [name, element]);
			}
		},

		controller:{

			_class :function( name, element ){
				Module.common._class.apply(this, [name, element]);
			}
		},

		view :{

			_class :function( name, element ){

				Module.common._class.apply(this, [name, element]);

				var tpl, cfg, templates, render;

				tpl = element.data('template');
				render = element.data('render');

				cfg = Jails.config.templates;
				templates = Jails.templates;

				this.template = function(vo, tpl){
					return cfg.engine.render( get(tpl), vo, templates );
				};

				this.render = function(vo, template){
					tpl = template || tpl;
					if(tpl && templates[tpl])
						this.partial(element, tpl, vo);
				};

				this.partial = function(el, tpl, vo){

					if(templates[tpl]){

						var html = cfg.engine.render( get(tpl), vo, templates );

						el.html( html );
						Scanner.start(el);
					}
				};

				function get(name){
					return templates[name];
				}

				render? this.render({}) :null;
			}
		},

		model :{
			_class :function( name, element ){}
		},

		component :{

			_class :function( name, element ){

				this.name = name;
				var _self = this;

				element.on('get-instance', function(e, getter){
					getter( _self );
					e.stopPropagation();
				});

				this.emit = function( simbol, args ){
					args = Array.prototype.slice.call(arguments);
					args.shift();
					element.trigger(name+':'+simbol, { args :args, element :element.get(0) });
				};
			}
		}
	};

	function Entity(dom){

		function instance(el){

			var object;
			el.trigger('get-instance', function(instance){ object = instance; });
			return object || {};
		}

		return {

			execute :function(method, args){

				args = Array.prototype.slice.call(arguments);
				args.shift();

				var object = instance( dom.eq(0) );
				if( object[method] ) object[method].apply( object, args );
			},

			broadcast :function(method, args){

				args = Array.prototype.slice.call(arguments);
				args.shift();

				dom.each(function(){
					var object = instance( $(this) );
					if( object[method] ) object[method].apply( object, args );
				});
			},

			instance :function(){
				return instance( dom.eq(0) );
			}
		};
	}

	var Interface = {

		_class :function(){

			this.apps = {};
			this.controllers = {};
			this.views = {};
			this.models = {};
			this.components = {};
			this.templates = {};

			this.controller = function(name, method){
				this.controllers[ name ] = method;
			},

			this.component = function(name, method){
				this.components[ name ] = method;
			},

			this.view = function(name, method){
				this.views[ name ] = method;
			},

			this.app = function(name, method){
				this.apps[ name ] = method;
			},

			this.model = function(name, object){
				Module.model._class.apply( object );
				Jails.models[ name ] = object;
				return object;
			}
		}
	};

	Interface._class.apply( Jails );
	return Jails;

});