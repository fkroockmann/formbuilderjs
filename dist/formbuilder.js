(function () {

	'use strict';

	var FormBuilder = function () {
		
		var self = this;

		this.defaultConfig = {};
		this.elements = {};

		this.ElementMock = function (config) {
			
			if (undefined === config) {
				throw 'Config for element must be set';
			}

			var element = this;

			this.id = '_' + Math.random().toString(36).substr(2, 6);
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
			};

			this.init = function () {
				element.setDefaultClass();
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
				throw 'Config must be set';
			}

			if (undefined === config.elements) {
				throw 'Elements must be set';
			}

			return true;
		};

		this.register = function (name, element) {
			if (undefined === self.elements[name]) {
				self.elements[name] = element;
			}
		};

		this.deRegister = function (name) {
			if (undefined !== self.elements[name]) {
				delete self.elements[name];
			}
		};

		this.setFormClass = function (form) {
			self.Form = form;
		};

		this.getFormClass = function () {
			return self.Form;
		};

		this.setDefaultConfig  = function (config) {
			if (config) {
				self.defaultConfig = config;
			}
		};

		this.getDefaultConfig = function () {
			return self.defaultConfig;
		};

		return {
			'getForm': this.getForm,
			'register': this.register,
			'deRegister': this.deRegister,
			'ElementMock': this.ElementMock,
			'setFormClass': this.setFormClass,
			'getFormClass': this.getFormClass,
			'elements': this.elements,
			'setDefaultConfig': this.setDefaultConfig,
			'getDefaultConfig': this.getDefaultConfig
		};
	};

	window.FormBuilder = new FormBuilder();

})();
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

(function () {

	'use strict';

	FormBuilder.register('checkbox', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);
		self.isScalar = false;

		if ((/number|string/).test(typeof config.options)) {
			self.options = [config.options];
			self.isScalar = true;
		} else if ('object' === typeof config.options) {
			self.options = config.options;
		} else {
			self.options = [];
		}
		
		if ((/number|string/).test(typeof config.checked)) {
			self.checked = [config.checked];
		} else if ('object' === typeof config.checked) {
			self.checked = config.checked;
		} else {
			self.checked = [];
		}

		self.render = function (wrap) {

			var key,
				option,
				div,
				checkbox,
				label,
				inputs;

			if (self.options.length > 1) {
				self.name = self.name + '[]';
			}

			for (key in self.options) {
				option = self.options[key];
				div = document.createElement('div');
				checkbox = document.createElement('input');
				label = document.createElement('label');

				if (config.sub_wrap_class) {
					div.className = config.sub_wrap_class;
				}

				if (self.elementClass) {
					checkbox.className = self.elementClass;
				}

				if (self.labelClass) {
					label.className = self.labelClass;
				}

				checkbox.type = 'checkbox';				
				checkbox.name = self.name;
				checkbox.value = key;

				label.appendChild(checkbox);
				label.innerHTML = label.innerHTML + ' ' + option;
				div.appendChild(label);

				wrap.appendChild(div);
			}

			inputs = wrap.querySelectorAll('input[type=checkbox]');
			for (var i = 0; i < inputs.length; i++) {
				if (-1 !== self.checked.indexOf(inputs[i].value)) {
					inputs[i].checked = true;
				}
			}

			return;
		};

		self.getData = function () {

			var inputs = self.html.getElementsByTagName('input'),
				i,
				input,
				data = [];

			for (i = 0 ; i < inputs.length ; i++) {
				input = inputs[i];

				if (true === input.checked) {
					if (true === self.isScalar) {
						return input.value;
					} else {
						data.push(input.value);	
					}
				}
			}

			return (data.length > 0) ? data : null;
		};

		return self;
	});
})();


(function () {

	'use strict';

	FormBuilder.register('hidden', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);

		self.render = function () {
			var element = document.createElement('input');

			element.type = 'hidden';
			element.name = self.name;

			if (self.value !== undefined && self.value !== null) {
				element.value = self.value;
			}			

			return element;
		};

		self.getData = function () {
			return self.html.getElementsByTagName('input')[0].value;
		};

		return self;
	});
})();


(function () {

	'use strict';

	FormBuilder.register('radio', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);

		if ((/number|string/).test(typeof config.options)) {
			self.options = [config.options];
		} else if ('object' === typeof config.options) {
			self.options = config.options;
		} else {
			self.options = [];
		}
		
		if ((/number|string/).test(typeof config.checked)) {
			self.checked = [config.checked];
		} else if ('object' === typeof config.checked) {
			self.checked = config.checked;
		} else {
			self.checked = [];
		}

		self.render = function (wrap) {

			var key,
				option,
				div,
				radio,
				label,
				inputs;

			for (key in self.options) {
				option = self.options[key];
				div = document.createElement('div');
				radio = document.createElement('input');
				label = document.createElement('label');

				if (config.sub_wrap_class) {
					div.className = config.sub_wrap_class;
				}

				if (self.labelClass) {
					label.className = self.labelClass;
				}

				if (self.elementClass) {
					radio.className = self.elementClass;
				}

				radio.type = 'radio';				
				radio.name = self.name;
				radio.value = key;

				label.appendChild(radio);
				label.innerHTML = label.innerHTML + ' ' + option;
				div.appendChild(label);

				wrap.appendChild(div);
			}

			inputs = wrap.querySelectorAll('input[type=radio]');
			for (var i = 0; i < inputs.length; i++) {
				if (-1 !== self.checked.indexOf(inputs[i].value)) {
					inputs[i].checked = true;
				}
			}

			return;
		};

		self.getData = function () {

			var inputs = self.html.getElementsByTagName('input'),
				i,
				input;

			for (i = 0 ; i < inputs.length ; i++) {
				input = inputs[i];

				if (true === input.checked) {
					return input.value;
				}
			}

			return null;
		};

		return self;
	});
})();


(function () {

	'use strict';

	FormBuilder.register('select', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);
		self.options = (typeof config.options === 'object') ? config.options : [];
		self.multiple = config.multiple || false;
		
		if ((/number|string/).test(typeof config.selected)) {
			self.selected = [config.selected];
		} else if ('object' === typeof config.selected) {
			self.selected = config.selected;
		} else {
			self.selected = [];
		}

		self.render = function (wrap) {
			var element = document.createElement('select'),
				key;

			element.name = self.name;
			element.disabled = self.disabled;

			if (self.label) {
				var label = document.createElement('label');

				if (self.labelClass) {
					label.className = self.labelClass;
				}

				label.innerHTML = self.label;
				wrap.appendChild(label);
			}

			if (true === self.multiple) {
				element.multiple = true;
				element.name = element.name + '[]';
			}

			if (self.elementClass) {
				element.className = self.elementClass;
			}

			for (key in self.options) {
				var option = document.createElement('option');

				option.value = key;
				option.text = self.options[key];

				if (-1 !== self.selected.indexOf(key)) {
					option.selected = true;
				}

				element.add(option);
			}

			return element;
		};

		self.getData = function () {
			var options = self.html.getElementsByTagName('option'),
				i,
				option,
				data = [];

			for (i = 0 ; i < options.length ; i++) {
				option = options[i];

				if (true === option.selected) {
					if (true === self.multiple) {
						data.push(option.value);
					} else {
						return option.value;	
					}
				}
			}

			return (data.length > 0) ? data : null;
		};	

		return self;
	});
})();


(function () {

	'use strict';

	FormBuilder.register('submit', function (config) {
		
		var self = this;

		this.form = config.form;
		this.elementClass = config.elementClass || '';

		this.render = function () {
			var element = document.createElement('input');

			element.type = "submit";
			element.value = 'Submit';

			if (self.elementClass) {
				element.className = self.elementClass;
			}

			element.onclick = function () {
				self.form.submit();
				
				return false;
			};

			return element;
		};

	});

})();
(function () {

	'use strict';

	FormBuilder.register('text', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);

		self.render = function (wrap) {
			var element = document.createElement('input');

			element.type = 'text';
			element.name = self.name;
			element.disabled = self.disabled;

			if (undefined !== self.placeholder) {
				element.placeholder	= self.placeholder;
			}

			if (self.value !== undefined && self.value !== null) {
				element.value = self.value;
			}	

			if (self.elementClass) {
				element.className = self.elementClass;
			}

			if (self.label) {
				var label = document.createElement('label');

				if (self.labelClass) {
					label.className = self.labelClass;
				}

				label.innerHTML = self.label;
				wrap.appendChild(label);
			}

			return element;
		};

		self.getData = function () {
			return self.html.getElementsByTagName('input')[0].value;
		};

		return self;
	});
})();


(function () {

	'use strict';

	FormBuilder.register('textarea', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);

		self.render = function (wrap) {
			var element = document.createElement('textarea');

			element.name = self.name;
			element.disabled = self.disabled;
			element.cols = config.cols || 20;
			element.rows = config.rows || 2;

			if (undefined !== self.placeholder) {
				element.placeholder	= self.placeholder;
			}

			if (self.label) {
				var label = document.createElement('label');

				if (self.labelClass) {
					label.className = self.labelClass;
				}

				label.innerHTML = self.label;
				wrap.appendChild(label);
			}

			if (self.value !== undefined && self.value !== null) {
				element.value = self.value;
			}		

			if (self.elementClass) {
				element.className = self.elementClass;
			}	

			return element;
		};

		self.getData = function () {
			return self.html.getElementsByTagName('textarea')[0].value;
		};

		return self;
	});
})();


