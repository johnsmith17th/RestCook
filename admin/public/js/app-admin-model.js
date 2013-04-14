$(document).ready(function() {
	$('#fieldName').keyup(function() {
		if ($('#fieldName').val()) {
			$('#formSubmit').attr('disabled', false);
		} else {
			$('#formSubmit').attr('disabled', true);
		}
	});

	$('.action-remove').on('click', function() {
		var key = $(this).attr('data-key');
		$('#deleteKey').val(key);
		$('#deleteFieldName').html(key);
	});

	$('.action-edit').on('click', function() {
		var key = $(this).attr('data-key');
		var paa = $('tr[data-key="'+ key +'"]');

		data = {
			name: paa.find('.field-name > abbr').html(),
			desc: paa.find('.field-name > abbr').attr('title'),
			type: paa.children('.field-type').html(),
			default: paa.children('.field-default').html(),
			required: paa.find('.field-required > i').attr('class') ? true : false,
			indexed: paa.find('.field-indexed > i').attr('class') ? true : false,
			unique: paa.find('.field-unique > i').attr('class') ? true : false
		};

		console.log(data);

	});
});