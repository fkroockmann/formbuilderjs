(function () {

	'use strict';

	var FormBuilder = function () {
		
		var self = this;

		this.defaultConfig = {};
		this.elements = {};

		this.ElementMock = function (config) {
			
			var element = this;

			this.id = 1;
			this.name = config.name;
			this.form = config.form;
			this.placeholder = config.placeholder;
			this.value = config.value;
			this.label = config.label;
			this.disabled = config.disabled || false;
			this.error = config.error || null;
			this.type = config.type;

			this.displayError = function () {
				if (null === element.error || undefined === element.error) {
					return;
				}

				var span = document.createElement('span');
				span.className = 'error';
				span.innerHTML = element.error;

				element.html.appendChild(span);
			};

			this.getDefaultElementClass = function (classParam) {
				if (self.defaultConfig && 
					self.defaultConfig.elements && 
					self.defaultConfig.elements[config.type] &&
					self.defaultConfig.elements[config.type][classParam]) {

					return self.defaultConfig.elements[config.type][classParam];
				}

				return '';
			};

			this.setDefaultClass = function () {
				element.wrapClass = config.wrap_class || element.getDefaultElementClass('wrap_class');
				element.elementClass = config.element_class || element.getDefaultElementClass('element_class');
				element.labelClass = config.label_class || element.getDefaultElementClass('label_class');
			}();

			return this;
		};

		this.getForm = function (config) {
			if (!self.configIsValid(config)) {
				return;
			}
			
			return new self.Form(config.elements, config.form);
		};

		this.configIsValid = function (config) {
			if (undefined === config) {
				throw 'config must be set';
			}

			if (undefined === config.elements) {
				throw 'elements must be set';
			}

			return true;
		};

		this.register = function (name, element) {
			if (undefined === self.elements[name]) {
				self.elements[name] = element;
			}
		};

		this.setForm = function (form) {
			self.Form = form;
		};

		this.setDefaultConfig  = function (config) {
			if (config) {
				self.defaultConfig = config;
			}
		};

		return {
			'getForm': this.getForm,
			'register': this.register,
			'ElementMock': this.ElementMock,
			'setForm': this.setForm,
			'elements': this.elements,
			'setDefaultConfig': this.setDefaultConfig
		};
	};

	window.FormBuilder = new FormBuilder();

})();