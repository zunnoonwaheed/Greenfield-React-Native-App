<?php
include("includes/db_settings.php");
ob_start();

$update_id = $_POST['id'];
$namee = str_replace("'", "`", $_POST['name']);
$title = str_replace("'", "`", $_POST['title']);
$keyword = str_replace("'", "`", $_POST['keyword']);
$keyword1 = str_replace("'", "`", $_POST['keyword1']);
$keyword2 = str_replace("'", "`", $_POST['keyword2']);
$descr = str_replace("'", "`", $_POST['descr']);
$addhead = str_replace("'", "`", $_POST['addhead']);
$slug = str_replace("'", "`", $_POST['slug']);
$menuID = !empty($_POST['menuID']) ? intval($_POST['menuID']) : 0;
$sort_order = !empty($_POST['sort_order']) ? intval($_POST['sort_order']) : 0;



// ✅ Default query (without image)
$query = "UPDATE sizee 
    SET name='{$namee}',
        title='{$title}',
        keyword='{$keyword}',
        keyword1='{$keyword1}',
        keyword2='{$keyword2}',
        descr='{$descr}',
        addhead='{$addhead}',
        slug='{$slug}',
        menuID='{$menuID}',
        sort_order='{$sort_order}'
    WHERE id=$update_id";

// ✅ Agar image upload hui ho
if (!empty($_FILES['image']['name'])) {
    $targetDir = "upload/stores/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $fileTmp  = $_FILES['image']['tmp_name'];
    $fileName = pathinfo($_FILES['image']['name'], PATHINFO_FILENAME);
    $ext      = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

    // Sirf allowed extensions
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // add webp in allowed extensions
    if (in_array($ext, $allowed)) {
        // Generate a unique name for the file
        $newName  = time() . "_" . preg_replace("/[^a-zA-Z0-9]/", "_", $fileName) . ".webp";
        $targetFile = $targetDir . $newName;

        // ✅ Convert to WebP or Move file if it's already a WebP
        if ($ext == 'webp') {
            // Agar already webp hai to sirf move kar do
            move_uploaded_file($fileTmp, $targetFile);
        } else {
            // Convert other images to WebP
            switch ($ext) {
                case 'jpg':
                case 'jpeg':
                    $img = imagecreatefromjpeg($fileTmp);
                    break;
                case 'png':
                    $img = imagecreatefrompng($fileTmp);
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    break;
                case 'gif':
                    $img = imagecreatefromgif($fileTmp);
                    break;
            }

            if (!empty($img)) {
                // Convert and save as webp (80% quality)
                imagewebp($img, $targetFile, 80);
                imagedestroy($img);
            }
        }

        // ✅ Update query with image
        $query = "UPDATE sizee 
            SET name='{$namee}',
                title='{$title}',
                keyword='{$keyword}',
                keyword1='{$keyword1}',
                keyword2='{$keyword2}',
                descr='{$descr}',
                addhead='{$addhead}',
                slug='{$slug}',
                image='{$newName}'
            WHERE id=$update_id";
    }
}

// ✅ Run query
if (!mysqli_query($con, $query)) {
    die('Error: ' . mysqli_error($con));
}

header("Location: acc.php");
exit;
?>
