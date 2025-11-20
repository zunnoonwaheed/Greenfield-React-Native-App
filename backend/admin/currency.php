<?php 
include('head.php');
$controls=new htmlControl;
$query_default = "select * from exchange where default_currency=0";
$result_default = mysqli_query($con,$query_default); 
$rec_found_default = mysqli_num_rows($result_default);
$row_default = mysqli_fetch_array($result_default);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage currency');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="insertCurrency.php" class="btn btn-primary">Insert New Currency</a>
                                <div class="ibox-tools">
                                    <a class="collapse-link">
                                        <i class="fa fa-chevron-up"></i>
                                    </a>
                                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                        <i class="fa fa-wrench"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="ibox-content">
                                <div class="">

                                </div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example">
                                        <thead>
                                            <tr>

                                                <th>Currency</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $query = "select * from exchange order by name";
                                            $s = 1;
                                            $result = mysqli_query($con,$query);
                                            $rec_found = mysqli_num_rows($result);
                                            if($rec_found >0){
                                            while($row = mysqli_fetch_array($result)){?>
                                                    <tr class="gradeX">
                                                        <td>
                                                            <span class="text-center"><?php echo $row['name'];?></span>
                                                            (Symbol: <?php echo $row['currency'];?>)&nbsp;(Rate: <?php echo $row['exchange_rate'];?>)<br /></td>

                                                        <td class="center">
                                                            <div class="btn-group">
                                                                <?php if ($row['default_currency']==0){?>
                                                                <button type="button" class="btn btn-warning btn-xs">Default Currency</button> <?php } 
                                                                else { ?>

                                                                    <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                        <a class="btn btn-primary btn-circle" href="editCurrency.php?id=<?php echo $row['id'];?>"><i class="fa fa-edit"></i></a>
                                                                    </div>

                                                                    <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                        <a class="btn btn-danger btn-circle" href="delCurrency.php?id=<?php echo $row['id'];?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this Coupon')"><i class="fa fa-times"></i></a>
                                                                    </div> 

                                                                <?php } ?>
                                                            </div>
                                                            <?php if ($row['default_currency']!=0){?>
                                                            <button type="button" class="btn btn-success btn-xs" onclick="location.href='stock.php?id=<?php echo $row['id'];?>&defaultID=<?php echo $row_default['id'];?>';">Set as default</button><?php } ?>
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
