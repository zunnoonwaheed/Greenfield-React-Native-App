<?php
session_start();
include("admin/includes/db_settings.php");

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$user = $con->query("SELECT * FROM users WHERE id = $user_id")->fetch_assoc();

// Extract address parts
$addressParts = ['city'=>'','phase'=>'','phase_id'=>'','sector'=>'','street'=>'','type'=>'','house_number'=>'','apartment_info'=>''];
if(!empty($user['address'])){
    $parts = explode('-', $user['address']);
    $addrMain = explode(',', $parts[0]);
    $addressParts['city'] = trim($addrMain[0] ?? '');
    $addressParts['phase'] = trim($addrMain[1] ?? '');
    $addressParts['sector'] = trim($addrMain[2] ?? '');
    $addressParts['street'] = trim($addrMain[3] ?? '');
    $addressParts['type'] = trim($addrMain[4] ?? '');
    $addressParts['house_number'] = trim($parts[1] ?? '');
    $addressParts['apartment_info'] = trim($parts[1] ?? '');
}

// Handle form submission
if(isset($_POST['update_profile'])){
    $name = $con->real_escape_string($_POST['name']);
    $phone = $con->real_escape_string($_POST['phone']);

    if(isset($_POST['address_edited'])){
        $city = trim($con->real_escape_string($_POST['city']));
        $phase = trim($con->real_escape_string($_POST['phase']));
        $sector = trim($con->real_escape_string($_POST['sector']));
        $street = trim($con->real_escape_string($_POST['street']));
        $type = $_POST['type'] ?? '';
        $house_number = trim($con->real_escape_string($_POST['house_number'] ?? ''));
        $apartment = trim($con->real_escape_string($_POST['apartment_info'] ?? ''));

        // Build formatted address
        $fullAddress = "$city, $phase, $sector, Street: $street";
        if($type === "House" && $house_number) $fullAddress .= ", House: $house_number";
        if($type === "Apartment" && $apartment) $fullAddress .= ", Apartment: $apartment";
    } else {
        $fullAddress = $user['address']; // keep existing
    }

    $update = $con->query("
        UPDATE users SET
            name='$name',
            phone='$phone',
            address='".$con->real_escape_string($fullAddress)."'
        WHERE id=$user_id
    ");

    if($update){
        header('Content-Type: application/json');
        $msg = "Profile updated successfully!";
        $user = $con->query("SELECT * FROM users WHERE id = $user_id")->fetch_assoc();
        echo json_encode(['success' => true, 'message' => $msg, 'user' => $user]);
        exit;
    } else {
        header('Content-Type: application/json');
        $error = "Error updating profile: ".$con->error;
        echo json_encode(['success' => false, 'message' => $error]);
        exit;
    }
}

?>


<?php include("head.php"); ?>
</head>
<body>
<?php include("header.php"); ?>

<div class="container mt-5">
    <div class="card shadow-lg rounded-4">
        <div class="card-body p-4">
            <h3 class="mb-4"><i class="bi bi-speedometer2"></i> Dashboard</h3>

            <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab">
                        <i class="bi bi-person-circle"></i>Edit Profile
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" href="dashboard.php"><i class="bi bi-bag-check"></i> Dashboard</a>
                </li>
            </ul>

            <div class="tab-content mt-4" id="dashboardTabsContent">
                <div class="card shadow-sm border-0 rounded-3">
                    <div class="card-body">
                        <h5 class="mb-3"><i class="bi bi-person-badge"></i> Update Details</h5>

                        <?php if(isset($msg)) echo '<div class="alert alert-success">'.$msg.'</div>'; ?>
                        <?php if(isset($error)) echo '<div class="alert alert-danger">'.$error.'</div>'; ?>

                      <form method="post" id="profileForm">
    <input type="hidden" name="address_edited" id="addressEdited" value="0">

    <div class="mb-3">
        <label>Name</label>
        <input type="text" name="name" class="form-control" value="<?=htmlspecialchars($user['name'])?>" required>
    </div>

    <div class="mb-3">
        <label>Email</label>
        <input type="email" class="form-control" value="<?=htmlspecialchars($user['email'])?>" disabled>
    </div>

    <div class="mb-3">
        <label>Phone</label>
        <input type="text" name="phone" class="form-control" value="<?=htmlspecialchars($user['phone'])?>" required>
    </div>

    <div id="displayAddress">
        <p><strong>Address:</strong> <?=htmlspecialchars($user['address'])?></p>
        <button type="button" class="btn btn-primary" id="editAddressBtn">Edit Address</button>
    </div>

   <div id="regAddressFields" class="d-none">
    <div class="mb-3">
        <label>City</label>
           
        <select disabled class="form-select" id="city" name="city">
            <option selected value="Islamabad">Islamabad</option>
        </select>
        <input type="text" hidden value="Islamabad" name="city">
    </div>

    <div class="mb-3">
        <label>Phase</label>
        <select class="form-select" id="regAreaSelect" name="phase">
            <option value="">Select Phase</option>
            <?php
            $phases = $con->query("SELECT id, name FROM locations WHERE parent_id IS NULL ORDER BY name ASC");
            while($p = $phases->fetch_assoc()){
                echo '<option value="'.htmlspecialchars($p['name']).'" data-id="'.$p['id'].'">'.htmlspecialchars($p['name']).'</option>';
            }
            ?>
        </select>
    </div>

    <div class="mb-3">
        <label>Sector</label>
        <select class="form-select" id="regSector" name="sector">
            <option value="">Select Sector</option>
        </select>
    </div>

    <div class="mb-3">
        <input type="text" class="form-control" name="street" placeholder="Street">
    </div>

    <div class="mb-3">
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="type" value="House" id="regHouseRadio">
            <label class="form-check-label" for="regHouseRadio">House</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="type" value="Apartment" id="regApartmentRadio">
            <label class="form-check-label" for="regApartmentRadio">Apartment</label>
        </div>
    </div>

    <div class="mb-3 d-none" id="regHouseDiv">
        <input type="text" class="form-control" name="house_number" placeholder="House Number">
    </div>

    <div class="mb-3 d-none" id="regApartmentDiv">
        <input type="text" class="form-control" name="apartment_info" placeholder="Apartment Name & Number">
    </div>
</div>


    <button type="submit" name="update_profile" class="btn btn-success w-100 mt-3">Update Profile</button>
</form>

                    </div>
                </div>
            </div>
        </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function(){
    const editBtn = document.getElementById("editAddressBtn");
    const displayDiv = document.getElementById("displayAddress");
    const editDiv = document.getElementById("regAddressFields");
    const addressEdited = document.getElementById("addressEdited");

    const phaseSelect = document.getElementById("regAreaSelect");
    const sectorSelect = document.getElementById("regSector");

    const houseRadio = document.getElementById("regHouseRadio");
    const aptRadio = document.getElementById("regApartmentRadio");
    const houseDiv = document.getElementById("regHouseDiv");
    const aptDiv = document.getElementById("regApartmentDiv");

    editBtn.addEventListener("click", function(){
        displayDiv.classList.add("d-none");
        editDiv.classList.remove("d-none");
        addressEdited.value = 1; // mark as edited
    });

    function toggleAddressFields(){
        if(houseRadio.checked){
            houseDiv.classList.remove("d-none");
            aptDiv.classList.add("d-none");
        } else {
            houseDiv.classList.add("d-none");
            aptDiv.classList.remove("d-none");
        }
    }
    houseRadio.addEventListener("change", toggleAddressFields);
    aptRadio.addEventListener("change", toggleAddressFields);

    // Fetch sectors
    phaseSelect.addEventListener("change", function(){
        const phaseId = this.options[this.selectedIndex].dataset.id;
        if(!phaseId) return;
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
            });
    });
});


</script>

<?php include("product-js.php");?>
<?php include("footer.php"); ?>
<?php include("js.php"); ?>
</body>
</html>
