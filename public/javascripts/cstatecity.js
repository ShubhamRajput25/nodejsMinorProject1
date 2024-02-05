// const { response } = require("express")

$(document).ready(function(){
    
    $.getJSON('/statecity/fetch_all_states',function(response){
        response.data.map((item)=>{
            $('#state').append(($('<option>')).text(item.statename).val(item.stateid))
        })
    })

    $('#state').change(function(){
        $.getJSON('/statecity/fetch_all_city',{stateid:$('#state').val()},function(response){
            $('#city').empty()
            $('#city').append(($('<option>')).text('select city').val(''))
            response.data.map((item)=>{
                $('#city').append(($('<option>')).text(item.cityname).val(item.cityid))
            })
        })
    

    })
    

})
