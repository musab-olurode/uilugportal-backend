import cheerio from 'cheerio';
import { NextFunction, Request, Response } from 'express';
import { successResponse, errorResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// eslint-disable-next-line no-unused-vars
export const testFunction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const $ = cheerio.load(`
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title>University of Ilorin:</title>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    
    <!--<script src="datepicker/jquery-1.8.3.js"></script>
    <script src="datepicker/jquery-ui.js"></script>
    <script type="text/javascript" src="datepicker/jquery.form.js"></script>
    <link rel="stylesheet" href="datepicker/jquery-ui.css" />
    
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <link href="css/menu.css" rel="stylesheet" type="text/css" />
    <link rel="shortcut icon" href="images/logo.jpg"> <!-- put the image/logo on the browser tab -->
    
    <link rel="stylesheet" type="text/css" href="include/easyui.css">
    <link rel="stylesheet" type="text/css" href="include/icon.css">
    <link rel="stylesheet" type="text/css" href="include/demo.css">
    <link rel="stylesheet" href="css/tinybox.css" />
    <script type="text/javascript" src="include/jquery.min.js"></script>
    <script type="text/javascript" src="include/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="datepicker/tinybox.js"></script> 
    <script type="text/javascript" src="include/jquery.edatagrid.js"></script>
    <script type="text/javascript" src="include/jquery.serializeobject.js"></script>
    
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <link href="css/menu.css" rel="stylesheet" type="text/css" />
    <link href="css/modal_css.css" rel="stylesheet" type="text/css" />
    <link rel="shortcut icon" href="images/logo.jpg"> <!-- put the image/logo on the browser tab -->
    
    
    <link rel="stylesheet" href="assets/countdown/jquery.countdown.css" />
    <script src="assets/countdown/jquery.countdown.js"></script>
    <script src="assets/js/script.js"></script>
    <!--Start of Tawk.to Script-->
    <!--<script type="text/javascript">
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/5af577a85f7cdf4f053410b8/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
    </script>-->
    <!--End of Tawk.to Script-->
    
    <!--[if lt IE 7]>
    <style type="text/css" media="screen">
    #menuh{float:none;}
    body{behavior:url(csshover.htc); font-size:75%;}
    #menuh ul li{float:left; width: 100%;}
    #menuh a{height:1%;font:normal 1em/1.6em  helvetica,  "Trebuchet MS", arial, sans-serif;}
    </style>
    <![endif]-->
         
    </head>
        <body>
    <!-- **************************** Heading *****************************************-->
        <!-- banner start -->
        <div id="top"> &nbsp;</div>
    <div id="banner">
      <h1> <a href="http://www.unilorin.edu.ng/"><b>UNIVERSITY OF ILORIN</b></a></h1>
    </div>	<!-- banner end -->
    
        <!-- top menu start -->
         <div id="menuh-container">
      <div id="menuh">
       <ul><li>&nbsp;</li></ul><ul><li>&nbsp;</li></ul><ul><li>&nbsp;</li></ul>
       <ul>
          <li><a href="javascript:if(confirm('Are you sure you want to logout?')) swapcontent('logout','index.php');">Logout</a> </li>
        </ul>
        <div align="right"><font color="#FFFFFF">Today: Wednesday, December 8th, 2021</font> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#FFFFFF"><b>Current Role: Student</b></font></div>
      </div>
       <center>
          <b><font color='blue' size='2'>Login ID: <font color='green'>19/52HA089</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome: <font color='green'>OLURODE MusAb Olanisebe( <a href="javascript:if(confirm('Are you sure you want to logout?')) swapcontent('logout','index.php');">Logout</a> )</font> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last Login: <font color='green'>Wednesday, December 08, 2021 @12:03:46 pm</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='green'>Rain (2nd) Semester 2020/2021</font></font></b>      <!--<style>
       .big{
         font-size:3em !important;
         color:red;
       }
       </style> -->
       </center>
      <div>
      </div>
    </div>	<!-- top menu end -->
    <!-- ********************************************* End of Header ******************************************* -->
        
     <!-- Scrolling news -->
     <!-- Scrolling news end -->
    
    <div id="container">
      <!-- ************************** Sidebar start here ******************************* --->
      <!doctype html>
    
    
    <script>
    
    function swapcontent2(cv,v,a,b,c,d,e,f,g,h,i,j,k,l)
    
            {   //swap content begins where cv means div id name
    
                var divid="#"+cv;//"#lga", {contentvar:cv,state:v}
    
                $(divid).html('<img src="images/loader.gif" width="100" height="100" alt="loading">').show();
    
                var url="scriptfile_a.php";
    
                var str;
    
                
    
                if(cv=="load_charges")
    
                 {
    
                         //alert('yes'); exit; 
    
                          $.post(url,{contentvar:cv},function(data){			
    
                          $('#w').html(data).show();
    
                          $('#w').window('open');  //open the dialog to display info from ajax
    
                          });				 
    
                 }//end of load charges
    
                if(cv=='open_dialog')
    
                 {
    
                     var div_id="#"+v;
    
                      //$(div_id).window('close');
    
                      $(div_id).window('open');
    
                 } //end of open dialog
    
                
    
                if(cv=='password_mgt') //start password mgt
    
                      {
    
                            var newpwd=$('#newpwd').val();
    
                            var con_newpwd=$('#con_newpwd').val();
    
                            var oldpwd=$('#oldpwd').val();
    
                            if(newpwd=='' || oldpwd=='')
    
                              {
    
                                  alert("Old and New passwords are compulsory");
    
                                  $(divid).html('').show();
    
                                  exit;
    
                              } //end of test
    
                            
    
                            if(newpwd!=con_newpwd)
    
                             {
    
                                 $.messager.alert('Password Error','Your new password does not match the confirm password');
    
                                 $(divid).html('').show();
    
                                 exit;
    
                             } //end of confirm password
    
                            
    
                            if(confirm("Are you sure you want to perform this operation?"))
    
                             {
    
                                    $.post(url,{contentvar:cv,ref:newpwd,oldpwd:oldpwd},function(data){  //ajaxfile/scriptfile_a is called undernith
    
                                    $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
    
                                    
    
                                    });
    
                             } //end of if confirm is true
    
                             else
    
                              $(divid).html('').show();
    
                             
    
                      }//end of password mgt
    
                      
    
                if(cv=='logout') //start putme_logout
    
                  {
    
                        $.post(url,{contentvar:cv,ref:v},function(data){  //ajaxfile/scriptfile_a is called undernith
    
                        $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
    
                        
    
                        });
    
                  }//end of logout
    
                  
    
                if(cv=='close_dialog')
    
                 {
    
                     var div_id="#"+v;
    
                      $(div_id).window('close');
    
                      //$(div_id).window('open');
    
                 } //end of open dialog
    
                if(cv=='print_dialog')
    
                 {
    
                     var div_id="#"+v;
    
                      $(div_id).printElement();
    
                      //$(div_id).window('open');
    
                 } //end of open dialog
    
            }
    
    </script>
    
    <div id="sidebar">
    
        <div class="easyui-accordion" style="width:220px;">
    
          <div title="PERSONAL SETUP" data-options="iconCls:'icon-ok'" style="padding:10px;"> <!-- first accordion -->
    
                    <ul> 
                      <li><a href='main.php?r_val=UGVyc29uYWwgTWVudQ=='>Main Menu</a></li>
    
                      <li><a href='personal_details.php?r_val=UGVyc29uYWwgTWVudQ==&id=MTkvNTJoYTA4OQ==' target="_blank">Personal Details</a></li>
    
                                        
    
                      <li><a href="page.php?r_val=UGVyc29uYWwgTWVudQ==&p_id=cGFzc3dvcmRfbWd0">Password Management</a></li>
    
                      <li><a href="javascript:if(confirm('Are you sure you want to logout?')) location='logout.php';">Logout</a></li>
    
                    </ul>
    
          </div> <!-- end of first accordion -->
    
          
    
          <!-- lecturer accordion -->
    
          
           <!-- end of lecturer accordion -->
    
           
    
           <!-- Auto-read role sidebar starts here for staff-->
    
           <!-- /////////////////////////////////////////////////////////////////////////////////////////////// -->
    
                  
           
    
           <!-- End of Auto-read role sidebar starts here for staff-->   
    
           
    
           
    
            <!-- student accordion -->
    
           
    
            <div title="MAIN MENU" data-options="iconCls:'icon-ok'" style="padding:10px;"> <!-- lstudent accordion -->
    
                                <ul>
    
    
    
                                
                                  <li><a href='registration_instruction.php?r_val=U3R1ZGVudA=='>Procedures for Registration</a></li>
    
                                  <li><a target="_blank" href='http://www.unilorin.edu.ng/download/AcadProg.pdf'>Download Academic Programme</a></li>
                                                              <li><a href='hostel_allocation.php?r_val=U3R1ZGVudA=='>Hostel Application</a></li>
                                                              <li><a href="javascript:swapcontent2('load_charges');">Current Charges</a></li>
    
                                 <!--<li><a href='tab_payment.php?statuss=UmV0dXJuaW5n&h_val=U3R1ZGVudA=='>Bandwidth Payment</a></li>-->
    
    
    
                                
                                  <!--<li><a href='#?r_val=U3R1ZGVudA=='>Download Add/Drop Form</a></li>-->
    
                                 
    
                                  
    <!--								  <li><a href='tab_payment.php?statuss=UmV0dXJuaW5n&r_val=U3R1ZGVudA=='>Tablet/Bandwidth Payment</a></li>
    
    -->										
                                
                  <li><a href='schoolcharge_payment.php?statuss=UmV0dXJuaW5n&r_val=U3R1ZGVudA=='>School Charges Payment</a></li>
                  <li><a href='course_registration.php?statuss=UmV0dXJuaW5n&r_val=U3R1ZGVudA=='>Course Registration</a></li>
                 
    
    
                               
    
    
                                   <li><a href='print_course_form.php?id=crg&r_val=U3R1ZGVudA=='>Print Completed Course Form</a></li>
    
                                  <li><a href='print_course_form.php?id=rec&r_val=U3R1ZGVudA=='>Print Payment Receipts</a></li>
    
                                  <li><a href='print_course_form.php?id=result&r_val=U3R1ZGVudA=='>Print Results</a></li>
    
                                 <!-- <li><a href='payment_revalidation.php?r_val=U3R1ZGVudA=='>Payment Revalidation Section</a></li>-->
                                 <li><a href='remita_general_payment.php?r_val=U3R1ZGVudA=='>General Payment / Revalidationn</a></li>
                                 
    
        
    
    
                 <li><a href='payment_revalidation_tab.php?statuss=UmV0dXJuaW5n&r_val=U3R1ZGVudA=='>Bandwidth Payment Revalidation</a></li>
    
     
                                                              <li><a href='old_matriculant.php?r_val=U3R1ZGVudA==&id=clr'>Print Admission Clearance</a></li>
                                 <li><a href='putme_page.php?token=&h_val=&p_id=Y2hlY2tfcHV0bWVfcmVzdWx0'>Admission Screening Result</a></li>
                                </ul>
    
              </div> 
    
              <div title="OTHER FORMS AND PAYMENTS" data-options="iconCls:'icon-ok'" style="padding:10px;"> <!-- lstudent accordion -->
    
                                <ul>
    
                                  <li><a href='other_payment.php?r_val=U3R1ZGVudA=='>Other Payments(Add & Drop/Change of Programme etc)</a></li>
    <li><a href='general_payment.php?r_val=U3R1ZGVudA=='>Outstanding Payment</a></li>
                                  
                                  <li><a href='add_drop.php?r_val=U3R1ZGVudA=='>Add and Drop Form</a></li>
                                
                                   <li><a href='payment_without_reg.php?statuss=UmV0dXJuaW5n&r_val=U3R1ZGVudA=='>Payment Without Registration (Returning Student Only)</a></li>
                                     
                                  <li><a href='request_form.php?r_val=U3R1ZGVudA==' target="_blank">Request for Additional Credit Unit</a></li>
                                </ul>
    
              </div> 
    
               <div title="e-VOTING" data-options="iconCls:'icon-ok'" style="padding:10px;">
    
               <ul>
    
                   <li><a href='otp.php?r_val=U3R1ZGVudA=='>e-Voting</a></li>
    
               </ul>
    
               
    
               </div>
    
    
               <div title="LECTURERS ASSESSMENT" data-options="iconCls:'icon-ok'" style="padding:10px;">
    
               <ul>
    
               <!--	<li><a href='survey/index.php?r_val=U3R1ZGVudA==&std_di=MTkvNTJoYTA4OQ==' target="_blank">Lecturers Accessment</a></li>
                
                -->
                <li><a href='accessment2.php?r_val=U3R1ZGVudA==&std_di=MTkvNTJoYTA4OQ==' > Lecturers Accessment</a></li> 
    
               </ul>
    
               
    
               </div>
    
               <div title="GRADUATION STATUS" data-options="iconCls:'icon-ok'" style="padding:10px;">
    
               <ul>
    
                   <li><a href='studgraduation.php?r_val=U3R1ZGVudA==&std_di=MTkvNTJoYTA4OQ=='>Confirm Graduation Status</a></li>
    
               </ul>
    
               
    
               </div>
          
           <!-- end of student accordion --> 
    
                  
    
       </div> <!-- end of main accordion -->
    
       
    
            
    
       <script>
    
            $(function() {
    
                $( "#accordion" ).accordion({
    
                  collapsible: true,
    
                  heightStyle: "content"
    
                });
    
              });
    
            //$( "#accordion" ).accordion();
    
       </script>
    
          
    
          <div id="w" class="easyui-window" title="" data-options="modal:true,closed:true,iconCls:'icon-save'" style="width:600px;height:auto;padding:10px;top:10px;">
    
          </div>
    </div> <!-- end of sidebar -->  <!-- ************************** End of Sidebar******************************* --->
      
      <!-- ************************** Content start here ******************************* --->
      <div id="content">
           <!--<h4>&nbsp;</h4>-->
        <h4><strong>Print-out Menu</strong>    </h4>
       <p><center><table>
                          <th>Reg/Matriculation No</th><td><b>19/52HA089</b></td><td rowspan='8' valign='top'><fieldset><legend><b>Passport</b></legend><img src='https://s3.us-east-2.amazonaws.com/uilugportal/96336386BE.jpg' alt='19/52HA089' width='150' height='150'/></fieldset></td></tr>
                       <th>Full-Name</th><td><b>OLURODE, MusAb Olanisebe</b></td></tr>
                       <th>Faculty</th><td><b>Communication & Information Sciences </b></td></tr>
                       <th>Department</th><td><b>Computer Science </b></td></tr>
                       <th>Programme</th><td><b>B.Sc. Computer Science</b></td></tr>
                       <th>Current Level</th><td><b>200</b></td></tr>
                       
                       </table></center>   
       
       <center><u><i>List of Receipts</i></u><br><table><tr><th colspan='4'>Click on any of the Payment Description below to generate Receipt</th></tr>
    <tr><th>S/No</th><th>Academic Session</th><th>Payment Description</th><th>Level</th></tr>        
    <tr><td>1</td><td>2019/2020</td><td><a style="color:red" href=receipt_printout.php?id=MjAxOTEwMDcxMjEyNDQ=&matno=MTkvNTJoYTA4OQ==&h=01ad525d62d2b5ea4429f22f5fd8780b084a6df045bf28f457d19133e8fadcd644c13607153f83d6d4570609530fe959cbfd7a0cd4c5746356b3051909a7451daa89c37bfbc8bd6d20e190040c2e9e99&desc=Acceptance Payment target='_blank'>Acceptance Payment</a></td><td></th></tr><tr><td>2</td><td>2019/2020</td><td><a style="color:red" href=receipt_printout.php?id=MjAxOTA3MDMwMTI3NDE=&matno=MTkvNTJoYTA4OQ==&h=e5b70aae7f5cb289b4d5ec4af514c231dfcaee6161522b7f3afdf0ac39302a70c6d4831260be025577cad2e54928e40f8ae19eaef9950d2e63423246fd47968975e0f41a25aaff71503e854c43a10df3&desc=POST UTME Registration target='_blank'>POST UTME Registration</a></td><td></th></tr><tr><td>3</td><td>2019/2020</td><td><a style="color:red" href=receipt_printout.php?id=MjAxOTEwMTUwNzM5NTc=&matno=MTkvNTJoYTA4OQ==&h=aa66d8cab823e2fef9a70feadb6a0d6f5a768f7fd9177e97a63186fd7b220fbf94d2c11921a04938bf1679297a6740d4f88b7862b7dbf814049f930bc22fdd81654f81ee42a47fe28a59976041cc5e41&desc=School Charges target='_blank'>School Charges</a></td><td>100</th></tr><tr><td>4</td><td>2020/2021</td><td><a style="color:red" href=receipt_printout.php?id=MjAyMTA5MjkxMDAwMjY=&matno=MTkvNTJoYTA4OQ==&h=2294afd60ab2d6315b78a79cf9cfcbf323e74737a8797b2ce1152cbb29cfd28c0f071704c5e30d59d87cf7fc999bd6992b1af45d3f3706862696b4af6e3888c460fb1dfb0cca19c79a3d27029df0747f&desc=Add/Drop Payment target='_blank'>Add/Drop Payment</a></td><td>200</th></tr><tr><td>5</td><td>2020/2021</td><td><a style="color:red" href=receipt_printout.php?id=MjAyMTA4MjYxMjQxMTk=&matno=MTkvNTJoYTA4OQ==&h=141dce36ad1e4abeeaf42f5c54fd6f3007f85f204bac120b8ee4841f1d7001cfaafc367a8ba1419698a0e86106391f234f69af520e6937ffcd94ce85eba5b4877b89e901c57ff719d2ce918b5a3c0766&desc=School Charges target='_blank'>School Charges</a></td><td>200</th></tr></table></center></center>   
       
       </p>
        
        
        <div id="w" class="easyui-window" title="Biodata Update:" data-options="modal:true,closed:true,iconCls:'icon-save'" style="width:600px;height:auto;padding:10px; top:50px;">
        </div>
    
      </div> 
      <!-- end of div for contents -->
      
    </div> 
    <!-- end of div for container -->
    <!-- ************************** End of Contents ******************************* --->
    
    
    <!-- ************************** Start of footer ******************************* --->
     <div id="footer" align="center">&copy; 2021. University of Ilorin, Ilorin. All right reserved | Developed by COMSIT.</div><!-- ************************** End of footer ******************************* --->
    
    <div id="overlay" class="web_dialog_overlay"></div>
    <div id="dialog" class="web_dialog"></div>
    <div id="logout"></div>
    <!----><div id="update_completebiodata"></div>
    
    </body>
    </html>
    
    <!--  ############################ Java script codes ------------------------------------------------------------------------>
    <script>
    function swapcontent_c(cv,v,a,b,c,d,e,f,g,h,i,j,k,l)
    {   //swap content begins where cv means div id name
        var divid="#"+cv;//"#lga", {contentvar:cv,state:v}
        $(divid).html('<img src="images/loader.gif" width="100" height="100" alt="loading">').show();
        //var url="scriptfile_a.php";
        var url2="scriptfile_c.php";
        var str;
            //alert('Helloooooooooooo');
     if(cv=='update_completebiodata') //start putme_logout
      {
         // alert('Muyideen');
              //$.post(url,{contentvar:cv,ref:v},function(data){  //ajaxfile/scriptfile_a is called undernith
            $.post(url2,$("#update_biodata_form").serialize()+"&contentvar="+cv+"&regno="+a,function(data){	
            $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
        
            });
      }//end of putme_login
      
    }
    
    function swapcontent(cv,v,a,b,c,d,e,f,g,h,i,j,k,l)
    {   //swap content begins where cv means div id name
        var divid="#"+cv;//"#lga", {contentvar:cv,state:v}
        $(divid).html('<img src="images/loader.gif" width="100" height="100" alt="loading">').show();
        var url="scriptfile_a.php";
        var url1="scriptfile_c.php";
        var str;
            //alert('Helloooooooooooo');
     if(cv=='logout') //start putme_logout
      {
              $.post(url,{contentvar:cv,ref:v},function(data){  //ajaxfile/scriptfile_a is called undernith
            $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
            
            });
      }//end of putme_login
    /*  if(cv=='update_completebiodata')
      {
        //swapcontent('save_gcourse','update');  
        alert(a);
        $.post(url1,"&contentvar="+cv+"&login_id="+v,function(data){			
                  $('#w').html(data).show();
                  $('#w').window('close');  //open the dialog to display info from ajax
                  });
        }*/
      if(cv=='completedata')
      {
         // alert(v);
              // $.post(url1,{contentvar:cv,ref:v},function(data){  //ajaxfile/scriptfile_a is called undernith
            //$(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
            //});
            $.post(url1,"&contentvar="+cv+"&login_id="+v,function(data){			
                  $('#w').html(data).show();
                  $('#w').window('open');  //open the dialog to display info from ajax
                  });
        }
      
      if(cv=='result_option')
       {
           //alert('Yes');exit;
           $.post(url,{contentvar:cv,opt:v},function(data){
            $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
            });
       }//end of result_option
      
      if(cv=='display_results') //display result
      {
         //alert('Muyideen'); alert($("#resultform").serialize());exit;
            $.post(url,$("#resultform").serialize()+"&contentvar="+cv,function(data){	
            $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
        
            });
      }//end of display_results
      
      if(cv=='dialog') //start dialog display 
      {
            ShowDialog(true);
            $.post(url,{contentvar:cv},function(data){
            $(divid).html(data).show(); //report result from the ajaxfile, the data stores the information to be displayed from ajaxfile
            
            });
      }//end dialog display
    }  //swap content ends
     </script>
    `);

    // page.replace(/href='/g, "href='https://uilugportal.unilorin.edu.ng/");

    let rows: any[] = [];

    let semester = $('table').map((i, elem) => {
      if (i === 1) {
        $(elem)
          .find('tr')
          .map((i2, el2) => {
            let row = $(el2).find('td').toArray();
            let hrefs = $(row[2]).find('a').toArray();
            let rowObject = {
              session: $(row[1]).text(),
              name: $(row[2]).text(),
              href: $(hrefs[0]).attr('href'),
            };
            if (rowObject.href) {
              rows.push(rowObject);
            }
          })
          .toArray();
      }
    });

    console.log(rows);

    let user = {};

    successResponse(res, '', { user, rows });
  }
);
