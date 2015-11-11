(function () {

	'use strict';

	var FormBuilder = function () {
		
		var self = this;

		this.elements = {};

		this.ElementMock = function (config) {
			
			var self = this;

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
				if (null === self.error || undefined === self.error) {
					return;
				}

				var span = document.createElement('span');
				span.className = 'error';
				span.innerHTML = self.error;

				self.html.appendChild(span);
			};

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

		return {
			'getForm': this.getForm,
			'register': this.register,
			'ElementMock': this.ElementMock,
			'setForm': this.setForm,
			'elements': this.elements
		};
	};

	window.FormBuilder = new FormBuilder();

})();