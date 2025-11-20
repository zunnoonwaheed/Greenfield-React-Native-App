<?php include('head.php');
$controls = new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php'); ?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage text page');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-content">
                                <div class="">
                                    <?php
$defaultHtml11 = htmlspecialchars('<h2 class="display-1 ls-1"><span class="fw-bold text-primary">Organic</span> Foods at your <span class="fw-bold">Doorsteps</span></h2>');
$defaultHtml12 = htmlspecialchars(' <p class="fs-4">YOU NAME IT, WE HAVE IT!</p>');
$defaultHtml13 = htmlspecialchars('<a href="#" class="btn btn-primary text-uppercase fs-6 rounded-pill px-4 py-3 mt-3">Start Shopping</a>');
$defaultHtml14 = htmlspecialchars('<a href="#" class="btn btn-dark text-uppercase fs-6 rounded-pill px-4 py-3 mt-3">Join Now</a>');
$defaultHtml15 = htmlspecialchars('   <div class="col-auto"><p class="fs-1 fw-bold lh-sm mb-0">14k+</p></div>
                  <div class="col"><p class="text-uppercase lh-sm mb-0">Product Varieties</p></div>');
$defaultHtml16 = htmlspecialchars('  <div class="col-auto"><p class="fs-1 fw-bold lh-sm mb-0">50k+</p></div>
                  <div class="col"><p class="text-uppercase lh-sm mb-0">Happy Customers</p></div>');
$defaultHtml17 = htmlspecialchars(' <div class="col-auto"><p class="fs-1 fw-bold lh-sm mb-0">10+</p></div>
                  <div class="col"><p class="text-uppercase lh-sm mb-0">Store Locations</p></div>');
$defaultHtml18 = htmlspecialchars('  <h5 class="text-light">Fresh from farm</h5>
                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>');
$defaultHtml19 = htmlspecialchars('<h5 class="text-light">100% Organic</h5>
                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>');
$defaultHtml20 = htmlspecialchars(' <h5 class="text-light">Free delivery</h5>
                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>');
$defaultHtml21 = htmlspecialchars(' <h3 class="banner-title text-light">Items on SALE</h3>
                    <p>Discounts up to 30%</p>
                    <a href="#" class="btn-link text-white">Shop Now</a>');
$defaultHtml22 = htmlspecialchars('  <h3 class="banner-title text-light">Combo offers</h3>
                    <p>Discounts up to 50%</p>
                    <a href="#" class="btn-link text-white">Shop Now</a>');
$defaultHtml23 = htmlspecialchars('    <h3 class="banner-title text-light">Discount Coupons</h3>
                    <p>Discounts up to 40%</p>
                    <a href="#" class="btn-link text-white">Shop Now</a>');
$defaultHtml24 = htmlspecialchars('div class="section-header">
                  <h2 class="section-title display-5 text-light">Get 25% Discount on your first purchase</h2>
                </div>
                <p>Just Sign Up & Register it now to become member.</p>');
?>
<?php
$id = intval($_GET['id']);
$query = "SELECT * FROM homep WHERE id = $id";
$result = mysqli_query($con, $query);
$row = mysqli_fetch_assoc($result);

if (!$row) {
    echo "<p>Record not found for ID $id.</p>";
    exit;
}


// Handle form submission
if (isset($_POST['update'])) {
    $updates = [];
    for ($i = 1; $i <= 38; $i++) {
        $field = "section$i";
        $value = isset($_POST[$field]) ? $_POST[$field] : "";  // Set empty if not set
        
        // If the field is an array (like section1, section2), join the IDs into a comma-separated string
        if (is_array($value)) {
            $value = implode(",", $value);  // Convert array to string
        }

        $updates[] = "$field='$value'";
    }
    $updateQuery = "UPDATE homep SET " . implode(", ", $updates) . " WHERE id=$id";
    
    if (mysqli_query($con, $updateQuery)) {
        echo "<script>alert('Record updated successfully!');window.location='homep.php';</script>";
    } else {
        echo "Error updating record: " . mysqli_error($con);
    }

    // Refresh data after update
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    
    

}

// Define labels based on ID
$customLabels = [
    'section1' => '1st products Tab',
    'section2' => '2nd products Tab',
    'section3' => '3rd products Tab',
    'section4' => '4th products Tab',
    'section5' => '1st products Heading',
    'section6' => '2nd products Heading',
    'section7' => '3rd products Heading',
    'section8' => '4th products Heading',
    'section9' => 'Meta Title',
    'section10' => 'Meta Description',
    'section11' => 'Slider Text Heading <br><small style="color:#888"> <em>' . $defaultHtml11 . '</em> </small>',
    'section12' => 'Slider Text Description <br><small style="color:#888"> <em>' . $defaultHtml12 . '</em> </small>',
    'section13' => 'Slider Button <br><small style="color:#888"> <em>' . $defaultHtml13 . '</em> </small>',
    'section14' => 'Slider Button <br><small style="color:#888"> <em>' . $defaultHtml14 . '</em> </small>',
    'section15' => 'Slider Facts 1 <br><small style="color:#888"> <em>' . $defaultHtml15 . '</em> </small>',
    'section16' => 'Slider Facts 2 <br><small style="color:#888"> <em>' . $defaultHtml16 . '</em> </small>',
    'section17' => 'Slider Facts 3 <br><small style="color:#888"> <em>' . $defaultHtml17 . '</em> </small>',
    'section18' => 'Slider thumbnail 1 <br><small style="color:#888"> <em>' . $defaultHtml18 . '</em> </small>',
    'section19' => 'Slider thumbnail 2 <br><small style="color:#888"> <em>' . $defaultHtml19 . '</em> </small>',
    'section20' => 'Slider thumbnail 3 <br><small style="color:#888"> <em>' . $defaultHtml20 . '</em> </small>',
    'section21' => 'Middle Banner 1 <br><small style="color:#888"> <em>' . $defaultHtml21 . '</em> </small>',
    'section22' => 'Middle Banner 2 <br><small style="color:#888"> <em>' . $defaultHtml22 . '</em> </small>',
    'section23' => 'Middle Banner 3 <br><small style="color:#888"> <em>' . $defaultHtml23 . '</em> </small>',
    'section24' => 'CTA Banner <br><small style="color:#888"> <em>' . $defaultHtml24 . '</em> </small>',
    'section25' => 'Exclude Categories Page Ids',
    'section26' => 'section26',
    'section27' => 'section27',
    'section28' => 'section28',
    'section29' => 'section29',
    'section30' => 'section30',
    'section31' => 'section31',
    'section32' => 'section32'
];
?>

<h2>Edit Homep (ID: <?php echo $id; ?>)</h2>
<form method="POST" onsubmit="return checkSelection()">
    <?php foreach ($customLabels as $field => $label): ?>
        <?php $value = htmlspecialchars($row[$field]); ?>
        <?php if (in_array($field, ['section1', 'section2', 'section3', 'section4'])): ?>
            <label for="<?php echo $field; ?>"><?php echo $label; ?>:</label>
            <input type="text" name="search_<?php echo $field; ?>" id="search_<?php echo $field; ?>" style="width: 600px;" placeholder="Search for products..." oninput="searchProducts('<?php echo $field; ?>')">
            <div id="search_results_<?php echo $field; ?>"></div>
      

            <!-- Display previously selected product IDs as tags -->
 <div id="selected_<?php echo $field; ?>">
    <?php
    $selectedProductIds = explode(",", $value);
    foreach ($selectedProductIds as $id) {
        $query = "SELECT namee FROM dow WHERE id = $id";
        $result = mysqli_query($con, $query);
        $product = mysqli_fetch_assoc($result);
        $productName = htmlspecialchars($product['namee'], ENT_QUOTES, 'UTF-8');
        
        // Create a unique tag ID using section and product ID
        $uniqueTagId = $field . '_' . $id;
        
        // Render the tag with a unique ID
        echo "<div class='selected-tag' id='tag_$uniqueTagId' data-id='$id' data-field='$field'>
                $productName 
                <span class='remove-tag' onclick='removeTag(\"$field\", \"$id\", \"tag_$uniqueTagId\")'>×</span>
              </div>";
    }
    ?>
</div>  <hr><br><br>




            <!-- Hidden input to store selected product IDs -->
            <input type="hidden" name="<?php echo $field; ?>" id="<?php echo $field; ?>" value="<?php echo $value; ?>">
        <?php else: ?>
            <!-- Regular input fields for other sections -->
            <?php echo $label; ?>: 
            <input type="text" name="<?php echo $field; ?>" style="width: 600px;" value="<?php echo $value; ?>"><br><br>
        <?php endif; ?>
    <?php endforeach; ?>
    
    <input type="submit" name="update" value="Update">
</form>

<script>
// Handle search functionality for product selection
function searchProducts(field) {
    const searchQuery = document.getElementById('search_' + field).value;
    const selectedIds = document.getElementById(field).value.split(',');

    if (searchQuery.length > 2) {
        fetch('search_products.php?q=' + searchQuery + '&selectedIds=' + selectedIds.join(','))
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('search_results_' + field);
                resultsDiv.innerHTML = ''; // Clear previous results

                if (data.products && data.products.length > 0) {
                    data.products.forEach(product => {
                        // Only show unselected products
                        if (!selectedIds.includes(product.id.toString())) {
                            const productDiv = document.createElement('div');
                            productDiv.innerHTML = ` 
                                <div class="product-tag" id="tag_${product.id}" onclick="toggleTag('${field}', '${product.id}', '${product.namee}')">
                                    ${product.namee} <span class="remove-tag">x</span>
                                </div>
                            `;
                            resultsDiv.appendChild(productDiv);
                        }
                    });
                } else {
                    resultsDiv.innerHTML = 'No new products found.';
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    } else {
        document.getElementById('search_results_' + field).innerHTML = '';
    }
}

// Toggle product selection as a tag
function toggleTag(field, productId, productName) {
    const selectedIds = document.getElementById(field).value.split(',');
    
    if (!selectedIds.includes(productId)) {
        // Add product to selected tags
        selectedIds.push(productId);
        
        const tagContainer = document.getElementById('selected_' + field);
        const tagDiv = document.createElement('div');
        tagDiv.id = 'tag_' + productId;
        tagDiv.classList.add('selected-tag');
        tagDiv.innerHTML = `${productName} <span class="remove-tag" onclick="removeTag('${field}', '${productId}')">x</span>`;
        tagContainer.appendChild(tagDiv);
    } else {
        alert('This product is already selected!');
    }

    // Update hidden input with selected IDs
    document.getElementById(field).value = selectedIds.join(',');
}

 

 
function removeTag(field, productId, uniqueTagId) {
    // Get the tag element using the unique tag ID (section + productId)
    const tagDiv = document.getElementById(uniqueTagId);
    if (tagDiv) {
        tagDiv.remove(); // Remove the tag from the UI (this section only)
    }

    // Update the selected IDs for the current section
    const hiddenInput = document.getElementById(field);
    let selectedIds = hiddenInput.value.split(','); // Get current IDs from hidden input

    // Remove the product ID from the array
    selectedIds = selectedIds.filter(id => id != productId);

    // Update the hidden input value for this section
    hiddenInput.value = selectedIds.join(',');  // Update hidden field with the remaining IDs

    // For debugging (optional)
    console.log(`Updated field: ${field} with new value: ${selectedIds.join(',')}`);
}

 
</script>

<style>
.selected-tag {
    display: inline-block;
    background-color: #d3d3d3;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 15px;
}

.remove-tag {
    cursor: pointer;
    color: red;
    margin-left: 5px;
}
.product-tag {
    background-color: #e0e0e0;
    margin: 5px;
    padding: 8px;
    cursor: pointer;
}

.product-tag:hover {
    background-color: #c0c0c0;
}
</style>

<?php include('script.php'); ?>
</body>
</html>
