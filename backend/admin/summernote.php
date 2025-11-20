<?php
$allowed = array('png', 'jpg', 'gif','jpeg');
if(isset($_FILES['file']) && $_FILES['file']['error'] == 0){
	$extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
	if(!in_array(strtolower($extension), $allowed)){
		echo '{"status":"error"}';
		exit;
	}
	if(move_uploaded_file($_FILES['file']['tmp_name'],'upload/textpage/'.$_FILES['file']['name'])){
		$tmp='upload/textpage/'.$_FILES['file']['name'];
		$new = '../upload/textpage/'.$_FILES['file']['name'];
		if(copy($con,$tmp,$new)){
			echo 'upload/textpage/'.$_FILES['file']['name'];
		}
		exit;
	}
}echo '{"status":"error"}';
exit;