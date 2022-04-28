import {Request, response, Response, Router} from 'express';

import VisualizationConfig from '../models/VisualizationConfig';


class VisualizationConfigRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); 
    }

    public async getAllConfigs(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allConfigs = await VisualizationConfig.find();
        if (allConfigs.length == 0){
            res.status(404).send("There are no visualization configurations yet")
        }
        else{
            res.status(200).send(allConfigs);
        }
    }
    public async getConfigCustomer(req: Request, res: Response) : Promise<void> {
        const configFound = await VisualizationConfig.findOne({customerName: req.params.customerName});
        if(configFound == null){
            res.status(404).send("Restaurant not found");
        }
        else{
            res.status(200).send(configFound);
        }
    }
    
    public async addConfig(req: Request, res: Response) : Promise<void> {
        const configFound = await VisualizationConfig.findOne({customerName: req.body.customerName})
        if (configFound != null){
            res.status(409).send("Configuration already created");
            return;
        }
        const {customerName, colorMode, fontsize} = req.body;
        const newConfig = new VisualizationConfig({customerName, colorMode: true, fontSize: 12}); //Default values when first created.
        await newConfig.save()
        res.status(201).send('Configuration added');
    
    }

    public async updateConfig(req: Request, res: Response) : Promise<void> {
        const configToUpdate = await VisualizationConfig.findOneAndUpdate({customerName: req.body.customerName, colorMode: req.body.colorMode,
                                                                    fontsize: req.body.fontSize});
        if(configToUpdate == null){
            VisualizationConfig.findByIdAndUpdate({customerName: req.body.customerName}, req.body)
            res.status(404).send("Configuration updated");
        }
        else{
            res.status(201).send('No changes detected, configuration already in use');
        }
    }

    public async deleteConfigCustomer(req: Request, res: Response) : Promise<void> {
        const configToDelete = await VisualizationConfig.findOneAndDelete ({customerName: req.params.customerName});
        if (configToDelete == null){
            res.status(404).send("Configuration for selected customer not found.")
        }
        else{
            res.status(200).send('Restaurant deleted.');
        }
    } 

    
    routes() {
        this.router.get('/', this.getAllConfigs);
        this.router.get('/customerName', this.getConfigCustomer);
        this.router.post('/', this.addConfig);
        this.router.put('/', this.updateConfig);
        this.router.delete('/customerName', this.deleteConfigCustomer);
        
    }
}

const visualizationConfigRoutes = new VisualizationConfigRoutes();

export default visualizationConfigRoutes.router;


