<?php
include("includes/db_settings.php"); // $con (main)
include("includes/db_settings2.php"); // $con2 (author data)

// Get DOW post ID
$post_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!$post_id) {
    echo "Invalid post ID.";
    exit;
}

// Get current domain
$current_domain = str_ireplace(['https://', 'http://'], '', $_SERVER['HTTP_HOST']);
$current_domain = rtrim($current_domain, '/');

// Get current website ID from con2
$website_stmt = $con2->prepare("SELECT id FROM websites WHERE domain = ?");
$website_stmt->bind_param("s", $current_domain);
$website_stmt->execute();
$website_result = $website_stmt->get_result();
if ($website_result->num_rows === 0) {
    echo "Website not found.";
    exit;
}
$website = $website_result->fetch_assoc();
$current_website_id = (int)$website['id'];

// Get post data from con (main)
$post_stmt = $con->prepare("SELECT author_id, author_name FROM dow WHERE id = ?");
$post_stmt->bind_param("i", $post_id);
$post_stmt->execute();
$post_result = $post_stmt->get_result();
if ($post_result->num_rows === 0) {
    echo "Post not found.";
    exit;
}
$post = $post_result->fetch_assoc();

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $new_author_id = (int)$_POST['author_id'];
    $new_author_name = trim($_POST['author_name']);

    $update_stmt = $con->prepare("UPDATE dow SET author_id = ?, author_name = ? WHERE id = ?");
    $update_stmt->bind_param("isi", $new_author_id, $new_author_name, $post_id);

    if ($update_stmt->execute()) {
        echo "<p>Author updated successfully.</p>";
        $post['author_id'] = $new_author_id;
        $post['author_name'] = $new_author_name;
    } else {
        echo "<p>Failed to update author.</p>";
    }
}

// Fetch ALL authors from con2 profile with email
$authors_sql = "
    SELECT id, CONCAT(first_name, ' ', last_name) AS full_name, email, website_ids
    FROM profile
    ORDER BY first_name ASC
";
$authors_res = $con2->query($authors_sql);
$authors = [];
while ($row = $authors_res->fetch_assoc()) {
    $authors[] = $row;
}

// Find current author's email to prefill email field on page load
$current_author_email = '';
foreach ($authors as $a) {
    if ($a['id'] == $post['author_id']) {
        $current_author_email = $a['email'];
        break;
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Author</title>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Select2 CSS & JS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        label { display: block; margin-top: 10px; }
        select, input { width: 300px; padding: 5px; }
        button { margin-top: 15px; padding: 8px 15px; }
        #author_email { background-color: #f0f0f0; }
    </style>
</head>
<body>

<h2>Edit Author</h2>
<form method="post">
    <label>Select Author:</label>
    <select id="author_select" class="select2">
        <option value="">-- Select Author --</option>
        <?php foreach ($authors as $a): ?>
            <?php
            $website_ids_array = array_map('trim', explode(',', $a['website_ids'] ?? ''));
            $tagged = in_array($current_website_id, $website_ids_array);
            ?>
            <option value="<?= $a['id'] ?>" 
                data-name="<?= htmlspecialchars($a['full_name']) ?>"
                data-email="<?= htmlspecialchars($a['email']) ?>"
                <?= ($a['id'] == $post['author_id']) ? 'selected' : '' ?>>
                <?= htmlspecialchars($a['full_name']) ?> (ID: <?= $a['id'] ?>)
                <?= !$tagged ? ' [Not Tagged]' : '' ?>
            </option>
        <?php endforeach; ?>
    </select>
    <br><br>

    <label>Author ID:</label>
    <input type="number" name="author_id" id="author_id" value="<?= htmlspecialchars($post['author_id']) ?>" required>
    <br><br>

    <label>Author Name:</label>
    <input type="text" name="author_name" id="author_name" value="<?= htmlspecialchars($post['author_name']) ?>" required>
    <br><br>

    <label>Author Email:</label>
    <input type="email" id="author_email" value="<?= htmlspecialchars($current_author_email) ?>" readonly>
    <br><br>

    <button type="submit">Save</button>
</form>
<a href="posts.php" class="btn btn-primary">Back</a>

<script>
$(document).ready(function() {
    $('.select2').select2({
        placeholder: "-- Select Author --",
        allowClear: true,
        width: '300px'
    });

    // On change update ID, Name and Email fields
    $('#author_select').on('change', function () {
        let selected = $(this).find(':selected');
        let authorId = selected.val();
        let authorName = selected.data('name');
        let authorEmail = selected.data('email');

        if (authorId) {
            $('#author_id').val(authorId);
            $('#author_name').val(authorName);
            $('#author_email').val(authorEmail);
        } else {
            // Clear if no author selected
            $('#author_id').val('');
            $('#author_name').val('');
            $('#author_email').val('');
        }
    });
});
</script>

</body>
</html>
