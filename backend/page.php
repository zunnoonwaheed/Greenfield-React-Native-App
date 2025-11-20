<?php
include("admin/includes/db_settings.php");
session_start();

$request_uri = $_SERVER['REQUEST_URI'];
$normalized_uri = preg_replace('#/+#', '/', $request_uri);
$normalized_uri = rtrim($normalized_uri, '/') . '/';

// --- NEW: Agar file exist karti hai to slug system skip kardo ---
$script_name = basename($normalized_uri, '/');
$file_path = __DIR__ . '/' . $script_name . '.php';
if (file_exists($file_path)) {
    // Direct file hai, slug redirect mat karo
    include($file_path);
    exit;
}
// --- END NEW ---

// Remove anything after the slug trailing slash
if (preg_match('#^/([^/]+)/(.*)$#', $normalized_uri, $matches)) {
    $slug = $matches[1];
    $extra = $matches[2];
    if (!empty($extra)) {
        header("Location: /$slug/", true, 301);
        exit;
    }
} else {
    http_response_code(404);
    include("404.php");
    exit;
}

// Redirect if normalized_uri != request_uri
if ($normalized_uri !== $request_uri) {
    header("Location: /$slug/", true, 301);
    exit;
}

$slug = filter_var($slug, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Query your table
$query = "SELECT * FROM dow WHERE slug = ? AND statuss = '1' LIMIT 1";
$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "s", $slug);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    // Redirects table
    $redirectQ = "SELECT new_slug FROM slug_redirects WHERE old_slug = ? LIMIT 1";
    $stmt2 = mysqli_prepare($con, $redirectQ);
    mysqli_stmt_bind_param($stmt2, "s", $slug);
    mysqli_stmt_execute($stmt2);
    $redirectResult = mysqli_stmt_get_result($stmt2);
    if ($r = mysqli_fetch_assoc($redirectResult)) {
        header("Location: /{$r['new_slug']}/", true, 301); exit;
    }

    // Fuzzy search
    $fuzzyQ = mysqli_query($con, "SELECT slug FROM dow WHERE statuss='1'");
    $bestSlug = '';
    $minDist = PHP_INT_MAX;
    while ($r2 = mysqli_fetch_assoc($fuzzyQ)) {
        $d = levenshtein($slug, $r2['slug']);
        if ($d < $minDist) {
            $minDist = $d;
            $bestSlug = $r2['slug'];
        }
    }

    if ($minDist <= 8 && !empty($bestSlug)) {
        header("Location: /$bestSlug/", true, 301); exit;
    }

    http_response_code(404);
    include("404.php"); exit;
}

$row_c = mysqli_fetch_assoc($result);

include("html.php");



// Default currency
$cquery = "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1";
$cres = mysqli_query($con, $cquery);
$currency = mysqli_fetch_assoc($cres);

// Price set
$price = $row_c['dprice'] > 0 ? $row_c['dprice'] : $row_c['price'];
$finalPrice = $price * $currency['exchange_rate'];
?>
<title><?php echo $row_c['namee']; ?></title>
<meta name="description" content="click here to get best help with your <?php echo $row_c['namee']; ?> assignment" />
<link rel="canonical" href="<?php echo $domain;?><?php echo $row_c['slug']; ?>/" />
<?php include ("head.php");?>
<?php echo $row_c['addhead'];?>
</head>
<body>
<?php include("header.php");?>
<?php
$domain = "https://greenfieldsupermarket.com/";
$imagePath = !empty($row_c['imagee']) 
    ? $domain."admin/upload/dow/".$row_c['imagee']
    : $domain."img/header-1.jpg";
    ;?>
<main>
  <div class="product-details py-5">
    <div class="container">
      <div class="row">
        <!-- Image -->
        <div class="col-lg-5 mb-3">
          <img src="/images/category-placeholder.jpg" data-src="<?php echo $imagePath; ?>" class="lazyload img-fluid rounded shadow-sm" alt="<?php echo $row_c['keyword']; ?>" />
        </div>

        <!-- Details -->
        <div class="col-lg-7">
          <h2 class="mb-3"><?php echo $row_c['namee']; ?></h2>

          <!-- Price -->
          <div class="mb-3">
            <?php if ($row_c['dprice'] > 0): ?>
              <span class="text-muted text-decoration-line-through me-2">
                <?php echo number_format($row_c['price'] * $currency['exchange_rate'], 2) . ' ' . $currency['currency']; ?>
              </span>
              <span class="h4 text-success">
                <?php echo number_format($finalPrice, 2) . ' ' . $currency['currency']; ?>
              </span>
            <?php else: ?>
              <span class="h4 text-dark">
                <?php echo number_format($finalPrice, 2) . ' ' . $currency['currency']; ?>
              </span>
            <?php endif; ?>
          </div>

          <!-- Description -->
          <p class="mb-4"><?php echo nl2br($row_c['code']); ?></p>
<form class="addToCartForm d-flex align-items-center gap-3">
  <input type="hidden" name="product_id" value="<?= $row_c['id']; ?>">
    <div class="col-md-2">
<div class="input-group input-group-sm elegant-qty rounded-pill" style="max-width: 140px;">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

</div>
  <button type="submit" class="btn btn-primary btn-lg">
    <svg width="20" height="20" class="me-1"><use xlink:href="#shopping-bag"></use></svg>
    Add to Cart
  </button>
</form>

<!-- Success Message -->
<div id="cartMsg" class="cart-msg text-success fw-bold"> </div>



</div></div>
<?php
// Step 1: Try to fetch same category products
$similarQ = "SELECT * FROM dow WHERE statuss='1' AND id != ? AND catId = ? LIMIT 4";
$stmt3 = mysqli_prepare($con, $similarQ);
mysqli_stmt_bind_param($stmt3, "ii", $row_c['id'], $row_c['catId']);
mysqli_stmt_execute($stmt3);
$similarRes = mysqli_stmt_get_result($stmt3);

// Step 2: If no category products found, fetch random
if (mysqli_num_rows($similarRes) === 0) {
    $randomQ = "SELECT * FROM dow WHERE statuss='1' AND id != ? ORDER BY RAND() LIMIT 6";
    $stmt4 = mysqli_prepare($con, $randomQ);
    mysqli_stmt_bind_param($stmt4, "i", $row_c['id']);
    mysqli_stmt_execute($stmt4);
    $similarRes = mysqli_stmt_get_result($stmt4);
}
?>

<?php if (mysqli_num_rows($similarRes) > 0): ?>
  <div class="similar-products mt-5">
    <h3 class="mb-4">Similar Products</h3>
    <div class="row">
      <?php while ($sp = mysqli_fetch_assoc($similarRes)): 
        $spImage = !empty($sp['imagee']) 
          ? $domain."admin/upload/dow/".$sp['imagee'] 
          : $domain."img/header-1.jpg";

        $spFinal = ($sp['dprice'] > 0) ? $sp['dprice'] : $sp['price'];
      ?>
        <div class="col-6 col-sm-4 col-md-2 mb-4">
          <div class="card h-100 shadow-sm d-flex flex-column">
            <a href="/<?= $sp['slug']; ?>/">
              <img src="/images/category-placeholder.jpg" data-src="<?= $spImage; ?>" class="lazyload card-img-top product-img" alt="<?= htmlspecialchars($sp['namee']); ?>">
            </a>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title text-truncate">
                <a href="/<?= $sp['slug']; ?>/" class="text-decoration-none text-dark">
                  <?= htmlspecialchars($sp['namee']); ?>
                </a>
              </h6>
              <p class="fw-bold mb-2">
                <?= number_format($spFinal, 2) . ' ' . $currency['currency']; ?>
              </p>

              <form class="addToCartForm mt-auto">
                <input type="hidden" name="product_id" value="<?= $sp['id']; ?>">
              <div class="row g-1 mt-2">
            <!-- Quantity box -->
            <div class="col-12 col-md-12">
               <div class="input-group input-group-sm elegant-qty rounded-pill" style="max-width: 140px;">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>
            </div>

            <!-- Add to Cart button -->
            <div class="col-12 col-md-12">
                <button type="submit" class="btn btn-primary rounded-1 p-2 fs-7 w-100">
                    <svg width="18" height="18"><use xlink:href="#cart"></use></svg> Add to Cart
                </button>
            </div>
        </div>
               
               
              </form>
            </div>
          </div>
        </div>
      <?php endwhile; ?>
    </div>
  </div>
<?php endif; ?>

 
<script>
    function showCartMsg(msg="Product added to cart!"){
    const el = document.getElementById('cartMsg');
    el.innerText = msg;
    el.classList.add('show');

    setTimeout(() => {
        el.classList.remove('show');
    }, 2000); // 2 seconds
}
</script>


<?php include("product-js.php");?>
<?php include("footer.php");?>          
<?php include("js.php");?>
</body>
</html>
