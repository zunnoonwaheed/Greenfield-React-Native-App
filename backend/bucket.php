<?php
include("admin/includes/db_settings.php");
session_start();

$domain = "https://greenfieldsupermarket.com/";

// Currency
$cquery = "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1";
$cres = mysqli_query($con, $cquery);
$currency = mysqli_fetch_assoc($cres);

// Fetch active bundles
$query = "SELECT * FROM bundles WHERE status = 1 ORDER BY created_at DESC";
$result = mysqli_query($con, $query);

include("html.php");
?>
<title>Our Bundles - Greenfield Supermarket</title>
<meta name="description" content="Shop exclusive product bundles at the best prices." />
<link rel="canonical" href="<?= $domain; ?>bucket.php" />
<?php include("head.php");?>
</head>
<body>
<?php include("header.php");?>

<main>
  <div class="container py-5">
    <h2 class="mb-4">Our Bundles</h2>
    <div class="row">
      <?php if (mysqli_num_rows($result) > 0): ?>
        <?php while ($b = mysqli_fetch_assoc($result)): 
          $imagePath = !empty($b['image']) 
            ? $domain."uploads/bundles/".$b['image']
            : $domain."img/header-1.jpg";

          $finalPrice = $b['final_price'] * $currency['exchange_rate'];
        ?>
          <div class="col-6 col-sm-4 col-md-3 mb-4">
            <div class="card h-100 shadow-sm d-flex flex-column">
              <a href="https://greenfieldsupermarket.com/bucket-detail.php?id=<?= $b['id']; ?>">
                <img src="/images/category-placeholder.jpg" 
                     data-src="<?= $imagePath; ?>" 
                     class="lazyload card-img-top product-img" 
                     alt="<?= htmlspecialchars($b['name']); ?>">
              </a>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title text-truncate">
                  <a href="https://greenfieldsupermarket.com/bucket-detail.php?id=<?= $b['id']; ?>" 
                     class="text-decoration-none text-dark">
                    <?= htmlspecialchars($b['name']); ?>
                  </a>
                </h6>
                <p class="fw-bold mb-2 text-success">
                  <?= number_format($finalPrice, 2) . ' ' . $currency['currency']; ?>
                </p>

               
              </div>
            </div>
          </div>
        <?php endwhile; ?>
      <?php else: ?>
        <div class="col-12">
          <p>No bundles available right now.</p>
        </div>
      <?php endif; ?>
    </div>
  </div>
</main>

<?php include("footer.php");?>          
<?php include("js.php");?>
</body>
</html>
