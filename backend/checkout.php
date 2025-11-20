<?php
session_start();
include("admin/includes/db_settings.php");
include("html.php");

$cart = $_SESSION['cart'] ?? [];
if(empty($cart)){
    echo "<div class='container mt-5'><h3>Your cart is empty.</h3></div>";
    exit;
}

$loggedIn = isset($_SESSION['user_id']);
$userName = $_SESSION['user_name'] ?? '';
$userEmail = $_SESSION['user_email'] ?? '';
$userPhone = $_SESSION['user_phone'] ?? '';
$userAddress = $_SESSION['user_address'] ?? '';

// subtotal
$total=0; 
foreach($cart as $item){
    $item_total = $item['price'] * $item['qty'];
    $total += $item_total;
}
// get delivery rules from DB
$rules = [];
$res = mysqli_query($con, "SELECT area, sector, charge FROM delivery_charges");
while($row = mysqli_fetch_assoc($res)){
    $rules[] = $row;
}

// default charge (fallback ALL)
$deliveryCharge = 0;
$res2 = mysqli_query($con, "SELECT charge FROM delivery_charges WHERE area='ALL' LIMIT 1");
if($res2 && mysqli_num_rows($res2)>0){
    $deliveryCharge = (float) mysqli_fetch_assoc($res2)['charge'];
}

// If user has saved address → try to match area/sector
// If user has saved address → try to match area/sector dynamically
if($loggedIn && !empty($userAddress)){
    $matchedCharge = null;
    foreach($rules as $rule){
        $ruleArea = $rule['area'];
        $ruleSector = $rule['sector'];

        if(stripos($userAddress, $ruleArea) !== false){ // area match
            if($ruleSector && stripos($userAddress, $ruleSector) !== false){
                $matchedCharge = (float)$rule['charge']; // area + sector exact match
                break;
            }
            elseif(empty($ruleSector)){
                $matchedCharge = (float)$rule['charge']; // area match without sector
            }
        }
    }

    if($matchedCharge !== null){
        $deliveryCharge = $matchedCharge;
    }
}

?>

<?php include ("head.php");?>
<?php if(isset($row_c['addhead'])) echo $row_c['addhead']; ?>
</head>
<body>
<?php include("header.php"); ?>

<div class="container my-5">
 

    <?php if(isset($_SESSION['login_error'])): ?>
    <div class="alert alert-danger">
        <?= $_SESSION['login_error'] ?>
    </div>
    <?php unset($_SESSION['login_error']); endif; ?>

    <?php if($loggedIn): ?>
        <div class="alert alert-success">
            Welcome back, <strong><?= htmlspecialchars($userName) ?></strong>! Your details are pre-filled below.
        </div>
    <?php endif; ?>
    <?php if(isset($_SESSION['error'])): ?>
  <div class="alert alert-danger">
    <?= $_SESSION['error']; ?>
  </div>
  <?php unset($_SESSION['error']); ?>
<?php endif; ?>

    <div class="row">
        <!-- Checkout Form -->
     <div class="col-md-6 order-2 order-md-1">
            <?php if(!$loggedIn): ?>
            <!-- Login toggle -->
            <div class="mb-3 pt-3">
                <a href="#" onclick="document.getElementById('loginForm').classList.toggle('d-none'); return false;" class="w-100 btn-secondary btn" >Already registered? Login here</a>
                <form id="loginForm" class="d-none mt-2" method="post" action="login.php">
                    <div class="mb-2">
                        <input type="email" class="form-control2" name="login_email" placeholder="Email" required>
                    </div>
                    <div class="mb-2">
                        <input type="password" class="form-control2" name="login_password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                </form>
            </div>
            <?php endif; ?>
<?php
session_start();
$old = $_SESSION['old_input'] ?? [];
unset($_SESSION['old_input']);
?>
            <form method="post" action="submit-order.php" id="checkoutForm">
                <h4 class="mb-3">Billing Details</h4>
               <div class="mb-3">
    <label class="form-label">Full Name</label>
    <input type="text" class="form-control2" name="name" required 
           value="<?= htmlspecialchars($old['name'] ?? $userName) ?>">
</div>

<div class="mb-3">
    <label class="form-label">Email</label>
    <input type="email" class="form-control2" name="email" required 
           value="<?= htmlspecialchars($old['email'] ?? $userEmail) ?>">
</div>

<div class="mb-3">
    <label class="form-label">Phone</label>
    <input type="text" class="form-control2" name="phone" required 
           value="<?= htmlspecialchars($old['phone'] ?? $userPhone) ?>">
</div>
<div class="mb-3">
 
  <select class="form-select2" name="payment_method" required>
    <option value="">Select Payment Method</option>
    <option value="cod">Cash on Delivery</option>
    <option value="online">Credit / Debit Card</option>
  </select>
</div>

                <!-- Address Section -->
                <?php if($loggedIn && $userAddress): ?>
                    <!-- Saved Address -->
                    <div class="mb-3" id="addressDisplay">
                        <label class="form-label">Address</label>
                        <div class="p-2 border bg-light"><?= htmlspecialchars($userAddress) ?></div>
                        <button type="button" class="btn btn-sm btn-primary mt-2" id="editAddressBtn">Edit</button>
                    </div>
                <?php endif; ?>

                <!-- Editable Address Fields -->
                <div id="addressFields" class="<?= ($loggedIn && $userAddress) ? 'd-none' : '' ?>">
                    <div class="mb-3">
                        <label class="form-label">Address</label>
                        <select disabled class="form-select2" id="citySelect" name="city" required>
                            <option value="Islamabad" selected>Islamabad</option>
                               <input type="hidden" name="city" value="Islamabad">
                        </select>
                    </div>

                <div class="mb-3">
    <select class="form-select2" id="areaSelect" name="area" required>
        <option value="">Select Area</option>
        <?php
        $phases = $con->query("SELECT id, name FROM locations WHERE parent_id IS NULL ORDER BY name ASC");
        while($p = $phases->fetch_assoc()){
            echo '<option value="'.$p['id'].'" data-name="'.htmlspecialchars($p['name']).'">'.$p['name'].'</option>';
        }
        ?>
    </select>
    <input type="hidden" name="phase" id="phaseName">
</div>

<div class="mb-3">
    <select class="form-select2" id="sectorSelect" name="sector" required>
        <option value="">Select Sector</option>
    </select>
</div>


                    <div class="mb-3">
                        <input type="text" class="form-control2" name="street" placeholder="Street Number" required>
                    </div>

                    <div class="mb-3">
                        <div class="form-check2 form-check2-inline">
                            <input class="form-check-input" type="radio" name="type" value="House" id="houseRadio" checked>
                            <label class="form-check-label" for="houseRadio">House</label>
                        </div>
                        <div class="form-check2 form-check2-inline">
                            <input class="form-check-input" type="radio" name="type" value="Apartment" id="apartmentRadio">
                            <label class="form-check-label" for="apartmentRadio">Apartment</label>
                        </div>
                    </div>

                    <div class="mb-3" id="houseDiv">
                        <input type="text" class="form-control2" name="house_number" placeholder="House Number">
                    </div>

                    <div class="mb-3 d-none" id="apartmentDiv">
                        <input type="text" class="form-control2" name="apartment_info" placeholder="Apartment Name & Number">
                    </div>
                </div>

                <?php if(!$loggedIn): ?>
                <div class="form-check2 mb-3">
                    <input class="form-check-input" type="checkbox" value="1" id="create_account" name="create_account" onclick="document.getElementById('passwordDiv').classList.toggle('d-none')">
                    <label class="form-check-label" for="create_account">Create an account?</label>
                </div>
                <div id="passwordDiv" class="d-none mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control2" name="password">
                </div>
                <?php endif; ?>

                <!-- Hidden input to store final address -->
                <input type="hidden" name="guest_address" id="guest_address">
<input type="hidden" name="delivery_charge" id="delivery_charge_input" value="<?= $deliveryCharge ?>">
<input type="hidden" name="final_total" id="final_total_input" value="<?= $total + $deliveryCharge ?>">
                <button type="submit" class="btn btn-primary w-100">Place Order</button>
            </form>
        </div>

        <!-- Cart Summary -->
             <!-- Cart Summary -->
       <div class="col-md-6 order-1 order-md-2">
  <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
    
    <!-- Header -->
    <div class="card-header bg-gradient text-white py-3" 
         style="background: linear-gradient(135deg, #027f1a, #90c443);">
      <h5 class="mb-0 fw-bold">
        <i class="bi bi-cart-check me-2"></i> Your Cart
      </h5>
    </div>

    <!-- Items -->
    <div class="card-body p-0">
      <ul class="list-group list-group-flush">
        <?php 
        $total=0; 
        foreach($cart as $item):
            $item_total = $item['price'] * $item['qty'];
            $total += $item_total;
        ?>
        <li class="list-group-item d-flex justify-content-between align-items-center py-3">
          <div>
            <h6 class="fw-semibold mb-1"><?= htmlspecialchars($item['name']) ?></h6>
            <small class="text-muted">
              <?= $item['qty'] ?> X <?= number_format($item['price'],2) ?> PKR
            </small>
          </div>
          <span class="fw-bold text-success fs-6"><?= number_format($item_total,2) ?> PKR</span>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>

    <!-- Totals -->
    <div class="card-footer bg-light p-0">
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between py-3">
          <span class="fw-medium">Subtotal</span>
          <span id="subtotal" class="fw-semibold"><?= number_format($total,2) ?> PKR</span>
        </li>
        <li class="list-group-item d-flex justify-content-between py-3">
          <span class="fw-medium">Delivery Charges</span>
          <span id="deliveryCharge" class="fw-semibold"><?= number_format($deliveryCharge,2) ?> PKR</span>
        </li>
        <li class="list-group-item d-flex justify-content-between py-3 bg-gradient fw-bold fs-5" 
            style="background: linear-gradient(135deg, #90c443, #027f1a);">
          <span>Total</span>
          <span id="finalTotal"><?= number_format($total + $deliveryCharge,2) ?> PKR</span>
        </li>
      </ul>
    </div>

  </div>
</div>
    </div>
</div>
<script>
document.addEventListener("DOMContentLoaded", function(){
  const phaseSelect = document.getElementById("areaSelect");
  const sectorSelect = document.getElementById("sectorSelect");
  const phaseNameHidden = document.getElementById("phaseName");

  if(phaseSelect){
    phaseSelect.addEventListener("change", function(){
      const selected = this.options[this.selectedIndex];
      phaseNameHidden.value = selected.dataset.name || "";

      const phaseId = this.value;
      sectorSelect.innerHTML = '<option value="">Loading...</option>';

      if(phaseId){
        fetch("get_sectors.php?phase_id=" + phaseId)
          .then(res => res.json())
          .then(data => {
            sectorSelect.innerHTML = '<option value="">Select Sector</option>';
            data.forEach(sec => {
              const opt = document.createElement("option");
              opt.value = sec.name;
              opt.textContent = sec.name;
              sectorSelect.appendChild(opt);
            });

            // Delivery charge update
            updateDeliveryCharges();
          })
          .catch(err => {
            console.error("Sector load error:", err);
            sectorSelect.innerHTML = '<option value="">Error loading sectors</option>';
          });
      } else {
        sectorSelect.innerHTML = '<option value="">Select Sector</option>';
      }
    });
  }

  if(sectorSelect){
    sectorSelect.addEventListener("change", updateDeliveryCharges);
  }
});


// --- Delivery Rules from PHP ---
let deliveryRules = <?= json_encode($rules) ?>;
let baseTotal = <?= $total ?>;

function getDeliveryCharge(area, sector){
    let defaultCharge = 0;
    let matchedCharge = null;

    deliveryRules.forEach(rule => {
        if(rule.area === area && rule.sector && rule.sector === sector){
            matchedCharge = parseFloat(rule.charge);
        }
        else if(rule.area === area && !rule.sector){
            matchedCharge = parseFloat(rule.charge);
        }
        else if(rule.area === "ALL" && matchedCharge === null){
            defaultCharge = parseFloat(rule.charge);
        }
    });

    return matchedCharge !== null ? matchedCharge : defaultCharge;
}

function updateDeliveryCharges(){
    const area = document.getElementById("phaseName")?.value || ""; // 👈 Phase ka naam
    const sector = document.getElementById("sectorSelect")?.value || "";
    let charge = getDeliveryCharge(area, sector);

    document.getElementById("deliveryCharge").innerText = charge.toFixed(2) + " PKR";
    document.getElementById("finalTotal").innerText = (baseTotal + charge).toFixed(2) + " PKR";

    // hidden inputs update
    document.getElementById("delivery_charge_input").value = charge.toFixed(2);
    document.getElementById("final_total_input").value = (baseTotal + charge).toFixed(2);
}


// Initial load
<?php if($loggedIn && !empty($userAddress)): ?>
    document.getElementById("deliveryCharge").innerText = "<?= number_format($deliveryCharge,2) ?> PKR";
    document.getElementById("finalTotal").innerText = "<?= number_format($total + $deliveryCharge,2) ?> PKR";
<?php else: ?>
    updateDeliveryCharges();
<?php endif; ?>


// --- House / Apartment toggle ---
const houseRadio = document.getElementById('houseRadio');
const apartmentRadio = document.getElementById('apartmentRadio');
const houseDiv = document.getElementById('houseDiv');
const apartmentDiv = document.getElementById('apartmentDiv');

function toggleHouseApartment(){
    if(houseRadio && houseRadio.checked){
        houseDiv.classList.remove('d-none');
        apartmentDiv.classList.add('d-none');
    } else {
        if(houseDiv) houseDiv.classList.add('d-none');
        if(apartmentDiv) apartmentDiv.classList.remove('d-none');
    }
}
if(houseRadio && apartmentRadio){
    houseRadio.addEventListener('change', toggleHouseApartment);
    apartmentRadio.addEventListener('change', toggleHouseApartment);
}
toggleHouseApartment();


// --- Enable/Disable address fields for validation ---
const addressFields = document.getElementById('addressFields');
function setAddressFieldsDisabled(disabled){
    if(!addressFields) return;
    const elems = addressFields.querySelectorAll('input, select, textarea');
    elems.forEach(el => {
        if(disabled){
            el.dataset._wasRequired = el.hasAttribute('required') ? '1' : '0';
            if(el.hasAttribute('required')) el.removeAttribute('required');
        } else {
            if(el.dataset._wasRequired === '1') el.setAttribute('required','required');
        }
        el.disabled = disabled;
    });
}
if(addressFields && addressFields.classList.contains('d-none')){
    setAddressFieldsDisabled(true);
}


// --- Checkout Form Submit ---
const checkoutForm = document.getElementById("checkoutForm");
if(checkoutForm){
    checkoutForm.addEventListener("submit", function(e){
        const addressDisplay = document.getElementById("addressDisplay");
        const guestAddressInput = document.getElementById("guest_address");

        if (addressDisplay && !addressDisplay.classList.contains("d-none")) {
            const saved = Array.from(addressDisplay.querySelectorAll(".p-2"))
                                .map(el => el.textContent.trim())
                                .join(", ");
            if(!saved){
                alert("Saved address is empty!");
                e.preventDefault();
                return;
            }
            guestAddressInput.value = saved;
            if(addressFields) setAddressFieldsDisabled(true);
            return;
        }

        if(addressFields) setAddressFieldsDisabled(false);

        const city = document.getElementById("citySelect")?.value || "";
        const area = document.getElementById("phaseName")?.value || ""; // 👈 Naam use karo
        const sector = document.getElementById("sectorSelect")?.value || "";
        const street = document.querySelector('input[name="street"]')?.value || "";
        const type = document.getElementById("houseRadio")?.checked ? "House" : "Apartment";
        const number = type === "House"
            ? document.querySelector('input[name="house_number"]')?.value || ""
            : document.querySelector('input[name="apartment_info"]')?.value || "";

        if (!area || !sector || !street || !number) {
            alert("Please fill all address fields!");
            e.preventDefault();
            return;
        }

        const finalAddress = `${city}, ${area}, ${sector}, Street ${street}, ${type}: ${number}`;
        guestAddressInput.value = finalAddress;
    });
}


// --- Edit button for logged-in users ---
const editBtn = document.getElementById('editAddressBtn');
if(editBtn){
    editBtn.addEventListener('click', function(){
        const addressDisplay = document.getElementById('addressDisplay');
        if(addressDisplay) addressDisplay.classList.add('d-none');
        if(addressFields){
            addressFields.classList.remove('d-none');
            setAddressFieldsDisabled(false);
        }
    });
}
</script>




<?php include("product-js.php");?>
<?php include("footer.php"); ?>          
<?php include("js.php"); ?>
</body>
</html>
