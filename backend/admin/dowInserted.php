<?php
include("includes/db_settings.php");
require_once("includes/functions.php");

// Helper function to handle uploads and convert images to WebP
function uploadFile($fileKey, $uploadDir = "upload/dow/") {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return "";
    }
    
    $tmpName = $_FILES[$fileKey]['tmp_name'];
    $originalName = basename($_FILES[$fileKey]['name']);
    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    $newName = uniqid("img_") . ".webp";  // Always save as .webp

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Process the image if not already webp
    if ($ext === 'webp') {
        move_uploaded_file($tmpName, $uploadDir . $newName);  // Directly move .webp file
        return $newName;
    }

    // Handle other image types and convert them to WebP
    switch (strtolower($ext)) {
        case 'jpg':
        case 'jpeg':
            $img = imagecreatefromjpeg($tmpName);
            break;
        case 'png':
            $img = imagecreatefrompng($tmpName);
            imagepalettetotruecolor($img);  // Convert to truecolor for WebP
            imagealphablending($img, true);
            imagesavealpha($img, true);
            break;
        case 'gif':
            $img = imagecreatefromgif($tmpName);
            break;
        default:
            $img = null;
    }

    if ($img) {
        // Save the image as WebP
        imagewebp($img, $uploadDir . $newName, 80);
        imagedestroy($img);
        return $newName;
    }

    return "";
}

// Upload files
$browse_file_name1 = uploadFile("file1");
$browse_file_name2 = uploadFile("file2");
$browse_file_name3 = uploadFile("file3");

// Sanitize inputs
$brID = isset($_POST['brID']) && $_POST['brID'] !== '' ? (int)$_POST['brID'] : 0;
$namee   = mysqli_real_escape_string($con, $_POST['namee']);
$slug    = mysqli_real_escape_string($con, $_POST['slug']);
$desc1   = mysqli_real_escape_string($con, $_POST['desc1']);
$desc2   = mysqli_real_escape_string($con, $_POST['pageData']);
$title   = mysqli_real_escape_string($con, $_POST['title']);
$keyword = mysqli_real_escape_string($con, $_POST['keyword']);
$descr   = mysqli_real_escape_string($con, $_POST['descr']);
$addhead = mysqli_real_escape_string($con, $_POST['addhead']);
$catID   = mysqli_real_escape_string($con, $_POST['catID']);
$mainID  = mysqli_real_escape_string($con, $_POST['mainID']);
$price   = mysqli_real_escape_string($con, $_POST['price']);
$dprice  = mysqli_real_escape_string($con, $_POST['dprice']);
$sku     = mysqli_real_escape_string($con, $_POST['sku']);
$tags    = mysqli_real_escape_string($con, $_POST['tags'] ?? '');
$websiteID = mysqli_real_escape_string($con, $_POST['websiteID'] ?? 0);
$statuss = 1; // default active
$datee   = date("Y-m-d");

// Insert query with WebP images
$ins_query_img = "
INSERT INTO dow 
(brID, catID, mainID, statuss, namee, slug, code, desc1, imagee, datee, 
 title, keyword, descr, addhead, tags, imagee3, price, dprice, sku, websiteID, imagee2)
VALUES
('$brID', '$catID','$mainID','$statuss','$namee','$slug','$desc2','$desc1',
 '$browse_file_name1','$datee','$title','$keyword','$descr','$addhead',
 '$tags','$browse_file_name3','$price','$dprice','$sku','$websiteID','$browse_file_name2')
";

if (!mysqli_query($con, $ins_query_img)) {
    die('Error: ' . mysqli_error($con));
}

// Redirect back to listing
header("Location:dow.php?catID=$catID&mainID=$mainID");
exit;
?>
