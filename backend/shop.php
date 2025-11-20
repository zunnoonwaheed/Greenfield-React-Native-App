<?php
include("admin/includes/db_settings.php");
session_start();

// ðŸ”¹ User query normalize
$q = $_GET['q'] ?? '';
$q = trim($q);
$q = strtolower($q);
// normalize numbers (1litre -> 1 litre)
$q = preg_replace('/(\d+)([a-zA-Z]+)/', '$1 $2', $q);
$q = mysqli_real_escape_string($con, $q);

// ðŸ”¹ Synonyms map
$synonyms = [
    'atta'  => ['ataa','ata'],
    'litre' => ['liter','ltr'],
    'liter' => ['litre','ltr']
];

// ðŸ”¹ Expand query with synonyms
$q_variants = [$q];
foreach ($synonyms as $main => $alts) {
    foreach ($alts as $alt) {
        if (stripos($q, $alt) !== false) {
            $q_variants[] = str_ireplace($alt, $main, $q);
        }
    }
}

$results = [];

// ðŸ”¹ Fulltext Search (fastest)
foreach ($q_variants as $qv) {
    $words = explode(" ", $qv);
    $booleanSearch = "";
    foreach ($words as $w) {
        if (!empty($w)) {
            $booleanSearch .= " +" . $w . "*";
        }
    }

    $sql = "
      SELECT *,
        MATCH(namee, slug, keyword) AGAINST('$booleanSearch' IN BOOLEAN MODE) AS score
      FROM dow
      WHERE statuss = '1'
        AND MATCH(namee, slug, keyword) AGAINST('$booleanSearch' IN BOOLEAN MODE)
      ORDER BY score DESC
      LIMIT 50
    ";
    $res = mysqli_query($con, $sql);
    while ($row = mysqli_fetch_assoc($res)) {
        $results[$row['id']] = $row; // unique by product ID
    }
}

// ðŸ”¹ If no results â†’ Fuzzy match (typos)
if (empty($results)) {
    $allQ = "SELECT * FROM dow WHERE statuss='1'";
    $allRes = mysqli_query($con, $allQ);

    while ($row = mysqli_fetch_assoc($allRes)) {
        $text = strtolower($row['namee'] . " " . $row['slug'] . " " . $row['keyword']);
        $queryWords = explode(" ", $q);

        foreach ($queryWords as $qw) {
            $textWords = explode(" ", $text);
            foreach ($textWords as $tw) {
                if (levenshtein($qw, $tw) <= 1) { // typo tolerance
                    $results[$row['id']] = $row;
                }
            }
        }
    }
}
include("html.php");
include("head.php");
include("header.php");
?>

<div class="container py-5">
  <h2 class="mb-4">Shop</h2>

  <!-- âœ… Products grid -->
  <div class="row">
    <?php if(!empty($results)): ?>
      <?php foreach($results as $p): ?>
        <div class="col-6 col-sm-4 col-md-3 mb-4"> 
        <div class="product-item">
          <div class="card h-100 shadow-sm">
            <a href="/<?= $p['slug']; ?>/">
              <img src="images/category-placeholder.jpg" data-src="/admin/upload/dow/<?= $p['imagee'] ?: 'default.jpg'; ?>" 
                   class="lazyload card-img-top img-fluid" 
                   alt="<?= htmlspecialchars($p['namee']); ?>">
            </a>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">
                <a href="/<?= $p['slug']; ?>/" class="text-decoration-none">
                  <?= htmlspecialchars($p['namee']); ?>
                </a>
              </h6>
              
              <div class="d-flex justify-content-center align-items-center gap-2">
                    <?php if($p['price'] > $p['dprice']){ ?>
                        <del>Rs.<?php echo $p['price']; ?></del>
                    <?php } ?>
                    <span class="text-dark fw-semibold">Rs.<?php echo $p['dprice']; ?></span>
                </div>
              <form class="addToCartForm mt-auto">
                <input type="hidden" name="product_id" value="<?= $p['id']; ?>">
                 
 <div class="row g-1 mt-2">
            <!-- Quantity box -->
               <div class="col-12 col-md-5">
<div class="input-group input-group-sm elegant-qty rounded-pill" style="max-width: 140px;">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

</div>

            <!-- Add to Cart button -->
            <div class="col-12 col-md-7">
                <button type="submit" class="btn btn-primary rounded-1 p-2 fs-7 w-100">
                    <svg width="18" height="18"><use xlink:href="#cart"></use></svg> Add to Cart
                </button>
            </div>
        </div>
                
              </form>
            </div>
          </div>
        </div></div>
      <?php endforeach; ?>
    <?php else: ?>
      <p class="text-muted">No products found<?= $q ? " for '".htmlspecialchars($q)."'" : ""; ?>.</p>
    <?php endif; ?>
  </div>
</div>
  
<?php include("footer.php"); ?>
<?php include("product-js.php"); ?>
<?php include("js.php"); ?>
