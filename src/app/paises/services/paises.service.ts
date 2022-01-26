import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  //private _baseUrl  : string = 'https://restcountries.com/v3.1';
  private _baseUrl  : string = 'https://restcountries.com/v3.1';
  private _regiones : string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones() {
    return [ ...this._regiones ];
  }

  constructor( private _http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}`
    return this._http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais[] | []> {
    if ( !codigo ) {
      return of([])
    }
    const url = `${ this._baseUrl }/alpha/${ codigo }`;
    return this._http.get<Pais[]>( url )
  }

}
