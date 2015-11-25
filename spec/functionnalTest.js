
QUnit.module('Functionnal tests');

var genericTestForm = function (config, formData, assert) {
		var form,
			div = document.createElement('div'),
			domForm,
			submitted = false,
			validated = false,
			submitInput;

		form = FormBuilder.getForm(config);
		form.render(div);

		domForm = div.getElementsByTagName('form')[0];
		
		assert.deepEqual(typeof domForm, 'object', 'Form found in DOM');

		assert.deepEqual(domForm.id, form.id, 'Form id is found');
		assert.deepEqual(domForm.className, form.formClass, 'Form class is found');
		
		submitInput = domForm.querySelector('input[type=submit]');
		assert.deepEqual(typeof submitInput, 'object', 'Submit is found');
		assert.deepEqual(submitInput.className, form.elements.submit.elementClass);

		form.on('submit', function () {
			submitted = true;
		});

		form.on('validate', function (data) {
			validated = true;
			if (formData) {
				assert.deepEqual(data, formData, 'Data is same');
			}
		});

		assert.deepEqual(validated, false);
		assert.deepEqual(submitted, false);
		submitInput.click();
		assert.deepEqual(validated, true, 'Validate event is trigged');
		assert.deepEqual(submitted, true, 'Submit event is trigged');

		return {'form': form, 'domForm': domForm};
	};

QUnit.test('Test Basic form', function (assert) {
	genericTestForm({'elements': {}}, null, assert);
});

QUnit.test('Test Custom Form', function (assert) {
	var config = {
			'elements': {},
			'form': {
				'name': 'testform',
				'form_class': 'form',
				'submit_class': 'btn btn-default'
			}
		};

	genericTestForm(config, null, assert);
});

QUnit.test('Test Text Element', function (assert) {
	var config = {
			'elements': {
				'mytext': {
					'type': 'text',
					'label': 'My text',
					'value': 'foo',
					'wrap_class': 'form-group',
					'element_class': 'form-control',
					'label_class': 'foo'
				}
			}
		},
		data = {'mytext': 'foo'},
		object = genericTestForm(config, data, assert),
		form = object.form,
		domForm = object.domForm,
		wrap = domForm.querySelector('div.element_mytext'),
		input = wrap.querySelector('input[name="mytext"]'),
		label = wrap.getElementsByTagName('label')[0];

	assert.deepEqual(typeof wrap, 'object', 'Element found');
	assert.deepEqual(typeof input, 'object', 'Input found');
	assert.deepEqual(typeof label, 'object', 'Label found');
	assert.deepEqual(wrap.className, 'element_mytext ' + config.elements.mytext.wrap_class, 'Wrap class found');
	assert.deepEqual(input.className, config.elements.mytext.element_class, 'Input class found');
	assert.deepEqual(label.className, config.elements.mytext.label_class, 'Label class found');
	assert.deepEqual(input.value, config.elements.mytext.value, 'Value found');
});

QUnit.test('Test Hidden Element', function (assert) {
	var config = {
			'elements': {
				'myhidden': {
					'type': 'hidden',
					'value': 'foo'
				}
			}
		},
		data = {'myhidden': 'foo'},
		object = genericTestForm(config, data, assert),
		form = object.form,
		domForm = object.domForm,
		wrap = domForm.querySelector('div.element_myhidden'),
		input = wrap.querySelector('input[name="myhidden"]');

	assert.deepEqual(typeof wrap, 'object', 'Element found');
	assert.deepEqual(typeof input, 'object', 'Input found');
	assert.deepEqual(input.value, config.elements.myhidden.value, 'Value found');
});

QUnit.test('Test Textarea Element', function (assert) {
	var config = {
			'elements': {
				'mytextarea': {
					'type': 'textarea',
					'value': 'foo',
					'cols': 22,
					'rows': 3
				}
			}
		},
		data = {'mytextarea': 'foo'},
		object = genericTestForm(config, data, assert),
		form = object.form,
		domForm = object.domForm,
		wrap = domForm.querySelector('div.element_mytextarea'),
		input = wrap.querySelector('textarea[name="mytextarea"]');

	assert.deepEqual(typeof wrap, 'object', 'Element found');
	assert.deepEqual(typeof input, 'object', 'Input found');
	assert.deepEqual(input.value, config.elements.mytextarea.value, 'Value found');
	assert.deepEqual(input.cols, config.elements.mytextarea.cols, 'Cols found');
	assert.deepEqual(input.rows, config.elements.mytextarea.rows, 'Rows found');
});

QUnit.test('Test Radio Element', function (assert) {
	var config = {
			'elements': {
				'myradio': {
					'type': 'radio',
					'label': 'My radio',
					'wrap_class': 'form-group',
					'element_class': 'form-control',
					'label_class': 'foo',
					'options': {
						'foo': 'Foo',
						'bar': 'Bar'
					},
					'checked': 'bar'
				}
			}
		},
		data = {'myradio': 'bar'},
		object = genericTestForm(config, data, assert),
		form = object.form,
		domForm = object.domForm,
		wrap = domForm.querySelector('div.element_myradio'),
		input = wrap.querySelector('input[name="myradio"]'),
		label = wrap.getElementsByTagName('label')[0];

	assert.deepEqual(typeof wrap, 'object', 'Element found');
	assert.deepEqual(typeof input, 'object', 'Input found');
	assert.deepEqual(typeof label, 'object', 'Label found');
	assert.deepEqual(wrap.className, 'element_myradio ' + config.elements.myradio.wrap_class, 'Wrap class found');
	assert.deepEqual(input.className, config.elements.myradio.element_class, 'Input class found');
	assert.deepEqual(label.className, config.elements.myradio.label_class, 'Label class found');
});

QUnit.test('Test Select Element', function (assert) {
	var config = {
			'elements': {
				'myselect': {
					'type': 'select',
					'label': 'My select',
					'wrap_class': 'form-group',
					'element_class': 'form-control',
					'label_class': 'foo',
					'options': {
						'foo': 'Foo',
						'bar': 'Bar'
					},
					'selected': 'bar'
				}
			}
		},
		data = {'myselect': 'bar'},
		object = genericTestForm(config, data, assert),
		form = object.form,
		domForm = object.domForm,
		wrap = domForm.querySelector('div.element_myselect'),
		select = wrap.querySelector('select[name="myselect"]'),
		label = wrap.getElementsByTagName('label')[0];

	assert.deepEqual(typeof wrap, 'object', 'Element found');
	assert.deepEqual(typeof select, 'object', 'Input found');
	assert.deepEqual(typeof label, 'object', 'Label found');
	assert.deepEqual(wrap.className, 'element_myselect ' + config.elements.myselect.wrap_class, 'Wrap class found');
	assert.deepEqual(select.className, config.elements.myselect.element_class, 'Input class found');
	assert.deepEqual(label.className, config.elements.myselect.label_class, 'Label class found');
});

QUnit.test('Test Checkbox Element', function (assert) {
	var config = {
			'elements': {
				'mycheckbox': {
					'type': 'checkbox',
					'label': 'My checkbox',
					'wrap_class': 'form-group',
					'element_class': 'form-control',
					'label_class': 'foo',
					'options': {
						'foo': 'Foo',
						'bar': 'Bar'
					},
					'checked': ['bar', 'foo']
				}
			}
		},
		data = {'mycheckbox': ['foo', 'bar']},
		object = genericTestForm(config, data, assert),
		form = object.form,
		domForm = object.domForm,
		wrap = domForm.querySelector('div.element_mycheckbox'),
		input = wrap.querySelector('input[name="mycheckbox"]'),
		label = wrap.getElementsByTagName('label')[0];

	assert.deepEqual(typeof wrap, 'object', 'Element found');
	assert.deepEqual(typeof input, 'object', 'Input found');
	assert.deepEqual(typeof label, 'object', 'Label found');
	assert.deepEqual(wrap.className, 'element_mycheckbox ' + config.elements.mycheckbox.wrap_class, 'Wrap class found');
	assert.deepEqual(input.className, config.elements.mycheckbox.element_class, 'Input class found');
	assert.deepEqual(label.className, config.elements.mycheckbox.label_class, 'Label class found');
});