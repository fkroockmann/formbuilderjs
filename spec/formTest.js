QUnit.module('Form Tests');

QUnit.test('New Form must be throw error if elements is not set', function (assert) {
	try {
		var form = new (FormBuilder.getFormClass())();
		assert.ok(false, 'Form constructeur must throw an error if elements argument is missing');
	} catch (e) {
		assert.ok(true, 'Form constructor throw an error caused by elements miss');
		assert.deepEqual('Elements must be set in form constructor', e);
	}
});

QUnit.test('New Form with simple Config (Default configuration)', function (assert) {
	var form = new (FormBuilder.getFormClass())({});

	assert.deepEqual(typeof form.elements.submit, 'object', 'Submit element is found');
	assert.deepEqual(typeof form.id, 'string', 'Form id is set');
	assert.deepEqual(form.method, 'POST', 'Default method is "POST"');
	assert.deepEqual(typeof form.name, 'string', 'Form name is set');
	assert.deepEqual(typeof form.on, 'function', 'Form on function is found');
	assert.deepEqual(typeof form.render, 'function', 'Form render function is found');
	assert.deepEqual(typeof form.addError, 'function', 'Form addError function is found');
	assert.deepEqual(typeof form.computeElements, 'function', 'Form computeElements function is found');
	assert.deepEqual(typeof form.config, 'object', 'Form config if found');
	assert.deepEqual(typeof form.dispatch, 'function', 'Form dispatch function is found');
	assert.deepEqual(typeof form.displayErrors, 'function', 'Form displayErrors function is found');
	assert.deepEqual(typeof form.errors, 'object', 'Form errors object is found');
	assert.deepEqual(form.formClass, '', 'No class by default');
	assert.deepEqual(typeof form.id, 'string', 'Form id is found');
	assert.deepEqual(form.listeners.submit, [], 'Submit listener container is found');
	assert.deepEqual(form.listeners.validate, [], 'Validate listener container is found');
	assert.deepEqual(typeof form.renderElements, 'function', 'Form renderElements function is found');
	assert.deepEqual(typeof form.submit, 'function', 'Form submit function is found');
});

QUnit.test('Form submit event tests', function (assert) {
	var form = new (FormBuilder.getFormClass())({}),
		test = 'foo',
		submitFunction = function (data, formArg) { 
			test = 'bar'; 
			assert.deepEqual(typeof data, 'object', 'First argument of callback is data');
			assert.deepEqual(form, formArg, 'Second argument of callback is the form'); 
		};

	form.on('submit', submitFunction);

	assert.deepEqual(form.listeners.submit[0], submitFunction, 'Submit callback is registred');

	assert.deepEqual(test, 'foo');
	form.submit();
	assert.deepEqual(test, 'bar', 'Submit callback is called');	
});

QUnit.test('Form validate event tests', function (assert) {
	var form = new (FormBuilder.getFormClass())({}),
		test = 'foo',
		data,
		validateFunction = function (data, formArg) { 
			test = 'bar';
			assert.deepEqual(typeof data, 'object', 'First argument of callback is data');
			assert.deepEqual(form, formArg, 'Second argument of callback is the form'); 
		};

	form.on('validate', validateFunction);
	assert.deepEqual(form.listeners.validate[0], validateFunction, 'Validate callback is registred');

	assert.deepEqual(test, 'foo');
	form.submit();
	assert.deepEqual(test, 'bar', 'Validate callback is called');	
});

QUnit.test('Form can add error to elements', function (assert) {
	var config = {
			'elements': {
				'mytext': {
					'type': 'text',
				}
			}
		},
		form,
		error = 'foooo';

	form = FormBuilder.getForm(config);

	form.addError('mytext', error);

	assert.deepEqual(form.errors.mytext, error, 'Error is registred');
});
