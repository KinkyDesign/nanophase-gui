import {Injectable} from '@angular/core';
import {Observable, Subject,  BehaviorSubject } from 'rxjs';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { Emission } from '../models/emission';
import { Scenario } from '../models/scenario';
import { EmissionsApiService } from '../api-client/emissions-api.service';


@Injectable()
export class SessionService{

    private subjectId = new Subject<any>();
    token: string;
    userid:string;
    private userName = new Subject<any>();
    private theme = new Subject<any>();
    private emissionForList = new Subject<Emission>();
    private emmissionForMap = new Subject<Emission>();

    private scenarioForList = new Subject<Scenario>();
    private scenarioForMap = new Subject<Scenario>();

    private scenariosEmissions = new Subject<Emission>();
    private showScenariosEmissions = new Subject<string>();

    private flyToShownEmissions = new Subject<Emission>();

    private removeFromShownEmissions = new Subject<Emission>();

    constructor(
        private _emissionsApi:EmissionsApiService
    ){

    }

    getSubjectId(): Observable<any>{
        return this.subjectId.asObservable();
    }

    getUserId(){
        var userData = JSON.parse(localStorage.getItem('userData'))
        this.userid = userData.sub
        return this.userid;
    }

    getUserData(){
        var userData = JSON.parse(localStorage.getItem('userData'))
        return userData
    }

    getUserName(): Observable<any>{
        return this.userName.asObservable();
    }

    getTheme(): Observable<any>{
        return this.theme.asObservable();
    }

    setEmissionForMap(emm:Emission){
        this.emmissionForMap.next(emm)
    }

    getEmissionForMap(){
        return this.emmissionForMap.asObservable()
    }

    setEmissionForList(emm:Emission){
        this.emissionForList.next(emm)
    }

    getEmissionForList(){
        return this.emissionForList.asObservable()
    }



    setScenarioForMap(emm:Scenario){
        this.scenarioForMap.next(null)
        // this.emmissionForMap.next(null)
        this.scenariosEmissions.next(null)
        this.scenarioForMap.next(emm)
        emm.emissions.forEach(em=>{
            this._emissionsApi.getWithIdSecured(em).subscribe(em=>{
                if(em){
                    this.scenariosEmissions.next(em)
                }
            })
        })
    }

    getScenarioForMap(){
        return this.scenarioForMap.asObservable()
    }

    setScenarioForList(scen:Scenario){
        this.scenarioForList.next(scen)
    }

    getScenarioForList(){
        return this.scenarioForList.asObservable()
    }


    setScenariosEmissions(emm:Emission){
        this.scenariosEmissions.next(emm)
    }

    getScenariosEmissions(){
        return this.scenariosEmissions.asObservable()
    }

    setShowScenariosEmissions(emm:string){
        this.showScenariosEmissions.next(emm)
    }

    getShowScenariosEmissions(){
        return this.showScenariosEmissions.asObservable()
    }

    setFlyToShownEmissions(emm:Emission){
        this.flyToShownEmissions.next(emm)
    }

    getFlyToShownEmissions(){
        return this.flyToShownEmissions.asObservable()
    }

    setRemoveFromShownEmissions(em:Emission){
        this.removeFromShownEmissions.next(em)
    }

    getRemoveFromShownEmissions(){
        return this.removeFromShownEmissions.asObservable()
    }

    get(key: any){
        return localStorage.getItem(key);
    }

    remove(key:any){
        switch(key){
            case 'subjectId':{
                this.subjectId.next();
                break;
            }
            //case 'loggedIn':{
           //     var fal = "false";
           //     this.loggedIn.next({ fal });
          //      break;
         //   }
            case 'userName':{
                this.userName.next();
                break;
            }

        }
        return localStorage.removeItem(key);
    }

    clear(){
        var nul = "null";
        this.subjectId.next({ nul });
     //   this.loggedIn.next({ nul });
        this.userName.next({ nul });
        return localStorage.clear();
    }

    set(key:any, data:any){
        switch(key){
            case 'subjectId':{
                this.subjectId.next({ data });
                break;
            }
            case 'userName':{
                this.userName.next({ data });
                break;
            }
            case 'theme':{
                this.theme.next({ data });
                break;
            }
        }
        return localStorage.setItem(key, data);
    }


}
