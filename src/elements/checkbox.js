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

		self.render = function (div) {

			var key,
				option,
				checkbox,
				span;

			if (self.options.length > 1) {
				self.name = self.name + '[]';
			}

			for (key in self.options) {
				option = self.options[key];
				checkbox = document.createElement('input');
				span = document.createElement('span');

				checkbox.type = 'checkbox';				
				checkbox.name = self.name;
				checkbox.value = key;

				if (-1 !== self.checked.indexOf(key)) {
					checkbox.checked = 'checked';
				}

				span.innerHTML = option;

				div.appendChild(checkbox);
				div.appendChild(span);
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

