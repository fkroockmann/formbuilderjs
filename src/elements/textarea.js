(function () {

	'use strict';

	FormBuilder.register('textarea', function (config) {
		var self = {};

		self = new FormBuilder.ElementMock(config);

		self.render = function () {
			var element = document.createElement('textarea');

			element.name = self.name;
			element.disabled = self.disabled;
			element.cols = config.cols || 20;
			element.rows = config.rows || 2;

			if (undefined !== self.placeholder) {
				element.placeholder	= self.placeholder;
			}

			if (self.value !== undefined && self.value !== null) {
				element.value = self.value;
			}			

			return element;
		};

		self.getData = function () {
			return self.html.getElementsByTagName('textarea')[0].value;
		};

		return self;
	});
})();


