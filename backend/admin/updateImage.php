<?php include('head.php');
$controls=new htmlControl;
$id= $_GET['id'];
$query = "select * from imagee where id =$id";
//echo $query;
$result = mysqli_query($con,$query); 
$rec_found = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage image');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Edit Image</a></li>
                            </ul>
                            <form action="imageUpdated.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Image</label>
                                                <div class="col-sm-10">
                                                    <input name="file1" type="file" class="btn btn-primary" id="file1"/></div>
                                            </div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Placement</label>
                                                <div class="col-sm-10">
                                                    <input name="align" type="radio" id="align" value="left" <?php if ($rec_found['align']=="left"){?> checked="checked" <?php } ?>/> Left
                                                    <input name="align" type="radio" id="align" value="bottom" <?php if ($rec_found['align']=="bottom"){?> checked="checked" <?php } ?>/> Bottom </div>
                                            </div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Link</label>
                                                <div class="col-sm-10">
                                                    <input name="linkk" type="text" id="linkk" class="form-control" value="<?php echo $rec_found['linkk']?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Alt Tag</label>
                                                <div class="col-sm-10">
                                                    <div class="summernote">
                                                        <textarea name="alt"  class="form-control" cols="65" rows="4">
                                                            <?php echo $rec_found['alt'];?>
                                                        </textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="imgName" id="imgName" value="<?php echo $_GET['imgName'];?>" />
                        <input type="hidden" name="id" id="id" value="<?php echo $_GET['id'];?>" />
                        <input name="Submit" type="submit" class="btn btn-block btn-outline btn-success" value="Update image" /></form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>    
</body>
</html>
