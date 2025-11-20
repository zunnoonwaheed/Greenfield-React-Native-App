<?php 
include('head.php');
$controls=new htmlControl;
// $imgName=$_REQUEST['imgName'];
// $x=$_REQUEST['x'];
// $id=$_REQUEST['id'];
?>
<link href="css/plugins/dropzone/basic.css" rel="stylesheet">
    <link href="css/plugins/dropzone/dropzone.css" rel="stylesheet">
<body>
<div id="wrapper">
    <?php include('left.php');?>
    <div id="page-wrapper" class="gray-bg">
        <?php include('header.php');
        echo $controls->getHeaderSection('Update Robots & Sitemap');
        ?>
    <div class="wrapper wrapper-content animated fadeInRight">
     <div class="row">
                <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>Update File</h5>
                        <div class="ibox-tools">
                            <a class="collapse-link">
                                <i class="fa fa-chevron-up"></i>
                            </a>
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                <i class="fa fa-wrench"></i>
                            </a>
                           
                            <a class="close-link">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                    <div class="ibox-content">
                    <form action="specialUpdated.php" method="post" enctype="multipart/form-data" name="form1" id="form1">
                        <div class="form-group"><label class="col-sm-2 control-label">Sitemap</label>
                                                <div class="col-sm-10">
                                                <input name="file1" type="file" class="btn btn-primary" id="file1" /></div>
                                            </div>
                                            <input name="update_slide" type="submit" class="btn btn-block btn-outline btn-success" value="Update site map and robots" />
                    </form>
  <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <thead>
                                            <tr>
                                                <th>S.No:</th>
                                                <th>File Name</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="gradeX">
                                                    <td>1</td>
                                                    <td>robots.txt</td>
                                                    <td class="center"><a class="btn btn-primary btn-circle" href="http://www.paperwriter.co.uk/robots.txt" target="_blank"><i class="fa fa-edit"></i></a></td>
                                                </tr>
                                              <tr class="gradeX">
                                                    <td>2</td>
                                                    <td>sitemap.xml</td>
                                                    <td class="center"><a class="btn btn-primary btn-circle" href="http://www.paperwriter.co.uk/sitemap.xml" target="_blank"><i class="fa fa-edit"></i></a></td>
                                                </tr> 
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
</body>
<?php include('script.php'); ?>
<script src="js/plugins/dropzone/dropzone.js"></script>
    <!-- Page-Level Scripts -->
    <script>
        $(document).ready(function(){

            Dropzone.options.myAwesomeDropzone = {

                autoProcessQueue: false,
                uploadMultiple: true,
                parallelUploads: 100,
                maxFiles: 100,

                // Dropzone settings
                init: function() {
                    var myDropzone = this;

                    this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        myDropzone.processQueue();
                    });
                    this.on("sendingmultiple", function() {
                    });
                    this.on("successmultiple", function(files, response) {
                    });
                    this.on("errormultiple", function(files, response) {
                    });
                }

            }

       });
    </script>


</body>


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/table_data_tables.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:15:49 GMT -->
</html>
