var express = require('express')
var router = express.Router()
var pool = require('./pool')
var multer = require('./multer')
const { v4: uuidv4 } = require('uuid')
const upload = require('./multer')

const { LocalStorage } = require('node-localstorage')
var localstorage = require('node-localstorage').LocalStorage
localstorage = new LocalStorage('./scratch')

router.get('/employeeform', function (req, res) {
   var admin = JSON.parse(localstorage.getItem('ADMIN'))
   if(admin == null){
    res.redirect('/employee/loginpage')
   }else{
    res.render('employeeform', { message: '' })
}
})

router.post('/submit_form', upload.single('picture'), function (req, res, next) {
    pool.query("insert into employees(employeename, gender,dob, salary,work, address, state, city, picture)values(?,?,?,?,?,?,?,?,?)", [`${req.body.firstname} ${req.body.middlename} ${req.body.lastname}`, req.body.gender, req.body.dob, req.body.salary, req.body.work, req.body.address, req.body.state, req.body.city, req.file.filename], function (error, result) {
        console.log(result)
        console.log(error)
        console.log("data : ", req.body)
        console.log("file : ", req.file)
        if (error) {
            res.render('blankfile', { message: 'server error .......' })
        } else {
            res.render('blankfile', { message: 'Submit successfully........' })
        }
    })
})

router.get('/update_all_data', function (req, res) {
    var admin = JSON.parse(localstorage.getItem('ADMIN'))
    if(admin == null){
     res.redirect('/employee/loginpage')
    }else{
    pool.query("select E.*,(select S.statename from state S where S.stateid=E.state) as statename,(select C.cityname from city C where C.cityid=E.city) as cityname from employees E where E.employeeid=?", [req.query.employeeid], function (error, result) {
        if (error) {
            console.log(error)
            res.render('updatealldata', { status: false, data: {} })
        } else {
            // console.log("data:",result)
            res.render('updatealldata', { status: true, data: result[0] })
        }
    })
    }
})

router.post('/edit_form', function (req, res, next) {
    if (req.body.btn == 'edit') {
        pool.query("update employees set employeename=?, gender=?,dob=?, salary=?,work=?, address=?, state=?, city=? where employeeid =?", [`${req.body.firstname} ${req.body.middlename} ${req.body.lastname}`, req.body.gender, req.body.dob, req.body.salary, req.body.work, req.body.address, req.body.state, req.body.city, req.body.employeeid], function (error, result) {


            if (error) {
                console.log(error)
                res.redirect('/showresult/showemployeedata')
            } else {
                res.redirect('/showresult/showemployeedata')
            }
        })
    }
    else {
        pool.query("delete from employees where employeeid=?", [req.body.employeeid], function (error, result) {


            if (error) {
                console.log(error)
                res.redirect('/showresult/showemployeedata')
            } else {
                res.redirect('/showresult/showemployeedata')
            }
        })
    }
})


router.get('/showpicture', function (req, res) {
    res.render('showpicture', { data: req.query })
})

router.get('/blankfile', function (req, res) {
    res.render('blankfile', { data: req.query })
})


router.post('/editpicture', upload.single('picture'), function (req, res, next) {
    pool.query("update employees set picture=? where employeeid=?", [req.file.filename, req.body.employeeid], function (error, result) {
        console.log(req.file)
        console.log(req.body)
        if (error) {

            console.log("EEEEEEEEEEEEEEEEEE",error)
            res.redirect('/showresult/showemployeedata')
        } else {
            console.log("SSSSSSSSSSSSSS", result)
            res.redirect('/showresult/showemployeedata')
        }
    })
})

router.get('/loginpage', function (req, res) {
    res.render('loginpage')
})




router.get('/dashboard', function (req, res) {
    var admin = JSON.parse(localstorage.getItem('ADMIN'))
    if(admin == null){
     res.redirect('/employee/loginpage')
    }else{
    res.render('dashboard',{data:admin})
    }
})

router.get('/check_admin', function (req, res) {
  pool.query("select * from admins where emailid=? and password=?",[req.query.email,req.query.password],function(error,result){
    if(error){
        console.log(error)
        res.redirect('/employee/loginpage')
    }else{

        if(result.length == 1){
            localstorage.setItem("ADMIN",JSON.stringify(result[0]))
            res.redirect('/employee/dashboard')
        }else{
            res.redirect('/employee/loginpage')
        }
    }
  })
})

router.get('/logoutpopup', function (req, res) {
    res.render('logoutpopup')
})

router.get('/logoutadmin', function (req, res) {
    if(req.query.btn == 'yes'){
     localstorage.clear();
    res.redirect('/employee/loginpage')
    }
    else{
        res.redirect('/employee/dashboard')
    }
})

router.get('/editprofile', function (req, res) {
    var admin = JSON.parse(localstorage.getItem('ADMIN'))
    if(admin == null){
     res.redirect('/employee/loginpage')
    }else{
res.render('editprofile', {data:admin})
    }
})

router.post('/updateprofile',function(req,res,next){
    pool.query("update admins set emailid=?, mobileno=?, adminname=?, password=? where emailid=?",[req.body.emailid,req.body.mobileno,req.body.adminname,req.body.password,req.body.preemailid],function(error,result){
        if(error){
            console.log("eeeeeeeee",error)
            res.redirect('/employee/updateprofile')
        }else{
            pool.query("select * from admins where emailid=? and password=?",[req.query.emailid,req.query.password],function(error,result){
                if(error){
                    console.log(error)
                    res.redirect('/employee/loginpage')
                }else{
            
                    if(result.length == 1){
                        localstorage.setItem("ADMIN",JSON.stringify(result[0]))
                        res.redirect('/employee/dashboard')
                    }else{
                        res.redirect('/employee/loginpage')
                    }
                }
              })
        }
    })
})
module.exports = router