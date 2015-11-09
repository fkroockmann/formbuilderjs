(function () {

	'use strict';

	FormBuilder.register('text', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);

		self.render = function () {
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

			return element;
		};

		self.getData = function () {
			return self.html.getElementsByTagName('input')[0].value;
		};

		return self;
	});
})();

