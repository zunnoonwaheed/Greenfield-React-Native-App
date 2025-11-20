<?php include('head.php');
$controls=new htmlControl;
date_default_timezone_set('Asia/Karachi');
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage Products');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">

                            <!-- View Scheduled Posts Button -->
                            
                            

                            <div class="ibox-content">
                                <div class=""></div>
                          <table class="table table-striped table-bordered table-hover dataTables-example">
    <thead>
        <tr>
            <th>S.No:</th>
            <th>Post Date</th>
            <th>Product Title</th>
          
            <th>Category</th>
  
            <th>Status</th>
            <th>Option</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>

<?php include('script.php'); ?>
<script>
$(document).ready(function(){
    $('.dataTables-example').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: 'fetch_dow_data.php',
            type: 'POST'
        },
        pageLength: 100,
        lengthMenu: [ [100, 200, 500, 1000], [100, 200, 500, 1000, 5000] ],
        order: [[0, 'asc']],
        columns: [
            { data: 'sno' },
            { data: 'datee' },
            { data: 'namee' },
            { data: 'category' },
            { data: 'status' },
            { data: 'option' }
        ]
    });
});
</script>
<script>
// Category change event
$(document).on('change', '.category-select', function(){
    var id = $(this).data('id');
    var value = $(this).val();

    $.post('update-category.php', {
        id: id,
        field: 'catID',
        value: value
    }, function(res){
        if(res.status === 'success'){
            alert(res.message); // Ya sweetalert use karo clean UI ke liye
        } else {
            alert('Error: ' + res.message);
        }
    }, 'json');
});
</script>


</html>
