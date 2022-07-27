import { Output } from './Entities/Output';
import { Company } from './Entities/Company';
import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  Cmp: any[] = [];  
  fOutput!: Array<Output>;  
  outputarray!: Array<Output>;
  dtFrom !: Date;
  dtTo !: Date;
  enBuyuk!: number;
  records: any[] = [];  


  @ViewChild('csvReader') csvReader: any;  
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        this.outputarray = this.createOutputArray();
        this.fOutput=this.findMax();
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  

    
  }  
  
  /* findMax() metodunda Output değerleri arasından gün sayısı en çok olan ekip bulunmuştur. */

  findMax()
  {
    let finalOutput: Output[] = [];
    for (let index = 0; index < this.outputarray.length; index++) {
      
      this.enBuyuk=+this.outputarray[0].Day;
        if(+this.outputarray[index].Day>this.enBuyuk)
        {
            this.enBuyuk=+this.outputarray[index].Day;
            let csvRecord: Output = new Output(this.outputarray[index].EmpID,this.outputarray[index].EmpID2,this.outputarray[index].ProjectID,this.outputarray[index].Day);
            finalOutput.push(csvRecord);
        }
    }
    return finalOutput;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let today = new Date();
    let csvArr = [];  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: Company = new Company();  
        csvRecord.EmpID = curruntRecord[0].trim();  
        csvRecord.ProjectID = curruntRecord[1].trim();  
        csvRecord.DateFrom = new Date(curruntRecord[2].trim()); 
        /*Null olan DateTo sütun verileri için bugünün tarihi atanmıştır. */
        if(curruntRecord[3]=="NULL;;;")
          csvRecord.DateTo =today;
        else
          csvRecord.DateTo = new Date(curruntRecord[3]);  
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }  

  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  /*
  getDiffBetweenDays() metodu iki tarih arasındaki gün sayısını elde etmek için kullanılmaktadır.
  */
  getDiffBetweenDays(x:Date, y:Date)
  {
      
      var date1= Date.UTC(x.getFullYear(), x.getMonth(), x.getDate());
      var date2 = Date.UTC(y.getFullYear(), y.getMonth(), y.getDate());
      
      return (Math.floor((date2 - date1) / (1000 * 60 * 60 * 24))).toString();
  }

  /*
  createOutputArray() metodu csv dosyasının içerisindeki verilerin iç içe döngü içerisinde çeşitli kontrol blokları ile 
  ayrıştırılmasını sağlamaktadır.İlk olarak projectID'ler kıyaslanmıştır, eşit olması durumunda EmpID'lerin eşitlik
  durumu kontrol edilmiştir. Eğer eşit değil ise aynı anda birlikte çalışılan tarihi bulmak için proje başlangıç tarihlerinin
  en büyüğü, proje bitiş tarihlerinin ise en küçüğü bulunmuştur ve getDiffBetweenDays metodu kullanılarak iki tarih arasındaki
  gün sayısı hesaplanmıştır. Son olarak Output sınıfımızın constructor'ına gerekli parametreler atanmış ve objeler oluşturulmuştur.
  */
  createOutputArray()
  {
    let outputarray1 :Output[]=[];

      for (let i = 0; i < this.records.length; i++) {

          for (let index = 0; index < this.records.length; index++) {

              if(this.records[i].ProjectID==this.records[index].ProjectID)
              {
                  if(this.records[i].EmpID==this.records[index].EmpID)
                      break;
                  else{
                      if(this.records[i].DateFrom>this.records[index].DateFrom)
                          this.dtFrom = this.records[i].DateFrom;
                      else
                          this.dtFrom = this.records[index].DateFrom;

                      if(this.records[i].DateTo>this.records[index].DateTo)
                          this.dtTo = this.records[index].DateTo;
                      else 
                          this.dtTo = this.records[i].DateTo;

                    
                      let csvRecord: Output = new Output(this.records[i].EmpID,this.records[index].EmpID,this.records[i].ProjectID,this.getDiffBetweenDays(this.dtFrom,this.dtTo));
                      outputarray1.push(csvRecord);
                  }
              }
              
          }
          
      }
      return outputarray1;
  }
}

