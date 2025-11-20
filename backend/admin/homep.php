<?php include('head.php');
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage text page');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                          <!---  <div class="ibox-title">
                                <a href="ins_tp.php" class="btn btn-primary ">Insert Text Page</a>
                                <div class="ibox-tools">
                                    <a class="collapse-link">
                                        <i class="fa fa-chevron-up"></i>
                                    </a>
                                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                        <i class="fa fa-wrench"></i>
                                    </a>
                                </div>
                            </div> -->
                            <div class="ibox-content">
                                <div class="">

                                </div>
<div class="table-responsive">
    <table class="table table-striped table-bordered table-hover dataTables-example">
        <thead>
            <tr>
                <th>Section 1</th>
                <th>Section 2</th>
                <th>Section 3</th>
                <th>Section 4</th>
                <th>Section 5</th>
                <th>Section 6</th>
                <th>Section 7</th>
                <th>Section 8</th>
                <th>Section 9</th>
                <th>Section 10</th>
                <th>Action</th> <!-- 👈 New column for action -->
            </tr>
        </thead>
        <tbody>
            <?php 
            $query = "select * from homep order by id asc";
            $result = mysqli_query($con, $query);
            while($row = mysqli_fetch_array($result)) { ?>
                <tr class="gradeX">
                    <td><?php echo $row['section1']; ?></td>
                    <td><?php echo $row['section2']; ?></td>
                    <td><?php echo $row['section3']; ?></td>
                    <td><?php echo $row['section4']; ?></td>
                    <td><?php echo $row['section5']; ?></td>
                    <td><?php echo $row['section6']; ?></td>
                    <td><?php echo $row['section7']; ?></td>
                    <td><?php echo $row['section8']; ?></td>
                    <td><?php echo $row['section9']; ?></td>
                    <td><?php echo $row['section10']; ?></td>
                    <td>
                        <a href="edit-homep.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-primary">Edit</a>
                      <a href="javascript:void(0);" class="btn btn-sm btn-danger" onclick="confirmReset(<?php echo $row['id']; ?>)">Reset</a>
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
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>

<script>
// JavaScript function to confirm reset and update the current page
function confirmReset(id) {
    // Ask for the password before resetting
    const password = prompt("Please enter the password to reset the Home page:");

    // Check if the entered password matches the expected one
    const correctPassword = "Mirha123#";  // Replace with your actual password

    if (password === correctPassword) {
        const confirmAction = confirm("Are you sure you want to reset all Home page sections?");

        if (confirmAction) {
            // Send a GET request to reset the values in the database
            window.location.href = "?reset=true&id=" + id;  // Triggers the reset action
        }
    } else {
        alert("Incorrect password! Reset canceled.");
    }
}
</script>

<?php
// Check if reset is triggered
if (isset($_GET['reset']) && $_GET['reset'] == 'true') {
    $id = intval($_GET['id']);
    
    // Define default values
    $default_values = [
        'section1' => '10,11,12,13,14',
        'section2' => '10,11,12,13,14',
        'section3' => '10,11,12,13,14',
        'section4' => '10,11,12,13,14',
    ];

    // Update database with default values
    $update_query = "UPDATE homep SET 
                        section1 = '{$default_values['section1']}',
                        section2 = '{$default_values['section2']}',
                        section3 = '{$default_values['section3']}',
                        section4 = '{$default_values['section4']}'
                    WHERE id = $id";

    if (mysqli_query($con, $update_query)) {
        echo "<script>alert('Sections have been reset to default values.');</script>";
    } else {
        echo "Error resetting data: " . mysqli_error($con);
    }
}
?>
<?php include('script.php'); ?>
<!-- Page-Level Scripts -->
 

</body>


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/table_data_tables.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:15:49 GMT -->
</html>
