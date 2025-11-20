<?php include('head.php');
$controls=new htmlControl;
@$catID=$_POST['catID'];
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('social media links');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="editshipping.php" class="btn btn-primary ">Edit Social Media</a>
                                <div class="ibox-content">
                                    <div class="">

                                    </div></div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <thead>
                                            <tr>
                                                <th>ICON</th>
                                                <th>Text Pages Title</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php 
                                            $query = "select * from shipping";
                                            $result = mysqli_query($con,$query); 
                                            $rec_found = mysqli_num_rows($result);
                                            $row = mysqli_fetch_array($result);
                                            ?>
                                            <tr class="gradeX">
                                                <td><i class="center fa fa-facebook-square"></i></td>
                                                <td> Facebook</td>
                                                <td class="center"><?php echo $row['fb'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-twitter-square"></i></td>
                                                <td>Twitter</td>
                                                <td class="center"><?php echo $row['twitter'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-linkedin-square"></i></td>
                                                <td>Linkedin</td>
                                                <td class="center"><?php echo $row['linkedin'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-pinterest-square"></i></td>
                                                <td>Pinterest</td>
                                                <td class="center"><?php echo $row['pinterest'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-skype"></td>
                                                <td>Skype</td>
                                                <td class="center"><?php echo $row['skype'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-comment"></td>
                                                <td>Chat</td>
                                                <td class="center"><?php echo $row['chat'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-mobile-phone (alias)"></td>
                                                <td>Call Us</td>
                                                <td class="center"><?php echo $row['callus'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-envelope"></td>
                                                <td>Mail</td>
                                                <td class="center"><?php echo $row['mail'];?></td>
                                            </tr>

                                        </tbody>
                                    </table>`
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
