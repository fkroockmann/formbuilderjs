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
	assert.ok(typeof FormBuilder.getForm === 'function', 'getForm function is found');
	assert.ok(typeof FormBuilder.register === 'function', 'register function is found');
	assert.ok(typeof FormBuilder.setDefaultConfig === 'function', 'setDefaultConfig function is found');
	assert.ok(typeof FormBuilder.getDefaultConfig === 'function', 'getDefaultConfig function is found');
	assert.ok(typeof FormBuilder.register === 'function', 'register function is found');
	assert.ok(typeof FormBuilder.deRegister === 'function', 'Deregister function is found');
	assert.ok(typeof FormBuilder.setFormClass === 'function', 'setForm function is found');
	assert.ok(typeof FormBuilder.getFormClass === 'function', 'getForm function is found');
	assert.ok(typeof FormBuilder.ElementMock === 'function', 'ElementMock is found');

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
});

QUnit.test('Form Class is include', function (assert) {
	assert.ok(typeof FormBuilder.getFormClass() === 'function', 'Form Class is found');
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

	assert.ok(FormBuilder.elements.foo === undefined, 'Element foo is not found');
});