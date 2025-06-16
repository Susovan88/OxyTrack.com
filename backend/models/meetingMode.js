import mongoose, { Schema } from "mongoose";
const meetingSchema =new Schema(
    {
        user_id:{type:String},
        meetingCode:{
            type:String,
            required:true,
        },
        data:{type:Date, default:Date.now,required:true},
    }
)

const Meeting=mongoose.model("Meeting",meetingSchema);

export default Meeting;
