import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const VisualizationConfig = new Schema({
    customerName: {type: String, required:true},
    colorMode: {type: Boolean, required: true}, //true is light and false is dark (Default is light)
    fontSize: {type: Number, required: true} //0: small size (7), 1: medium size (12), 2: big size (18) (Default is medium)
})

export default model('VisualizationConfig', VisualizationConfig);