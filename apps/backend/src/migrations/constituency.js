import mongoose from 'mongoose';
import Constituency from '../models/constituency.js';
import connectDB from '../config/db.js';
import {constituencyNameData}  from './constant.js';

const populateEnglishNameToHindiNameInConstituencyDataInMongoDB = async () => {

    await connectDB();
    const constituencies = await Constituency.find({});
    const res_constant = constituencyNameData.sort((a,b)=>a.hindi_name.localeCompare(b.hindi_name));
    const res = constituencies.sort((a, b) => a.area_name.localeCompare(b.area_name));
    for (let i = 0; i < res.length; i++) {
        console.log('i: ',i,', area_name: ',res[i].area_name, 'id ', res[i]._id);
        const englishName = res_constant.find(name => name.hindi_name === res[i].area_name);
        if (englishName) {
            res[i].english_name = englishName.english_name;
        }
        await res[i].save();
    }
}

const addEnglishNameForTheseIds = async () => {
    await connectDB();
    
    const specificIds = [
        '68add9e4615f3037710afc82', // कुढ़नी
        '68add9e4615f3037710afc2a', // खगड़िया
        '68add9e4615f3037710afc47', // बख्तियरपुर
        '68add9e4615f3037710afc46', // बाढ़
        '68add9e4615f3037710afc50', // मसौढ़ी
        '68add9e4615f3037710afc0a', // मढ़ौरा
        '68add9e4615f3037710afc8a', // रामगढ़, कैमूर
        '68add9e4615f3037710afc20', // रोसड़ा
        '68add9e4615f3037710afc3b', // सूर्यगढ़ा
        ];
    
        const hindiToEnglish = {
            'कुढ़नी': 'Kudni',
            'खगड़िया': 'Khagaria',
            'बख्तियरपुर': 'Bakhtiyarpur',
            'बाढ़': 'Barh',
            'मसौढ़ी': 'Masaurhi',
            'मढ़ौरा': 'Marhaura',
            'रामगढ़, कैमूर': 'Ramgarh, Kaimur',
            'रोसड़ा': 'Rosera',
            'सूर्यगढ़ा': 'Suryagarha',
        }
    
    for (const id of specificIds) {
        const constituency = await Constituency.findById(id);
        if (constituency) {
            const englishName = hindiToEnglish[constituency.area_name];
            if (englishName) {
                constituency.english_name = englishName;
                await constituency.save();
                console.log(`Updated ${constituency.area_name} -> ${englishName}`);
            }
        }
    }
}

// await populateEnglishNameToHindiNameInConstituencyDataInMongoDB();

await addEnglishNameForTheseIds();