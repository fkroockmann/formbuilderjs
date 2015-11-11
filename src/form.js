(function () {

	'use strict';

	var Form = function (elements, config) {

		var form = this;

		this.id = 1;
		this.name = config.name || 'form-' + this.id;
		this.config = config || {};
		this.class = config.class || [];
		this.method = config.method || 'POST';
		this.errors = {};

		this.listeners = {
			'submit': [],
			'validate': []
		};

		this.on = function (eventName, callback) {
			if (form.listeners[eventName]) {
				form.listeners[eventName].push(callback);
			}
		};

		this.dispatch = function (eventName, params) {

			if (typeof arguments[0] !== 'string') {
				throw 'Invalid event name';
			}

			var key,
				listeners = form.listeners[arguments[0]],
				args = [];

		    Array.prototype.push.apply(args, arguments);

		    args.shift();

			if (listeners) {
				for (key in listeners) {
					listeners[key].apply(null, args);
				}	
			}
		};
		
		this.submit = function () {

			var data = {},
				key,
				currentData,
				element;

			for (key in form.elements) {
				element = form.elements[key];

				if ('function' === typeof element.getData) {
					currentData = element.getData();
					if (null !== currentData) {
						data[key] = currentData;
					}
				}
			}

			form.dispatch('validate', data, form);

			if (0 === Object.keys(form.errors).length) {
				if (form.listeners.submit.length > 0) {
					form.dispatch('submit', data);	
				} else {
					form.html.submit();
				}
			} else {
				form.displayErrors();
			}
		};

		this.displayErrors = function () {
			var key,
				errors = form.errors,
				element;

			for (key in errors) {
				element = form.elements[key];

				if (element !== undefined) {
					element.error = errors[key];
					element.displayError();
				}
			}	
		};

		this.addError = function(elementName, error) {
			if (undefined === form.errors[elementName]) {
				form.errors[elementName] = {};
			}

			form.errors[elementName] = error;
		};

		this.computeElements = function() {
			var key,
				element,
				FbElement;
			
			form.elements = {};

			for (key in elements) {
				element = elements[key];
				FbElement = FormBuilder.elements[element.type];
				
				if (undefined !== FbElement) {
					element.name = key;
					element.form = form;
					form.elements[key] = new FbElement(element);
				}
			}

			form.elements.submit = new FormBuilder.elements.submit({'form': form});
		};
		
		this.trigger = function (eventName, params) {
			if (form.listeners[eventName]) {
				if (typeof form[eventName] === 'function') {
					form[eventName](params);
				}
			}
		};
		
		this.renderElements = function (formElement) {
			var key,
				element,
				wrap, 
				html;

			for (key in form.elements) {
				element = form.elements[key];

				wrap = document.createElement('div');
				wrap.className= 'element_' + key;

				html = element.render(wrap);

				if (element.label !== undefined && element.label !== null) {
					var label = document.createElement('label');

					label.innerHTML = element.label;
					wrap.appendChild(label);
				}

				if (undefined !== html) {
					wrap.appendChild(html);
				}

				element.html = wrap;

				if (key !== 'submit') {
					element.displayError();	
				}

				formElement.appendChild(wrap);
			}
		};
		
		this.render = function () {
			var formElement = document.createElement('form');

			if (form.class.length > 0) {
				formElement.className = form.class.join(' ');
			}

			formElement.method = form.method;
			formElement.id = 'form_' + form.id;

			form.renderElements(formElement);
			
			form.html = formElement;

			return formElement;
		};
		
		this.init = function () {
			form.computeElements();
		}();

		return {
			'id': this.id,
			'name': this.name,
			'elements': this.elements,
			'method': this.method,
			'render': this.render,
			'on': this.on
		};
	};

	FormBuilder.setForm(Form);

})();