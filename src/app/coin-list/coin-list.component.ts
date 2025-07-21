import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CurrencyService } from '../service/currency.service';
import {  MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatLabel,MatPaginator,CurrencyPipe,UpperCasePipe,MatTableModule,CommonModule],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss'
})
export class CoinListComponent implements OnInit {

  bannerData: any = [];
  currency : string = "INR"
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api:ApiService, private currencyService : CurrencyService,private router:Router){}

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
    this.currencyService.getCurrency()
    .subscribe(val=>{
      this.currency = val;
      this.getAllData();
      this.getBannerData();
    })
  }

  getBannerData() {
    this.api.getTrendingCurrency(this.currency)
      .subscribe(res => {
        console.log(res);
        this.bannerData = res;
      })
  }
  getAllData() {
    this.api.getCurrency(this.currency)
      .subscribe(res => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoDetails(row: any) {
    this.router.navigate(['coin-detail',row.id])
  }

}
