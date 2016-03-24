/**
 * AngularFreeorder
 * 
 * A small library to make AngularJS module components load-order-independent.
 * 
 * @author <tibi@mindcrumbs.net> Tibor Fulop
 * @copyright GPL3
 */

(function(angular){
	
	/**
	 * AngularFreeorder module
	 * 
	 * @param {string} name
	 * @returns {AngularFreeorderModule}
	 */
	var AngularFreeorderModule = function(name){
		this.name = name;
		this.moduleExtensions = [];
	};

	/**
	 * Register a module provider
	 * 
	 * @param {string} name
	 * @param {function} providerType
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.provider = function(name, providerType){
		this.moduleExtensions.push(['provider', arguments]);
		return this;
	};

	/**
	 * Register a module factory
	 * 
	 * @param {string} name
	 * @param {function} providerType
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.factory = function(name, providerFunction){
		this.moduleExtensions.push(['factory', arguments]);
		return this;
	};

	/**
	 * Register a module service
	 * 
	 * @param {string} name
	 * @param {function} constructor
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.service = function(name, constructor){
		this.moduleExtensions.push(['service', arguments]);
		return this;
	};

	/**
	 * Register a module value
	 * 
	 * @param {string} name
	 * @param {function} obj
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.value = function(name, obj){
		this.moduleExtensions.push(['value', arguments]);
		return this;
	};

	/**
	 * Register a module constant
	 * 
	 * @param {string} name
	 * @param {function} obj
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.constant = function(name, obj){
		this.moduleExtensions.push(['constant', arguments]);
		return this;
	};

	/**
	 * Register a module decorator
	 * 
	 * @param {string} The
	 * @param {function} This
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.decorator = function(The, This){
		this.moduleExtensions.push(['decorator', arguments]);
		return this;
	};

	/**
	 * Register a module animation
	 * 
	 * @param {string} name
	 * @param {function} animationFactory
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.animation = function(name, animationFactory){
		this.moduleExtensions.push(['animation', arguments]);
		return this;
	};

	/**
	 * Register a module filter
	 * 
	 * @param {string} name
	 * @param {function} filterFactory
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.filter = function(name, filterFactory){
		this.moduleExtensions.push(['filter', arguments]);
		return this;
	};

	/**
	 * Register a module controller
	 * 
	 * @param {string} name
	 * @param {function} constructor
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.controller = function(name, constructor){
		this.moduleExtensions.push(['controller', arguments]);
		return this;
	};

	/**
	 * Register a module directive
	 * 
	 * @param {string} name
	 * @param {function} directiveFactory
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.directive = function(name, directiveFactory){
		this.moduleExtensions.push(['directive', arguments]);
		return this;
	};

	/**
	 * Register a module component
	 * 
	 * @param {string} name
	 * @param {function} options
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.component = function(name, options){
		this.moduleExtensions.push(['component', arguments]);
		return this;
	};

	/**
	 * Register a module config
	 * 
	 * @param {function} configFn
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.config = function(configFn){
		this.moduleExtensions.push(['config', arguments]);
		return this;
	};

	/**
	 * Register a function to run on module bootstrap
	 * 
	 * @param {function} initializationFn
	 * @returns {AngularFreeorderModule}
	 */
	AngularFreeorderModule.prototype.run = function(initializationFn){
		this.moduleExtensions.push(['run', arguments]);
		return this;
	};

	/**
	 * Process a AngularFreeorderModule and apply extensions to the actual angular module
	 * 
	 * @param {object} angularModule
	 */
	AngularFreeorderModule.prototype.process = function(angularModule){
		var self = this;
		_.each(this.moduleExtensions, function(moduleExtension){
			angularModule[moduleExtension[0]].apply(angularModule, moduleExtension[1]);
		});
		return angularModule;
	};
	 
	/**
	 * Angular Freeorder instance
	 */
	angularFreeorder = {
		/**
		 * Modules that have been used, but are not registered yet
		 * 
		 * @type object
		 */
		pendingModules: {},
		
		/**
		 * Registered modules
		 * 
		 * @type object
		 */
		registeredModules: {},
		
		/**
		 * Register or return a module with dependencies
		 * 
		 * @param {string} name
		 * @param {array} dependencies
		 * @returns {object}
		 */
		module: function(name, dependencies){
			if (this.registeredModules[name]) {
				return this.registeredModules[name];
			}
			if (typeof(dependencies) === 'undefined') {
				if (!this.pendingModules[name]){
					this.pendingModules[name] = new AngularFreeorderModule(name);
				}
				return this.pendingModules[name];
			}
			this.registeredModules[name] = angular.__module(name, dependencies);
			if (this.pendingModules[name]) {
				this.pendingModules[name].process(this.registeredModules[name]);
				delete(this.pendingModules[name]);
			}
			return this.registeredModules[name];
		}
	};

	// Override angular's module call
	angular.__module = angular.module;
	angular.module = function(){
		return angularFreeorder.module.apply(angularFreeorder, arguments);
	};
	
})(angular);