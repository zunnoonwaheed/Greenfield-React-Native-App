<?php require_once("includes/db_settings.php"); ?>
<?php 
ob_start();
$update_id = $_POST['id'] ?? 0;
$brID = isset($_POST['brID']) && $_POST['brID'] !== '' ? (int)$_POST['brID'] : 0;
$namee   = str_replace("'", "`", $_POST['namee'] ?? '');
$slug    = str_replace("'", "`", $_POST['slug'] ?? '');
$desc1   = str_replace("'", "`", $_POST['desc1'] ?? '');
$desc2   = str_replace("'", "`", $_POST['pageData'] ?? '');
$title   = str_replace("'", "`", $_POST['title'] ?? '');
$keyword = str_replace("'", "`", $_POST['keyword'] ?? '');
$descr   = str_replace("'", "`", $_POST['descr'] ?? '');
$addhead = str_replace("'", "`", $_POST['addhead'] ?? '');
$catID   = str_replace("'", "`", $_POST['catID'] ?? '');
$mainID  = str_replace("'", "`", $_POST['mainID'] ?? '');
$tags    = str_replace("'", "`", $_POST['tags'] ?? '');
$old_slug = $_POST['old_slug'] ?? '';
$price   = $_POST['price'] ?? 0;
$dprice  = $_POST['dprice'] ?? 0;
$sku     = str_replace("'", "`", $_POST['sku'] ?? '');
$schedule_date = $_POST['schedule_date'] ?? null;

// Slug Redirect Logic
if ($old_slug && $old_slug !== $slug) {
    $check = $con->prepare("SELECT id FROM slug_redirects WHERE old_slug=?");
    $check->bind_param("s", $old_slug);
    $check->execute();
    $check->store_result();

    if ($check->num_rows === 0) {
        $insert = $con->prepare("INSERT INTO slug_redirects (old_slug, new_slug) VALUES (?, ?)");
        $insert->bind_param("ss", $old_slug, $slug);
        $insert->execute();
    }
}

$query = "UPDATE dow 
    SET 
    brID='{$brID}',
    namee='{$namee}',
        desc1='{$desc1}',
        code='{$desc2}',
        title='{$title}',
        keyword='{$keyword}',
        descr='{$descr}',
        addhead='{$addhead}',
        tags='{$tags}',
        price='{$price}',
        dprice='{$dprice}',
        sku='{$sku}',
        slug='{$slug}'
    WHERE id='{$update_id}'";

if (!mysqli_query($con, $query)) {
    die('Error: ' . mysqli_error($con));
}

// -------- IMAGE UPLOAD START --------
function handleImageUpdate($fileKey, $column, $update_id, $oldImgName = '') {
    global $con;
    $uploadDir = "upload/dow/";

    if (isset($_FILES[$fileKey]['name']) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
        $browse_file_name = $_FILES[$fileKey]['name'];
        $temp = $_FILES[$fileKey]['tmp_name'];
        $ext = pathinfo($browse_file_name, PATHINFO_EXTENSION);
        $newFileName = time() . "_" . basename($browse_file_name);

        // Delete old image if exists
        if (!empty($oldImgName)) {
            $filename = $uploadDir . $oldImgName;
            if (file_exists($filename)) {
                unlink($filename);
            }
        }

        // Convert image to WebP if not already webp
        if (strtolower($ext) === 'webp') {
            // Directly move .webp file
            move_uploaded_file($temp, $uploadDir . $newFileName);
        } else {
            // Convert other images to WebP
            $newFileName = time() . "_" . preg_replace("/[^a-zA-Z0-9]/", "_", pathinfo($browse_file_name, PATHINFO_FILENAME)) . ".webp";
            switch (strtolower($ext)) {
                case 'jpg':
                case 'jpeg':
                    $img = imagecreatefromjpeg($temp);
                    break;
                case 'png':
                    $img = imagecreatefrompng($temp);
                    imagepalettetotruecolor($img);  // Convert to truecolor for WebP
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    break;
                case 'gif':
                    $img = imagecreatefromgif($temp);
                    break;
                default:
                    $img = null;
            }

            if ($img) {
                // Save as WebP
                imagewebp($img, $uploadDir . $newFileName, 80);
                imagedestroy($img);
            }
        }

        // Update database with the new image
        $query = "UPDATE dow SET {$column}='{$newFileName}' WHERE id={$update_id}";
        if (!mysqli_query($con, $query)) {
            die('Error: ' . mysqli_error($con));
        }
    }
}

// Imagee (main)
handleImageUpdate("file1", "imagee", $update_id, $_POST['imagName'] ?? '');
// Imagee2
handleImageUpdate("file2", "imagee2", $update_id, $_POST['imagName2'] ?? '');
// Imagee3
handleImageUpdate("file3", "imagee3", $update_id, $_POST['imagName3'] ?? '');
// -------- IMAGE UPLOAD END --------

header("Location:dow.php?catID=$catID&mainID=$mainID");
exit;
?>
