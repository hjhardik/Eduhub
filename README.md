# Eduhub
EduHub is an online website where audience (teachers and students) can collaborate on online lesson materials and study guides in a seamless manner.


#----------------------- Web Application Documentation -----------------------#
--------------- https://lit-lowlands-71008.herokuapp.com/ --------------

## Deployment
---
1. If you want to deploy it on your own custom domain, three changes will be required :
   -- in public/js/pdfViewer.js, update the google analytics TRACKING_ID to your own tracking id
   -- in public/js/pdfViewer.js, update the PDF embed API CLIENT_ID with your own API client id
   -- in config/keys.js, if you want to use your own MONOGDB Atlas database, update dbPAssword as specified there.

   THATS' IT and you are ready to go.

2. Else you can use the same database and just update the TRACKING_ID and CLIENT_ID with your own credentials.

3. FOR ANALYTICS DASHBOARD,
## DASHBOARD TEMPLATE (LINK TO MY DASHBOARD TEMPLATE)
https://analytics.google.com/analytics/web/template?uid=34UHDnC1QcebcyNxlRNxIQ

4. Link to my final deployed web application :
   https://lit-lowlands-71008.herokuapp.com/

##YOU CAN REGISTER AS NEW USERS BUT HERE ARE ALREADY MADE ACCOUNTS BY ME(email/password) :
--STUDENTS
hardik@gmail.com/hardik
bill@gmail.com/bill100

--TEACHERS
michael@mit.edu/michael
david@mit.edu/davidmit

---

## UPON SUCCESSFUL LOGIN,

-- as a TEACHER, you will see your teacher dashboard, which contains the courses that are created by you as well as all other courses present. Also the teacher dashboard cntains the CREATE COURSE + button, by which you can create a new course for all the students. ALso you can see and access any other courses normally.

-- as a STUDENT, you will see student dashboard which contain the latest courses added as well a section of all courses. You can access any course by clicking on the GO TO THE COURSE link.

## CREATE COURSE+
Teachers can create course by specifying all the required details and uploading necessary PDF files for each topic. As soon as it is created it will be available to all the students for them to use.

## COURSE
Once you reach a course page, then all the PDF files (ie. all the topics) will be present on the same page itself. Each PDF file can be viewed by clicking on the topic by means of a similar to dropdown look. You can collapse and show any of them by clicking on the topic.

If some annotations are already present then it will be visible automatically in the comments pane of the embedded PDF. You can add your own annotations and they will be saved automatically to the server and then will be visible to anyone in real time. Similarly for you, any other user who annotates on the PDF file, those annotations will be available in real time to you also. If any user doesnot specify the position of annotation, it will by default be positioned at bottom right corner of teh viewing page and can be easily seen in the comments pane.
You can also edit and delete the annotations easily and that also will be updated real time for everyone.

Also if you download/print the PDF, the PDF will contain all the annotations at their positions which makes it easier for the user to keep track of notes.

If for a course, the student comments on any one topic file, "complete", "completed", "Complete", "Completed", "Course completed.", then that course is marked completed for that student.

Also , course sharing functionality is prvided to directly share the course link thorugh social media.

## CANVAS WHITEBOARD
A canvas whiteboard is also available below every course so that user can easily draw anything he/she may feel important, and then it can be downloaded easily as a PDF. Also the whole whiteboard can be easily cleared with the clean button. When you click the download button, it will automatically convert the canavas to base64 image and send it to server. Then on the server it is converted to PNG image and then PDF TOOLS API is called to create PDF from the image. After PDF is created successfully, download request is sent to the user and PDF gets downloaded on their device and atlast, all the temporary images and PDF file are deleted from the server automatically.


## GA DASHBOARD TEMPLATE (LINK TO MY DASHBOARD TEMPLATE)

https://analytics.google.com/analytics/web/template?uid=34UHDnC1QcebcyNxlRNxIQ
---

## if you are able to correctly implement the GA dashboard, your dashboard will look similar to this:
https://drive.google.com/file/d/1B1T70fvbnlhPTtlDrcDTnvBw0q3ckdXW/view?usp=sharing


## Link to my final deployed web application :
https://lit-lowlands-71008.herokuapp.com/
