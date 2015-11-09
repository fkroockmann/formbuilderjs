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

		self.render = function (div) {

			var key,
				option,
				radio,
				span;

			for (key in self.options) {
				option = self.options[key];
				radio = document.createElement('input');
				span = document.createElement('span');

				radio.type = 'radio';				
				radio.name = self.name;
				radio.value = key;

				if (-1 !== self.checked.indexOf(key)) {
					radio.checked = 'checked';
				}

				span.innerHTML = option;

				div.appendChild(radio);
				div.appendChild(span);
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

