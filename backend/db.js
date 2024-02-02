const mongoose =  require('mongoose');
const uri = "mongodb+srv://ashritha2501:jeevika%40123@cluster0.fkmbsgv.mongodb.net/munchnowdb?retryWrites=true&w=majority"
const ctm = async()=>{
    await mongoose.connect(uri,{useNewUrlParser : true},async(err,result)=>{
        if(err) console.log("---",err)
        else{
        console.log("connected successfully");
        const fetched_data=await mongoose.connection.db.collection("food_items");
        fetched_data.find({}).toArray(async function(err,data){
            const foodCategory = await mongoose.connection.db.collection("food_category");
            foodCategory.find({}).toArray(async function(err,catData){
                if(err) console.log(err);
                else{

                  global.food_items=data;
                  global.food_category=catData;
                }
            })

            })
        
    }

    });
}

module.exports = ctm;


