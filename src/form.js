(function () {

	'use strict';

	var Form = function (elements, config) {

		if (typeof elements !== 'object') {
			throw 'Elements must be set in form constructor';
		}

		var form = this;

		this.id = 'form_' + Math.random().toString(36).substr(2, 5);
		this.config = config || {};
		this.name = this.config.name || '';
		this.formClass = this.config.form_class || '';
		this.method = this.config.method || 'POST';
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

		this.dispatch = function () {

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
					form.dispatch('submit', data, form);	
				} else {
					if (form.html) {
						form.html.submit();	
					}
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

			form.elements.submit = 
				new FormBuilder
						.elements
						.submit(
							{
								'form': form, 
								'elementClass': form.config.submit_class
							}
						);
		};
		
		this.renderElements = function (formElement) {
			var key,
				element,
				wrap, 
				html;

			for (key in form.elements) {
				element = form.elements[key];

				wrap = document.createElement('div');

				wrap.className = 'element_' + key + (element.wrapClass ? ' ' + element.wrapClass : '');

				html = element.render(wrap);

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
		
		this.render = function (node) {

			if (!node) {
				throw 'An DOM node must be passed to render function arguments';
			}

			var formElement = document.createElement('form');

			if (form.formClass) {
				formElement.className = form.formClass;
			}

			formElement.method = form.method;
			formElement.id = form.id;

			if (form.name) {
				formElement.name = form.name;	
			}

			form.renderElements(formElement);
			
			form.html = formElement;

			return node.appendChild(formElement);
		};
		
		this.init = function () {
			form.computeElements();
		}();

		return form;
	};

	FormBuilder.setFormClass(Form);

})();
