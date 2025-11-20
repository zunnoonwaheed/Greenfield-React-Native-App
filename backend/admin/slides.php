<?php
include("includes/db_settings.php");
include('head1.php');
$controls=new htmlControl;
function box($sid){
$slide_q = "select * from slider where id=".$sid;
$result_q = mysqli_query($con,$slide_q); 
return mysqli_fetch_array($result_q);
}
?>
<body>
<div id="wrapper">
    <?php include('left.php');?>
    <div id="page-wrapper" class="gray-bg">
        <?php include('header.php');
        echo $controls->getHeaderSection('manage slides');
        ?>
    <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-content">
                  

                    <div class="table-responsive">
                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                    <thead>
                    <tr>
                        <th>S no</th>
                        <th>Text / Image</th>
                        <th>Content</th>
                        <th>Option</th>
                    </tr>
                    </thead>
                    <tbody>
<?php  for($i=1; $i<=10; $i++){  
    $s=1;
if ($i==3)
    continue;{
        ?> 
                    <tr class="gradeX">
                    <td><?php echo $i; ?></td>

                    <?php if ($i==4 or $i==9){ ?>
                        <?php $row_q=box($i); ?>
                        <td><img src="../<?php echo $row_q['image']; ?>" width="200" height="100"></td>
                    <?php  }
                 else {
                 $row_q=box($i); ?>
                <td><?php echo $row_q['text_initial']; ?></td><?php } ?> 
                <td><?php echo $row_q['text_final']; ?></td>
                    <td class="center">
                     <div class="btn-group">
                            <button data-toggle="dropdown" class="btn btn-primary btn-xs dropdown-toggle">Action <span class="caret"></span></button>
                            <ul class="dropdown-menu">
                                <li><a href="editslides.php?id=<?php echo $row_q['id'];?>">Edit</a></li>
                                
                            </ul>
                        </div>
                </td>
                    </tr>
<?php   }
} ?>
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
