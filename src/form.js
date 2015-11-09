(function () {

	'use strict';

	var Form = function (elements, config) {

		var form = this;

		this.id = 1;
		this.name = config.name || 'form-' + this.id;
		this.config = config || {};
		this.class = config.class || [];
		this.method = config.method || 'POST';
		this.listeners = {
			'submit': [],
		};

		this.on = function (eventName, callback) {
			if (form.listeners[eventName]) {
				form.listeners[eventName].push(callback);
			}
		};

		this.dispatch = function (eventName, params) {
			var key,
				listeners = form.listeners[eventName];

			if (listeners) {
				for (key in listeners) {
					listeners[key](params);
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

			this.dispatch('submit', data);
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