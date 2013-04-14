$(document).ready(function() {
	$('#fieldName').keyup(function() {
		if ($('#fieldName').val()) {
			$('#formSubmit').attr('disabled', false);
		} else {
			$('#formSubmit').attr('disabled', true);
		}
	});
});