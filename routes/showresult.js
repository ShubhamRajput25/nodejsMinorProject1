var express = require('express')
var router = express.Router()
var pool = require('./pool')
var multer = require('./multer')
const {v4 : uuidv4} = require('uuid')
const upload = require('./multer')

const { LocalStorage } = require('node-localstorage')
const { route } = require('./employee')
var localstorage = require('node-localstorage').LocalStorage
localstorage = new LocalStorage('./scratch')


router.get('/showemployeedata',function(req,res){
    var admin = JSON.parse(localstorage.getItem('ADMIN'))
    if(admin == null){
     res.redirect('/employee/loginpage')
    }else{
    pool.query("select E.*,(select S.statename from state S where S.stateid=E.state) as statename,(select C.cityname from city C where C.cityid=E.city) as cityname from employees E",function(error,result){
if(error){
    console.log(error)
    res.render('showresult',{status:false,data:{}})
}else{

    res.render('showresult',{status:true,data:result})
}
    })
    }
})

router.get('/searchbar',function(req,res,next){
        res.render('searchemployee')

})

router.get('/searchemployee',function(req,res,next){
    pool.query("select * from employees where employeename=?",[req.query.employeename],function(error,result){
       if(error){
res.redirect('/showresult/searchbar')
       }else{
        console.log("",result)
        res.render('showresult',{status:true,data:result})
       }
    })
})
module.exports = router