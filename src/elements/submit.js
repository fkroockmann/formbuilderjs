(function () {

	'use strict';

	FormBuilder.register('submit', function (config) {
		
		var self = this;

		this.form = config.form;

		this.render = function () {
			var element = document.createElement('input');

			element.type = "submit";
			element.value = 'Submit';

			element.onclick = function () {
				self.form.trigger('submit');
				
				return false;
			};

			return element;
		};

	});

})();