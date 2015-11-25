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

