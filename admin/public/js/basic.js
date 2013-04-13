$(document).ready(function() {
	$('#deleteNameInput').keyup(function(arguments) {
		if ($('#deleteNameInput').val() == $('#deleteName').val()) {
			$('#deleteSubmit').attr('disabled', false);
		} else {
			$('#deleteSubmit').attr('disabled', true);
		}
	});
});