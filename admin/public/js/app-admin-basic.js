$(document).ready(function() {
	$('#deleteNameInput').keyup(function() {
		if ($('#deleteNameInput').val() == $('#deleteName').val()) {
			$('#deleteSubmit').attr('disabled', false);
		} else {
			$('#deleteSubmit').attr('disabled', true);
		}
	});
});