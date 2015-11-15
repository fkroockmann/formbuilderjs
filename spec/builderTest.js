QUnit.module('Builder Tests');

QUnit.test('Global FormBuilder variable exist', function(assert) {
	assert.ok(FormBuilder);						
});

QUnit.test('Default elements are registred', function (assert) {
	assert.ok(FormBuilder.elements.text, 'Element Text is found');
	assert.ok(FormBuilder.elements.textarea, 'Element Textarea is found');
	assert.ok(FormBuilder.elements.checkbox, 'Element Checkbox is found');
	assert.ok(FormBuilder.elements.radio, 'Element Radio is found');
	assert.ok(FormBuilder.elements.hidden, 'Element Hidden is found');
	assert.ok(FormBuilder.elements.select, 'Element Select is found');
	assert.ok(FormBuilder.elements.submit, 'Element Submit is found');

	assert.deepEqual(Object.keys(FormBuilder.elements).length, 7, '7 elements in FormBuilder');
});

QUnit.test('Default FormBuilder functions are defined', function (assert) {
	assert.deepEqual(typeof FormBuilder.getForm, 'function', 'getForm function is found');
	assert.deepEqual(typeof FormBuilder.register, 'function', 'register function is found');
	assert.deepEqual(typeof FormBuilder.setDefaultConfig, 'function', 'setDefaultConfig function is found');
	assert.deepEqual(typeof FormBuilder.getDefaultConfig, 'function', 'getDefaultConfig function is found');
	assert.deepEqual(typeof FormBuilder.register, 'function', 'register function is found');
	assert.deepEqual(typeof FormBuilder.deRegister, 'function', 'Deregister function is found');
	assert.deepEqual(typeof FormBuilder.setFormClass, 'function', 'setForm function is found');
	assert.deepEqual(typeof FormBuilder.getFormClass, 'function', 'getForm function is found');
	assert.deepEqual(typeof FormBuilder.ElementMock, 'function', 'ElementMock is found');

	assert.deepEqual(Object.keys(FormBuilder).length, 9, '9 attributes form the FormBuilder');
});

QUnit.test('setDefaultConfig and getDefaultConfig functions work', function (assert) {
	var defaultConfig = {
		'elements': {
			'text': {
				'element_Class': 'foo',
				'wrap_class': 'bar'
			},
			'select': {
				'element_class': 'bar',
				'wrap_class': 'foo'
			}
		}
	};

	FormBuilder.setDefaultConfig(defaultConfig);
	assert.deepEqual(FormBuilder.getDefaultConfig(), defaultConfig, 'Default config is set');
	FormBuilder.setDefaultConfig({});	
});

QUnit.test('Form Class is include', function (assert) {
	assert.deepEqual(typeof FormBuilder.getFormClass(), 'function', 'Form Class is found');
});

QUnit.test('getForm function throw errors', function (assert) {
	try {
		FormBuilder.getForm();
		assert.ok(false, 'getForm function must have a config argument');
	} catch (e) {
		assert.ok(true, 'getForm function throw an error when config argument is missing');
		assert.deepEqual('Config must be set', e);
	}

	try {
		FormBuilder.getForm({});
		asert.ok(false, 'config argument must have "elements" attibute');
	} catch (e) {
		assert.ok(true, 'getForm function throw an error when config dont have elements attibute');
		assert.deepEqual('Elements must be set', e);
	}
});

QUnit.test('New element is registred', function (assert) {
	FormBuilder.register('foo', function () {
		return;
	});

	assert.ok(FormBuilder.elements.foo, 'Element foo is found');
});

QUnit.test('Element is deregistred', function (assert) {
	FormBuilder.deRegister('foo');

	assert.deepEqual(FormBuilder.elements.foo, undefined, 'Element foo is not found');
});

QUnit.module('Element Mock Test');

QUnit.test('New Element must be throw errors if the config is not valid', function (assert) {
	try {
		var element = new FormBuilder.ElementMock();
		assert.ok(false, 'Element class must have "config" in construct arguments');
	} catch (e) {
		assert.ok(true, 'ElementMock throw an error if the "config" is missing as argument');
		assert.deepEqual('Config for element must be set', e);
	}
});

QUnit.test('Element with simple config (Default configuration)', function (assert) {
	var element = new FormBuilder.ElementMock({});
	
	assert.deepEqual(element.disabled, false, 'Element is not disabled');
	assert.deepEqual(typeof element.displayError, 'function', 'Display error function exist');
	assert.deepEqual(element.elementClass, '', 'Element dont have class');
	assert.deepEqual(element.error, null, 'Element error is null');
	assert.deepEqual(element.form, undefined, 'Form is not set');
	assert.deepEqual(typeof element.getDefaultElementClass, 'function', 'getDefaultElementClass function exist');
	assert.deepEqual(typeof element.id, 'string', 'Element have an id');
	assert.deepEqual(element.label, undefined, 'Element dont have label');
	assert.deepEqual(element.labelClass, '', 'Element label dont have class');
	assert.deepEqual(element.name, undefined, 'Element dont have name');
	assert.deepEqual(element.placeholder, undefined, 'Element dont have placeholder');
	assert.deepEqual(typeof element.setDefaultClass, 'function', 'setDefaultClass function exit');
	assert.deepEqual(element.type, undefined, 'Element dont have type');
	assert.deepEqual(element.value, undefined, 'Element dont have value');
	assert.deepEqual(element.wrapClass, '', 'Element wrap dont have class');
});

QUnit.test('Element config override with Form config', function (assert) {
	var elementConfig = {
		'type': 'text',
		'element_class': 'foo',
		'wrap_class': 'bar',
		'label_class': 'foobar'
	};

	var element = new FormBuilder.ElementMock(elementConfig);

	assert.deepEqual(element.elementClass, elementConfig.element_class, 'Element class is override by Form Config');
	assert.deepEqual(element.wrapClass, elementConfig.wrap_class, 'Wrap class is override by Form Config');
	assert.deepEqual(element.labelClass, elementConfig.label_class, 'Label class is override by Form Config');
});

QUnit.test('Element config override with FormBuilder default config', function (assert) {
	var defaultConfig = {
		'elements': {
			'text': {
				'element_class': 'foo',
				'wrap_class': 'bar',
				'label_class': 'foobar'
			}
		}
	};

	FormBuilder.setDefaultConfig(defaultConfig);

	var element = new FormBuilder.ElementMock({'type': 'text'});

	assert.deepEqual(element.elementClass, defaultConfig.elements.text.element_class, 'Element class is override by FormBuilder default Config');
	assert.deepEqual(element.wrapClass, defaultConfig.elements.text.wrap_class, 'Wrap class is override by FormBuilder default Config');
	assert.deepEqual(element.labelClass, defaultConfig.elements.text.label_class, 'Label class is override by FormBuilder default Config');

	FormBuilder.setDefaultConfig({});
});

QUnit.test('Element config is override by Form before FormBuilder defaultConfig', function (assert) {
	var elementConfig = {
			'type': 'text',
			'element_class': 'fooz',
			'wrap_class': 'barz',
			'label_class': 'foobarz'
		},
		defaultConfig = {
			'elements': {
				'text': {
					'element_class': 'foo',
					'wrap_class': 'bar',
					'label_class': 'foobar'
				}
			}
		};

	FormBuilder.setDefaultConfig(defaultConfig);

	var element = new FormBuilder.ElementMock(elementConfig);

	assert.deepEqual(element.elementClass, elementConfig.element_class, 'Element class is override by Form Config');
	assert.deepEqual(element.wrapClass, elementConfig.wrap_class, 'Wrap class is override by Form Config');
	assert.deepEqual(element.labelClass, elementConfig.label_class, 'Label class is override by Form Config');

	FormBuilder.setDefaultConfig({});
});
