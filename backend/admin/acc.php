<?php include('head.php');
error_reporting(0);
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage product categories');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="insertar.php" class="btn btn-primary ">Insert New Category</a>
                             
                              
                            </div>
                            <div class="ibox-content">
                                <div class="">

                                </div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <thead>
                                            <tr>
                                                <th>Category Name</th>
                                                <th>Category</th>
                                                 <th>Sort Oder / Menu</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            if (isset($_REQUEST['catID'])){ 
                                                $query = "select * from sizee WHERE catID=".$_REQUEST['catID']." ORDER by name";
                                            }else{
                                                $query = "select * from sizee WHERE catID=2 ORDER by id";
                                            }
                                            $result = mysqli_query($con,$query); 
                                            $rec_found = mysqli_num_rows($result);
                                            if($rec_found >0){
                                                while($row = mysqli_fetch_array($result)){
                                                    $s=1;
                                            ?>
                                                    <tr class="gradeX">
                                                        <td><?php echo $row['name'];?></td>
                                                        <td><?php
                                                            $query_cat = "select * from sizee WHERE id=".$row['catID']."";
                                                            $result_cat = mysqli_query($con,$query_cat); 
                                                            $rec_found_cat = mysqli_num_rows($result_cat);
                                                            $row_cat = mysqli_fetch_array($result_cat);
                                                        echo $row_cat['name'];?></td>
                                                          <td><?php echo $row['sort_order'];?></td>
                                                        <td class="center">
                                                            <div class="btn-group">

                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <?php
                                                                    $query_cat = "select * from sizee WHERE catID=".$row['id']." ORDER by name";
                                                                    $result_cat = mysqli_query($con,$query_cat); 
                                                                    $rec_found_cat = mysqli_num_rows($result_cat);
                                                                    if($rec_found_cat==0){?>
                                                                        <a class="btn btn-info btn-circle" href="dow.php?catID=<?php echo $row['id'];?>&mainID=<?php echo $row['mainID'];?>"><i class="fa fa-eye"></i></a></
                                                                    <?php }
                                                                    else{?>
                                                                        <a class="btn btn-info btn-circle" href="acc.php?catID=<?php echo $row['id'];?>"><i class="fa fa-eye"></i></a>
                                                                    <?php
                                                                    }
                                                                    ?>

                                                                </div>

                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <a class="btn btn-primary btn-circle" href="editar.php?id=<?php echo $row['id'];?>"><i class="fa fa-edit"></i></a>
                                                                </div>

                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <a class="btn btn-danger btn-circle" href="delar.php?id=<?php echo $row['id'];?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this Blog')"><i class="fa fa-times"></i></a> 
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                <?php $s++; } }?>
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


<?php include('script.php'); ?>
<!-- Page-Level Scripts -->
<script>
    $(document).ready(function(){
        $('.dataTables-example').DataTable({
            dom: '<"html5buttons"B>lTfgitp',

            customize: function (win){
                $(win.document.body).addClass('white-bg');
                $(win.document.body).css('font-size', '10px');

                $(win.document.body).find('table')
                .addClass('compact')
                .css('font-size', 'inherit');
            }
            }
            ]

        });

        /* Init DataTables */
        var oTable = $('#editable').DataTable();

        /* Apply the jEditable handlers to the table */
        oTable.$('td').editable( 'http://webapplayers.com/example_ajax.php', {
            "callback": function( sValue, y ) {
                var aPos = oTable.fnGetPosition( this );
                oTable.fnUpdate( sValue, aPos[0], aPos[1] );
            },
            "submitdata": function ( value, settings ) {
                return {
                    "row_id": this.parentNode.getAttribute('id'),
                    "column": oTable.fnGetPosition( this )[2]
                };
            },

            "width": "90%",
            "height": "100%"
        } );


    });

    function fnClickAddRow() {
        $('#editable').dataTable().fnAddData( [
            "Custom row",
            "New row",
            "New row",
            "New row",
            "New row" ] );

    }
</script>

</body>


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/table_data_tables.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:15:49 GMT -->
</html>
