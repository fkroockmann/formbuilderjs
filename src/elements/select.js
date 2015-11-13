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

