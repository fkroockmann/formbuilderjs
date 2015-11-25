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