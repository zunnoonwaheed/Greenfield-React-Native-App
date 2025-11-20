<?php
include("../admin/includes/db_settings.php");
session_start();

$slug = $_GET['slug'] ?? '';
$slug = mysqli_real_escape_string($con, $slug);

include("../html.php");
include("../head.php");
include("../header.php");

// Fetch categories (subcategory list for this page)
$homepQ = "SELECT section25 FROM homep LIMIT 1"; 
$homepRes = mysqli_query($con, $homepQ);
$excludeIds = [];

if ($homepRes && mysqli_num_rows($homepRes) > 0) {
    $row = mysqli_fetch_assoc($homepRes);
    if (!empty($row['section25'])) {
        // ids array mein convert
        $excludeIds = array_map('intval', explode(',', $row['section25']));
    }
}

// base query
$catQ = "SELECT * FROM sizee WHERE catID != 0";

// agar exclude IDs hain to NOT IN clause add karo
if (!empty($excludeIds)) {
    $ids = implode(',', $excludeIds);
    $catQ .= " AND id NOT IN ($ids)";
}

$catQ .= " ORDER BY name ASC";

$catRes = mysqli_query($con, $catQ);
// Default placeholder
$defaultImage = "/images/category-placeholder.jpg";
?>

<div class="container py-5">
  <div class="row g-4">
    <?php while($cat = mysqli_fetch_assoc($catRes)): 
      $catImage = !empty($cat['image']) 
        ? "/admin/upload/stores/" . $cat['image'] 
        : $defaultImage;
    ?>
      <div class="col-6 col-md-3 col-lg-2 text-center">
        <a href="/category/<?= htmlspecialchars($cat['slug']); ?>/" class="d-block text-decoration-none">
          <img src="/images/category-placeholder.jpg"data-src="<?= $catImage; ?>" 
               class="lazyload rounded-circle border bordery category-icon" 
               alt="<?= htmlspecialchars($cat['name']); ?>">
          <h4 class="fs-6 mt-2 fw-normal"><?= htmlspecialchars($cat['name']); ?></h4>
        </a>
      </div>
    <?php endwhile; ?>
  </div>
</div>

<?php include("../product-js.php");?>
<?php include("../footer.php");?>          
<?php include("../js.php");?>
