var express = require('express')
var router = express.Router()
var pool = require('./pool')
router.get('/fetch_all_states',function(req,res,next){
pool.query("select * from state",function(error,result){
    if(error){
        console.log(error)
        res.status(500).json({status:false,message:"pls contact the database administrator"})
    }else{
        res.status(200).json({status:true,message:"success",data:result}) 
    }
})
})

router.get('/fetch_all_city',function(req,res,next){
    pool.query("select * from city where stateid=?",[req.query.stateid],function(error,result){
        if(error){
            console.log(error)
            res.status(500).json({status:false,message:"pls contact the database administrator"})
        }else{
            console.log(result)
            res.status(200).json({status:true,message:"success",data:result}) 
        }
    })
})

module.exports = router