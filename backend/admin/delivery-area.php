<?php include('head.php');
$controls=new htmlControl;
?>
<body>
<div id="wrapper">
    <?php include('left.php');?>
    <div id="page-wrapper" class="gray-bg">
        <?php include('header.php');
        echo $controls->getHeaderSection('Delivery Charges and Areas');
        ?>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <div class="ibox-tools">
                                <a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </div>
                        </div>
                        <div class="ibox-content">

<div class="row">
    <!-- Locations -->
    <div class="col-md-6">
        <h3>Add Location</h3>
        <form id="addLocationForm">
            <div class="form-group">
                <label>Type</label>
                <select name="type" id="locType" class="form-control" required>
                    <option value="">-- Select Type --</option>
                    <option value="phase">Phase</option>
                    <option value="sector">Sector</option>
                </select>
            </div>

            <div class="form-group" id="phaseSelectBox" style="display:none;">
                <label>Select Phase (for Sector)</label>
                <select name="parent_id" id="parentPhase" class="form-control">
                    <option value="">-- Select Phase --</option>
                    <?php
                    $phases = $con->query("SELECT id, name FROM locations WHERE type='phase' ORDER BY name ASC");
                    while($p = $phases->fetch_assoc()){
                        echo "<option value='".$p['id']."'>".$p['name']."</option>";
                    }
                    ?>
                </select>
            </div>

            <div class="form-group">
                <label>Location Name</label>
                <input type="text" name="name" class="form-control" required>
            </div>

            <button type="submit" class="btn btn-primary btn-sm">Add Location</button>
        </form>

        <h3>Locations List</h3>
        <table class="table table-bordered" id="locationsTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Location / Sector</th>
                    <th>Type</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Pehle saare phases lao
                $phases = $con->query("SELECT * FROM locations WHERE type='phase' ORDER BY name ASC");
                while($phase = $phases->fetch_assoc()){ ?>
                    <tr style="background:#f0f0f0; font-weight:bold;" data-id="<?= $phase['id'] ?>">
                        <td><?= $phase['id'] ?></td>
                        <td><?= $phase['name'] ?></td>
                        <td>Phase</td>
                        <td>
                            <button class="btn btn-info btn-xs freeDeliveryBtn" data-phase="<?= $phase['name'] ?>" data-sector="">Post to Free Delivery</button>
                            <button class="btn btn-danger btn-xs deleteLocation">Delete</button>
                        </td>
                    </tr>

                    <?php
                    // ab is phase ke sectors lao
                    $sectors = $con->query("SELECT * FROM locations WHERE parent_id=".$phase['id']." AND type='sector' ORDER BY name ASC");
                    while($sector = $sectors->fetch_assoc()){ ?>
                        <tr data-id="<?= $sector['id'] ?>">
                            <td><?= $sector['id'] ?></td>
                            <td style="padding-left:40px;">↳ <?= $sector['name'] ?></td>
                            <td>Sector</td>
                            <td>
                                <button class="btn btn-info btn-xs freeDeliveryBtn" data-phase="<?= $phase['name'] ?>" data-sector="<?= $sector['name'] ?>">Post to Free Delivery</button>
                                <button class="btn btn-danger btn-xs deleteLocation">Delete</button>
                            </td>
                        </tr>
                    <?php } ?>
                <?php } ?>
            </tbody>
        </table>
    </div>

    <!-- Delivery Charges -->
  <div class="col-md-6">
    <h3>Delivery Charges</h3>
    <table class="table table-bordered" id="chargesTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Phase</th>
                <th>Sector</th>
                <th>Charge</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $chs = $con->query("SELECT * FROM delivery_charges ORDER BY id DESC");
            while($row = $chs->fetch_assoc()){ ?>
                <tr data-id="<?= $row['id'] ?>">
                    <td><?= $row['id'] ?></td>
                    <td><?= $row['area'] ?></td>
                    <td><?= $row['sector'] ?></td>
                    <td><?= $row['charge'] ?></td>
                    <td>
                        <button class="btn btn-warning btn-xs updateCharge">Update</button>
                        <?php if($row['id'] != 1){ ?>
                            <button class="btn btn-danger btn-xs deleteCharge">Delete</button>
                        <?php } ?>
                    </td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</div>

</div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php include('footer.php'); ?>
    </div>
</div>
<?php include('script.php'); ?>
<script>
$(document).ready(function(){

    // Show/hide phase dropdown
    $("#locType").change(function(){
        if($(this).val() === "sector"){
            $("#phaseSelectBox").show();
            $("#parentPhase").attr("required", true);
        } else {
            $("#phaseSelectBox").hide();
            $("#parentPhase").attr("required", false);
        }
    });

    // Add Location
    $("#addLocationForm").submit(function(e){
        e.preventDefault();
        $.post("actions.php", $(this).serialize() + "&action=add_location", function(res){
            alert(res);
            location.reload();
        });
    });

    // Delete Location
    $(document).on("click", ".deleteLocation", function(){
        var id = $(this).closest("tr").data("id");
        if(confirm("Delete this location?")){
            $.post("actions.php", {id:id, action:"delete_location"}, function(res){
                alert(res);
                location.reload();
            });
        }
    });

    // Post to Free Delivery (charge 0.00)
    $(document).on("click", ".freeDeliveryBtn", function(){
        var phase = $(this).data("phase");
        var sector = $(this).data("sector");
        if(confirm("Set Free Delivery for " + (sector ? (phase + " - " + sector) : phase) + "?")){
            $.post("actions.php", {area:phase, sector:sector, charge:"0.00", action:"add_or_update_charge"}, function(res){
                alert(res);
                location.reload();
            });
        }
    });

    // Update Charge
    $(document).on("click", ".updateCharge", function(){
        var row = $(this).closest("tr");
        var id = row.data("id");
        var charge = prompt("Enter new charge:");
        if(charge !== null){
            $.post("actions.php", {id:id, charge:charge, action:"update_charge"}, function(res){
                alert(res);
                location.reload();
            });
        }
    });

    // Delete Charge
    $(document).on("click", ".deleteCharge", function(){
        var id = $(this).closest("tr").data("id");
        if(confirm("Delete this delivery charge?")){
            $.post("actions.php", {id:id, action:"delete_charge"}, function(res){
                alert(res);
                location.reload();
            });
        }
    });

});
</script>

</body>
</html>
