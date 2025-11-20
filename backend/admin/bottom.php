<link href="css/style.css" rel="stylesheet" type="text/css" />
<table width="100%" border="0">
                          		<tr height="50">
                            		<td width="50%" align="center" class="hrBlack">
									<!-- Placement of Bottom Contents -->
									Copyright &copy; <?php echo date("Y");?> All Right Reserved.</td>
                            		<td width="50%" align="center" class="hrBlack">&nbsp;</td>
                          		</tr>
                        	</table>
							<?php 
							//  Close Connection 
							if (isset($con)){
								mysqli_close($con);
							}
							?>							
