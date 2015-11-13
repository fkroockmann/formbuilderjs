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

