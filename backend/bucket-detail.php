<?php
include("admin/includes/db_settings.php");
session_start();

$domain = "https://greenfieldsupermarket.com/";

// --- Bundle ID check ---
$bundle_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($bundle_id <= 0) {
    http_response_code(404);
    include("404.php");
    exit;
}

// --- Currency (default) ---
$cquery = "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1";
$cres = mysqli_query($con, $cquery);
$currency = mysqli_fetch_assoc($cres);

// --- Fetch bundle ---
$bQ = "SELECT * FROM bundles WHERE id = $bundle_id AND status = 1 LIMIT 1";
$bRes = mysqli_query($con, $bQ);
if (mysqli_num_rows($bRes) == 0) {
    http_response_code(404);
    include("404.php");
    exit;
}
$bundle = mysqli_fetch_assoc($bRes);

// --- Fetch bundle items with product info ---
$itemsQ = "
    SELECT bi.quantity, d.id as product_id, d.namee, d.slug, d.price, d.dprice 
    FROM bundle_items bi 
    JOIN dow d ON bi.product_id = d.id 
    WHERE bi.bundle_id = $bundle_id
";
$itemsRes = mysqli_query($con, $itemsQ);

include("html.php");
?>
<title><?= htmlspecialchars($bundle['name']); ?> - Bundle</title>
<link rel="canonical" href="<?= $domain; ?>bucket-detail.php?id=<?= $bundle['id']; ?>" />
<?php include("head.php");?>
<style>
  .list-group-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: #fff; border-radius: 0.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
  .product-name { flex-grow: 1; font-weight: 500; font-size: 1rem; margin-left: 1rem; }
  .remove-item { font-weight: bold; border: none; background: none; color: #dc3545; cursor: pointer; font-size: 1.2rem; }
  .qty-input { max-width: 60px; text-align: center; }
</style>
</head>
<body>
<?php include("header.php");?>

<main>
<div class="container py-5">

  <!-- Bundle Header -->
  <div class="text-center mb-5">
    <h2 class="fw-bold display-5 mb-3"><?= htmlspecialchars($bundle['name']); ?></h2>
    <p class="text-muted fs-5 lh-base"><?= nl2br($bundle['description']); ?></p>
  </div>

  <!-- Bundle Form -->
  <form method="post" action="add-bundle-to-cart.php" id="bundleForm" class="card shadow-lg p-4 border-0 rounded-3">
    <input type="hidden" name="bundle_id" value="<?= $bundle_id; ?>">

  <!-- Product List -->
<div id="bundleItems" class="mb-4">
  <?php while($item = mysqli_fetch_assoc($itemsRes)):
    $pPrice = ($item['dprice'] > 0 ? $item['dprice'] : $item['price']) * $currency['exchange_rate'];
  ?>
  <div class="list-group-item" data-price="<?= $pPrice ?>">
    <button type="button" class="remove-item me-3">✕</button>
    <div class="product-name">
      <a href="/<?= $item['slug']; ?>/" target="_blank" class="text-decoration-none text-dark">
        <?= htmlspecialchars($item['namee']); ?>
      </a>
    </div>
    <div class="input-group input-group-sm me-3" style="width:120px;">
      <button type="button" class="btn btn-outline-secondary qty-btn" data-action="decrease">−</button>
      <input type="number" name="quantity[<?= $item['product_id'] ?>]" value="<?= $item['quantity'] ?>" min="1" class="form-control qty-input">
      <button type="button" class="btn btn-outline-secondary qty-btn" data-action="increase">+</button>
    </div>
    <div class="item-total fw-bold text-primary">
      <?= number_format($pPrice * $item['quantity'], 2)." ".$currency['currency']; ?>
    </div>
  </div>
  <?php endwhile; ?>

  <!-- Add Product Button Row -->
  <div id="addProductRow" class="text-center mt-4">
    <button type="button" id="showSearchBtn" class="btn btn-outline-primary px-4 py-2 rounded-pill shadow-sm">+ Add Product</button>
  </div>

  <!-- Hidden Search Box -->
  <div id="searchRow" class="mt-3 d-none">
    <input type="text" id="searchProduct" class="form-control shadow-sm rounded-pill" placeholder="Search product...">
    <ul id="searchResults" class="list-group shadow-sm mt-2 rounded-3" style="z-index:1000; max-height:250px; overflow:auto;"></ul>
  </div>
</div>

<!-- Totals -->
<div class="text-end mb-4">
  <p class="mb-2 fs-6"><strong>Subtotal:</strong> <span id="subtotal">0</span> <?= $currency['currency']; ?></p>
  <?php if((int)$bundle['discount'] > 0): ?>
    <p class="mb-2 fs-6 text-success"><strong>Discount:</strong> <?= (int)$bundle['discount'] ?>%</p>
  <?php endif; ?>
  <h4 class="fw-bold text-dark"><strong>Final Total:</strong> <span id="finalPrice">0</span> <?= $currency['currency']; ?></h4>
</div>

    <!-- Bundle Quantity -->
    <div class="mb-4">
      <label class="form-label fw-semibold">Bundle Quantity</label>
      <input type="number" name="qty" value="1" min="1" class="form-control shadow-sm rounded-3" style="max-width:120px;">
    </div>

    <!-- Submit -->
    <div class="text-end">
      <button type="submit" class="btn btn-primary px-4 py-2 rounded-pill shadow"><i class="bi bi-cart-plus"></i> Add Bundle to Cart</button>
    </div>
  </form>
</div>
</main>

<script>
function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll('#bundleItems .list-group-item').forEach(item => {
    const price = parseFloat(item.getAttribute('data-price'));
    const qtyInput = item.querySelector('.qty-input');
    const qty = parseInt(qtyInput.value) || 1;
    const total = price * qty;
    item.querySelector('.item-total').innerText = total.toFixed(2) + " <?= $currency['currency']; ?>";
    subtotal += total;
  });
  document.getElementById('subtotal').innerText = subtotal.toFixed(2);
  let discount = <?= (int)$bundle['discount'] ?>;
  let finalTotal = subtotal;
  if(discount > 0) finalTotal = subtotal - (subtotal * discount / 100);
  document.getElementById('finalPrice').innerText = finalTotal.toFixed(2);
}

document.addEventListener('click', function(e){
  if(e.target.classList.contains('qty-btn')){
    const input = e.target.parentElement.querySelector('.qty-input');
    let value = parseInt(input.value) || 1;
    if(e.target.dataset.action === 'increase') value++;
    if(e.target.dataset.action === 'decrease' && value > 1) value--;
    input.value = value;
    updateTotals();
  }
  if(e.target.classList.contains('remove-item')){
    e.target.closest('.list-group-item').remove();
    updateTotals();
  }
});

document.getElementById('showSearchBtn').addEventListener('click', function(){
  document.getElementById('searchRow').classList.toggle('d-none');
});

document.getElementById('searchProduct').addEventListener('input', function(){
  const q = this.value.trim();
  if(q.length < 2){
    document.getElementById('searchResults').innerHTML = '';
    return;
  }
  fetch('search-product.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'q=' + encodeURIComponent(q)
  })
    .then(res => res.text())
    .then(html => {
      document.getElementById('searchResults').innerHTML = html;
    })
    .catch(err => console.error('Search error:', err));
});

document.getElementById('searchResults').addEventListener('click', function(e){
  if(e.target && e.target.classList.contains('list-group-item-action')){
    const prod = e.target.dataset;
    const container = document.createElement('div');
    container.className = 'list-group-item';
    container.setAttribute('data-price', prod.price);
    container.innerHTML = `
      <button type="button" class="remove-item me-3">✕</button>
      <div class="product-name"><a href="/${prod.slug}/" target="_blank" class="text-decoration-none text-dark">${prod.name}</a></div>
      <div class="input-group input-group-sm me-3" style="width:120px;">
        <button type="button" class="btn btn-outline-secondary qty-btn" data-action="decrease">−</button>
        <input type="number" name="quantity[${prod.id}]" value="1" min="1" class="form-control qty-input">
        <button type="button" class="btn btn-outline-secondary qty-btn" data-action="increase">+</button>
      </div>
      <div class="item-total fw-bold text-primary">${parseFloat(prod.price).toFixed(2)} <?= $currency['currency']; ?></div>`;
    document.getElementById('bundleItems').insertBefore(container, document.getElementById('addProductRow'));
    updateTotals();
  }
});

updateTotals();
</script>

<?php include("footer.php");?> 
<?php include("product-js.php");?>
<?php include("js.php");?>
</body>
</html>