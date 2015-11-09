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

