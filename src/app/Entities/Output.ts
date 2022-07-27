export class Output{

    EmpID!: string;
    EmpID2!: string;
    ProjectID !: string;
    Day!: string;

    constructor(EmpId:string,EmpID2:string,ProjectID:string,Day:string){
        this.EmpID=EmpId;
        this.EmpID2=EmpID2;
        this.ProjectID=ProjectID;
        this.Day=Day;
    }
}