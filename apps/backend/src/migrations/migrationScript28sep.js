import mongoose from 'mongoose';
import Constituency from '../models/constituency.js';
import connectDB from '../config/db.js';
import { constituencyNameData } from './constant.js';
import fs from 'fs';

function updateDeptInfo(deptInfo, outputItemDeptInfo){
    outputItemDeptInfo.sort((a, b) => a.dept_name.localeCompare(b.dept_name));
    deptInfo.sort((a, b) => a.dept_name.localeCompare(b.dept_name));
    for(let i = 0; i < deptInfo.length; i++){
        if(deptInfo[i].dept_name === outputItemDeptInfo[i].dept_name){
            deptInfo[i].work_info = outputItemDeptInfo[i].work_info;
            deptInfo[i].survey_score = outputItemDeptInfo[i].survey_score;
            deptInfo[i].average_score = outputItemDeptInfo[i].average_score;
        }
        else{
            console.log(`777 Not able to match ${deptInfo[i].dept_name} with ${outputItemDeptInfo[i].dept_name}`);
        }
    }
}

async function updateConstituencyData(data){
    await connectDB();

    const outputDataMap = new Map();
    data.forEach(item => {
        outputDataMap.set(item.area_name, item);
    });

    const constituencies = await Constituency.find({});
    let updatedCount = 0;
    const updatedConstituencies = [];
    const unmatchedConstituencies = [];
    for(const constituency of constituencies){
        const outputItem = outputDataMap.get(constituency.area_name);
        if(outputItem){            
            const constituencyObj = constituency.toObject();
            //update
            constituencyObj.vidhayak_info.metadata.net_worth = outputItem.vidhayak_info.metadata.net_worth;
            constituencyObj.vidhayak_info.metadata.criminal_cases = outputItem.vidhayak_info.metadata.criminal_cases;
            constituencyObj.vidhayak_info.metadata.funds_utilisation = outputItem.vidhayak_info.metadata.funds_utilisation;
            updateDeptInfo(constituencyObj.dept_info, outputItem.dept_info);
            
            updatedConstituencies.push(constituencyObj);
            updatedCount++;
            console.log(`Updated ${constituency.area_name}`);
        }
        else{
            console.log(`555 No output data found for ${constituency.area_name}`);
            unmatchedConstituencies.push(constituency.area_name);
        }
    }
    fs.writeFileSync('./updatedConstituencies28sep.json', JSON.stringify(updatedConstituencies, null, 2), 'utf8');
    console.log(`Updated ${updatedCount} constituencies and saved to updatedConstituencies.json`);
    console.log(`Unmatched ${unmatchedConstituencies.length} constituencies and saved to unmatchedConstituencies.json`);
    await mongoose.disconnect();
}

//step1: change the constituency data and verify if the changes are alright
// const outputData = JSON.parse(fs.readFileSync('output--24sep.json', 'utf8'));
// await updateConstituencyData(outputData);

//step2: save to mongo db
async function updateNewDataToMongoDB(){
    await connectDB();
    const updatedConstituencies = JSON.parse(fs.readFileSync('./updatedConstituencies28sep.json', 'utf8'));
    for(const constituency of updatedConstituencies){
        try{
        await Constituency.findByIdAndUpdate(constituency._id, constituency, { new: true });
        }
        catch(error){
            console.log(`Error updating ${constituency.area_name}: ${error}`);
        }
    }
    await mongoose.disconnect();

}

await updateNewDataToMongoDB();