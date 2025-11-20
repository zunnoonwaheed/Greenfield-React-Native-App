<?php include('head.php');
$controls=new htmlControl;

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
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Insert Image</a></li>
                            </ul>
                            <form action="storesInserted.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Alter Tag</label>
                                                <div class="col-sm-10">
                                                    <input name="linkk" type="text" id="linkk"  class="form-control" ></div>
                                            </div>
                                            <!--<div class="form-group"><label class="col-sm-2 control-label">Title</label>
                                            <div class="col-sm-10">
                                            <input name="name" type="text" id="name"
                                            class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Description</label>
                                            <div class="col-sm-10">
                                            <div class="summernote">
                                            <textarea name="desc1"  class="form-control" cols="65" rows="4"></textarea>

                                            </div></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Button Title</label>
                                            <div class="col-sm-10">
                                            <input name="title" type="text" id="title"  class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Link</label>
                                            <div class="col-sm-10">
                                            <input name="link" type="text" id="link"  class="form-control" ></div>
                                            </div>-->





                                            <div class="form-group"><label class="col-sm-2 control-label">Image</label>
                                                <div class="col-sm-10">
                                                    <input name="file1" type="file" class="btn btn-primary" id="file1" /></div>
                                            </div>
                                            <div class="form-group">
                                                <div class="col-sm-12">
                                                    <input name="update_slide" type="submit" class="btn btn-block btn-outline btn-success" value="Update" />
                                                </div>
                                            </div>
                                        </fieldset>

                                    </div>
                                </div>



                            </div>
                        </div></form>
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
